<script setup lang="ts">
import { AlertTriangle, ArrowRight, ArrowUp, CheckCircle2, RotateCcw, Sparkles } from 'lucide-vue-next';
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
const emit = defineEmits<{ switch: [tool: AssistantTool] }>();

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
const progress = computed(() => (finished.value ? 100 : (answered.value / TOTAL) * 100));

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
    <div class="flex h-full flex-col">
        <!-- Progresso: linha fina no topo -->
        <div class="h-0.5 w-full shrink-0 bg-line/70" :class="started ? '' : 'invisible'" role="progressbar" aria-valuemin="0" :aria-valuemax="TOTAL" :aria-valuenow="answered" :aria-label="`${answered} de ${TOTAL} perguntas respondidas`">
            <div class="h-full bg-action-600 transition-[width] duration-700 ease-out" :style="{ width: `${progress}%` }" />
        </div>

        <Transition name="stage" mode="out-in" @after-enter="focusComposer">
            <!-- Introdução: a IA só é chamada quando a pessoa decide começar -->
            <div v-if="!started" key="intro" class="flex min-h-0 flex-1 flex-col px-6 py-10 sm:px-12">
                <div class="my-auto text-center">
                    <span class="mx-auto grid size-16 place-items-center rounded-[1.4rem] bg-linear-to-br from-action-500 to-navy-800 text-white shadow-[0_14px_30px_-12px_rgb(29_79_216/0.7)]"><Sparkles class="size-7" aria-hidden="true" /></span>
                    <h3 class="mt-6 text-3xl leading-tight font-extrabold tracking-tight text-balance text-ink sm:text-[2.2rem]">Ensaie sua entrevista</h3>
                    <p class="mx-auto mt-3 max-w-sm text-base leading-relaxed text-muted">Converse com um recrutador virtual sobre <span class="font-semibold text-ink">{{ title }}</span> e receba um feedback honesto no final.</p>
                    <p class="mt-5 text-sm text-subtle">{{ TOTAL }} perguntas · cerca de 5 minutos</p>
                </div>
                <div class="mx-auto w-full max-w-xs">
                    <button type="button" data-autofocus class="btn-primary btn-lg w-full" @click="begin">Começar<ArrowRight class="size-4.5" aria-hidden="true" /></button>
                    <p class="mt-4 text-center text-xs leading-relaxed text-subtle">Simulação por IA. Não avalia você de verdade e não tem ligação com a empresa.</p>
                </div>
            </div>

            <!-- Conversa -->
            <div v-else key="chat" class="flex min-h-0 flex-1 flex-col">
                <div ref="listEl" class="iv-scroll flex-1 space-y-6 overflow-y-auto px-5 py-6 sm:px-8" role="log" aria-live="polite" aria-label="Conversa da entrevista">
                    <template v-for="(m, i) in messages" :key="i">
                        <!-- Feedback final -->
                        <section v-if="feedback && finished && i === messages.length - 1 && m.role === 'model'" class="iv-rise scroll-mt-4" data-feedback aria-label="Feedback da entrevista">
                            <p v-if="feedback.preamble" class="mb-5 flex items-start gap-3">
                                <span class="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full bg-linear-to-br from-action-500 to-navy-800 text-white"><Sparkles class="size-4" aria-hidden="true" /></span>
                                <span class="rounded-2xl rounded-tl-md bg-surface px-4 py-3 text-[15px] leading-relaxed whitespace-pre-wrap text-ink">{{ feedback.preamble }}</span>
                            </p>
                            <div class="rounded-3xl border border-line bg-white p-5 shadow-(--shadow-card) sm:p-7">
                                <p class="flex items-center gap-2 text-xs font-bold tracking-widest text-success-700 uppercase"><CheckCircle2 class="size-4" aria-hidden="true" />Entrevista concluída</p>
                                <h3 class="mt-2 text-2xl font-extrabold tracking-tight text-ink">Seu feedback</h3>
                                <p v-if="summary" class="mt-4 text-base leading-relaxed text-ink">{{ summary.lines.join(' ') }}</p>
                                <section v-for="b in otherBlocks" :key="b.title" class="mt-7">
                                    <h4 class="flex items-center gap-2.5 text-sm font-extrabold text-ink"><span class="size-2 rounded-full" :class="b.dot" aria-hidden="true" />{{ b.title }}</h4>
                                    <ul v-if="b.bullets" class="mt-2.5 space-y-2">
                                        <li v-for="(l, k) in b.lines" :key="k" class="flex gap-3 text-[15px] leading-relaxed text-ink"><span class="mt-2.5 h-px w-3 shrink-0 bg-line-strong" aria-hidden="true" /><span>{{ l }}</span></li>
                                    </ul>
                                    <p v-else class="mt-2.5 text-[15px] leading-relaxed text-ink">{{ b.lines.join(' ') }}</p>
                                </section>
                            </div>
                        </section>

                        <!-- Recrutador -->
                        <div v-else-if="m.role === 'model'" class="iv-rise flex items-start gap-3">
                            <span class="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full bg-linear-to-br from-action-500 to-navy-800 text-white"><Sparkles class="size-4" aria-hidden="true" /></span>
                            <div class="min-w-0 max-w-[92%]">
                                <!-- Pergunta da vez: em destaque -->
                                <template v-if="isActive(i)">
                                    <p class="mb-1.5 text-[11px] font-bold tracking-widest text-action-700 uppercase">Pergunta {{ questionNumber(i) }} <span class="text-subtle">de {{ TOTAL }}</span></p>
                                    <div class="rounded-2xl rounded-tl-md bg-action-50/80 px-4 py-3.5 ring-1 ring-action-100">
                                        <p v-if="splitQuestion(m.text).note" class="mb-2 text-sm leading-relaxed text-muted">{{ splitQuestion(m.text).note }}</p>
                                        <p class="text-lg leading-snug font-bold text-ink sm:text-xl sm:leading-snug">{{ splitQuestion(m.text).question }}</p>
                                    </div>
                                </template>
                                <p v-else class="rounded-2xl rounded-tl-md bg-surface px-4 py-3 text-[15px] leading-relaxed whitespace-pre-wrap text-ink">{{ clean(m.text) }}</p>
                            </div>
                        </div>

                        <!-- Candidato -->
                        <div v-else class="iv-rise flex justify-end">
                            <p class="max-w-[85%] rounded-2xl rounded-br-md bg-linear-to-b from-action-500 to-action-600 px-4 py-3 text-[15px] leading-relaxed break-words whitespace-pre-wrap text-white shadow-[0_6px_16px_-8px_rgb(37_99_235/0.7)]">{{ m.text }}</p>
                        </div>
                    </template>

                    <!-- Digitando -->
                    <div v-if="loading" class="iv-rise flex items-center gap-3" role="status" aria-label="O recrutador está digitando">
                        <span class="grid size-8 shrink-0 place-items-center rounded-full bg-linear-to-br from-action-500 to-navy-800 text-white"><Sparkles class="size-4" aria-hidden="true" /></span>
                        <span class="flex items-center gap-1.5 rounded-2xl rounded-tl-md bg-surface px-4 py-4"><i class="iv-dot" /><i class="iv-dot" style="animation-delay: 150ms" /><i class="iv-dot" style="animation-delay: 300ms" /></span>
                    </div>

                    <div v-if="error" class="iv-rise flex items-start gap-3 rounded-2xl bg-danger-50 p-4 text-sm text-danger-700" role="alert">
                        <AlertTriangle class="mt-0.5 size-4.5 shrink-0" aria-hidden="true" />
                        <p class="min-w-0 flex-1"><span class="font-semibold">{{ error }}</span> <button type="button" class="font-bold underline underline-offset-2" @click="ask">Tentar de novo</button></p>
                    </div>
                </div>

                <footer class="shrink-0 border-t border-line/70 bg-white px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-8 sm:pt-4">
                    <div v-if="finished" class="flex items-center justify-between gap-3">
                        <button type="button" class="text-sm font-semibold text-muted transition-colors hover:text-ink" @click="emit('switch', 'questions')">Ver perguntas prováveis</button>
                        <button type="button" data-autofocus class="btn-primary" @click="restart"><RotateCcw class="size-4" aria-hidden="true" />Refazer</button>
                    </div>
                    <template v-else>
                        <form class="flex items-end gap-2 rounded-[1.6rem] border border-line-strong bg-white p-1.5 pl-5 shadow-(--shadow-xs) transition focus-within:border-action-600 focus-within:shadow-[0_0_0_4px_var(--color-action-100)]" @submit.prevent="send">
                            <label for="iv-input" class="sr-only">Sua resposta</label>
                            <textarea
                                id="iv-input"
                                ref="inputEl"
                                v-model="input"
                                data-autofocus
                                rows="1"
                                :maxlength="MAX_CHARS"
                                class="max-h-35 min-h-10 flex-1 resize-none border-0 bg-transparent px-0 py-2.5 text-[15px] leading-relaxed text-ink shadow-none placeholder:text-subtle focus:ring-0 focus:outline-none"
                                :placeholder="loading ? 'O recrutador está pensando…' : 'Escreva sua resposta…'"
                                :disabled="loading || !!error"
                                @input="autosize"
                                @keydown.enter="onEnter"
                            />
                            <button type="submit" class="grid size-10 shrink-0 place-items-center rounded-full bg-action-600 text-white transition hover:scale-105 hover:bg-action-700 disabled:scale-100 disabled:bg-line-strong" :disabled="!canSend" aria-label="Enviar resposta"><ArrowUp class="size-5" aria-hidden="true" /></button>
                        </form>
                        <p class="mt-2 hidden justify-between px-3 text-xs text-subtle sm:flex">
                            <span><kbd class="font-sans font-semibold">Enter</kbd> envia · <kbd class="font-sans font-semibold">Shift + Enter</kbd> nova linha</span>
                            <span v-if="input.length > MAX_CHARS * 0.85" class="tabular-nums" :class="input.length >= MAX_CHARS ? 'font-bold text-danger-700' : ''">{{ input.length }}/{{ MAX_CHARS }}</span>
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
    background: var(--color-subtle);
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
.iv-scroll {
    overscroll-behavior: contain;
    scrollbar-width: thin;
}
</style>
