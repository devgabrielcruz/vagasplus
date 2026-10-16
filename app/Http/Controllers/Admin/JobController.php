<?php

namespace App\Http\Controllers\Admin;

use App\Enums\EmploymentType;
use App\Enums\ExperienceLevel;
use App\Enums\JobStatus;
use App\Enums\SalaryPeriod;
use App\Enums\WorkMode;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\JobPostingRequest;
use App\Models\Category;
use App\Models\JobPosting;
use App\Services\JobLifecycle;
use App\Services\JobPostingWriter;
use App\Services\Settings;
use App\Support\JobPostingSchema;
use App\Support\JobPresenter;
use App\Support\Like;
use App\Support\Seo;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class JobController extends Controller
{
    private const SORTABLE = ['title', 'status', 'published_at', 'expires_at', 'updated_at'];

    public function __construct(
        private readonly JobLifecycle $lifecycle,
        private readonly JobPostingWriter $writer,
        private readonly Settings $settings,
    ) {}

    public function index(Request $request): Response
    {
        $filters = [
            'q' => trim((string) $request->query('q', '')),
            'status' => (string) $request->query('status', ''),
            'date_field' => in_array($request->query('date_field'), ['published_at', 'expires_at', 'updated_at'], true) ? $request->query('date_field') : 'published_at',
            'from' => (string) $request->query('from', ''),
            'to' => (string) $request->query('to', ''),
            'sort' => in_array($request->query('sort'), self::SORTABLE, true) ? $request->query('sort') : 'updated_at',
            'dir' => $request->query('dir') === 'asc' ? 'asc' : 'desc',
        ];

        $now = now();
        $query = JobPosting::query()->with(['company', 'category', 'platform']);

        if ($filters['q'] !== '') {
            $like = Like::contains($filters['q']);
            $query->where(function (Builder $w) use ($like, $filters) {
                Like::where($w, 'job_postings.title', $like);
                Like::orWhere($w, 'job_postings.slug', $like);
                $w->orWhereHas('company', fn (Builder $c) => Like::where($c, 'companies.name', $like));
                if (ctype_digit($filters['q'])) {
                    $w->orWhere('id', (int) $filters['q']);
                }
            });
        }

        if ($status = JobStatus::tryFrom($filters['status'])) {
            match ($status) {
                // Status "efetivo": respeita o relógio mesmo que o scheduler ainda não tenha rodado.
                JobStatus::Published => $query->active($now),
                JobStatus::Expired => $query->where(fn ($q) => $q->where('status', JobStatus::Expired)
                    ->orWhere(fn ($w) => $w->where('status', JobStatus::Published)->where('expires_at', '<=', $now))),
                JobStatus::Scheduled => $query->where('status', JobStatus::Scheduled)->where('published_at', '>', $now),
                default => $query->where('status', $status),
            };
        }

        if ($filters['from'] !== '' && strtotime($filters['from'])) {
            $query->where($filters['date_field'], '>=', Carbon::parse($filters['from'])->startOfDay());
        }
        if ($filters['to'] !== '' && strtotime($filters['to'])) {
            $query->where($filters['date_field'], '<=', Carbon::parse($filters['to'])->endOfDay());
        }

        $jobs = $query->orderBy($filters['sort'], $filters['dir'])->orderByDesc('id')->paginate(20)->withQueryString();

        return Inertia::render('Admin/Jobs/Index', [
            'jobs' => [
                'data' => $jobs->getCollection()->map(fn (JobPosting $j) => $this->row($j, $now))->all(),
                'current_page' => $jobs->currentPage(),
                'last_page' => $jobs->lastPage(),
                'total' => $jobs->total(),
                'from' => $jobs->firstItem(),
                'to' => $jobs->lastItem(),
                'prev_url' => $jobs->previousPageUrl(),
                'next_url' => $jobs->nextPageUrl(),
                'links' => collect(range(1, $jobs->lastPage()))
                    ->filter(fn ($p) => $p === 1 || $p === $jobs->lastPage() || abs($p - $jobs->currentPage()) <= 2)
                    ->map(fn ($p) => ['page' => $p, 'url' => $jobs->url($p), 'active' => $p === $jobs->currentPage()])
                    ->values()->all(),
            ],
            'filters' => $filters,
            'statuses' => collect(JobStatus::cases())->map(fn ($s) => ['value' => $s->value, 'label' => $s->label()])->all(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Jobs/Form', [
            'job' => null,
            'aiConfigured' => JobImportController::aiConfigured(),
            ...$this->formProps(),
        ]);
    }

    public function store(JobPostingRequest $request): RedirectResponse
    {
        $job = DB::transaction(function () use ($request) {
            $job = $this->writer->create($request->validated(), $request->user());
            $this->applyLifecycleAction($job, $request);

            return $job;
        });

        return redirect()->route('admin.jobs.edit', $job)->with('success', $this->actionMessage($request->input('action')));
    }

    public function edit(JobPosting $job): Response
    {
        $job->load(['company', 'location', 'category', 'events.user']);

        return Inertia::render('Admin/Jobs/Form', [
            'job' => $this->formData($job),
            ...$this->formProps(),
        ]);
    }

    public function update(JobPostingRequest $request, JobPosting $job): RedirectResponse
    {
        DB::transaction(function () use ($request, $job) {
            $this->writer->update($job, $request->validated(), $request->user());
            $this->applyLifecycleAction($job, $request);
        });

        return redirect()->route('admin.jobs.edit', $job)->with('success', $this->actionMessage($request->input('action')));
    }

    public function archive(Request $request, JobPosting $job): RedirectResponse
    {
        $this->lifecycle->archive($job, $request->user());

        return back()->with('success', 'Vaga arquivada.');
    }

    public function restore(Request $request, JobPosting $job): RedirectResponse
    {
        $this->lifecycle->restore($job, $request->user());

        return back()->with('success', 'Vaga restaurada como rascunho. Revise e publique novamente.');
    }

    public function unschedule(Request $request, JobPosting $job): RedirectResponse
    {
        $this->lifecycle->unschedule($job, $request->user());

        return back()->with('success', 'Agendamento cancelado. A vaga voltou para rascunho.');
    }

    public function renew(Request $request, JobPosting $job): RedirectResponse
    {
        $data = $request->validate([
            'validity_days' => ['nullable', 'integer', 'min:1', 'max:365'],
            'expires_at' => ['nullable', 'date'],
            'confirm' => ['boolean'],
        ]);

        $expiresAt = match (true) {
            ! empty($data['expires_at']) => Carbon::parse($data['expires_at']),
            ! empty($data['validity_days']) => now()->addDays((int) $data['validity_days']),
            default => throw ValidationException::withMessages(['expires_at' => 'Informe o novo prazo de validade.']),
        };

        $this->lifecycle->renew($job, $expiresAt, (bool) ($data['confirm'] ?? false), $request->user());

        return back()->with('success', 'Vaga renovada até '.$expiresAt->locale('pt_BR')->isoFormat('D [de] MMMM [às] HH:mm').'.');
    }

    /** Pré-visualização autenticada e nunca indexável, inclusive de rascunhos. */
    public function preview(JobPosting $job): Response
    {
        $job->load(['company', 'location', 'category']);
        return Inertia::render('Public/JobShow', [
            'job' => JobPresenter::detail($job, $job->status !== JobStatus::Archived),
            'closed' => false,
            'preview' => true,
            'previewStatus' => $job->effectiveStatus()->label(),
            'editUrl' => route('admin.jobs.edit', $job),
            'related' => [],
            'breadcrumbs' => [['label' => 'Pré-visualização', 'url' => null]],
            'seo' => [
                ...Seo::make("Pré-visualização: {$job->title}", 'Pré-visualização administrativa', route('admin.jobs.preview', $job), index: false),
                'robots' => 'noindex,nofollow',
            ],
        ]);
    }

    private function applyLifecycleAction(JobPosting $job, JobPostingRequest $request): void
    {
        $action = $request->input('action');

        if (! in_array($action, ['publish', 'schedule'], true)) {
            return;
        }

        $publishAt = $request->publishAt();

        if ($action === 'schedule' && ($publishAt === null || $publishAt->lte(now()))) {
            throw ValidationException::withMessages(['publish_at' => 'Para agendar, escolha uma data de publicação futura.']);
        }

        if ($action === 'publish' && $publishAt !== null && $publishAt->gt(now())) {
            throw ValidationException::withMessages(['publish_at' => 'Use "Agendar" para publicar em uma data futura.']);
        }

        $this->lifecycle->publish($job->refresh(), $publishAt, $request->expiresAt(), $request->user());
    }

    private function actionMessage(?string $action): string
    {
        return match ($action) {
            'publish' => 'Vaga publicada.',
            'schedule' => 'Publicação agendada.',
            default => 'Vaga salva.',
        };
    }

    private function row(JobPosting $job, Carbon $now): array
    {
        $effective = $job->effectiveStatus($now);

        return [
            'id' => $job->id,
            'title' => $job->title,
            'company' => $job->company->name,
            'category' => $job->category->name,
            'platform' => $job->platform->name,
            'status' => $effective->value,
            'status_label' => $effective->label(),
            'is_featured' => $job->is_featured,
            'published_at' => $job->published_at?->toIso8601String(),
            'expires_at' => $job->expires_at?->toIso8601String(),
            'updated_at' => $job->updated_at->toIso8601String(),
            'expiring_soon' => $effective === JobStatus::Published && $job->expires_at->lte($now->copy()->addDays(7)),
            'edit_url' => route('admin.jobs.edit', $job),
            'preview_url' => route('admin.jobs.preview', $job),
            'public_url' => $effective === JobStatus::Published ? route('jobs.show', $job->slug) : null,
        ];
    }

    private function formProps(): array
    {
        $enum = fn (array $cases) => collect($cases)->map(fn ($c) => ['value' => $c->value, 'label' => $c->label()])->all();

        return [
            'categories' => Category::query()->orderBy('position')->orderBy('name')->get(['id', 'name', 'is_active']),
            'options' => [
                'work_modes' => $enum(WorkMode::cases()),
                'employment_types' => $enum(EmploymentType::cases()),
                'experience_levels' => $enum(ExperienceLevel::cases()),
                'salary_periods' => $enum(SalaryPeriod::cases()),
                'platforms' => \App\Models\Platform::query()->active()->orderBy('position')->orderBy('name')
                    ->get()->map(fn ($p) => ['value' => $p->id, 'label' => $p->name, 'logo' => $p->logo_src, 'uses_email' => $p->uses_email])->all(),
            ],
            'validity' => [
                'presets' => [7, 15, 30, 60],
                'default' => $this->settings->get('default_validity_days'),
                'max' => $this->settings->get('max_validity_days'),
            ],
        ];
    }

    private function formData(JobPosting $job): array
    {
        $fmt = fn (?Carbon $d) => $d?->format('Y-m-d\TH:i');
        $effective = $job->effectiveStatus();

        return [
            'id' => $job->id,
            'status' => $effective->value,
            'status_label' => $effective->label(),
            'slug' => $job->slug,
            'title' => $job->title,
            'company_name' => $job->company->name,
            'company_website_url' => $job->company->website_url,
            'company_logo_url' => $job->company->logo_url,
            'company_logo_src' => $job->company->logo_src,
            'company_about' => $job->company->about,
            'description' => $job->description,
            'responsibilities' => $job->responsibilities,
            'requirements' => $job->requirements,
            'nice_to_have' => $job->nice_to_have,
            'benefits' => $job->benefits,
            'additional_info' => $job->additional_info,
            'category_id' => $job->category_id,
            'city' => $job->location?->city,
            'state' => $job->location?->state,
            'work_mode' => $job->work_mode->value,
            'employment_type' => $job->employment_type->value,
            'experience_level' => $job->experience_level?->value,
            'salary_min' => $job->salary_min,
            'salary_max' => $job->salary_max,
            'salary_currency' => $job->salary_currency,
            'salary_period' => $job->salary_period?->value,
            'source_name' => $job->source_name,
            'source_url' => $job->source_url,
            'platform_id' => $job->platform_id,
            'apply_url' => $job->apply_url,
            'apply_email' => $job->apply_email,
            'source_published_at' => $fmt($job->source_published_at),
            'is_featured' => $job->is_featured,
            'publish_at' => $fmt($job->published_at),
            'expires_at' => $fmt($job->expires_at),
            'public_url' => $effective === JobStatus::Published ? route('jobs.show', $job->slug) : null,
            'preview_url' => route('admin.jobs.preview', $job),
            'schema_valid' => $job->isActive() && JobPostingSchema::build($job) !== null,
            'history' => $job->events->take(30)->map(fn ($e) => [
                'id' => $e->id,
                'event' => $e->event->value,
                'from' => $e->from_status ? JobStatus::from($e->from_status)->label() : null,
                'to' => $e->to_status ? JobStatus::from($e->to_status)->label() : null,
                'user' => $e->user?->name ?? 'Sistema',
                'at' => $e->created_at->toIso8601String(),
                'meta' => $e->meta,
            ])->all(),
        ];
    }
}
