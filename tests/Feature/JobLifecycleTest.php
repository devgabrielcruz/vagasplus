<?php

namespace Tests\Feature;

use App\Enums\JobStatus;
use App\Models\JobPosting;
use App\Models\JobPostingEvent;
use App\Models\User;
use App\Services\JobLifecycle;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Validation\ValidationException;
use Tests\TestCase;

class JobLifecycleTest extends TestCase
{
    use RefreshDatabase;

    public function test_expired_job_cannot_be_published_again_without_renewal(): void
    {
        $job = JobPosting::factory()->expired()->create();

        $this->expectException(ValidationException::class);

        app(JobLifecycle::class)->publish($job);
    }

    public function test_expired_job_requires_explicit_confirmation_to_renew(): void
    {
        $job = JobPosting::factory()->expired()->create();

        try {
            app(JobLifecycle::class)->renew($job, now()->addDays(10));
            $this->fail('A renovação sem confirmação deveria falhar.');
        } catch (ValidationException $e) {
            $this->assertArrayHasKey('confirm', $e->errors());
        }

        $this->assertSame(JobStatus::Expired, $job->fresh()->status);
        $this->assertFalse($job->fresh()->isActive());
    }

    public function test_renewal_updates_expiration_and_records_history(): void
    {
        $admin = User::factory()->admin()->create();
        $job = JobPosting::factory()->expired()->create();
        $newDate = now()->addDays(20)->startOfMinute();

        app(JobLifecycle::class)->renew($job, $newDate, true, $admin);

        $job->refresh();
        $this->assertSame(JobStatus::Published, $job->status);
        $this->assertTrue($job->expires_at->equalTo($newDate));
        $this->assertNull($job->expired_at);
        $this->assertTrue($job->isActive());
        $this->assertDatabaseHas('job_posting_events', ['job_posting_id' => $job->id, 'event' => 'renewed', 'user_id' => $admin->id]);
    }

    public function test_renewal_respects_maximum_validity(): void
    {
        $job = JobPosting::factory()->create();

        $this->expectException(ValidationException::class);

        app(JobLifecycle::class)->renew($job, now()->addDays(500));
    }

    public function test_expire_command_expires_due_jobs_and_is_idempotent(): void
    {
        $due = JobPosting::factory()->stale()->create(['is_featured' => true]);
        $open = JobPosting::factory()->create();
        $draft = JobPosting::factory()->draft()->create();

        $this->artisan('jobs:expire')->expectsOutput('1 vaga(s) expirada(s).')->assertSuccessful();

        $due->refresh();
        $this->assertSame(JobStatus::Expired, $due->status);
        $this->assertNotNull($due->expired_at);
        $this->assertFalse($due->is_featured);
        $this->assertSame(JobStatus::Published, $open->fresh()->status);
        $this->assertSame(JobStatus::Draft, $draft->fresh()->status);

        $firstExpiredAt = $due->expired_at;

        $this->artisan('jobs:expire')->expectsOutput('0 vaga(s) expirada(s).')->assertSuccessful();
        $this->artisan('jobs:expire')->assertSuccessful();

        $this->assertTrue($due->fresh()->expired_at->equalTo($firstExpiredAt));
        $this->assertSame(1, JobPostingEvent::where('job_posting_id', $due->id)->where('event', 'expired')->count());
    }

    public function test_scheduled_jobs_are_promoted_when_due(): void
    {
        $job = JobPosting::factory()->scheduled()->create();

        $this->artisan('jobs:publish-scheduled')->expectsOutput('0 vaga(s) publicada(s).');
        $this->assertSame(JobStatus::Scheduled, $job->fresh()->status);

        $this->travel(3)->days();

        $this->artisan('jobs:publish-scheduled')->expectsOutput('1 vaga(s) publicada(s).');
        $this->artisan('jobs:publish-scheduled')->expectsOutput('0 vaga(s) publicada(s).');
        $this->assertSame(JobStatus::Published, $job->fresh()->status);
    }

    public function test_expiration_must_be_after_publication_and_within_limit(): void
    {
        $lifecycle = app(JobLifecycle::class);
        $job = JobPosting::factory()->draft()->create();

        try {
            $lifecycle->publish($job, now(), now()->subDay());
            $this->fail('Expiração anterior à publicação deveria falhar.');
        } catch (ValidationException $e) {
            $this->assertArrayHasKey('expires_at', $e->errors());
        }

        try {
            $lifecycle->publish($job, now(), now()->addDays(91));
            $this->fail('Validade acima do máximo deveria falhar.');
        } catch (ValidationException $e) {
            $this->assertArrayHasKey('expires_at', $e->errors());
        }

        $lifecycle->publish($job);
        $this->assertEqualsWithDelta(30, now()->diffInDays($job->fresh()->expires_at), 1);
    }

    public function test_archived_job_is_only_restored_as_draft(): void
    {
        $job = JobPosting::factory()->archived()->create();

        app(JobLifecycle::class)->restore($job);

        $job->refresh();
        $this->assertSame(JobStatus::Draft, $job->status);
        $this->assertFalse($job->isActive());
        $this->assertTrue($job->needs_review);
    }

    public function test_archived_job_cannot_be_renewed(): void
    {
        $job = JobPosting::factory()->archived()->create();

        $this->expectException(ValidationException::class);

        app(JobLifecycle::class)->renew($job, now()->addDays(5), true);
    }
}
