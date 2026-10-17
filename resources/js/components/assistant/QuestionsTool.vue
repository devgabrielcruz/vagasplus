<script setup lang="ts">
import { AlertTriangle, ArrowRight, Briefcase, Check, ChevronLeft, ChevronRight, ClipboardList, Copy, Cpu, Lightbulb, MessagesSquare, RotateCcw, Target, Users, X, Zap } from 'lucide-vue-next';
import { computed, onActivated, onDeactivated, ref, watch, type Component } from 'vue';
import { postJson, type AssistantTool } from '@/lib/assistant';

type Question = { category: string; question: string; why: string; how: string };

const props = defineProps<{ slug: string; title: string; company: string; open: boolean }>();
const emit = defineEmits<{ switch: [tool: AssistantTool]; close: [] }>();

const questions = ref<Question[]>([]);
const loading = ref(false);
const error = ref('');
const index = ref(0);
const forward = ref(true);
const copied = ref(false);
const active = ref(false);

// Cada tipo de pergunta tem sua cor e seu ícone: dá para saber "onde estou" só de olhar.
const theme: Record<string, { grad: string; bar: string; icon: Component }> = {
    Técnica: { grad: 'from-action-600 to-navy-800', bar: 'bg-action-600', icon: Cpu },
    Comportamental: { grad: 'from-emerald-500 to-success-700', bar: 'bg-emerald-500', icon: Users },
    Experiência: { grad: 'from-violet-500 to-indigo-700', bar: 'bg-violet-500', icon: Briefcase },
    'Situação prática': { grad: 'from-amber-500 to-orange-600', bar: 'bg-amber-500', icon: Zap },
};
const fallback = { grad: 'from-navy-700 to-navy-900', bar: 'bg-navy-700', icon: Briefcase };
const themeOf = (c: string) => theme[c] ?? fallback;

const current = computed(() => questions.value[index.value]);
const look = computed(() => themeOf(current.value?.category ?? ''));
const hasPrev = computed(() => index.value > 0);
const hasNext = computed(() => index.value < questions.value.length - 1);

function go(n: number) {
    if (n < 0 || n >= questions.value.length || n === index.value) return;
    forward.value = n > index.value;
    index.value = n;
}

// As perguntas são geradas uma vez por vaga no servidor (cache), então abrir de novo é rápido e gratuito.
async function load() {
    if (loading.value || questions.value.length) return;
    error.value = '';
    loading.value = true;
    try {
        const { ok, json } = await postJson<{ questions: Question[] }>(`/vagas/${props.slug}/perguntas-provaveis`);
        if (!ok) {
            error.value = json.message ?? 'Não foi possível carregar as perguntas agora. Tente novamente.';
            return;
        }
        questions.value = json.questions ?? [];
        index.value = 0;
    } catch {
        error.value = 'Falha de conexão. Tente novamente.';
    } finally {
        loading.value = false;
    }
}

async function copyAll() {
    const text = questions.value.map((q, i) => `${i + 1}. ${q.question}`).join('\n');
    try {
        await navigator.clipboard.writeText(`Perguntas prováveis - ${props.title} (${props.company})\n\n${text}`);
        copied.value = true;
        setTimeout(() => (copied.value = false), 2000);
    } catch {
        /* sem permissão de área de transferência: nada a fazer */
    }
}

// Setas do teclado: só enquanto esta ferramenta está aberta e visível.
function onKey(e: KeyboardEvent) {
    if (!props.open || !active.value || (e.target as HTMLElement)?.closest('textarea, input')) return;
    if (e.key === 'ArrowRight') go(index.value + 1);
    else if (e.key === 'ArrowLeft') go(index.value - 1);
}
onActivated(() => {
    active.value = true;
    window.addEventListener('keydown', onKey);
});
onDeactivated(() => {
    active.value = false;
    window.removeEventListener('keydown', onKey);
});

// Arrastar o cartão para os lados (celular e mouse) troca de pergunta.
let startX = 0;
let startY = 0;
let tracking = false;
function swipeStart(e: PointerEvent) {
    tracking = true;
    startX = e.clientX;
    startY = e.clientY;
}
function swipeEnd(e: PointerEvent) {
    if (!tracking) return;
    tracking = false;
    const dx = e.clientX - startX;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(e.clientY - startY) * 1.5) go(index.value + (dx < 0 ? 1 : -1));
}

watch(() => props.open, (v) => v && load(), { immediate: true });
</script>

<template>
    <div class="qt-paper relative flex h-full flex-col md:flex-row">
        <button type="button" class="absolute top-3 right-3 z-10 grid size-10 place-items-center rounded-full text-amber-900/60 transition-colors hover:bg-amber-200/60 hover:text-navy-900" aria-label="Fechar" @click="emit('close')"><X class="size-5" aria-hidden="true" /></button>

        <!-- Cabeçalho "caderno de estudos": etiqueta amarela, título e ação de copiar -->
        <header class="relative shrink-0 border-b-2 border-dashed border-amber-300/80 bg-gradient-to-b from-amber-100 to-[#fffaf1] px-5 pt-8 pb-4 sm:px-7 sm:pt-5 md:flex md:w-72 md:shrink-0 md:flex-col md:border-r-2 md:border-b-0 md:px-5 md:pt-8 md:pb-5">
            <div class="flex items-center gap-3.5 pr-10 md:pr-0">
                <span class="grid size-12 shrink-0 -rotate-3 place-items-center rounded-2xl border-2 border-navy-900 bg-amber-300 text-navy-900 shadow-[3px_3px_0_0_var(--color-navy-900)]"><ClipboardList class="size-6" aria-hidden="true" /></span>
                <div class="min-w-0 flex-1">
                    <h2 class="text-lg leading-tight font-extrabold text-navy-900">Perguntas prováveis</h2>
                    <p class="truncate text-xs font-medium text-amber-900/70">{{ title }} · {{ company }}</p>
                </div>
                <button v-if="questions.length" type="button" class="hidden items-center gap-1.5 rounded-full border-2 border-navy-900/15 bg-white px-3 py-1.5 text-xs font-bold text-navy-900 transition hover:border-navy-900 sm:inline-flex md:hidden" @click="copyAll"><component :is="copied ? Check : Copy" class="size-3.5" aria-hidden="true" />{{ copied ? 'Copiadas!' : 'Copiar todas' }}</button>
            </div>

            <!-- Desktop: todas as perguntas numa lista lateral (clique para ir direto) -->
            <nav v-if="questions.length" class="mt-5 hidden min-h-0 flex-1 space-y-1.5 overflow-y-auto pr-1 md:block" aria-label="Perguntas">
                <button v-for="(q, i) in questions" :key="i" type="button" class="flex w-full items-start gap-2.5 rounded-xl px-2.5 py-2 text-left transition-colors" :class="i === index ? 'bg-white shadow-sm ring-1 ring-amber-300' : 'hover:bg-amber-100/70'" :aria-current="i === index" @click="go(i)">
                    <span class="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full text-[11px] font-extrabold text-white" :class="themeOf(q.category).bar">{{ i + 1 }}</span>
                    <span class="min-w-0"><span class="block text-[10px] font-bold tracking-wider text-amber-900/60 uppercase">{{ q.category }}</span><span class="line-clamp-2 text-xs leading-snug font-semibold text-navy-900">{{ q.question }}</span></span>
                </button>
            </nav>
            <div v-if="questions.length" class="mt-4 hidden space-y-2 md:block">
                <button type="button" class="inline-flex w-full items-center justify-center gap-1.5 rounded-full border-2 border-navy-900/15 bg-white px-3 py-1.5 text-xs font-bold text-navy-900 transition hover:border-navy-900" @click="copyAll"><component :is="copied ? Check : Copy" class="size-3.5" aria-hidden="true" />{{ copied ? 'Copiadas!' : 'Copiar todas' }}</button>
                <!-- Atalho separado da navegação: leva para a simulação, não para a próxima pergunta -->
                <button type="button" class="flex w-full items-center gap-2.5 rounded-2xl border-2 border-navy-900 bg-navy-900 p-3 text-left text-white transition hover:bg-navy-800" @click="emit('switch', 'interview')"><MessagesSquare class="size-5 shrink-0 text-amber-300" aria-hidden="true" /><span class="min-w-0"><span class="block text-xs font-extrabold">Quer treinar de verdade?</span><span class="block text-[11px] text-navy-100/75">Abrir a simulação de entrevista</span></span></button>
            </div>
        </header>

        <!-- Carregando -->
        <div v-if="loading" class="flex flex-1 flex-col items-center justify-center px-8" role="status" aria-label="Gerando perguntas">
            <div class="qt-skel relative w-full max-w-sm -rotate-1 overflow-hidden rounded-3xl border-2 border-navy-900/10 bg-white shadow-(--shadow-pop)">
                <div class="h-32 bg-linear-to-br from-amber-300 to-orange-400" />
                <div class="space-y-3 p-5"><span class="block h-3 w-3/4 rounded-full bg-amber-100" /><span class="block h-3 w-1/2 rounded-full bg-amber-100" /><span class="block h-3 w-2/3 rounded-full bg-amber-100" /></div>
            </div>
            <p class="mt-7 text-sm font-semibold text-amber-900/80">Analisando a vaga e preparando as perguntas…</p>
        </div>

        <!-- Erro -->
        <div v-else-if="error" class="flex flex-1 flex-col items-center justify-center px-8 text-center" role="alert">
            <AlertTriangle class="size-7 text-danger-700" aria-hidden="true" />
            <p class="mt-3 max-w-xs text-sm font-semibold text-danger-700">{{ error }}</p>
            <button type="button" class="btn-secondary mt-5" @click="load"><RotateCcw class="size-4" aria-hidden="true" />Tentar de novo</button>
        </div>

        <!-- Baralho de perguntas -->
        <div v-else-if="current" class="flex min-h-0 min-w-0 flex-1 flex-col">
            <!-- Trilha numerada: cada pergunta tem a cor da sua categoria -->
            <div class="flex shrink-0 items-center justify-center gap-1.5 px-5 pt-4 sm:px-8 md:hidden" role="group" aria-label="Ir para a pergunta">
                <button v-for="(q, i) in questions" :key="i" type="button" class="grid size-8 place-items-center rounded-full text-xs font-extrabold transition-all duration-200" :class="i === index ? [themeOf(q.category).bar, 'scale-110 text-white shadow-md'] : 'bg-white text-amber-900/60 ring-1 ring-amber-200 hover:ring-amber-400'" :aria-label="`Pergunta ${i + 1}: ${q.category}`" :aria-current="i === index" @click="go(i)">{{ i + 1 }}</button>
            </div>

            <div class="flex min-h-0 flex-1 items-center gap-2 overflow-y-auto px-3 py-5 sm:gap-4 sm:px-5">
                <!-- Seta anterior (desktop) -->
                <button type="button" class="qt-arrow hidden sm:grid" aria-label="Pergunta anterior" :disabled="!hasPrev" @click="go(index - 1)"><ChevronLeft class="size-6" aria-hidden="true" /></button>

                <div class="relative mx-auto my-auto min-w-0 flex-1 touch-pan-y select-none sm:max-w-[26rem] md:max-w-[32rem]" @pointerdown="swipeStart" @pointerup="swipeEnd" @pointercancel="tracking = false">
                    <!-- Cartas de trás: indicam que há mais perguntas -->
                    <span v-if="hasNext" class="absolute inset-x-5 -bottom-2.5 h-10 rotate-1 rounded-3xl border-2 border-navy-900/10 bg-white" aria-hidden="true" />
                    <span v-if="index < questions.length - 2" class="absolute inset-x-9 -bottom-5 h-10 -rotate-1 rounded-3xl border-2 border-navy-900/10 bg-amber-50" aria-hidden="true" />

                    <Transition :name="forward ? 'deck-next' : 'deck-prev'" mode="out-in">
                        <article :key="index" class="relative overflow-hidden rounded-3xl border-2 border-navy-900 bg-white shadow-[5px_5px_0_0_var(--color-navy-900)]">
                            <!-- Topo colorido com a pergunta -->
                            <div class="relative overflow-hidden bg-linear-to-br px-5 pt-5 pb-6 text-white sm:px-6" :class="look.grad">
                                <span class="pointer-events-none absolute -top-3 -right-1 text-[7rem] leading-none font-black text-white/10 tabular-nums" aria-hidden="true">{{ index + 1 }}</span>
                                <p class="relative flex items-center gap-2 text-xs font-bold tracking-widest uppercase">
                                    <span class="grid size-7 place-items-center rounded-lg bg-white/20"><component :is="look.icon" class="size-4" aria-hidden="true" /></span>{{ current.category }}
                                    <span class="ml-auto rounded-full bg-white/20 px-2 py-0.5 text-[11px] tracking-normal normal-case tabular-nums">{{ index + 1 }} de {{ questions.length }}</span>
                                </p>
                                <h3 class="relative mt-4 text-xl leading-snug font-extrabold text-balance sm:text-[1.4rem] sm:leading-snug">{{ current.question }}</h3>
                            </div>

                            <!-- Corpo -->
                            <div class="space-y-3 p-4 sm:p-5">
                                <div class="flex gap-3 rounded-2xl bg-action-50/80 p-3.5">
                                    <span class="grid size-8 shrink-0 place-items-center rounded-xl bg-white text-action-700 shadow-(--shadow-xs)"><Target class="size-4" aria-hidden="true" /></span>
                                    <div class="min-w-0"><p class="text-[11px] font-bold tracking-widest text-action-700 uppercase">O que querem descobrir</p><p class="mt-1 text-sm leading-relaxed text-ink">{{ current.why }}</p></div>
                                </div>
                                <div class="flex gap-3 rounded-2xl bg-warning-50/90 p-3.5">
                                    <span class="grid size-8 shrink-0 place-items-center rounded-xl bg-white text-warning-700 shadow-(--shadow-xs)"><Lightbulb class="size-4" aria-hidden="true" /></span>
                                    <div class="min-w-0"><p class="text-[11px] font-bold tracking-widest text-warning-700 uppercase">Como responder</p><p class="mt-1 text-sm leading-relaxed text-ink">{{ current.how }}</p></div>
                                </div>
                            </div>
                        </article>
                    </Transition>
                </div>

                <!-- Seta seguinte (desktop) -->
                <button type="button" class="qt-arrow hidden sm:grid" aria-label="Próxima pergunta" :disabled="!hasNext" @click="go(index + 1)"><ChevronRight class="size-6" aria-hidden="true" /></button>
            </div>

            <!-- Navegação no celular -->
            <div class="flex shrink-0 flex-wrap items-center justify-center gap-x-5 gap-y-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:hidden">
                <button type="button" class="qt-arrow grid" aria-label="Pergunta anterior" :disabled="!hasPrev" @click="go(index - 1)"><ChevronLeft class="size-6" aria-hidden="true" /></button>
                <p class="min-w-16 text-center text-sm font-bold text-navy-900 tabular-nums">{{ index + 1 }} <span class="text-amber-900/50">/ {{ questions.length }}</span></p>
                <button type="button" class="qt-arrow grid" aria-label="Próxima pergunta" :disabled="!hasNext" @click="go(index + 1)"><ChevronRight class="size-6" aria-hidden="true" /></button>
                <!-- Atalhos do celular (no desktop ficam na coluna lateral) -->
                <div class="flex w-full items-center justify-center gap-2 px-4">
                    <button type="button" class="inline-flex items-center gap-1.5 rounded-full border-2 border-navy-900/15 bg-white px-3 py-1.5 text-xs font-bold text-navy-900" @click="copyAll"><component :is="copied ? Check : Copy" class="size-3.5" aria-hidden="true" />{{ copied ? 'Copiadas!' : 'Copiar' }}</button>
                    <button type="button" class="inline-flex items-center gap-1.5 rounded-full border-2 border-navy-900 bg-navy-900 px-3 py-1.5 text-xs font-bold text-white" @click="emit('switch', 'interview')"><MessagesSquare class="size-3.5 text-amber-300" aria-hidden="true" />Simular entrevista</button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Papel pautado discreto no fundo */
.qt-paper {
    background-image: repeating-linear-gradient(transparent 0, transparent 31px, rgb(245 158 11 / 0.08) 31px, rgb(245 158 11 / 0.08) 32px);
}
.qt-arrow {
    width: 2.75rem;
    height: 2.75rem;
    flex-shrink: 0;
    place-items: center;
    border-radius: 9999px;
    border: 2px solid var(--color-navy-900);
    background: white;
    color: var(--color-navy-900);
    box-shadow: 2px 2px 0 0 var(--color-navy-900);
    transition:
        transform 0.2s ease,
        background-color 0.2s ease,
        color 0.2s ease,
        opacity 0.2s ease;
}
.qt-arrow:not(:disabled):hover {
    transform: translate(-1px, -1px);
    background: var(--color-amber-300);
}
.qt-arrow:disabled {
    opacity: 0.35;
    box-shadow: none;
}

.deck-next-enter-active,
.deck-prev-enter-active {
    transition:
        opacity 0.3s ease,
        transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
}
.deck-next-leave-active,
.deck-prev-leave-active {
    transition:
        opacity 0.14s ease,
        transform 0.14s ease;
}
.deck-next-enter-from {
    opacity: 0;
    transform: translateX(40px) rotate(2deg);
}
.deck-prev-enter-from {
    opacity: 0;
    transform: translateX(-40px) rotate(-2deg);
}
.deck-next-leave-to {
    opacity: 0;
    transform: translateX(-30px) rotate(-2deg);
}
.deck-prev-leave-to {
    opacity: 0;
    transform: translateX(30px) rotate(2deg);
}
.qt-skel {
    animation: qt-pulse 1.4s ease-in-out infinite;
}
@keyframes qt-pulse {
    50% {
        opacity: 0.6;
    }
}
</style>
