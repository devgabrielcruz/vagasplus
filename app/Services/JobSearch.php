<?php

namespace App\Services;

use App\Enums\EmploymentType;
use App\Enums\ExperienceLevel;
use App\Enums\WorkMode;
use App\Models\JobPosting;
use App\Support\Like;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;

/**
 * Busca pública de vagas. Sempre parte de JobPosting::active(), então vagas
 * expiradas, rascunhos, agendadas futuras e arquivadas nunca aparecem.
 */
class JobSearch
{
    public const PARAMS = ['q', 'local', 'categoria', 'modalidade', 'tipo', 'nivel', 'plataforma'];

    public static function filtersFrom(Request $request): array
    {
        $filters = [];

        foreach (self::PARAMS as $param) {
            $value = $request->query($param);
            if (is_string($value) && trim($value) !== '') {
                $filters[$param] = mb_substr(trim($value), 0, 100);
            }
        }

        return $filters;
    }

    public function query(array $filters = []): Builder
    {
        $query = JobPosting::query()->active()->with(['company', 'location', 'category', 'platform']);

        if ($q = $filters['q'] ?? null) {
            $like = Like::contains($q);
            $query->where(function (Builder $w) use ($like) {
                Like::where($w, 'job_postings.title', $like);
                Like::orWhere($w, 'job_postings.description', $like);
                Like::orWhere($w, 'job_postings.requirements', $like);
                $w->orWhereHas('company', fn (Builder $c) => Like::where($c, 'companies.name', $like));
            });
        }

        if ($local = $filters['local'] ?? null) {
            $like = Like::contains($local);
            $query->whereHas('location', function (Builder $l) use ($local, $like) {
                Like::where($l, 'locations.city', $like);
                $l->orWhere('locations.state', strtoupper($local));
            });
        }

        if ($slug = $filters['categoria'] ?? null) {
            $query->whereHas('category', fn (Builder $c) => $c->where('slug', $slug));
        }

        if (($mode = $filters['modalidade'] ?? null) && WorkMode::tryFrom($mode)) {
            $query->where('work_mode', $mode);
        }

        if (($type = $filters['tipo'] ?? null) && EmploymentType::tryFrom($type)) {
            $query->where('employment_type', $type);
        }

        if ($platform = $filters['plataforma'] ?? null) {
            $query->whereHas('platform', fn (Builder $p) => $p->where('slug', $platform));
        }

        if (($level = $filters['nivel'] ?? null) && ExperienceLevel::tryFrom($level)) {
            $query->where('experience_level', $level);
        }

        return $query->orderByDesc('published_at')->orderByDesc('id');
    }

    public function paginate(array $filters, int $perPage = 12): LengthAwarePaginator
    {
        return $this->query($filters)->paginate($perPage)->withQueryString();
    }

}
