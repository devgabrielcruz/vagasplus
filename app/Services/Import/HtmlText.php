<?php

namespace App\Services\Import;

use DOMDocument;
use DOMXPath;

/** Reduz uma página HTML ao texto legível (sem scripts, menus e rodapés). */
class HtmlText
{
    /**
     * Dados que sites modernos (Next.js, Nuxt, etc.) embutem no HTML para montar a página:
     * <script id="__NEXT_DATA__"> e <script type="application/json">. Texto bruto, limitado.
     */
    public static function embeddedJson(string $html, int $limit = 12000): string
    {
        $dom = new DOMDocument;
        libxml_use_internal_errors(true);
        $dom->loadHTML('<?xml encoding="utf-8"?>'.$html, LIBXML_NOWARNING | LIBXML_NOERROR | LIBXML_COMPACT);
        libxml_clear_errors();

        $parts = [];
        foreach ((new DOMXPath($dom))->query('//script[@id="__NEXT_DATA__" or @type="application/json"]') as $script) {
            $json = trim($script->textContent);

            if (strlen($json) > 40) {
                $parts[] = $json;
            }
        }

        $blob = html_entity_decode(strip_tags(implode("\n", $parts)), ENT_QUOTES | ENT_HTML5, 'UTF-8');

        return mb_substr((string) preg_replace('/\s+/u', ' ', $blob), 0, $limit);
    }

    public static function from(string $html, int $limit = 14000): string
    {
        $dom = new DOMDocument;
        libxml_use_internal_errors(true);
        $dom->loadHTML('<?xml encoding="utf-8"?>'.$html, LIBXML_NOWARNING | LIBXML_NOERROR | LIBXML_COMPACT);
        libxml_clear_errors();

        $xpath = new DOMXPath($dom);
        foreach ($xpath->query('//script|//style|//noscript|//svg|//nav|//footer|//iframe|//template') as $node) {
            $node->parentNode?->removeChild($node);
        }

        // Quebras de linha em elementos de bloco para preservar a estrutura em listas e parágrafos.
        foreach ($xpath->query('//br|//p|//li|//h1|//h2|//h3|//h4|//div|//tr') as $node) {
            $node->appendChild($dom->createTextNode("\n"));
        }

        $title = trim((string) $dom->getElementsByTagName('title')->item(0)?->textContent);
        $body = $dom->getElementsByTagName('body')->item(0)?->textContent ?? $dom->textContent;

        $text = preg_replace(["/[ \t\x{00A0}]+/u", "/\s*\n\s*/", "/\n{3,}/"], [' ', "\n", "\n\n"], (string) $body);
        $text = trim(($title !== '' ? "Título da página: {$title}\n\n" : '').$text);

        return mb_substr($text, 0, $limit);
    }
}
