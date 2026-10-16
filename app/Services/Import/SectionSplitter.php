<?php

namespace App\Services\Import;

use DOMDocument;
use DOMElement;
use DOMNode;

/**
 * Divide uma descrição em HTML nas seções do formulário (descrição, responsabilidades, requisitos,
 * diferenciais, benefícios...) usando os títulos (h1–h6 ou parágrafo só em negrito) como divisores.
 * Títulos que não reconhecemos ficam no texto da seção em que aparecem.
 */
class SectionSplitter
{
    public function __construct(private readonly TextHeuristicExtractor $rules) {}

    /** @return array<string, string> seção => HTML (sem sanitizar) */
    public function split(string $html): array
    {
        $dom = new DOMDocument;
        libxml_use_internal_errors(true);
        $dom->loadHTML('<?xml encoding="utf-8"?><div id="root">'.$html.'</div>', LIBXML_NOWARNING | LIBXML_NOERROR);
        libxml_clear_errors();

        $root = $dom->getElementById('root');
        $this->unwrapDivs($dom);
        $this->flattenLists($dom);
        $buckets = [];
        $current = 'description';

        foreach ($root?->childNodes ?? [] as $node) {
            $heading = $this->headingText($node);

            if ($heading !== null && ($key = $this->rules->sectionKey($heading)) !== null) {
                $current = $key;

                continue;
            }

            $buckets[$current][] = $dom->saveHTML($node);
        }

        return array_filter(array_map(fn ($parts) => trim(implode('', $parts)), $buckets), fn ($v) => strip_tags($v) !== '' && trim(strip_tags($v)) !== '');
    }

    /** Blocos <div> usados só como embrulho: seus filhos passam a ser filhos diretos (para achar os títulos). */
    private function unwrapDivs(DOMDocument $dom): void
    {
        do {
            $changed = false;

            foreach (iterator_to_array($dom->getElementsByTagName('div')) as $div) {
                if ($div->getAttribute('id') === 'root' || ! $div->parentNode) {
                    continue;
                }

                foreach (iterator_to_array($div->childNodes) as $child) {
                    $div->parentNode->insertBefore($child, $div);
                }

                $div->parentNode->removeChild($div);
                $changed = true;
                break;
            }
        } while ($changed);
    }

    /** Editores geram <ul><li><ul>…</ul></li></ul>: remove o <li> que só embrulha outra lista. */
    private function flattenLists(DOMDocument $dom): void
    {
        do {
            $changed = false;

            foreach (iterator_to_array($dom->getElementsByTagName('li')) as $li) {
                $elements = array_filter(iterator_to_array($li->childNodes), fn ($n) => $n instanceof DOMElement);
                $onlyList = count($elements) === 1 && in_array(strtolower(reset($elements)->tagName), ['ul', 'ol'], true);
                $noText = trim(implode('', array_map(fn ($n) => $n instanceof \DOMText ? $n->textContent : '', iterator_to_array($li->childNodes)))) === '';

                if ($onlyList && $noText && $li->parentNode) {
                    $inner = reset($elements);
                    $parent = $li->parentNode;

                    foreach (iterator_to_array($inner->childNodes) as $child) {
                        $parent->insertBefore($child, $li);
                    }

                    $parent->removeChild($li);
                    $changed = true;
                    break;
                }
            }
        } while ($changed);
    }

    private function headingText(DOMNode $node): ?string
    {
        if (! $node instanceof DOMElement) {
            return null;
        }

        $text = trim(preg_replace('/\s+/u', ' ', $node->textContent));

        if ($text === '' || mb_strlen($text) > 90) {
            return null;
        }

        if (preg_match('/^h[1-6]$/i', $node->tagName)) {
            return $text;
        }

        // Parágrafo cujo conteúdo é só um trecho em negrito: "<p><strong>Requisitos</strong></p>"
        if (strtolower($node->tagName) === 'p' && $node->childNodes->length >= 1) {
            $strong = $node->getElementsByTagName('strong')->item(0) ?? $node->getElementsByTagName('b')->item(0);

            // Compara só letras/números: "<strong>Diferencial:</strong> 🧐" também é um título.
            $letters = fn (string $t) => preg_replace('/[^\p{L}\p{N}]/u', '', $t);

            if ($strong && $letters($strong->textContent) !== '' && $letters($strong->textContent) === $letters($text)) {
                return $text;
            }
        }

        return null;
    }
}
