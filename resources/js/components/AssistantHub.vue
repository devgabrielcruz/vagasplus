<script lang="ts">
// Painéis abertos ao mesmo tempo (hoje no máximo um): o scroll da página só volta quando o último fecha.
let scrollLocks = 0;
</script>

<script setup lang="ts">
import { X } from 'lucide-vue-next';
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import InterviewTool from '@/components/assistant/InterviewTool.vue';
import MatchTool from '@/components/assistant/MatchTool.vue';
import QuestionsTool from '@/components/assistant/QuestionsTool.vue';
import { ASSISTANT_TOOLS, type AssistantTool } from '@/lib/assistant';

// Painel único das ferramentas de IA da vaga: modal no desktop, bottom sheet (arrastável) no celular.
// As três ferramentas ficam montadas (KeepAlive) e o andamento de cada uma é mantido ao trocar de aba ou fechar.
const props = defineProps<{ slug: string; title: string; company: string }>();
const tool = defineModel<AssistantTool | null>('tool', { default: null });

const bodies = { interview: InterviewTool, questions: QuestionsTool, match: MatchTool } as const;

const isOpen = computed(() => tool.value !== null);
// A aba continua exibida durante a animação de fechar (tool já é null nesse momento).
const current = ref<AssistantTool>('interview');
const used = ref(false);
const index = computed(() => ASSISTANT_TOOLS.findIndex((t) => t.key === current.value));

// O Teleport só existe no navegador: hidratá-lo com o HTML do SSR o casa com nós errados do <body> e quebra a abertura dos painéis.
const mounted = ref(false);
onMounted(() => (mounted.value = true));

const panelEl = ref<HTMLElement | null>(null);
const tabEls = ref<HTMLElement[]>([]);
const bar = ref({ x: 0, w: 0 });
let opener: HTMLElement | null = null;
let locked = false;

function lock(on: boolean) {
    if (on === locked) return;
    locked = on;
    scrollLocks += on ? 1 : -1;
    document.documentElement.style.overflow = scrollLocks > 0 ? 'hidden' : '';
}

function close() {
    tool.value = null;
}

function focusContent() {
    nextTick(() => (panelEl.value?.querySelector<HTMLElement>('[data-autofocus]') ?? panelEl.value)?.focus({ preventScroll: true }));
}

// Posição do sublinhado da aba ativa.
function measure() {
    const el = tabEls.value[index.value];
    if (el) bar.value = { x: el.offsetLeft, w: el.offsetWidth };
}

function onKeydown(e: KeyboardEvent) {
    if (!isOpen.value) return;
    if (e.key === 'Escape') {
        close();
        return;
    }
    if (e.key !== 'Tab' || !panelEl.value) return;
    const items = [...panelEl.value.querySelectorAll<HTMLElement>('button:not([disabled]), textarea:not([disabled]), input:not([disabled]), a[href]')].filter((el) => el.offsetParent !== null && el.tabIndex >= 0);
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
    }
}

// Abas: setas ← → trocam de ferramenta.
function onTabKey(e: KeyboardEvent) {
    const step = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    const next = (index.value + step + ASSISTANT_TOOLS.length) % ASSISTANT_TOOLS.length;
    tool.value = ASSISTANT_TOOLS[next].key;
    nextTick(() => tabEls.value[next]?.focus());
}

watch(tool, (v) => {
    if (v) {
        current.value = v;
        used.value = true;
        nextTick(measure);
    }
});

watch(isOpen, (v) => {
    if (v) {
        opener = document.activeElement as HTMLElement | null;
        lock(true);
        window.addEventListener('keydown', onKeydown);
        window.addEventListener('resize', measure);
        nextTick(measure);
        focusContent();
    } else {
        lock(false);
        window.removeEventListener('keydown', onKeydown);
        window.removeEventListener('resize', measure);
        opener?.focus?.();
    }
});

onBeforeUnmount(() => {
    lock(false);
    window.removeEventListener('keydown', onKeydown);
    window.removeEventListener('resize', measure);
});

// Arrastar a alça para baixo fecha a bottom sheet (celular).
const dragY = ref(0);
const dragging = ref(false);
let startY = 0;

function dragStart(e: PointerEvent) {
    dragging.value = true;
    startY = e.clientY;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
}
function dragMove(e: PointerEvent) {
    if (dragging.value) dragY.value = Math.max(0, e.clientY - startY);
}
function dragEnd() {
    if (!dragging.value) return;
    dragging.value = false;
    const far = dragY.value > 110;
    dragY.value = 0;
    if (far) close();
}
</script>

<template>
    <Teleport v-if="mounted" to="body">
        <Transition name="ah">
            <div v-show="isOpen" class="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6">
                <div class="absolute inset-0 bg-navy-950/40 backdrop-blur-[6px]" aria-hidden="true" @click="close" />

                <section
                    ref="panelEl"
                    class="ah-panel relative flex h-[94dvh] w-full flex-col overflow-hidden rounded-t-[28px] bg-white shadow-[0_-16px_60px_-16px_rgb(7_20_51/0.5)] outline-none sm:h-[min(44rem,calc(100dvh-3rem))] sm:max-w-[38rem] sm:rounded-[28px] sm:shadow-[0_40px_100px_-24px_rgb(7_20_51/0.55)]"
                    :class="dragging ? '' : 'ah-settle'"
                    :style="dragY ? { transform: `translateY(${dragY}px)` } : undefined"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="ah-title"
                    tabindex="-1"
                >
                    <h2 id="ah-title" class="sr-only">Prepare-se para esta vaga: {{ props.title }} ({{ props.company }})</h2>

                    <!-- Cabeçalho: abas em controle segmentado, com ícone colorido por ferramenta -->
                    <header class="shrink-0 border-b border-line/70 px-4 pb-3.5 sm:px-6 sm:pb-4">
                        <div class="mx-auto h-6 w-24 touch-none sm:hidden" @pointerdown="dragStart" @pointermove="dragMove" @pointerup="dragEnd" @pointercancel="dragEnd">
                            <span class="mx-auto mt-2.5 block h-1.5 w-11 rounded-full bg-line-strong" aria-hidden="true" />
                        </div>

                        <div class="flex items-center gap-2 sm:gap-3 sm:pt-5">
                            <div class="relative grid min-w-0 flex-1 grid-cols-3 gap-1 rounded-2xl bg-surface p-1 ring-1 ring-line/80 ring-inset" role="tablist" aria-label="Ferramentas de IA" @keydown="onTabKey">
                                <!-- Pílula branca que desliza até a aba ativa -->
                                <span class="ah-bar absolute top-1 bottom-1 left-0 rounded-xl bg-white shadow-[0_1px_2px_rgb(15_26_51/0.1),0_6px_16px_-6px_rgb(15_26_51/0.2)]" :style="{ width: `${bar.w}px`, transform: `translateX(${bar.x}px)` }" aria-hidden="true" />

                                <button
                                    v-for="(t, i) in ASSISTANT_TOOLS"
                                    :id="`ah-tab-${t.key}`"
                                    :key="t.key"
                                    :ref="(el) => { if (el) tabEls[i] = el as HTMLElement; }"
                                    type="button"
                                    role="tab"
                                    :aria-selected="current === t.key"
                                    aria-controls="ah-panel"
                                    :tabindex="current === t.key ? 0 : -1"
                                    class="group relative z-10 flex min-w-0 flex-col items-center justify-center gap-1 rounded-xl px-1 py-2 text-[11px] leading-tight font-bold whitespace-nowrap transition-colors sm:flex-row sm:gap-1.5 sm:px-2 sm:py-1.5 sm:text-[13px]"
                                    :class="current === t.key ? 'text-ink' : 'text-muted hover:text-ink'"
                                    @click="tool = t.key"
                                >
                                    <span class="grid size-7 shrink-0 place-items-center rounded-lg transition-all duration-300 group-hover:scale-110" :class="current === t.key ? t.tile : 'bg-transparent text-subtle group-hover:bg-white/70'">
                                        <component :is="t.icon" class="size-4" aria-hidden="true" />
                                    </span>
                                    <span class="hidden sm:inline">{{ t.tab }}</span><span class="sm:hidden">{{ t.tabShort }}</span>
                                </button>
                            </div>

                            <button type="button" class="grid size-10 shrink-0 place-items-center rounded-full text-subtle transition-colors hover:bg-surface hover:text-ink" aria-label="Fechar" @click="close"><X class="size-5" aria-hidden="true" /></button>
                        </div>
                    </header>

                    <!-- Conteúdo da ferramenta ativa -->
                    <div id="ah-panel" class="relative min-h-0 flex-1" role="tabpanel" :aria-labelledby="`ah-tab-${current}`">
                        <Transition name="ah-tab" mode="out-in" @after-enter="isOpen && focusContent()">
                            <KeepAlive>
                                <component :is="bodies[current]" v-if="used" :key="current" :slug="slug" :title="title" :company="company" :open="isOpen" @switch="tool = $event" />
                            </KeepAlive>
                        </Transition>
                    </div>
                </section>
            </div>
        </Transition>
    </Teleport>
</template>

<style scoped>
/* Abrir/fechar */
.ah-enter-active,
.ah-leave-active {
    transition: opacity 0.24s ease;
}
.ah-enter-active .ah-panel,
.ah-leave-active .ah-panel {
    transition:
        transform 0.38s cubic-bezier(0.22, 1, 0.36, 1),
        opacity 0.24s ease;
}
.ah-enter-from,
.ah-leave-to {
    opacity: 0;
}
.ah-enter-from .ah-panel,
.ah-leave-to .ah-panel {
    transform: translateY(100%);
}
@media (min-width: 40rem) {
    .ah-enter-from .ah-panel,
    .ah-leave-to .ah-panel {
        transform: translateY(18px) scale(0.96);
        opacity: 0;
    }
}
.ah-settle {
    transition: transform 0.25s cubic-bezier(0.22, 1, 0.36, 1);
}

/* Sublinhado deslizante das abas */
.ah-bar {
    transition:
        transform 0.35s cubic-bezier(0.22, 1, 0.36, 1),
        width 0.35s cubic-bezier(0.22, 1, 0.36, 1);
}

/* Troca de ferramenta */
.ah-tab-enter-active {
    transition:
        opacity 0.22s ease,
        transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}
.ah-tab-leave-active {
    transition: opacity 0.12s ease;
}
.ah-tab-enter-from {
    opacity: 0;
    transform: translateY(10px);
}
.ah-tab-leave-to {
    opacity: 0;
}
</style>
