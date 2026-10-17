<script setup lang="ts">
import { usePage } from '@inertiajs/vue3';
import { Heart, MousePointerClick, PauseCircle, RefreshCw, ShieldBan } from 'lucide-vue-next';
import { computed, nextTick, ref, watch } from 'vue';
import { useAdBlockDetection } from '@/composables/useAdBlockDetection';

/**
 * Aviso de tela cheia para quem usa bloqueador de anúncios. Só atua com a publicidade ligada
 * (ADS_ENABLED + ID do AdSense) e ADS_ADBLOCK_WALL=true. Robôs de busca nunca o veem.
 */
const page = usePage<{ ads: { enabled: boolean; adblockWall: boolean } }>();
const active = computed(() => !!page.props.ads?.enabled && !!page.props.ads?.adblockWall);
const { blocked, checking, check } = useAdBlockDetection(() => active.value);

const dialog = ref<HTMLElement | null>(null);
const show = computed(() => active.value && blocked.value);

watch(show, async (on) => {
    document.documentElement.classList.toggle('overflow-hidden', on);
    // Deixa o resto da página inacessível a teclado e leitores de tela.
    document.getElementById('app')?.toggleAttribute('inert', on);
    if (on) {
        await nextTick();
        dialog.value?.focus();
    }
});

const steps = [
    { icon: MousePointerClick, title: 'Abra o bloqueador', text: 'Clique no ícone do AdBlock na barra do navegador.' },
    { icon: PauseCircle, title: 'Pause neste site', text: 'Escolha “Pausar” ou “Desativar neste site”.' },
    { icon: RefreshCw, title: 'Volte e continue', text: 'Clique no botão abaixo e pronto.' },
];
</script>

<template>
    <Teleport to="body">
        <div v-if="show" class="fixed inset-0 z-[100] grid place-items-center overflow-y-auto p-4 backdrop-blur-md">
            <div ref="dialog" role="alertdialog" aria-modal="true" aria-labelledby="adblock-title" aria-describedby="adblock-desc" tabindex="-1" class="w-full max-w-4xl overflow-hidden rounded-3xl md:grid md:grid-cols-[17rem_1fr] border border-line bg-white shadow-[0_30px_80px_-20px_rgb(11_31_77/0.45)] outline-none">
                <!-- Ilustração: escudo do bloqueador com "anúncios" sendo barrados -->
                <div class="relative grid h-44 place-items-center overflow-hidden bg-gradient-to-br from-red-600 to-red-800 md:h-auto md:min-h-full" aria-hidden="true">
                    <div class="absolute -top-10 -left-10 size-40 rounded-full bg-white/5"></div>
                    <div class="absolute -right-12 -bottom-16 size-48 rounded-full bg-white/5"></div>
                    <span class="absolute top-7 left-[14%] -rotate-12 rounded-md bg-white/15 px-2 py-1 text-[11px] font-extrabold tracking-wider text-white/80 line-through decoration-2">AD</span>
                    <span class="absolute top-12 right-[16%] rotate-6 rounded-md bg-white/15 px-2 py-1 text-[11px] font-extrabold tracking-wider text-white/80 line-through decoration-2">ANÚNCIO</span>
                    <span class="absolute bottom-7 left-[22%] rotate-6 rounded-md bg-white/15 px-2 py-1 text-[11px] font-extrabold tracking-wider text-white/80 line-through decoration-2">AD</span>
                    <span class="absolute right-[24%] bottom-6 -rotate-6 rounded-md bg-white/15 px-2 py-1 text-[11px] font-extrabold tracking-wider text-white/80 line-through decoration-2">PUBLI</span>
                    <span class="relative grid size-24 place-items-center rounded-full bg-white shadow-xl ring-8 ring-white/15">
                        <ShieldBan class="size-12 text-red-600" stroke-width="2" />
                    </span>
                </div>

                <div class="p-6 sm:p-8 md:p-10">
                    <h2 id="adblock-title" class="text-2xl font-extrabold text-balance text-ink">Sabemos que anúncios não são legais…</h2>
                    <div id="adblock-desc" class="mt-3 space-y-3 text-[15px] leading-relaxed text-muted">
                        <p>A gente também não gosta de propaganda atrapalhando. Mas é ela que paga os custos do VagasPlus, e é por isso que você busca vagas sem pagar nada e sem criar conta.</p>
                        <p>Percebemos que você está usando um bloqueador de anúncios. Pode liberar o VagasPlus nele? Prometemos manter tudo discreto.</p>
                    </div>

                    <ol class="mt-6 grid gap-3 sm:grid-cols-3">
                        <li v-for="(s, i) in steps" :key="i" class="relative rounded-2xl bg-surface p-4 text-center">
                            <span class="absolute top-2.5 left-3 text-xs font-extrabold text-subtle">{{ i + 1 }}</span>
                            <span class="mx-auto grid size-10 place-items-center rounded-xl bg-white text-navy-900 shadow-sm ring-1 ring-line"><component :is="s.icon" class="size-5" aria-hidden="true" /></span>
                            <p class="mt-2.5 text-sm font-bold text-ink">{{ s.title }}</p>
                            <p class="mt-1 text-xs leading-snug text-muted">{{ s.text }}</p>
                        </li>
                    </ol>

                    <button type="button" class="btn-primary mt-6 w-full md:w-auto md:px-8" :disabled="checking" @click="check">
                        <RefreshCw class="size-4" :class="{ 'animate-spin': checking }" aria-hidden="true" />Já desativei, continuar
                    </button>
                    <p class="mt-3 flex items-center gap-1.5 text-xs text-subtle"><Heart class="size-3.5 fill-current text-action-600" aria-hidden="true" />Obrigado por apoiar o VagasPlus</p>
                </div>
            </div>
        </div>
    </Teleport>
</template>
