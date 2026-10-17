<script setup lang="ts">
import { AlertTriangle, ArrowRight, ArrowUp, CheckCircle2, Check, Clock, MessageCircleQuestion, RotateCcw, Sparkles, Star, X } from 'lucide-vue-next';
import { computed, nextTick, ref, watch } from 'vue';
import { postJson, type AssistantTool } from '@/lib/assistant';

type Msg = { role: 'user' | 'model'; text: string };
type Block = { title: string; dot: string; lines: string[]; bullets: boolean };

// Mantém em sincronia com InterviewSimulator::MAX_ANSWERS (o servidor é quem decide o fim).
const TOTAL = 6;
const MAX_CHARS = 1500;
// Em telas de toque o Enter quebra linha (o envio é pelo botão); com teclado, Enter envia.
const touch = typeof window !== 'undefined' && !!window.matchMedia?.('(pointer: coarse)').matches;

const props = defineProps<{ slug: string; title: string; company: string; open: boolean }>();
const emit = defineEmits<{ switch: [tool: AssistantTool]; close: [] }>();

const messages = ref<Msg[]>([]);
const input = ref('');
const loading = ref(false);
const error = ref('');
const started = ref(false);
const finished = ref(false);
const listEl = ref<HTMLElement | null>(null);
const inputEl = ref<HTMLTextAreaElement | null>(null);

const answered = computed(() => messages.value.filter((m) => m.role === 'user').length);
const canSend = computed(() => !!input.value.trim() && !loading.value && !finished.value && !error.value);
const filled = computed(() => (finished.value ? TOTAL : answered.value));
const current = computed(() => Math.min(answered.value + 1, TOTAL));

// O modelo é instruído a usar texto simples; limpamos Markdown por garantia e nunca renderizamos HTML.
const clean = (t: string) => t.replace(/\*\*|__|^#+\s*/gm, '').trim();

// A fala do recrutador costuma ser "comentário curto + pergunta": a pergunta ganha destaque e o comentário fica discreto.
function splitQuestion(text: string): { note: string; question: string } {
    const t = clean(text);
    const q = t.lastIndexOf('?');
    if (q < 0) return { note: '', question: t };
    const head = t.slice(0, q);
    const cut = Math.max(head.lastIndexOf('. '), head.lastIndexOf('! '), head.lastIndexOf('? '), head.lastIndexOf('\n'));
    if (cut < 0) return { note: '', question: t.slice(0, q + 1) + t.slice(q + 1).trim() };
    return { note: t.slice(0, cut + 1).trim(), question: t.slice(cut + 1, q + 1).trim() + t.slice(q + 1) };
}

// A pergunta "da vez": última fala do recrutador, ainda sem resposta.
const isActive = (i: number) => !finished.value && !loading.value && i === messages.value.length - 1 && messages.value[i].role === 'model';
const questionNumber = (i: number) => i / 2 + 1;

const sectionMeta: Record<string, string> = { resumo: 'bg-action-600', 'pontos fortes': 'bg-success-700', 'a melhorar': 'bg-warning-700', dicas: 'bg-navy-700' };

// Feedback final: blocos "Título:" + itens "- ". Texto antes do 1º título (ex.: resposta a uma dúvida) vira nota.
function parseFeedback(text: string): { preamble: string; blocks: Block[] } {
    const blocks: Block[] = [];
    const pre: string[] = [];

    for (const raw of clean(text).split(/\n\s*\n/)) {
        const lines = raw.split('\n').map((l) => l.trim()).filter(Boolean);
        const m = lines[0]?.match(/^([^:]{2,24}):\s*(.*)$/);
        const dot = m ? sectionMeta[m[1].trim().toLowerCase()] : undefined;

        if (m && dot) {
            const body = [m[2], ...lines.slice(1)].filter(Boolean);
            blocks.push({ title: m[1].trim(), dot, lines: body.map((l) => l.replace(/^[-•*]\s+/, '')), bullets: body.some((l) => /^[-•*]\s+/.test(l)) });
        } else if (!blocks.length) {
            pre.push(raw.trim());
        } else {
            blocks[blocks.length - 1].lines.push(...lines);
        }
    }

    return { preamble: pre.join('\n\n'), blocks };
}

const feedback = computed(() => {
    if (!finished.value) return null;
    const last = messages.value[messages.value.length - 1];
    if (!last || last.role !== 'model') return null;
    const parsed = parseFeedback(last.text);
    return parsed.blocks.length >= 2 ? parsed : null;
});
const summary = computed(() => feedback.value?.blocks.find((b) => b.title.toLowerCase() === 'resumo'));
const otherBlocks = computed(() => feedback.value?.blocks.filter((b) => b !== summary.value) ?? []);

async function scrollDown(smooth = true) {
    await nextTick();
    listEl.value?.scrollTo({ top: listEl.value.scrollHeight, behavior: smooth ? 'smooth' : 'auto' });
}

function autosize() {
    const el = inputEl.value;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 140)}px`;
}

// Pede a próxima fala da IA para o histórico atual (vazio = primeira pergunta).
async function ask() {
    error.value = '';
    loading.value = true;
    scrollDown();
    try {
        const { ok, status, json } = await postJson<{ message: string; finished: boolean }>(`/vagas/${props.slug}/entrevista`, { messages: messages.value });
        if (!ok) {
            error.value = json.message ?? (status === 429 ? 'Muitas solicitações. Aguarde um pouco e tente de novo.' : 'Não foi possível continuar agora. Tente novamente.');
            return;
        }
        messages.value.push({ role: 'model', text: json.message });
        finished.value = !!json.finished;
    } catch {
        error.value = 'Falha de conexão. Tente novamente.';
    } finally {
        loading.value = false;
        await nextTick();
        if (finished.value && !error.value) {
            // Fim da entrevista: a leitura começa pelo topo do feedback, não pelo fim.
            listEl.value?.querySelector('[data-feedback]')?.scrollIntoView({ block: 'start', behavior: 'smooth' });
        } else {
            scrollDown();
            if (!error.value) inputEl.value?.focus({ preventScroll: true });
        }
    }
}

function begin() {
    started.value = true;
    ask();
}

async function send() {
    if (!canSend.value) return;
    messages.value.push({ role: 'user', text: input.value.trim() });
    input.value = '';
    await nextTick();
    autosize();
    await ask();
}

function restart() {
    messages.value = [];
    finished.value = false;
    error.value = '';
    input.value = '';
    begin();
}

function onEnter(e: KeyboardEvent) {
    if (touch || e.shiftKey) return;
    e.preventDefault();
    send();
}

function focusComposer() {
    if (started.value && !finished.value && !loading.value) inputEl.value?.focus({ preventScroll: true });
}

// Ao reabrir o painel, a conversa volta já no fim.
watch(() => props.open, (v) => v && started.value && scrollDown(false), { immediate: true });
</script>

<template>
    <div class="relative flex h-full flex-col md:flex-row">
        <button type="button" class="absolute top-3 right-3 z-10 grid size-10 place-items-center rounded-full text-white/60 transition-colors hover:bg-white/10 hover:text-white" aria-label="Fechar" @click="emit('close')"><X class="size-5" aria-hidden="true" /></button>

        <!-- Cabeçalho "chamada": avatar do recrutador, status e progresso em segmentos -->
        <header class="relative shrink-0 border-b border-white/10 bg-gradient-to-b from-navy-800 to-[#0b1630] px-4 pt-7 pb-4 sm:px-6 sm:pt-5 md:flex md:w-72 md:shrink-0 md:flex-col md:border-r md:border-b-0 md:px-6 md:pt-9 md:pb-6">
            <div class="flex items-center gap-3 pr-10 md:flex-col md:items-start md:gap-4 md:pr-0">
                <span class="relative shrink-0">
                    <span class="grid size-11 place-items-center rounded-full bg-gradient-to-br from-action-500 to-[#7c5cff] text-white shadow-[0_8px_20px_-6px_rgb(124_92_255/0.7)] md:size-16"><Sparkles class="size-5 md:size-7" aria-hidden="true" /></span>
                    <span class="absolute -right-0.5 -bottom-0.5 size-3.5 rounded-full border-2 border-navy-800 bg-emerald-400" aria-hidden="true" />
                </span>
                <div class="min-w-0 flex-1 md:w-full md:flex-none">
                    <h2 class="text-sm font-extrabold text-white">Recrutador virtual</h2>
                    <p class="truncate text-xs text-navy-100/70 md:line-clamp-3 md:whitespace-normal md:break-words">Entrevista para {{ title }}</p>
                </div>
                <p v-if="started && !finished" class="hidden rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white sm:block md:hidden">Pergunta {{ current }} de {{ TOTAL }}</p>
            </div>
            <div class="mt-4 flex gap-1.5 md:hidden" :class="started ? '' : 'invisible'" role="progressbar" aria-valuemin="0" :aria-valuemax="TOTAL" :aria-valuenow="answered" :aria-label="`${answered} de ${TOTAL} perguntas respondidas`">
                <span v-for="n in TOTAL" :key="n" class="h-1 flex-1 rounded-full transition-colors duration-500" :class="n <= filled ? 'bg-gradient-to-r from-action-500 to-[#7c5cff]' : 'bg-white/15'" />
            </div>

            <!-- Desktop: lista de etapas (ou dicas, antes de começar) na coluna lateral -->
            <!-- Linha do tempo: só círculos ligados por uma linha; o texto aparece apenas na etapa atual -->
            <div v-if="started" class="mt-8 hidden md:block" aria-hidden="true">
                <ol>
                    <li v-for="n in TOTAL" :key="n" class="flex gap-3.5">
                        <span class="flex flex-col items-center">
                            <span class="grid size-6 shrink-0 place-items-center rounded-full text-[11px] font-extrabold transition-all duration-300" :class="n <= filled ? 'bg-emerald-400 text-navy-900' : n === current ? 'bg-action-600 text-white ring-4 ring-action-600/25' : 'bg-white/10 text-white/40'"><Check v-if="n <= filled" class="size-3.5" /><template v-else>{{ n }}</template></span>
                            <span v-if="n < TOTAL" class="my-1 w-px flex-1 transition-colors duration-500" :class="n <= filled ? 'bg-emerald-400/60' : 'bg-white/10'" />
                        </span>
                        <span class="min-h-8 pt-0.5 text-xs font-semibold" :class="n === current && !finished ? 'text-white' : 'text-white/40'">{{ n === current && !finished ? 'Pergunta atual' : n <= filled ? 'Respondida' : '' }}</span>
                    </li>
                </ol>
            </div>
            <ul v-else class="mt-7 hidden space-y-3 text-xs leading-relaxed text-navy-100/75 md:block">
                <li class="flex gap-2.5"><Check class="mt-0.5 size-4 shrink-0 text-emerald-400" aria-hidden="true" />Responda como numa conversa de verdade.</li>
                <li class="flex gap-2.5"><Check class="mt-0.5 size-4 shrink-0 text-emerald-400" aria-hidden="true" />Use exemplos concretos da sua experiência.</li>
                <li class="flex gap-2.5"><Check class="mt-0.5 size-4 shrink-0 text-emerald-400" aria-hidden="true" />Sem pressa: não há tempo limite.</li>
            </ul>
        </header>

        <Transition name="stage" mode="out-in" @after-enter="focusComposer">
            <!-- Introdução: a IA só é chamada quando a pessoa decide começar -->
            <div v-if="!started" key="intro" class="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto px-6 py-8 sm:px-12">
                <div class="my-auto text-center">
                    <div class="iv-rings relative mx-auto grid size-28 place-items-center">
                        <span class="grid size-20 place-items-center rounded-full bg-gradient-to-br from-action-500 to-[#7c5cff] text-white shadow-[0_18px_40px_-10px_rgb(124_92_255/0.8)]"><Sparkles class="size-9" aria-hidden="true" /></span>
                    </div>
                    <h3 class="mt-6 text-3xl leading-tight font-extrabold tracking-tight text-balance text-white sm:text-[2.2rem]">Simule sua entrevista</h3>
                    <p class="mx-auto mt-3 max-w-sm text-base leading-relaxed text-navy-100/80">Converse com um recrutador virtual sobre <span class="font-semibold text-white">{{ title }}</span> e receba um feedback honesto no final.</p>
                    <ul class="mx-auto mt-7 grid max-w-sm grid-cols-3 gap-2.5 text-center">
                        <li class="rounded-2xl bg-white/[0.06] px-2 py-3 ring-1 ring-white/10"><MessageCircleQuestion class="mx-auto size-5 text-action-200" aria-hidden="true" /><p class="mt-1.5 text-sm font-extrabold text-white">{{ TOTAL }}</p><p class="text-[11px] text-navy-100/70">perguntas</p></li>
                        <li class="rounded-2xl bg-white/[0.06] px-2 py-3 ring-1 ring-white/10"><Clock class="mx-auto size-5 text-action-200" aria-hidden="true" /><p class="mt-1.5 text-sm font-extrabold text-white">~5 min</p><p class="text-[11px] text-navy-100/70">de conversa</p></li>
                        <li class="rounded-2xl bg-white/[0.06] px-2 py-3 ring-1 ring-white/10"><Star class="mx-auto size-5 text-action-200" aria-hidden="true" /><p class="mt-1.5 text-sm font-extrabold text-white">Feedback</p><p class="text-[11px] text-navy-100/70">no final</p></li>
                    </ul>
                </div>
                <div class="mx-auto mt-8 w-full max-w-xs">
                    <button type="button" data-autofocus class="btn-primary btn-lg w-full" @click="begin">Começar entrevista<ArrowRight class="size-4.5" aria-hidden="true" /></button>
                    <p class="mt-4 text-center text-xs leading-relaxed text-navy-100/55">Simulação por IA. Não avalia você de verdade e não tem ligação com a empresa.</p>
                </div>
            </div>

            <!-- Conversa -->
            <div v-else key="chat" class="flex min-h-0 min-w-0 flex-1 flex-col">
                <div ref="listEl" class="iv-scroll flex-1 space-y-6 overflow-y-auto px-5 py-6 sm:px-8" role="log" aria-live="polite" aria-label="Conversa da entrevista">
                    <template v-for="(m, i) in messages" :key="i">
                        <!-- Feedback final: "boletim" claro sobre o fundo escuro -->
                        <section v-if="feedback && finished && i === messages.length - 1 && m.role === 'model'" class="iv-rise scroll-mt-4" data-feedback aria-label="Feedback da entrevista">
                            <p v-if="feedback.preamble" class="mb-5 flex items-start gap-3">
                                <span class="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full bg-gradient-to-br from-action-500 to-[#7c5cff] text-white"><Sparkles class="size-4" aria-hidden="true" /></span>
                                <span class="rounded-2xl rounded-tl-md bg-white/[0.08] px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap text-white/90 ring-1 ring-white/10">{{ feedback.preamble }}</span>
                            </p>
                            <div class="overflow-hidden rounded-3xl bg-white text-ink shadow-[0_24px_60px_-20px_rgb(0_0_0/0.7)]">
                                <div class="bg-gradient-to-br from-action-600 to-[#7c5cff] px-5 py-5 text-white sm:px-7">
                                    <p class="flex items-center gap-2 text-xs font-bold tracking-widest uppercase"><CheckCircle2 class="size-4" aria-hidden="true" />Entrevista concluída</p>
                                    <h3 class="mt-1.5 text-2xl font-extrabold tracking-tight">Seu feedback</h3>
                                </div>
                                <div class="p-5 sm:p-7">
                                    <p v-if="summary" class="text-sm leading-relaxed text-ink">{{ summary.lines.join(' ') }}</p>
                                    <section v-for="b in otherBlocks" :key="b.title" class="mt-6">
                                        <h4 class="flex items-center gap-2.5 text-sm font-extrabold text-ink"><span class="size-2.5 rounded-full" :class="b.dot" aria-hidden="true" />{{ b.title }}</h4>
                                        <ul v-if="b.bullets" class="mt-2.5 space-y-2">
                                            <li v-for="(l, k) in b.lines" :key="k" class="flex gap-3 text-sm leading-relaxed text-ink"><span class="mt-2.5 h-px w-3 shrink-0 bg-line-strong" aria-hidden="true" /><span>{{ l }}</span></li>
                                        </ul>
                                        <p v-else class="mt-2.5 text-sm leading-relaxed text-ink">{{ b.lines.join(' ') }}</p>
                                    </section>
                                </div>
                            </div>
                        </section>

                        <!-- Recrutador -->
                        <div v-else-if="m.role === 'model'" class="iv-rise flex items-start gap-3">
                            <span class="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full bg-gradient-to-br from-action-500 to-[#7c5cff] text-white"><Sparkles class="size-4" aria-hidden="true" /></span>
                            <div class="min-w-0 max-w-[92%]">
                                <!-- Pergunta da vez: em destaque, com brilho -->
                                <template v-if="isActive(i)">
                                    <p class="mb-1.5 text-[11px] font-bold tracking-widest text-action-200 uppercase">Pergunta {{ questionNumber(i) }} <span class="text-white/40">de {{ TOTAL }}</span></p>
                                    <div class="rounded-2xl rounded-tl-md bg-gradient-to-br from-action-600/35 to-[#7c5cff]/25 px-4 py-3 shadow-[0_0_40px_-12px_rgb(59_120_245/0.6)] ring-1 ring-action-500/50">
                                        <p v-if="splitQuestion(m.text).note" class="mb-1.5 text-[13px] leading-relaxed text-navy-100/70">{{ splitQuestion(m.text).note }}</p>
                                        <p class="text-base leading-relaxed font-semibold text-white sm:text-[17px]">{{ splitQuestion(m.text).question }}</p>
                                    </div>
                                </template>
                                <p v-else class="rounded-2xl rounded-tl-md bg-white/[0.08] px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap text-white/90 ring-1 ring-white/10">{{ clean(m.text) }}</p>
                            </div>
                        </div>

                        <!-- Candidato -->
                        <div v-else class="iv-rise flex justify-end">
                            <p class="max-w-[85%] rounded-2xl rounded-br-md bg-gradient-to-br from-action-500 to-action-700 px-4 py-2.5 text-sm leading-relaxed break-words whitespace-pre-wrap text-white shadow-[0_8px_20px_-10px_rgb(37_99_235/0.9)]">{{ m.text }}</p>
                        </div>
                    </template>

                    <!-- Digitando -->
                    <div v-if="loading" class="iv-rise flex items-center gap-3" role="status" aria-label="O recrutador está digitando">
                        <span class="grid size-8 shrink-0 place-items-center rounded-full bg-gradient-to-br from-action-500 to-[#7c5cff] text-white"><Sparkles class="size-4" aria-hidden="true" /></span>
                        <span class="flex items-center gap-1.5 rounded-2xl rounded-tl-md bg-white/[0.08] px-4 py-4 ring-1 ring-white/10"><i class="iv-dot" /><i class="iv-dot" style="animation-delay: 150ms" /><i class="iv-dot" style="animation-delay: 300ms" /></span>
                    </div>

                    <div v-if="error" class="iv-rise flex items-start gap-3 rounded-2xl bg-danger-50 p-4 text-sm text-danger-700" role="alert">
                        <AlertTriangle class="mt-0.5 size-4.5 shrink-0" aria-hidden="true" />
                        <p class="min-w-0 flex-1"><span class="font-semibold">{{ error }}</span> <button type="button" class="font-bold underline underline-offset-2" @click="ask">Tentar de novo</button></p>
                    </div>
                </div>

                <footer class="shrink-0 border-t border-white/10 bg-[#0b1630] px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-8 sm:pt-4">
                    <div v-if="finished" class="flex items-center justify-between gap-3">
                        <button type="button" class="text-sm font-semibold text-navy-100/70 transition-colors hover:text-white" @click="emit('switch', 'questions')">Ver perguntas prováveis</button>
                        <button type="button" data-autofocus class="btn-primary" @click="restart"><RotateCcw class="size-4" aria-hidden="true" />Refazer</button>
                    </div>
                    <template v-else>
                        <form class="flex items-end gap-2 rounded-[1.6rem] border border-white/15 bg-white/[0.06] p-1.5 pl-5 transition focus-within:border-action-500 focus-within:bg-white/[0.09] focus-within:shadow-[0_0_0_4px_rgb(59_120_245/0.2)]" @submit.prevent="send">
                            <label for="iv-input" class="sr-only">Sua resposta</label>
                            <textarea
                                id="iv-input"
                                ref="inputEl"
                                v-model="input"
                                data-autofocus
                                rows="1"
                                :maxlength="MAX_CHARS"
                                class="max-h-35 min-h-10 flex-1 resize-none border-0 bg-transparent px-0 py-2.5 text-sm leading-relaxed text-white shadow-none placeholder:text-white/40 focus:ring-0 focus:outline-none"
                                :placeholder="loading ? 'O recrutador está pensando…' : 'Escreva sua resposta…'"
                                :disabled="loading || !!error"
                                @input="autosize"
                                @keydown.enter="onEnter"
                            />
                            <button type="submit" class="grid size-10 shrink-0 place-items-center rounded-full bg-action-600 text-white transition hover:scale-105 hover:bg-action-500 disabled:scale-100 disabled:bg-white/15 disabled:text-white/40" :disabled="!canSend" aria-label="Enviar resposta"><ArrowUp class="size-5" aria-hidden="true" /></button>
                        </form>
                        <p class="mt-2 hidden justify-between px-3 text-xs text-white/40 sm:flex">
                            <span><kbd class="font-sans font-semibold">Enter</kbd> envia · <kbd class="font-sans font-semibold">Shift + Enter</kbd> nova linha</span>
                            <span v-if="input.length > MAX_CHARS * 0.85" class="tabular-nums" :class="input.length >= MAX_CHARS ? 'font-bold text-red-300' : ''">{{ input.length }}/{{ MAX_CHARS }}</span>
                        </p>
                    </template>
                </footer>
            </div>
        </Transition>
    </div>
</template>

<style scoped>
.stage-enter-active {
    transition:
        opacity 0.35s ease,
        transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
}
.stage-leave-active {
    transition: opacity 0.14s ease;
}
.stage-enter-from {
    opacity: 0;
    transform: translateY(14px);
}
.stage-leave-to {
    opacity: 0;
}
.iv-rise {
    animation: iv-rise 0.4s cubic-bezier(0.22, 1, 0.36, 1) both;
}
@keyframes iv-rise {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
}
.iv-dot {
    display: block;
    width: 6px;
    height: 6px;
    border-radius: 9999px;
    background: rgb(255 255 255 / 0.65);
    animation: iv-bounce 1s ease-in-out infinite;
}
@keyframes iv-bounce {
    0%,
    60%,
    100% {
        transform: translateY(0);
        opacity: 0.5;
    }
    30% {
        transform: translateY(-4px);
        opacity: 1;
    }
}
/* Anéis que pulsam em volta do avatar na introdução, como numa chamada tocando */
.iv-rings::before,
.iv-rings::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 9999px;
    border: 2px solid rgb(124 92 255 / 0.5);
    animation: iv-ring 2.4s ease-out infinite;
}
.iv-rings::after {
    animation-delay: 1.2s;
}
@keyframes iv-ring {
    from {
        transform: scale(0.7);
        opacity: 0.9;
    }
    to {
        transform: scale(1.35);
        opacity: 0;
    }
}
.iv-scroll {
    overscroll-behavior: contain;
    scrollbar-width: thin;
    scrollbar-color: rgb(255 255 255 / 0.25) transparent;
}
</style>
