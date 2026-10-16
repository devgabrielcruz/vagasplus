<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\JobSubmission;
use App\Services\JobPostingWriter;
use App\Services\LogoStorage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class SubmissionController extends Controller
{
    private const STATUSES = [
        JobSubmission::PENDING => 'Em análise',
        JobSubmission::APPROVED => 'Aprovada',
        JobSubmission::REJECTED => 'Recusada',
    ];

    public function index(Request $request): Response
    {
        $status = array_key_exists($request->query('status'), self::STATUSES) ? $request->query('status') : JobSubmission::PENDING;

        $submissions = JobSubmission::query()
            ->with(['category', 'platform'])
            ->where('status', $status)
            ->orderByRaw($status === JobSubmission::PENDING ? 'created_at asc' : 'created_at desc')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Admin/Submissions/Index', [
            'status' => $status,
            'counts' => collect(self::STATUSES)->map(fn ($label, $key) => ['value' => $key, 'label' => $label, 'count' => JobSubmission::where('status', $key)->count()])->values(),
            'submissions' => [
                'data' => $submissions->getCollection()->map(fn (JobSubmission $s) => [
                    'id' => $s->id, 'title' => $s->title, 'company_name' => $s->company_name,
                    'submitter' => $s->submitter_name, 'category' => $s->category->name, 'platform' => $s->platform->name,
                    'status' => $s->status, 'created_at' => $s->created_at->toIso8601String(),
                    'show_url' => route('admin.submissions.show', $s),
                ])->all(),
                'current_page' => $submissions->currentPage(),
                'last_page' => $submissions->lastPage(),
                'total' => $submissions->total(),
                'prev_url' => $submissions->previousPageUrl(),
                'next_url' => $submissions->nextPageUrl(),
                'links' => collect(range(1, $submissions->lastPage()))
                    ->filter(fn ($p) => $p === 1 || $p === $submissions->lastPage() || abs($p - $submissions->currentPage()) <= 2)
                    ->map(fn ($p) => ['page' => $p, 'url' => $submissions->url($p), 'active' => $p === $submissions->currentPage()])
                    ->values()->all(),
            ],
        ]);
    }

    public function show(JobSubmission $submission): Response
    {
        $submission->load(['category', 'platform', 'reviewer', 'jobPosting']);

        return Inertia::render('Admin/Submissions/Show', [
            'submission' => [
                'id' => $submission->id,
                'status' => $submission->status,
                'status_label' => self::STATUSES[$submission->status],
                'created_at' => $submission->created_at->toIso8601String(),
                'submitter' => ['name' => $submission->submitter_name, 'email' => $submission->submitter_email, 'phone' => $submission->submitter_phone, 'ip' => $submission->submitter_ip],
                'company' => [
                    'name' => $submission->company_name, 'website_url' => $submission->company_website_url,
                    'logo' => $submission->company_logo_path ? Storage::disk('public')->url($submission->company_logo_path) : null,
                ],
                'title' => $submission->title,
                'category' => $submission->category->name,
                'work_mode' => $submission->work_mode->label(),
                'employment_type' => $submission->employment_type->label(),
                'experience_level' => $submission->experience_level?->label(),
                'location' => $submission->city ? "{$submission->city}, {$submission->state}" : null,
                'description' => $submission->description,
                'requirements' => $submission->requirements,
                'benefits' => $submission->benefits,
                'salary' => \App\Support\JobPresenter::salary((new \App\Models\JobPosting)->forceFill([
                    'salary_min' => $submission->salary_min, 'salary_max' => $submission->salary_max,
                    'salary_currency' => 'BRL', 'salary_period' => $submission->salary_period,
                ])),
                'platform' => ['label' => $submission->platform->name, 'logo' => $submission->platform->logo_src, 'uses_email' => $submission->platform->uses_email],
                'apply_url' => $submission->apply_url,
                'apply_email' => $submission->apply_email,
                'rejection_reason' => $submission->rejection_reason,
                'reviewed_at' => $submission->reviewed_at?->toIso8601String(),
                'reviewer' => $submission->reviewer?->name,
                'job_edit_url' => $submission->job_posting_id ? route('admin.jobs.edit', $submission->job_posting_id) : null,
            ],
        ]);
    }

    /** Aprova: cria a vaga como RASCUNHO (para revisar e publicar) e liga à solicitação. */
    public function approve(Request $request, JobSubmission $submission, JobPostingWriter $writer): RedirectResponse
    {
        $this->ensurePending($submission);

        $job = DB::transaction(function () use ($submission, $writer, $request) {
            $job = $writer->create([
                'title' => $submission->title,
                'company_name' => $submission->company_name,
                'company_website_url' => $submission->company_website_url,
                'category_id' => $submission->category_id,
                'work_mode' => $submission->work_mode->value,
                'employment_type' => $submission->employment_type->value,
                'experience_level' => $submission->experience_level?->value,
                'city' => $submission->city,
                'state' => $submission->state,
                'description' => $submission->description,
                'requirements' => $submission->requirements,
                'benefits' => $submission->benefits,
                'salary_min' => $submission->salary_min,
                'salary_max' => $submission->salary_max,
                'salary_period' => $submission->salary_period?->value,
                'salary_currency' => 'BRL',
                'platform_id' => $submission->platform_id,
                'apply_url' => $submission->apply_url,
                'apply_email' => $submission->apply_email,
                'source_name' => 'Enviada pelo site',
                'is_featured' => false,
            ], $request->user());

            // Logotipo enviado: aproveita se a empresa ainda não tem um.
            $company = $job->company;
            if ($submission->company_logo_path && ! $company->logo_path && ! $company->logo_url && Storage::disk('public')->exists($submission->company_logo_path)) {
                $ext = pathinfo($submission->company_logo_path, PATHINFO_EXTENSION);
                $target = 'logos/companies/'.uniqid('c_', true).'.'.$ext;
                Storage::disk('public')->copy($submission->company_logo_path, $target);
                $company->update(['logo_path' => $target]);
            }

            $job->forceFill(['needs_review' => true])->save();

            $submission->forceFill([
                'status' => JobSubmission::APPROVED,
                'reviewed_by' => $request->user()->id,
                'reviewed_at' => now(),
                'job_posting_id' => $job->id,
            ])->save();

            return $job;
        });

        return redirect()->route('admin.jobs.edit', $job)->with('success', 'Solicitação aprovada. A vaga foi criada como rascunho: revise e publique.');
    }

    public function reject(Request $request, JobSubmission $submission, LogoStorage $logos): RedirectResponse
    {
        $this->ensurePending($submission);

        $data = $request->validate(['reason' => ['required', 'string', 'min:3', 'max:500']], [], ['reason' => 'motivo']);

        $logos->delete($submission->company_logo_path);

        $submission->forceFill([
            'status' => JobSubmission::REJECTED,
            'rejection_reason' => $data['reason'],
            'company_logo_path' => null,
            'reviewed_by' => $request->user()->id,
            'reviewed_at' => now(),
        ])->save();

        return redirect()->route('admin.submissions.index')->with('success', 'Solicitação recusada.');
    }

    private function ensurePending(JobSubmission $submission): void
    {
        if (! $submission->isPending()) {
            throw ValidationException::withMessages(['status' => 'Esta solicitação já foi analisada.']);
        }
    }
}