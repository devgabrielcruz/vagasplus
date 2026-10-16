<script setup lang="ts">
import { AlertTriangle, ArrowRight, Check, FileText, FileUp, Loader2, RotateCcw, ShieldCheck, X } from 'lucide-vue-next';
import { computed, nextTick, ref } from 'vue';
import { extractPdfText, PdfTextError } from '@/lib/pdfText';
import { postJson, type AssistantTool } from '@/lib/assistant';

type Result = { score: number; verdict: string; matched: string[]; gaps: string[]; suggestions: string[] };

// Mantém em sincronia com JobPrep::RESUME_MIN / RESUME_MAX.
const MIN = 80;
const MAX = 8000;

const props = defineProps<{ slug: string; title: string; company: string; open: boolean }>();
const emit = defineEmits<{ switch: [tool: AssistantTool] }>();

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
    if (s >= 75) return { label: 'Alta aderência', text: 'text-success-700', stroke: 'var(--color-success-700)' };
    if (s >= 50) return { label: 'Aderência média', text: 'text-action-700', stroke: 'var(--color-action-600)' };
    return { label: 'Aderência baixa', text: 'text-warning-700', stroke: 'var(--color-warning-700)' };
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
    <div class="flex h-full flex-col">
        <Transition name="stage" mode="out-in">
            <!-- Analisando -->
            <div v-if="view === 'loading'" key="loading" class="flex min-h-0 flex-1 flex-col items-center justify-center px-6 text-center sm:px-12" role="status">
                <span class="flex items-center gap-1.5" aria-hidden="true"><i class="mt-dot" /><i class="mt-dot" style="animation-delay: 150ms" /><i class="mt-dot" style="animation-delay: 300ms" /></span>
                <p class="mt-5 text-lg font-extrabold text-ink">Analisando seu currículo…</p>
                <p class="mt-1 max-w-xs text-sm text-muted">Comparando sua experiência com os requisitos desta vaga.</p>
            </div>

            <!-- Resultado -->
            <div v-else-if="view === 'result' && result" key="result" class="flex min-h-0 flex-1 flex-col">
                <div class="mt-scroll flex-1 overflow-y-auto px-6 py-9 sm:px-12">
                    <div class="text-center">
                        <div class="relative mx-auto size-36">
                            <svg viewBox="0 0 120 120" class="size-full -rotate-90" aria-hidden="true">
                                <circle cx="60" cy="60" r="52" fill="none" stroke="var(--color-line)" stroke-width="7" />
                                <circle cx="60" cy="60" r="52" fill="none" :stroke="level.stroke" stroke-width="7" stroke-linecap="round" :stroke-dasharray="C" :stroke-dashoffset="dash" class="mt-ring" />
                            </svg>
                            <p class="absolute inset-0 grid place-items-center leading-none"><span><span class="text-5xl font-extrabold tracking-tight text-ink tabular-nums">{{ result.score }}</span><span class="text-xl font-bold text-subtle">%</span></span></p>
                        </div>
                        <p class="mt-4 text-sm font-extrabold" :class="level.text">{{ level.label }}</p>
                        <p v-if="result.verdict" class="mx-auto mt-2 max-w-sm text-[17px] leading-relaxed text-ink">{{ result.verdict }}</p>
                    </div>

                    <section v-if="result.matched.length" class="mt-10">
                        <h4 class="text-xs font-bold tracking-widest text-success-700 uppercase">Você já atende</h4>
                        <ul class="mt-3 space-y-3">
                            <li v-for="(m, i) in result.matched" :key="i" class="flex gap-3 text-[15px] leading-relaxed text-ink"><Check class="mt-1 size-4 shrink-0 text-success-700" aria-hidden="true" /><span>{{ m }}</span></li>
                        </ul>
                    </section>

                    <section v-if="result.gaps.length" class="mt-9">
                        <h4 class="text-xs font-bold tracking-widest text-warning-700 uppercase">Pontos de atenção</h4>
                        <ul class="mt-3 space-y-3">
                            <li v-for="(g, i) in result.gaps" :key="i" class="flex gap-3 text-[15px] leading-relaxed text-ink"><span class="mt-2.5 h-px w-3 shrink-0 bg-warning-700" aria-hidden="true" /><span>{{ g }}</span></li>
                        </ul>
                    </section>

                    <section v-if="result.suggestions.length" class="mt-9">
                        <h4 class="text-xs font-bold tracking-widest text-action-700 uppercase">Como ajustar seu currículo</h4>
                        <ol class="mt-3 space-y-3">
                            <li v-for="(s, i) in result.suggestions" :key="i" class="flex gap-3 text-[15px] leading-relaxed text-ink"><span class="w-4 shrink-0 text-right font-bold text-subtle tabular-nums">{{ i + 1 }}</span><span>{{ s }}</span></li>
                        </ol>
                    </section>

                    <p class="mt-10 text-xs leading-relaxed text-subtle">Análise feita por IA só com o texto enviado. Use como orientação, não como garantia.</p>
                </div>

                <footer class="flex shrink-0 items-center justify-between gap-3 border-t border-line/70 px-6 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-12">
                    <button type="button" data-autofocus class="inline-flex items-center gap-1.5 text-sm font-semibold text-muted transition-colors hover:text-ink" @click="again"><RotateCcw class="size-4" aria-hidden="true" />Outro currículo</button>
                    <button type="button" class="btn-primary" @click="emit('switch', 'interview')">Treinar a entrevista<ArrowRight class="size-4" aria-hidden="true" /></button>
                </footer>
            </div>

            <!-- Enviar currículo -->
            <div v-else key="form" class="flex min-h-0 flex-1 flex-col">
                <div class="mt-scroll flex flex-1 flex-col overflow-y-auto px-6 pt-9 pb-6 sm:px-12">
                    <h3 class="text-[1.9rem] leading-tight font-extrabold tracking-tight text-balance text-ink sm:text-4xl">Seu currículo combina com a vaga?</h3>
                    <p class="mt-3 text-base leading-relaxed text-muted">Veja a aderência aos requisitos, o que já está forte e o que ajustar.</p>

                    <input ref="fileEl" type="file" accept="application/pdf,.pdf" class="sr-only" tabindex="-1" aria-hidden="true" @change="readPdf(($event.target as HTMLInputElement).files?.[0])" />

                    <!-- PDF carregado -->
                    <div v-if="pdfName" class="mt-8 flex items-center gap-3">
                        <FileText class="size-6 shrink-0 text-success-700" aria-hidden="true" />
                        <p class="min-w-0 flex-1"><span class="block truncate text-sm font-bold text-ink">{{ pdfName }}</span><span class="block text-xs text-muted">Lido no seu navegador. Revise o texto abaixo.</span></p>
                        <button type="button" class="grid size-9 shrink-0 place-items-center rounded-full text-subtle transition-colors hover:bg-surface hover:text-ink" aria-label="Remover PDF" @click="clearAll"><X class="size-4.5" aria-hidden="true" /></button>
                    </div>

                    <!-- Soltar PDF -->
                    <button
                        v-else
                        type="button"
                        class="group mt-8 flex w-full flex-col items-center gap-3 rounded-3xl border-2 border-dashed px-6 py-10 text-center transition-colors"
                        :class="dragging ? 'border-action-600 bg-action-50' : 'border-line-strong hover:border-action-500 hover:bg-action-50/40'"
                        :disabled="reading"
                        @click="fileEl?.click()"
                        @dragover.prevent="dragging = true"
                        @dragleave.prevent="dragging = false"
                        @drop.prevent="onDrop"
                    >
                        <Loader2 v-if="reading" class="size-8 animate-spin text-action-700" aria-hidden="true" />
                        <FileUp v-else class="size-8 text-action-700 transition-transform duration-200 group-hover:-translate-y-0.5" aria-hidden="true" />
                        <span class="text-base font-bold text-ink">{{ reading ? 'Lendo o PDF…' : 'Solte seu currículo em PDF' }}</span>
                        <span class="text-sm text-muted">{{ reading ? 'Só um instante' : 'ou clique para escolher o arquivo' }}</span>
                    </button>
                    <p v-if="pdfError" class="mt-3 flex items-start gap-2 text-sm font-semibold text-danger-700" role="alert"><AlertTriangle class="mt-0.5 size-4 shrink-0" aria-hidden="true" />{{ pdfError }}</p>

                    <button v-if="!showText" type="button" class="mt-5 self-center text-sm font-semibold text-muted underline underline-offset-4 transition-colors hover:text-ink" @click="startPaste">Prefiro colar o texto</button>

                    <!-- Texto (colado ou extraído do PDF) -->
                    <div v-if="showText" class="mt-6 flex flex-1 flex-col">
                        <label for="mt-resume" class="text-xs font-bold tracking-widest text-subtle uppercase">{{ pdfName ? 'Texto extraído (editável)' : 'Texto do currículo' }}</label>
                        <textarea
                            id="mt-resume"
                            ref="inputEl"
                            v-model="resume"
                            class="mt-2 block min-h-40 w-full flex-1 resize-none rounded-2xl border border-line-strong bg-white p-4 text-[15px] leading-relaxed text-ink shadow-none transition placeholder:text-subtle focus:border-action-600 focus:ring-4 focus:ring-action-100 focus:outline-none"
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

                    <p class="mt-8 flex items-start gap-2.5 text-xs leading-relaxed text-subtle">
                        <ShieldCheck class="mt-0.5 size-4 shrink-0 text-success-700" aria-hidden="true" />
                        <span>Só o texto é enviado à IA (Google Gemini) e nada é salvo no VagasPlus. Apague CPF, RG, endereço e telefone antes de analisar.</span>
                    </p>
                </div>

                <footer class="shrink-0 border-t border-line/70 px-6 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-12">
                    <button type="button" class="btn-primary w-full sm:ml-auto sm:w-auto" :disabled="!canAnalyze" @click="analyze">Analisar compatibilidade<ArrowRight class="size-4" aria-hidden="true" /></button>
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
.mt-dot {
    display: block;
    width: 8px;
    height: 8px;
    border-radius: 9999px;
    background: var(--color-action-600);
    animation: mt-bounce 1s ease-in-out infinite;
}
@keyframes mt-bounce {
    0%,
    60%,
    100% {
        transform: translateY(0);
        opacity: 0.4;
    }
    30% {
        transform: translateY(-5px);
        opacity: 1;
    }
}
.mt-scroll {
    overscroll-behavior: contain;
    scrollbar-width: thin;
}
</style>
