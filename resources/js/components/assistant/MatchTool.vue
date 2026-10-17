<script setup lang="ts">
import { AlertTriangle, ArrowRight, Check, FileText, FileUp, Loader2, RotateCcw, ScanSearch, ShieldCheck, TrendingUp, X } from 'lucide-vue-next';
import { computed, nextTick, ref } from 'vue';
import { extractPdfText, PdfTextError } from '@/lib/pdfText';
import { postJson, type AssistantTool } from '@/lib/assistant';

type Result = { score: number; verdict: string; matched: string[]; gaps: string[]; suggestions: string[] };

// Mantém em sincronia com JobPrep::RESUME_MIN / RESUME_MAX.
const MIN = 80;
const MAX = 8000;

const props = defineProps<{ slug: string; title: string; company: string; open: boolean }>();
const emit = defineEmits<{ switch: [tool: AssistantTool]; close: [] }>();

const resume = ref('');
const loading = ref(false);
const error = ref('');
const result = ref<Result | null>(null);
const shown = ref(0);
const inputEl = ref<HTMLTextAreaElement | null>(null);
const fileEl = ref<HTMLInputElement | null>(null);
const reading = ref(false);
const dragging = ref(false);
const pdfName = ref('');
const pdfError = ref('');
const pasting = ref(false);

const size = computed(() => resume.value.trim().length);
const canAnalyze = computed(() => size.value >= MIN && size.value <= MAX && !loading.value && !reading.value);
const showText = computed(() => pasting.value || !!pdfName.value);

// Anel da nota (raio 52)
const C = 2 * Math.PI * 52;
const dash = computed(() => C - (C * shown.value) / 100);
const level = computed(() => {
    const s = result.value?.score ?? 0;
    if (s >= 75) return { label: 'Alta aderência', text: 'bg-emerald-100 text-emerald-800', stroke: '#059669' };
    if (s >= 50) return { label: 'Aderência média', text: 'bg-action-100 text-action-700', stroke: 'var(--color-action-600)' };
    return { label: 'Aderência baixa', text: 'bg-amber-100 text-amber-800', stroke: '#d97706' };
});

const view = computed(() => (loading.value ? 'loading' : result.value ? 'result' : 'form'));

async function analyze() {
    if (!canAnalyze.value) return;
    error.value = '';
    loading.value = true;
    try {
        const { ok, json } = await postJson<Result>(`/vagas/${props.slug}/compatibilidade`, { resume: resume.value.trim() });
        if (!ok) {
            error.value = json.errors?.resume?.[0] ?? json.message ?? 'Não foi possível analisar agora. Tente novamente.';
            return;
        }
        result.value = json as Result;
        shown.value = 0;
        await nextTick();
        // Anima o anel do 0 até a nota (depois da transição de entrada).
        setTimeout(() => (shown.value = result.value?.score ?? 0), 350);
    } catch {
        error.value = 'Falha de conexão. Tente novamente.';
    } finally {
        loading.value = false;
    }
}

// O PDF é lido aqui no navegador; só o texto (que a pessoa pode revisar e editar) segue para a análise.
async function readPdf(file: File | undefined) {
    if (!file || reading.value || loading.value) return;
    pdfError.value = '';
    error.value = '';
    reading.value = true;
    try {
        resume.value = await extractPdfText(file);
        pdfName.value = file.name;
    } catch (e) {
        pdfError.value = e instanceof PdfTextError ? e.message : 'Não foi possível ler este PDF. Cole o texto do currículo.';
    } finally {
        reading.value = false;
        if (fileEl.value) fileEl.value.value = '';
    }
}

function onDrop(e: DragEvent) {
    dragging.value = false;
    readPdf(e.dataTransfer?.files?.[0]);
}

function clearAll() {
    pdfName.value = '';
    pdfError.value = '';
    resume.value = '';
    pasting.value = false;
}

function startPaste() {
    pasting.value = true;
    nextTick(() => inputEl.value?.focus({ preventScroll: true }));
}

function again() {
    result.value = null;
    shown.value = 0;
    error.value = '';
    clearAll();
}
</script>

<template>
    <div class="relative flex h-full flex-col md:flex-row">
        <button type="button" class="absolute top-3 right-3 z-10 grid size-10 place-items-center rounded-full text-white/70 transition-colors hover:bg-white/15 hover:text-white md:text-subtle md:hover:bg-surface md:hover:text-ink" aria-label="Fechar" @click="emit('close')"><X class="size-5" aria-hidden="true" /></button>

        <!-- Cabeçalho "relatório": faixa verde com ícone de scanner -->
        <header class="relative shrink-0 overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-900 px-5 pt-8 pb-5 text-white sm:px-8 sm:pt-6 md:flex md:w-72 md:shrink-0 md:flex-col md:px-6 md:pt-9 md:pb-6">
            <span class="mt-grid pointer-events-none absolute inset-0 opacity-30" aria-hidden="true" />
            <span class="pointer-events-none absolute -top-10 -right-8 size-40 rounded-full bg-white/10" aria-hidden="true" />
            <div class="relative flex items-center gap-3.5 pr-10 md:flex-col md:items-start md:gap-4 md:pr-0">
                <span class="relative grid size-12 shrink-0 place-items-center rounded-2xl bg-white/15 ring-1 ring-white/30 backdrop-blur"><ScanSearch class="size-6" aria-hidden="true" /></span>
                <div class="min-w-0 flex-1 md:w-full md:flex-none">
                    <h2 class="mb-1.5 text-lg leading-tight font-extrabold whitespace-nowrap md:text-base">Compatibilidade com a vaga</h2>
                    <p class="truncate text-xs md:line-clamp-3 md:whitespace-normal md:break-words font-medium text-emerald-100/85">{{ title }} · {{ company }}</p>
                </div>
            </div>
            <ol class="relative mt-8 hidden space-y-4 md:block" aria-hidden="true">
                <li v-for="(s, i) in ['Envie seu currículo (PDF ou texto)', 'A IA compara com os requisitos da vaga', 'Veja a nota e o que ajustar']" :key="s" class="flex items-start gap-3 text-xs leading-snug font-semibold text-emerald-50"><span class="grid size-6 shrink-0 place-items-center rounded-full bg-white/15 text-[11px] font-extrabold ring-1 ring-white/30">{{ i + 1 }}</span><span class="pt-1">{{ s }}</span></li>
            </ol>
        </header>

        <Transition name="stage" mode="out-in">
            <!-- Analisando: um documento sendo escaneado -->
            <div v-if="view === 'loading'" key="loading" class="flex min-h-0 min-w-0 flex-1 flex-col items-center justify-center px-6 text-center sm:px-12" role="status">
                <div class="relative w-44 overflow-hidden rounded-2xl border-2 border-emerald-200 bg-white p-4 shadow-[0_18px_40px_-18px_rgb(5_150_105/0.6)]" aria-hidden="true">
                    <span class="mb-3 block h-2.5 w-1/2 rounded-full bg-emerald-200" />
                    <span v-for="(w, i) in ['w-full', 'w-11/12', 'w-4/5', 'w-full', 'w-3/5', 'w-10/12']" :key="i" class="mt-2 block h-1.5 rounded-full bg-emerald-100" :class="w" />
                    <span class="mt-scan pointer-events-none absolute inset-x-0 top-0 h-14 bg-gradient-to-b from-transparent via-emerald-400/40 to-transparent" />
                </div>
                <p class="mt-7 text-lg font-extrabold text-ink">Analisando seu currículo…</p>
                <p class="mt-1 max-w-xs text-sm text-muted">Comparando sua experiência com os requisitos desta vaga.</p>
            </div>

            <!-- Resultado: painel de resultados -->
            <div v-else-if="view === 'result' && result" key="result" class="flex min-h-0 min-w-0 flex-1 flex-col">
                <div class="mt-scroll flex-1 space-y-4 overflow-y-auto bg-emerald-50/50 px-4 py-5 sm:px-8 sm:py-6">
                    <!-- Nota -->
                    <section class="flex flex-col items-center gap-5 rounded-3xl border border-emerald-100 bg-white p-5 shadow-(--shadow-card) sm:flex-row sm:items-center sm:p-6">
                        <div class="relative size-32 shrink-0">
                            <svg viewBox="0 0 120 120" class="size-full -rotate-90" aria-hidden="true">
                                <circle cx="60" cy="60" r="52" fill="none" stroke="#d1fae5" stroke-width="9" />
                                <circle cx="60" cy="60" r="52" fill="none" :stroke="level.stroke" stroke-width="9" stroke-linecap="round" :stroke-dasharray="C" :stroke-dashoffset="dash" class="mt-ring" />
                            </svg>
                            <p class="absolute inset-0 grid place-items-center leading-none"><span><span class="text-4xl font-extrabold tracking-tight text-ink tabular-nums">{{ result.score }}</span><span class="text-lg font-bold text-subtle">%</span></span></p>
                        </div>
                        <div class="text-center sm:text-left">
                            <span class="inline-block rounded-full px-3 py-1 text-xs font-extrabold" :class="level.text">{{ level.label }}</span>
                            <p v-if="result.verdict" class="mt-2.5 text-[15px] leading-relaxed text-ink">{{ result.verdict }}</p>
                        </div>
                    </section>

                    <div class="grid items-stretch gap-4" :class="result.matched.length && result.gaps.length ? 'md:grid-cols-2' : ''">
                    <section v-if="result.matched.length" class="h-full rounded-3xl border border-emerald-200 bg-emerald-50 p-5">
                        <h4 class="flex items-center gap-2 text-sm font-extrabold text-emerald-800"><span class="grid size-6 place-items-center rounded-full bg-emerald-600 text-white"><Check class="size-3.5" aria-hidden="true" /></span>Você já atende</h4>
                        <ul class="mt-3 space-y-2.5">
                            <li v-for="(m, i) in result.matched" :key="i" class="flex gap-3 text-[15px] leading-relaxed text-ink"><Check class="mt-1 size-4 shrink-0 text-emerald-600" aria-hidden="true" /><span>{{ m }}</span></li>
                        </ul>
                    </section>

                    <section v-if="result.gaps.length" class="h-full rounded-3xl border border-amber-200 bg-amber-50 p-5">
                        <h4 class="flex items-center gap-2 text-sm font-extrabold text-amber-800"><span class="grid size-6 place-items-center rounded-full bg-amber-500 text-white"><AlertTriangle class="size-3.5" aria-hidden="true" /></span>Pontos de atenção</h4>
                        <ul class="mt-3 space-y-2.5">
                            <li v-for="(g, i) in result.gaps" :key="i" class="flex gap-3 text-[15px] leading-relaxed text-ink"><span class="mt-2.5 h-px w-3 shrink-0 bg-amber-600" aria-hidden="true" /><span>{{ g }}</span></li>
                        </ul>
                    </section>

                    </div>

                    <section v-if="result.suggestions.length" class="rounded-3xl border border-line bg-white p-5 shadow-(--shadow-card)">
                        <h4 class="flex items-center gap-2 text-sm font-extrabold text-ink"><span class="grid size-6 place-items-center rounded-full bg-navy-900 text-white"><TrendingUp class="size-3.5" aria-hidden="true" /></span>Como ajustar seu currículo</h4>
                        <ol class="mt-3 space-y-3">
                            <li v-for="(s, i) in result.suggestions" :key="i" class="flex gap-3 text-[15px] leading-relaxed text-ink"><span class="grid size-6 shrink-0 place-items-center rounded-full bg-emerald-100 text-xs font-extrabold text-emerald-800 tabular-nums">{{ i + 1 }}</span><span>{{ s }}</span></li>
                        </ol>
                    </section>

                    <p class="px-1 pt-1 text-xs leading-relaxed text-subtle">Análise feita por IA só com o texto enviado. Use como orientação, não como garantia.</p>
                </div>

                <footer class="flex shrink-0 items-center justify-between gap-3 border-t border-emerald-100 bg-white px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-8">
                    <button type="button" data-autofocus class="inline-flex items-center gap-1.5 text-sm font-semibold text-muted transition-colors hover:text-ink" @click="again"><RotateCcw class="size-4" aria-hidden="true" />Outro currículo</button>
                    <button type="button" class="btn-primary" @click="emit('switch', 'interview')">Treinar a entrevista<ArrowRight class="size-4" aria-hidden="true" /></button>
                </footer>
            </div>

            <!-- Enviar currículo -->
            <div v-else key="form" class="flex min-h-0 min-w-0 flex-1 flex-col">
                <div class="mt-scroll flex flex-1 flex-col overflow-y-auto px-5 pt-7 pb-6 sm:px-8">
                    <h3 class="text-[1.7rem] leading-tight font-extrabold tracking-tight text-balance text-ink sm:text-[2rem]">Seu currículo combina com a vaga?</h3>
                    <p class="mt-2.5 text-base leading-relaxed text-muted">Veja a aderência aos requisitos, o que já está forte e o que ajustar.</p>

                    <input ref="fileEl" type="file" accept="application/pdf,.pdf" class="sr-only" tabindex="-1" aria-hidden="true" @change="readPdf(($event.target as HTMLInputElement).files?.[0])" />

                    <!-- PDF carregado -->
                    <div v-if="pdfName" class="mt-6 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-3.5">
                        <span class="grid size-10 shrink-0 place-items-center rounded-xl bg-emerald-600 text-white"><FileText class="size-5" aria-hidden="true" /></span>
                        <p class="min-w-0 flex-1"><span class="block truncate text-sm font-bold text-ink">{{ pdfName }}</span><span class="block text-xs text-muted">Lido no seu navegador. Revise o texto abaixo.</span></p>
                        <button type="button" class="grid size-9 shrink-0 place-items-center rounded-full text-subtle transition-colors hover:bg-white hover:text-ink" aria-label="Remover PDF" @click="clearAll"><X class="size-4.5" aria-hidden="true" /></button>
                    </div>

                    <!-- Soltar PDF -->
                    <button
                        v-else
                        type="button"
                        class="group mt-6 flex w-full flex-col items-center gap-3 rounded-3xl border-2 border-dashed px-6 py-9 text-center transition-colors"
                        :class="dragging ? 'border-emerald-600 bg-emerald-50' : 'border-emerald-300 bg-emerald-50/40 hover:border-emerald-600 hover:bg-emerald-50'"
                        :disabled="reading"
                        @click="fileEl?.click()"
                        @dragover.prevent="dragging = true"
                        @dragleave.prevent="dragging = false"
                        @drop.prevent="onDrop"
                    >
                        <span class="grid size-14 place-items-center rounded-2xl bg-white text-emerald-700 shadow-(--shadow-card) ring-1 ring-emerald-100">
                            <Loader2 v-if="reading" class="size-7 animate-spin" aria-hidden="true" />
                            <FileUp v-else class="size-7 transition-transform duration-200 group-hover:-translate-y-0.5" aria-hidden="true" />
                        </span>
                        <span class="text-base font-bold text-ink">{{ reading ? 'Lendo o PDF…' : 'Solte seu currículo em PDF' }}</span>
                        <span class="text-sm text-muted">{{ reading ? 'Só um instante' : 'ou clique para escolher o arquivo' }}</span>
                    </button>
                    <p v-if="pdfError" class="mt-3 flex items-start gap-2 text-sm font-semibold text-danger-700" role="alert"><AlertTriangle class="mt-0.5 size-4 shrink-0" aria-hidden="true" />{{ pdfError }}</p>

                    <button v-if="!showText" type="button" class="mt-5 self-center text-sm font-semibold text-muted underline underline-offset-4 transition-colors hover:text-ink" @click="startPaste">Prefiro colar o texto</button>

                    <!-- Texto (colado ou extraído do PDF) -->
                    <div v-if="showText" class="mt-5 flex flex-1 flex-col">
                        <label for="mt-resume" class="text-xs font-bold tracking-widest text-emerald-800 uppercase">{{ pdfName ? 'Texto extraído (editável)' : 'Texto do currículo' }}</label>
                        <textarea
                            id="mt-resume"
                            ref="inputEl"
                            v-model="resume"
                            class="mt-2 block min-h-40 w-full flex-1 resize-none rounded-2xl border border-emerald-200 bg-white p-4 text-[15px] leading-relaxed text-ink shadow-none transition placeholder:text-subtle focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100 focus:outline-none"
                            placeholder="Cole aqui o conteúdo do seu currículo (Word, LinkedIn, e-mail…)"
                            :disabled="reading"
                            :aria-invalid="size > MAX || undefined"
                        />
                        <p class="mt-2 flex justify-between text-xs tabular-nums">
                            <span :class="size > 0 && size < MIN ? 'text-warning-700' : 'text-subtle'">{{ size > 0 && size < MIN ? `Faltam ${MIN - size} caracteres` : `Mínimo ${MIN} caracteres` }}</span>
                            <span :class="size > MAX ? 'font-bold text-danger-700' : 'text-subtle'">{{ size.toLocaleString('pt-BR') }}/{{ MAX.toLocaleString('pt-BR') }}</span>
                        </p>
                    </div>

                    <p v-if="error" class="mt-4 flex items-start gap-2 text-sm font-semibold text-danger-700" role="alert"><AlertTriangle class="mt-0.5 size-4 shrink-0" aria-hidden="true" />{{ error }}</p>

                    <p class="mt-7 flex items-start gap-2.5 rounded-2xl bg-surface p-3.5 text-xs leading-relaxed text-muted">
                        <ShieldCheck class="mt-0.5 size-4 shrink-0 text-emerald-700" aria-hidden="true" />
                        <span>Só o texto é enviado à IA e nada é salvo no VagasPlus. Apague CPF, RG, endereço e telefone antes de analisar.</span>
                    </p>
                </div>

                <footer class="shrink-0 border-t border-emerald-100 px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-8">
                    <button type="button" class="btn-primary w-full !bg-emerald-600 hover:!bg-emerald-700 sm:ml-auto sm:w-auto" :disabled="!canAnalyze" @click="analyze">Analisar compatibilidade<ArrowRight class="size-4" aria-hidden="true" /></button>
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
.mt-ring {
    transition: stroke-dashoffset 1.2s cubic-bezier(0.22, 1, 0.36, 1);
}
/* Linha de varredura sobre o documento */
.mt-scan {
    animation: mt-scan 1.8s ease-in-out infinite;
}
@keyframes mt-scan {
    from {
        transform: translateY(-100%);
    }
    to {
        transform: translateY(230%);
    }
}
/* Grade sutil no cabeçalho */
.mt-grid {
    background-image:
        linear-gradient(rgb(255 255 255 / 0.12) 1px, transparent 1px),
        linear-gradient(90deg, rgb(255 255 255 / 0.12) 1px, transparent 1px);
    background-size: 28px 28px;
}
.mt-scroll {
    overscroll-behavior: contain;
    scrollbar-width: thin;
}
</style>
