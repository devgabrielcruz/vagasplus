<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

/**
 * Aceita apenas URLs absolutas http(s) com host. Rejeita javascript:, data:, etc.
 * Com $httpsOnly = true (padrão), exige HTTPS.
 */
class SafeUrl implements ValidationRule
{
    public function __construct(private readonly bool $httpsOnly = true) {}

    public static function isSafe(?string $url, bool $httpsOnly = true): bool
    {
        if ($url === null || $url === '' || preg_match('/[\x00-\x20\x7F]/', $url)) {
            return false;
        }

        $parts = parse_url($url);

        if ($parts === false || empty($parts['scheme']) || empty($parts['host'])) {
            return false;
        }

        $scheme = strtolower($parts['scheme']);
        $allowed = $httpsOnly ? ['https'] : ['https', 'http'];

        return in_array($scheme, $allowed, true) && ! isset($parts['user']) && ! isset($parts['pass']);
    }

    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (! is_string($value) || ! self::isSafe($value, $this->httpsOnly)) {
            $fail($this->httpsOnly
                ? 'O campo :attribute deve ser uma URL válida que comece com https://.'
                : 'O campo :attribute deve ser uma URL válida (http:// ou https://).');
        }
    }
}
