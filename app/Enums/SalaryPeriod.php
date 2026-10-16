<?php

namespace App\Enums;

enum SalaryPeriod: string
{
    case Hour = 'hour';
    case Month = 'month';
    case Year = 'year';

    public function label(): string
    {
        return match ($this) {
            self::Hour => 'por hora',
            self::Month => 'por mês',
            self::Year => 'por ano',
        };
    }

    /** Valor do schema.org/QuantitativeValue.unitText. */
    public function schemaOrg(): string
    {
        return match ($this) {
            self::Hour => 'HOUR',
            self::Month => 'MONTH',
            self::Year => 'YEAR',
        };
    }
}
