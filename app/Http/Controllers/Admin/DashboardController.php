<?php

namespace App\Http\Controllers\Admin;

use App\Enums\JobStatus;
use App\Http\Controllers\Controller;
use App\Models\JobPosting;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(): Response
    {
        $now = now();

        $stats = [
            'active' => JobPosting::active($now)->count(),
            'draft' => JobPosting::where('status', JobStatus::Draft)->count(),
            'scheduled' => JobPosting::where('status', JobStatus::Scheduled)->where('published_at', '>', $now)->count(),
            'expiring_soon' => JobPosting::active($now)->where('expires_at', '<=', $now->copy()->addDays(7))->count(),
            // Inclui as que já venceram mas o scheduler ainda não marcou como expiradas.
            'expired' => JobPosting::where(fn ($q) => $q->where('status', JobStatus::Expired)
                ->orWhere(fn ($w) => $w->where('status', JobStatus::Published)->where('expires_at', '<=', $now)))->count(),
            'recently_expired' => JobPosting::whereIn('status', [JobStatus::Expired, JobStatus::Published])
                ->where('expires_at', '<=', $now)->where('expires_at', '>=', $now->copy()->subDays(7))->count(),
            'needs_review' => JobPosting::where('needs_review', true)->whereNotIn('status', [JobStatus::Archived])->count(),
            'archived' => JobPosting::where('status', JobStatus::Archived)->count(),
            'submissions' => \App\Models\JobSubmission::where('status', 'pending')->count(),
        ];

        $row = fn (JobPosting $j) => [
            'id' => $j->id,
            'title' => $j->title,
            'company' => $j->company->name,
            'expires_at' => $j->expires_at?->toIso8601String(),
            'edit_url' => route('admin.jobs.edit', $j),
        ];

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'expiringSoon' => JobPosting::active($now)->with('company')
                ->where('expires_at', '<=', $now->copy()->addDays(7))->orderBy('expires_at')->limit(8)->get()->map($row),
            'recentlyExpired' => JobPosting::with('company')
                ->whereIn('status', [JobStatus::Expired, JobStatus::Published])
                ->where('expires_at', '<=', $now)->where('expires_at', '>=', $now->copy()->subDays(7))
                ->orderByDesc('expires_at')->limit(8)->get()->map($row),
        ]);
    }
}
