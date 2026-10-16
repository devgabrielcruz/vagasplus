<?php

namespace App\Enums;

enum JobStatus: string
{
    case Draft = 'draft';
    case Scheduled = 'scheduled';
    case Published = 'published';
    case Expired = 'expired';
    case Archived = 'archived';

    public function label(): string
    {
        return match ($this) {
            self::Draft => 'Rascunho',
            self::Scheduled => 'Agendada',
            self::Published => 'Publicada',
            self::Expired => 'Expirada',
            self::Archived => 'Arquivada',
        };
    }
}
