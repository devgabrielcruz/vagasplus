<script setup lang="ts">
import { usePage } from '@inertiajs/vue3';
import { Megaphone } from 'lucide-vue-next';
import { computed, onMounted } from 'vue';

/**
 * Espaço publicitário, sempre presente, com altura reservada (sem salto de layout).
 *  - Com ADS_ENABLED + ADS_CLIENT_ID + ID da posição (ADS_SLOT_*): renderiza a unidade do AdSense.
 *  - Caso contrário: mostra "Anuncie aqui" (venda direta de espaço por e-mail).
 *
 * Formatos: leaderboard (728×90, 320×100 no móvel), rectangle (336×280), square (300×250),
 *           sidebar (336×600), infeed (fluido) e card (mesmo tamanho de um card de vaga,
 *           para ficar no meio da lista; traz o selo "Anúncio" para não se passar por vaga).
 */
const props = withDefaults(defineProps<{ placement: string; format?: 'leaderboard' | 'rectangle' | 'square' | 'sidebar' | 'infeed' | 'card' }>(), { format: 'leaderboard' });

const page = usePage<{ ads: { enabled: boolean; client: string | null; slots: Record<string, string | null>; demo: boolean }; app: { contactEmail: string } }>();
const ads = computed(() => page.props.ads);
const unitId = computed(() => (ads.value?.enabled && ads.value.client ? (ads.value.slots?.[props.placement] ?? null) : null));
const mail = computed(() => `mailto:${page.props.app?.contactEmail}?subject=${encodeURIComponent(`Anunciar no VagasPlus — ${props.placement}`)}`);

// Banners fictícios (ADS_DEMO): escolha estável por posição, igual no servidor e no cliente.
const demos = [
    { slug: 'cursoplus', name: 'CursoPlus' },
    { slug: 'fintech-nova', name: 'Nova Pay' },
    { slug: 'hospedagem-max', name: 'HostMax' },
];
const demo = computed(() => {
    if (!ads.value?.demo || unitId.value) return null;
    const d = demos[[...props.placement].reduce((n, c) => n + c.charCodeAt(0), 0) % demos.length];
    if (props.format === 'square') return { ...d, src: `/img/promo/${d.slug}-square.svg`, w: 300, h: 250 };
    if (props.format === 'card') return { ...d, src: `/img/promo/${d.slug}-card.svg`, w: 544, h: 170 };
    const wide = props.format === 'leaderboard' || props.format === 'infeed';
    return { ...d, src: `/img/promo/${d.slug}-${wide ? 'wide' : 'box'}.svg`, w: wide ? 728 : 336, h: wide ? 90 : 280 };
});

const size: Record<string, string> = {
    leaderboard: 'min-h-[90px] w-full max-w-[728px]',
    rectangle: 'min-h-[280px] w-full max-w-[336px]',
    square: 'min-h-[250px] w-full max-w-[300px]',
    sidebar: 'min-h-[250px] xl:min-h-[600px] w-full max-w-[336px]',
    infeed: 'min-h-[120px] w-full',
};

onMounted(() => {
    if (!unitId.value) return;
    try {
        ((window as unknown as { adsbygoogle: unknown[] }).adsbygoogle ||= []).push({});
    } catch {
        /* bloqueadores de anúncio podem impedir o script; o espaço permanece reservado */
    }
});
</script>

<template>
    <!-- Card de anúncio: ocupa uma célula da grade, com a mesma aparência/altura dos cards de vaga -->
    <aside v-if="format === 'card'" aria-label="Publicidade" class="card flex h-full min-h-[198px] flex-col overflow-hidden" :data-slot="placement">
        <p class="px-4 pt-2.5 pb-1.5 text-[10px] font-semibold tracking-[0.12em] text-subtle uppercase">Anúncio</p>
        <div class="flex flex-1 items-stretch">
            <ins v-if="unitId" class="adsbygoogle block size-full" style="display: block" :data-ad-client="ads.client!" :data-ad-slot="unitId" data-ad-format="auto" data-full-width-responsive="true" />
            <a v-else-if="demo" href="https://example.com" target="_blank" rel="sponsored nofollow noopener noreferrer" class="block size-full" :aria-label="`Anúncio de demonstração: ${demo.name}`"><img :src="demo.src" :alt="`Anúncio de demonstração de ${demo.name}`" :width="demo.w" :height="demo.h" class="block size-full object-cover" decoding="async" /></a>
            <a v-else :href="mail" class="flex size-full flex-col items-center justify-center gap-1.5 bg-[repeating-linear-gradient(135deg,transparent,transparent_10px,var(--color-surface)_10px,var(--color-surface)_20px)] p-4 text-center transition-colors hover:bg-navy-50">
                <Megaphone class="size-5 text-action-600" aria-hidden="true" />
                <span class="text-sm font-bold text-ink">Anuncie aqui</span>
                <span class="max-w-[34ch] text-xs text-muted">Alcance quem busca emprego todos os dias. Fale com a gente.</span>
            </a>
        </div>
    </aside>

    <aside v-else aria-label="Publicidade" class="flex justify-center" :data-slot="placement">
        <div class="flex items-center justify-center overflow-hidden rounded-xl border border-line bg-white" :class="size[format]">
            <ins v-if="unitId" class="adsbygoogle block size-full" style="display: block" :data-ad-client="ads.client!" :data-ad-slot="unitId" data-ad-format="auto" data-full-width-responsive="true" />
            <a v-else-if="demo" href="https://example.com" target="_blank" rel="sponsored nofollow noopener noreferrer" class="block w-full" :aria-label="`Anúncio de demonstração: ${demo.name}`"><img :src="demo.src" :alt="`Anúncio de demonstração de ${demo.name}`" :width="demo.w" :height="demo.h" class="block h-auto w-full" decoding="async" /></a>
            <a v-else :href="mail" class="flex size-full flex-col items-center justify-center gap-1.5 bg-[repeating-linear-gradient(135deg,transparent,transparent_10px,var(--color-surface)_10px,var(--color-surface)_20px)] p-4 text-center transition-colors hover:bg-navy-50">
                <Megaphone class="size-5 text-action-600" aria-hidden="true" />
                <span class="text-sm font-bold text-ink">Anuncie aqui</span>
                <span class="max-w-[28ch] text-xs text-muted">Alcance quem busca emprego todos os dias. Fale com a gente.</span>
            </a>
        </div>
    </aside>
</template>
