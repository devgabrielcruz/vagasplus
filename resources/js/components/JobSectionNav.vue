<script setup lang="ts">
import { ListTree } from 'lucide-vue-next';
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';

/**
 * Índice navegável da vaga: clicar rola até a seção, e a seção visível fica destacada (scrollspy).
 *  - card:  coluna fixa à esquerda (1280 px ou mais)
 *  - chips: barra horizontal fixa abaixo do menu (abaixo de 1280 px)
 * É uma lista de âncoras comuns (funciona sem JS) com rolagem suave que respeita "reduzir movimento".
 */
const props = defineProps<{ items: { id: string; title: string }[]; variant: 'card' | 'chips' }>();

const active = ref(props.items[0]?.id ?? '');
const chipsRef = ref<HTMLElement | null>(null);
let observer: IntersectionObserver | undefined;
const inView = new Set<string>();

function pickActive() {
    // Fim da página: a última seção pode ser curta demais para chegar ao topo; destaca-a.
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 6) {
        active.value = props.items[props.items.length - 1]?.id ?? active.value;
        return;
    }

    const first = props.items.find((i) => inView.has(i.id));
    if (first) active.value = first.id;
}

onMounted(() => {
    observer = new IntersectionObserver(
        (entries) => {
            for (const e of entries) e.isIntersecting ? inView.add(e.target.id) : inView.delete(e.target.id);
            pickActive();
        },
        // Faixa de leitura: da parte de cima (abaixo do menu fixo) até ~45% da tela.
        { rootMargin: '-110px 0px -55% 0px', threshold: 0 },
    );

    props.items.forEach((i) => {
        const el = document.getElementById(i.id);
        if (el) observer!.observe(el);
    });

    window.addEventListener('scroll', pickActive, { passive: true });
});

onBeforeUnmount(() => {
    observer?.disconnect();
    window.removeEventListener('scroll', pickActive);
});

function go(e: Event, id: string) {
    const el = document.getElementById(id);
    if (!el) return;

    e.preventDefault();
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    history.replaceState(history.state, '', `#${id}`);
    active.value = id;
    // Leva o foco do teclado/leitor de tela para o título da seção (sem rolar de novo).
    (el.querySelector('h2') as HTMLElement | null)?.focus({ preventScroll: true });
}

// Mantém o chip ativo visível na barra horizontal.
watch(active, async (id) => {
    if (props.variant !== 'chips') return;
    await nextTick();
    const bar = chipsRef.value;
    const chip = bar?.querySelector<HTMLElement>(`[data-id="${id}"]`);
    // Rola só a barra horizontal (scrollIntoView também mexeria na página e cancelaria a rolagem até a seção).
    if (bar && chip) bar.scrollTo({ left: chip.offsetLeft - bar.clientWidth / 2 + chip.clientWidth / 2, behavior: 'smooth' });
});
</script>

<template>
    <nav v-if="variant === 'card'" aria-label="Seções desta vaga" class="card hidden p-4 xl:block">
        <p class="mb-2 flex items-center gap-2 px-2 text-xs font-bold tracking-widest text-muted uppercase"><ListTree class="size-3.5" aria-hidden="true" />Nesta vaga</p>
        <ol class="space-y-0.5">
            <li v-for="item in items" :key="item.id">
                <a
                    :href="`#${item.id}`"
                    :aria-current="active === item.id ? 'location' : undefined"
                    class="block rounded-lg border-l-2 px-3 py-2 text-sm font-semibold transition-colors"
                    :class="active === item.id ? 'border-action-600 bg-action-50 text-action-700' : 'border-transparent text-muted hover:bg-surface hover:text-ink'"
                    @click="go($event, item.id)"
                >{{ item.title }}</a>
            </li>
        </ol>
    </nav>

    <nav v-else aria-label="Seções desta vaga" class="sticky top-16 z-30 -mx-4 mb-4 border-b border-line bg-surface/95 backdrop-blur sm:-mx-6 lg:-mx-8 xl:hidden">
        <ol ref="chipsRef" class="flex gap-2 overflow-x-auto px-4 py-2.5 sm:px-6 [scrollbar-width:none]">
            <li v-for="item in items" :key="item.id" class="shrink-0">
                <a
                    :href="`#${item.id}`"
                    :data-id="item.id"
                    :aria-current="active === item.id ? 'location' : undefined"
                    class="inline-flex min-h-9 items-center rounded-full border px-3.5 text-[13px] font-semibold whitespace-nowrap transition-colors"
                    :class="active === item.id ? 'border-action-600 bg-action-600 text-white' : 'border-line-strong bg-white text-muted'"
                    @click="go($event, item.id)"
                >{{ item.title }}</a>
            </li>
        </ol>
    </nav>
</template>
