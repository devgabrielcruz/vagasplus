<?php

namespace App\Enums;

enum EmploymentType: string
{
    case Clt = 'clt';
    case Pj = 'pj';
    case Internship = 'internship';
    case Apprentice = 'apprentice';
    case Temporary = 'temporary';
    case Freelance = 'freelance';

    public function label(): string
    {
        return match ($this) {
            self::Clt => 'CLT',
            self::Pj => 'PJ',
            self::Internship => 'Estágio',
            self::Apprentice => 'Jovem aprendiz',
            self::Temporary => 'Temporário',
            self::Freelance => 'Freelancer',
        };
    }

    /** Valor do schema.org/employmentType. */
    public function schemaOrg(): string
    {
        return match ($this) {
            self::Clt => 'FULL_TIME',
            self::Pj => 'CONTRACTOR',
            self::Internship, self::Apprentice => 'INTERN',
            self::Temporary => 'TEMPORARY',
            self::Freelance => 'CONTRACTOR',
        };
    }
}
