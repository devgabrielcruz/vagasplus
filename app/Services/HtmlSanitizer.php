<?php

namespace App\Services;

use Symfony\Component\HtmlSanitizer\HtmlSanitizer as SymfonySanitizer;
use Symfony\Component\HtmlSanitizer\HtmlSanitizerConfig;

/**
 * Sanitiza o HTML aceito nos campos de conteúdo das vagas (lista branca de tags simples).
 */
class HtmlSanitizer
{
    private SymfonySanitizer $sanitizer;

    public function __construct()
    {
        $config = (new HtmlSanitizerConfig())
            ->allowElement('p')
            ->allowElement('br')
            ->allowElement('strong')
            ->allowElement('b')
            ->allowElement('em')
            ->allowElement('i')
            ->allowElement('u')
            ->allowElement('ul')
            ->allowElement('ol')
            ->allowElement('li')
            ->allowElement('h3')
            ->allowElement('h4')
            ->allowElement('blockquote')
            ->allowElement('a', ['href'])
            ->allowLinkSchemes(['https', 'http', 'mailto'])
            ->forceAttribute('a', 'rel', 'noopener noreferrer nofollow ugc')
            ->forceAttribute('a', 'target', '_blank')
            ->allowRelativeLinks(false)
            ->allowRelativeMedias(false);

        $this->sanitizer = new SymfonySanitizer($config);
    }

    public function clean(?string $html): ?string
    {
        $html = trim((string) $html);

        if ($html === '') {
            return null;
        }

        // Texto puro (sem nenhuma tag) vira parágrafos, preservando quebras de linha.
        if (! str_contains($html, '<')) {
            $html = collect(preg_split('/\R{2,}/', e($html)))
                ->map(fn ($p) => '<p>'.nl2br(trim($p), false).'</p>')
                ->implode('');
        }

        $clean = trim($this->sanitizer->sanitize($html));

        return $clean === '' ? null : $clean;
    }
}
