<?php

namespace App\Services;

use App\Enums\JobEvent;
use App\Enums\JobStatus;
use App\Models\JobPosting;
use App\Models\JobPostingEvent;
use App\Models\User;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

/**
 * Única porta de entrada para mudar status e datas de uma vaga.
 *
 * Transições permitidas:
 *   draft      -> published | scheduled | archived
 *   scheduled  -> published | draft | archived   (também vira published sozinha via jobs:publish-scheduled)
 *   published  -> expired (automático) | archived
 *   expired    -> published (SOMENTE via renew() com confirmação) | archived
 *   archived   -> draft (restore)
 */
class JobLifecycle
{
    public function __construct(private readonly Settings $settings) {}

    /** Publica agora (ou agenda, se $publishAt for futuro). */
    public function publish(JobPosting $job, ?Carbon $publishAt = null, ?Carbon $expiresAt = null, ?User $by = null): JobPosting
    {
        $this->assertTransition($job, [JobStatus::Draft, JobStatus::Scheduled], 'Somente rascunhos ou vagas agendadas podem ser publicadas.');

        $now = now();
        $publishAt ??= $now;
        $expiresAt ??= $publishAt->copy()->addDays($this->settings->get('default_validity_days'));

        $this->assertWindow($publishAt, $expiresAt);

        if ($expiresAt->lte($now)) {
            throw ValidationException::withMessages(['expires_at' => 'A data de expiração precisa ser futura.']);
        }

        $scheduled = $publishAt->gt($now);
        $from = $job->status;

        return DB::transaction(function () use ($job, $publishAt, $expiresAt, $scheduled, $from, $by) {
            $job->forceFill([
                'status' => $scheduled ? JobStatus::Scheduled : JobStatus::Published,
                'published_at' => $publishAt,
                'expires_at' => $expiresAt,
                'expired_at' => null,
                'archived_at' => null,
                'needs_review' => false,
                'updated_by' => $by?->id,
            ])->save();

            $this->log($job, $scheduled ? JobEvent::Scheduled : JobEvent::Published, $from, $by, [
                'published_at' => $publishAt->toIso8601String(),
                'expires_at' => $expiresAt->toIso8601String(),
            ]);

            return $job;
        });
    }

    /** Volta uma vaga agendada para rascunho (cancela o agendamento). */
    public function unschedule(JobPosting $job, ?User $by = null): JobPosting
    {
        $this->assertTransition($job, [JobStatus::Scheduled], 'Somente vagas agendadas podem ter o agendamento cancelado.');

        return DB::transaction(function () use ($job, $by) {
            $job->forceFill(['status' => JobStatus::Draft, 'published_at' => null, 'expires_at' => null, 'updated_by' => $by?->id])->save();
            $this->log($job, JobEvent::Updated, JobStatus::Scheduled, $by, ['note' => 'Agendamento cancelado']);

            return $job;
        });
    }

    /**
     * Estende a validade. Para vagas expiradas exige confirmação explícita de que
     * a oportunidade continua aberta; uma vaga expirada nunca reaparece sozinha.
     */
    public function renew(JobPosting $job, Carbon $newExpiresAt, bool $confirmedStillOpen = false, ?User $by = null): JobPosting
    {
        $effective = $job->effectiveStatus();

        if (! in_array($effective, [JobStatus::Published, JobStatus::Expired], true)) {
            throw ValidationException::withMessages(['status' => 'Somente vagas publicadas ou expiradas podem ser renovadas.']);
        }

        if ($effective === JobStatus::Expired && ! $confirmedStillOpen) {
            throw ValidationException::withMessages(['confirm' => 'Confirme que a oportunidade continua aberta para renovar uma vaga expirada.']);
        }

        $now = now();
        if ($newExpiresAt->lte($now)) {
            throw ValidationException::withMessages(['expires_at' => 'A nova data de expiração precisa ser futura.']);
        }

        $max = $this->settings->get('max_validity_days');
        if ($newExpiresAt->gt($now->copy()->addDays($max))) {
            throw ValidationException::withMessages(['expires_at' => "A validade máxima a partir de hoje é de {$max} dias."]);
        }

        $from = $job->status;
        $previous = $job->expires_at;

        return DB::transaction(function () use ($job, $newExpiresAt, $from, $previous, $by) {
            $job->forceFill([
                'status' => JobStatus::Published,
                'expires_at' => $newExpiresAt,
                'expired_at' => null,
                'needs_review' => false,
                'updated_by' => $by?->id,
            ])->save();

            $this->log($job, JobEvent::Renewed, $from, $by, [
                'previous_expires_at' => $previous?->toIso8601String(),
                'expires_at' => $newExpiresAt->toIso8601String(),
            ]);

            return $job;
        });
    }

    public function archive(JobPosting $job, ?User $by = null): JobPosting
    {
        $this->assertTransition($job, [JobStatus::Draft, JobStatus::Scheduled, JobStatus::Published, JobStatus::Expired], 'Esta vaga já está arquivada.');

        $from = $job->status;

        return DB::transaction(function () use ($job, $from, $by) {
            $job->forceFill(['status' => JobStatus::Archived, 'archived_at' => now(), 'is_featured' => false, 'updated_by' => $by?->id])->save();
            $this->log($job, JobEvent::Archived, $from, $by);

            return $job;
        });
    }

    /** Restaura para rascunho: nunca republica automaticamente. */
    public function restore(JobPosting $job, ?User $by = null): JobPosting
    {
        $this->assertTransition($job, [JobStatus::Archived], 'Somente vagas arquivadas podem ser restauradas.');

        return DB::transaction(function () use ($job, $by) {
            $job->forceFill([
                'status' => JobStatus::Draft,
                'archived_at' => null,
                'published_at' => null,
                'expires_at' => null,
                'expired_at' => null,
                'needs_review' => true,
                'updated_by' => $by?->id,
            ])->save();
            $this->log($job, JobEvent::Restored, JobStatus::Archived, $by);

            return $job;
        });
    }

    /**
     * Encerra as vagas publicadas cujo prazo terminou. Idempotente: só toca em
     * registros ainda marcados como "published"/"scheduled" com prazo vencido.
     *
     * @return int quantidade de vagas expiradas nesta execução
     */
    public function expireDue(?Carbon $now = null): int
    {
        $now ??= now();
        $count = 0;

        JobPosting::query()
            ->whereIn('status', [JobStatus::Published->value, JobStatus::Scheduled->value])
            ->where('expires_at', '<=', $now)
            ->chunkById(100, function ($jobs) use ($now, &$count) {
                foreach ($jobs as $job) {
                    DB::transaction(function () use ($job, $now, &$count) {
                        $from = $job->status;
                        $job->forceFill(['status' => JobStatus::Expired, 'expired_at' => $now, 'is_featured' => false])->save();
                        $this->log($job, JobEvent::Expired, $from, null, ['expires_at' => $job->expires_at->toIso8601String()]);
                        $count++;
                    });
                }
            });

        return $count;
    }

    /** Promove vagas agendadas cujo horário de publicação chegou. */
    public function publishDue(?Carbon $now = null): int
    {
        $now ??= now();
        $count = 0;

        JobPosting::query()
            ->where('status', JobStatus::Scheduled->value)
            ->where('published_at', '<=', $now)
            ->where('expires_at', '>', $now)
            ->chunkById(100, function ($jobs) use (&$count) {
                foreach ($jobs as $job) {
                    DB::transaction(function () use ($job, &$count) {
                        $job->forceFill(['status' => JobStatus::Published])->save();
                        $this->log($job, JobEvent::Published, JobStatus::Scheduled, null, ['note' => 'Publicação agendada concluída']);
                        $count++;
                    });
                }
            });

        return $count;
    }

    /** Valida que expires_at > published_at e respeita a validade máxima configurada. */
    public function assertWindow(Carbon $publishAt, Carbon $expiresAt): void
    {
        if ($expiresAt->lte($publishAt)) {
            throw ValidationException::withMessages(['expires_at' => 'A expiração precisa ser posterior à data de publicação.']);
        }

        $max = $this->settings->get('max_validity_days');
        if ($expiresAt->gt($publishAt->copy()->addDays($max))) {
            throw ValidationException::withMessages(['expires_at' => "A validade máxima de uma vaga é de {$max} dias."]);
        }
    }

    public function log(JobPosting $job, JobEvent $event, ?JobStatus $from, ?User $by = null, array $meta = []): void
    {
        JobPostingEvent::create([
            'job_posting_id' => $job->id,
            'user_id' => $by?->id,
            'event' => $event,
            'from_status' => $from?->value,
            'to_status' => $job->status->value,
            'meta' => $meta ?: null,
        ]);
    }

    /** @param  list<JobStatus>  $allowed */
    private function assertTransition(JobPosting $job, array $allowed, string $message): void
    {
        if (! in_array($job->status, $allowed, true)) {
            throw ValidationException::withMessages(['status' => $message]);
        }
    }
}
