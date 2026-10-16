<?php

namespace App\Enums;

enum ExperienceLevel: string
{
    case Intern = 'intern';
    case Junior = 'junior';
    case Mid = 'mid';
    case Senior = 'senior';
    case Lead = 'lead';

    public function label(): string
    {
        return match ($this) {
            self::Intern => 'Estágio',
            self::Junior => 'Júnior',
            self::Mid => 'Pleno',
            self::Senior => 'Sênior',
            self::Lead => 'Liderança',
        };
    }
}
