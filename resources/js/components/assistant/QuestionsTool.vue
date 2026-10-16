<script setup lang="ts">
import { AlertTriangle, ArrowRight, Briefcase, Check, ChevronLeft, ChevronRight, Copy, Cpu, Lightbulb, RotateCcw, Target, Users, Zap } from 'lucide-vue-next';
import { computed, onActivated, onDeactivated, ref, watch, type Component } from 'vue';
import { postJson, type AssistantTool } from '@/lib/assistant';

type Question = { category: string; question: string; why: string; how: string };

const props = defineProps<{ slug: string; title: string; company: string; open: boolean }>();
const emit = defineEmits<{ switch: [tool: AssistantTool] }>();

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
    <div class="flex h-full flex-col">
        <!-- Carregando -->
        <div v-if="loading" class="flex flex-1 flex-col items-center justify-center px-8" role="status" aria-label="Gerando perguntas">
            <div class="qt-skel w-full max-w-sm overflow-hidden rounded-3xl border border-line">
                <div class="h-36 bg-linear-to-br from-action-600/80 to-navy-800/80" />
                <div class="space-y-3 p-5"><span class="block h-3 w-3/4 rounded-full bg-surface" /><span class="block h-3 w-1/2 rounded-full bg-surface" /></div>
            </div>
            <p class="mt-6 text-sm font-medium text-muted">Analisando a vaga e preparando as perguntas…</p>
        </div>

        <!-- Erro -->
        <div v-else-if="error" class="flex flex-1 flex-col items-center justify-center px-8 text-center" role="alert">
            <AlertTriangle class="size-7 text-danger-700" aria-hidden="true" />
            <p class="mt-3 max-w-xs text-sm font-semibold text-danger-700">{{ error }}</p>
            <button type="button" class="btn-secondary mt-5" @click="load"><RotateCcw class="size-4" aria-hidden="true" />Tentar de novo</button>
        </div>

        <!-- Baralho de perguntas -->
        <template v-else-if="current">
            <!-- Trilha: uma barrinha colorida por pergunta, clicável -->
            <div class="flex shrink-0 gap-1.5 px-5 pt-5 sm:px-8" role="group" aria-label="Ir para a pergunta">
                <button v-for="(q, i) in questions" :key="i" type="button" class="group flex-1 py-1.5" :aria-label="`Pergunta ${i + 1}: ${q.category}`" :aria-current="i === index" @click="go(i)">
                    <span class="block h-1.5 rounded-full transition-all duration-300" :class="[themeOf(q.category).bar, i === index ? 'opacity-100' : i < index ? 'opacity-50' : 'opacity-20 group-hover:opacity-40']" />
                </button>
            </div>

            <div class="flex min-h-0 flex-1 items-center gap-2 overflow-y-auto px-3 py-5 sm:gap-4 sm:px-5">
                <!-- Seta anterior (desktop) -->
                <button type="button" class="qt-arrow hidden sm:grid" aria-label="Pergunta anterior" :disabled="!hasPrev" @click="go(index - 1)"><ChevronLeft class="size-6" aria-hidden="true" /></button>

                <div class="relative mx-auto my-auto min-w-0 flex-1 touch-pan-y select-none sm:max-w-[26rem]" @pointerdown="swipeStart" @pointerup="swipeEnd" @pointercancel="tracking = false">
                    <!-- Cartas de trás: indicam que há mais perguntas -->
                    <span v-if="hasNext" class="absolute inset-x-5 -bottom-2.5 h-10 rounded-3xl border border-line bg-white shadow-(--shadow-xs)" aria-hidden="true" />
                    <span v-if="index < questions.length - 2" class="absolute inset-x-9 -bottom-5 h-10 rounded-3xl border border-line bg-surface" aria-hidden="true" />

                    <Transition :name="forward ? 'deck-next' : 'deck-prev'" mode="out-in">
                        <article :key="index" class="relative overflow-hidden rounded-3xl border border-line bg-white shadow-(--shadow-pop)">
                            <!-- Topo colorido com a pergunta -->
                            <div class="relative overflow-hidden bg-linear-to-br px-5 pt-5 pb-6 text-white sm:px-6" :class="look.grad">
                                <span class="pointer-events-none absolute -top-3 -right-1 text-[7rem] leading-none font-black text-white/10 tabular-nums" aria-hidden="true">{{ index + 1 }}</span>
                                <p class="relative flex items-center gap-2 text-xs font-bold tracking-widest uppercase">
                                    <span class="grid size-7 place-items-center rounded-lg bg-white/20"><component :is="look.icon" class="size-4" aria-hidden="true" /></span>{{ current.category }}
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

            <!-- Navegação no celular: setas grandes ao lado do contador -->
            <div class="flex shrink-0 items-center justify-center gap-5 pb-3 sm:hidden">
                <button type="button" class="qt-arrow grid" aria-label="Pergunta anterior" :disabled="!hasPrev" @click="go(index - 1)"><ChevronLeft class="size-6" aria-hidden="true" /></button>
                <p class="min-w-16 text-center text-sm font-bold text-ink tabular-nums">{{ index + 1 }} <span class="text-subtle">/ {{ questions.length }}</span></p>
                <button type="button" class="qt-arrow grid" aria-label="Próxima pergunta" :disabled="!hasNext" @click="go(index + 1)"><ChevronRight class="size-6" aria-hidden="true" /></button>
            </div>

            <footer class="flex shrink-0 items-center justify-between gap-3 border-t border-line/70 px-5 py-3.5 pb-[max(0.875rem,env(safe-area-inset-bottom))] sm:px-8">
                <p class="hidden items-center gap-3 text-xs text-subtle sm:flex">
                    <span><kbd class="rounded border border-line-strong px-1.5 py-0.5 font-sans font-semibold">←</kbd> <kbd class="rounded border border-line-strong px-1.5 py-0.5 font-sans font-semibold">→</kbd> navegar</span>
                    <button type="button" class="inline-flex items-center gap-1 font-semibold text-muted hover:text-ink" @click="copyAll"><component :is="copied ? Check : Copy" class="size-3.5" aria-hidden="true" />{{ copied ? 'Copiadas!' : 'Copiar todas' }}</button>
                </p>
                <button type="button" class="inline-flex items-center gap-1 text-xs font-semibold text-muted hover:text-ink sm:hidden" @click="copyAll"><component :is="copied ? Check : Copy" class="size-3.5" aria-hidden="true" />{{ copied ? 'Copiadas!' : 'Copiar' }}</button>

                <button type="button" data-autofocus :class="hasNext ? 'btn-secondary' : 'btn-primary'" @click="emit('switch', 'interview')">Praticar na entrevista<ArrowRight class="size-4" aria-hidden="true" /></button>
            </footer>
        </template>
    </div>
</template>

<style scoped>
.qt-arrow {
    width: 2.75rem;
    height: 2.75rem;
    flex-shrink: 0;
    place-items: center;
    border-radius: 9999px;
    border: 1px solid var(--color-line-strong);
    background: white;
    color: var(--color-ink);
    box-shadow: var(--shadow-card);
    transition:
        transform 0.2s ease,
        border-color 0.2s ease,
        background-color 0.2s ease,
        color 0.2s ease,
        opacity 0.2s ease;
}
.qt-arrow:not(:disabled):hover {
    transform: scale(1.1);
    border-color: var(--color-action-600);
    background: var(--color-action-600);
    color: white;
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
        opacity: 0.55;
    }
}
</style>
