<?php

namespace App\Models;

use App\Enums\JobEvent;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class JobPostingEvent extends Model
{
    public const UPDATED_AT = null;

    protected $fillable = ['job_posting_id', 'user_id', 'event', 'from_status', 'to_status', 'meta'];

    protected function casts(): array
    {
        return ['event' => JobEvent::class, 'meta' => 'array', 'created_at' => 'datetime'];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
