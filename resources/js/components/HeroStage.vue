<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import { CheckCircle2, Info, MapPin, MessagesSquare, Search, Target, Video } from 'lucide-vue-next';
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import CompanyLogo from '@/components/CompanyLogo.vue';
import { prefersReducedMotion } from '@/composables/useTypewriter';
import type { JobCardData } from '@/types';

/**
 * Palco animado do hero: alterna sozinho entre "Vagas", "Simulador de entrevista" e "Compatibilidade".
 * A aba de entrevista é uma videochamada em tela dividida com vídeos demonstrativos (placeholders mudos em loop).
 * Usa vagas REAIS; as falas e as notas da simulação são apenas ilustrativas.
 */
const props = defineProps<{ jobs: JobCardData[] }>();

const tabs = [
    { key: 'jobs', label: 'Vagas', icon: Search },
    { key: 'interview', label: 'Entrevista', icon: MessagesSquare },
    { key: 'match', label: 'Compatibilidade', icon: Target },
] as const;
type Tab = (typeof tabs)[number]['key'];

const ROTATE_MS = 10500;
const active = ref<Tab>('jobs');
const paused = ref(false);
const reduced = ref(false);
const cycle = ref(0); // muda a cada troca para reiniciar a barra de progresso e as animações

const job = computed(() => props.jobs[0]);
const role = computed(() => job.value?.title ?? 'a vaga');

// --- Simulação da entrevista: o texto é digitado passo a passo ---
const question = computed(() => `Conte sobre um projeto em que você fez a diferença como ${role.value}.`);
const answerFull = 'Liderei a migração do nosso fluxo de entregas e reduzi o tempo de resposta pela metade em dois meses.';
const qText = ref('');
const aText = ref('');
const stage = ref(0); // 0 pergunta digitando · 1 resposta digitando · 2 feedback
const score = ref(0);
const clarity = ref(0);
const structure = ref(0);
const matchPct = ref(0);

let runId = 0;
const sleep = (ms: number) => new Promise<void>((r) => window.setTimeout(r, ms));

async function typeInto(target: { value: string }, full: string, id: number, speed = 24) {
    for (let i = 1; i <= full.length; i++) {
        if (id !== runId) return false;
        target.value = full.slice(0, i);
        await sleep(speed + Math.random() * 18);
    }
    return true;
}

function countTo(target: { value: number }, to: number, id: number, ms = 1100) {
    const start = performance.now();
    const tick = (now: number) => {
        if (id !== runId) return;
        const p = Math.min(1, (now - start) / ms);
        target.value = Math.round(to * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
}

function showFinal() {
    qText.value = question.value;
    aText.value = answerFull;
    stage.value = 2;
    score.value = 8;
    clarity.value = 85;
    structure.value = 72;
    matchPct.value = 82;
}

async function play(tab: Tab) {
    const id = ++runId;
    qText.value = '';
    aText.value = '';
    stage.value = 0;
    score.value = clarity.value = structure.value = matchPct.value = 0;
    if (reduced.value) return showFinal();

    if (tab === 'interview') {
        await sleep(500);
        if (!(await typeInto(qText, question.value, id))) return;
        await sleep(500);
        stage.value = 1;
        await sleep(900);
        if (!(await typeInto(aText, answerFull, id, 16))) return;
        await sleep(450);
        stage.value = 2;
        countTo(score, 8, id, 900);
        countTo(clarity, 85, id);
        countTo(structure, 72, id);
    } else if (tab === 'match') {
        await sleep(450);
        countTo(matchPct, 82, id, 1500);
    }
}

function select(tab: Tab) {
    active.value = tab;
    cycle.value++;
}

let rotate: number | undefined;
function schedule() {
    window.clearTimeout(rotate);
    if (reduced.value || paused.value) return;
    rotate = window.setTimeout(() => select(tabs[(tabs.findIndex((t) => t.key === active.value) + 1) % tabs.length].key), ROTATE_MS);
}

watch([active, cycle], () => {
    play(active.value);
    schedule();
});
watch(paused, schedule);

onMounted(() => {
    reduced.value = prefersReducedMotion();
    play(active.value);
    schedule();
});
onBeforeUnmount(() => {
    runId++;
    window.clearTimeout(rotate);
});

// Quem está falando em cada etapa da simulação (0 = recrutadora, 1 = candidato).
const speaking = computed(() => (stage.value === 0 ? 'recruiter' : stage.value === 1 ? 'candidate' : ''));
const people = [
    { key: 'recruiter', label: 'Recrutadora', src: '/videos/recrutadora.mp4', poster: '/videos/recrutadora.jpg', ring: 'ring-action-500', wave: 'text-action-200' },
    { key: 'candidate', label: 'Você', src: '/videos/candidato.mp4', poster: '/videos/candidato.jpg', ring: 'ring-emerald-300', wave: 'text-emerald-300' },
];

const strengths = ['Experiência na área', 'Requisitos principais', 'Nível da vaga'];
const gaps = ['Inglês avançado'];
</script>

<template>
    <div class="relative mx-auto w-full max-w-md" role="region" aria-label="Demonstração: busca de vagas, simulador de entrevista e compatibilidade" @mouseenter="paused = true" @mouseleave="paused = false" @focusin="paused = true" @focusout="paused = false">
        <!-- Placa azul deslocada + selos -->
        <div class="pointer-events-none absolute inset-0 translate-x-2 translate-y-2 rounded-3xl sm:translate-x-3.5 sm:translate-y-3.5 border-2 border-navy-900 bg-action-600" aria-hidden="true" />
        <span class="animate-float absolute -top-4 -right-1 z-10 sm:-right-3 rotate-6 rounded-xl border-2 border-navy-900 bg-amber-300 px-3 py-1.5 text-xs font-extrabold text-navy-900 shadow-[3px_3px_0_0_var(--color-navy-900)]" aria-hidden="true">100% grátis</span>
        <span class="animate-float absolute -bottom-7 -left-1 z-10 sm:-left-4 -rotate-3 rounded-xl border-2 border-navy-900 bg-white px-3 py-1.5 text-xs font-extrabold text-navy-900 shadow-[3px_3px_0_0_var(--color-navy-900)] [animation-delay:-3s]" aria-hidden="true">Sem cadastro</span>

        <div class="relative overflow-hidden rounded-3xl border-2 border-navy-900 bg-navy-900">
            <!-- Abas com barra de progresso -->
            <div role="tablist" aria-label="Recursos do VagasPlus" class="grid grid-cols-3 border-b border-white/10">
                <button v-for="t in tabs" :id="`hero-tab-${t.key}`" :key="t.key" type="button" role="tab" :aria-selected="active === t.key" :aria-controls="`hero-panel-${t.key}`" :tabindex="active === t.key ? 0 : -1" class="relative flex items-center justify-center gap-1.5 px-1 py-3.5 text-[11px] font-bold transition-colors sm:px-2 sm:text-xs" :class="active === t.key ? 'text-white' : 'text-navy-100/55 hover:text-white/85'" @click="select(t.key)">
                    <component :is="t.icon" class="hidden size-3.5 sm:block" aria-hidden="true" />{{ t.label }}
                    <span v-if="active === t.key" :key="cycle" class="hero-progress absolute inset-x-0 bottom-0 h-0.5 origin-left bg-action-500" :class="{ 'hero-progress-run': !reduced }" :style="{ animationDuration: `${ROTATE_MS}ms`, animationPlayState: paused ? 'paused' : 'running' }" />
                </button>
            </div>

            <div class="relative h-[27rem] p-3.5 sm:h-[clamp(21rem,50vh,25rem)] sm:p-4">
                <!-- VAGAS -->
                <div v-if="active === 'jobs'" id="hero-panel-jobs" :key="`j${cycle}`" role="tabpanel" aria-labelledby="hero-tab-jobs" class="space-y-2.5">
                    <p class="hero-in flex items-center gap-2 px-1 text-xs font-bold text-navy-100/70"><span class="size-1.5 animate-pulse rounded-full bg-emerald-300" aria-hidden="true" />Chegando agora</p>
                    <Link v-for="(j, i) in jobs.slice(0, 4)" :key="j.id" :href="j.url" class="hero-in group flex items-center gap-3 rounded-2xl bg-white p-3 shadow-lg transition hover:-translate-y-0.5" :style="{ animationDelay: `${120 + i * 140}ms` }">
                        <CompanyLogo :name="j.company.name" :url="j.company.logo_url" size="sm" />
                        <div class="min-w-0 flex-1">
                            <p class="truncate text-sm font-bold text-ink group-hover:text-action-700">{{ j.title }}</p>
                            <p class="truncate text-xs text-muted">{{ j.company.name }}</p>
                            <div class="mt-1 flex items-center gap-2 text-[11px] text-muted">
                                <span class="rounded-full bg-action-50 px-1.5 py-0.5 font-semibold text-action-700">{{ j.work_mode.label }}</span>
                                <span v-if="j.location" class="inline-flex items-center gap-0.5 truncate"><MapPin class="size-3" aria-hidden="true" />{{ j.location }}</span>
                            </div>
                        </div>
                        <img v-if="j.platform.logo" :src="j.platform.logo" :alt="`via ${j.platform.label}`" class="h-6 w-auto max-w-[4rem] shrink-0 rounded-md object-contain" />
                    </Link>
                </div>

                <!-- ENTREVISTA -->
                <div v-else-if="active === 'interview'" id="hero-panel-interview" :key="`i${cycle}`" role="tabpanel" aria-labelledby="hero-tab-interview" class="flex h-full flex-col gap-3">
                    <div class="flex items-center justify-between gap-2 px-1 text-[11px] font-bold text-navy-100/70">
                        <span class="flex items-center gap-1.5"><Video class="size-3.5" aria-hidden="true" />Entrevista por vídeo</span>
                        <span class="flex items-center gap-1.5 rounded-full bg-black/30 px-2 py-0.5 text-white"><i class="size-1.5 animate-pulse rounded-full bg-red-400" aria-hidden="true" />Ao vivo</span>
                    </div>

                    <!-- Videochamada em tela dividida. Os vídeos são só demonstrativos (mudos, em loop); quem "fala" é indicado pelo contorno e pela legenda. -->
                    <div class="hero-in grid min-h-0 flex-1 grid-cols-2 gap-2">
                        <figure v-for="p in people" :key="p.key" class="relative min-h-0 overflow-hidden rounded-2xl bg-navy-950 ring-2 transition-shadow duration-300" :class="speaking === p.key ? p.ring : 'ring-white/10'">
                            <video class="absolute inset-0 size-full object-cover" :src="p.src" :poster="p.poster" muted loop playsinline preload="metadata" :autoplay="!reduced" disablepictureinpicture tabindex="-1" aria-hidden="true" />
                            <figcaption class="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-gradient-to-t from-black/70 to-transparent px-2.5 pt-6 pb-2 text-[11px] font-bold text-white">
                                {{ p.label }}
                                <span class="wave !h-3 transition-opacity duration-300" :class="[p.wave, speaking === p.key ? 'opacity-100' : 'opacity-0']" aria-hidden="true"><i v-for="n in 4" :key="n" :style="{ animationDelay: `${n * 120}ms` }" /></span>
                            </figcaption>
                        </figure>
                    </div>

                    <!-- Legenda de quem está falando -->
                    <p v-if="stage < 2" class="min-h-[3.6rem] rounded-xl bg-white/10 px-3 py-2 text-[12px] leading-snug text-white">
                        <span class="mb-0.5 block text-[10px] font-extrabold tracking-wide uppercase" :class="stage === 0 ? 'text-action-200' : 'text-emerald-300'">{{ stage === 0 ? 'Recrutadora' : 'Você' }}</span>
                        {{ stage === 0 ? qText : aText }}<span v-if="!reduced" class="caret" aria-hidden="true" />
                    </p>

                    <div v-if="stage >= 2" class="hero-in mt-auto rounded-2xl border border-white/15 bg-white/[0.07] p-3">
                        <div class="flex items-center justify-between">
                            <p class="flex items-center gap-1.5 text-xs font-bold text-emerald-300"><CheckCircle2 class="size-4" aria-hidden="true" />Feedback da resposta</p>
                            <p class="text-lg font-extrabold text-white tabular-nums">{{ score }}<span class="text-xs font-semibold text-navy-100/60">/10</span></p>
                        </div>
                        <div v-for="b in [{ l: 'Clareza', v: clarity }, { l: 'Estrutura', v: structure }]" :key="b.l" class="mt-2">
                            <div class="flex justify-between text-[11px] font-semibold text-navy-100/80"><span>{{ b.l }}</span><span class="tabular-nums">{{ b.v }}%</span></div>
                            <div class="mt-1 h-1.5 overflow-hidden rounded-full bg-white/10"><div class="h-full rounded-full bg-gradient-to-r from-action-500 to-[#b49bff]" :style="{ width: `${b.v}%` }" /></div>
                        </div>
                    </div>
                </div>

                <!-- COMPATIBILIDADE -->
                <div v-else id="hero-panel-match" :key="`m${cycle}`" role="tabpanel" aria-labelledby="hero-tab-match" class="flex h-full flex-col items-center gap-4">
                    <p class="hero-in flex items-center gap-1.5 self-start px-1 text-[11px] font-bold text-navy-100/70"><Target class="size-3.5" aria-hidden="true" />Seu currículo × {{ role }}</p>
                    <div class="relative grid size-36 place-items-center">
                        <svg viewBox="0 0 120 120" class="absolute inset-0 -rotate-90" aria-hidden="true">
                            <circle cx="60" cy="60" r="52" fill="none" stroke="rgb(255 255 255 / 0.1)" stroke-width="10" />
                            <circle cx="60" cy="60" r="52" fill="none" stroke="url(#hero-ring)" stroke-width="10" stroke-linecap="round" stroke-dasharray="326.7" :stroke-dashoffset="326.7 * (1 - matchPct / 100)" />
                            <defs><linearGradient id="hero-ring" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#6aa0ff" /><stop offset="1" stop-color="#b49bff" /></linearGradient></defs>
                        </svg>
                        <p class="text-center"><span class="text-4xl font-extrabold text-white tabular-nums">{{ matchPct }}%</span><span class="block text-[11px] font-semibold text-navy-100/70">de compatibilidade</span></p>
                    </div>
                    <ul class="w-full space-y-1.5">
                        <li v-for="(s, i) in strengths" :key="s" class="hero-in flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-xs font-semibold text-white" :style="{ animationDelay: `${600 + i * 160}ms` }"><CheckCircle2 class="size-4 shrink-0 text-emerald-300" aria-hidden="true" />{{ s }}</li>
                        <li v-for="g in gaps" :key="g" class="hero-in flex items-center gap-2 rounded-xl bg-amber-400/15 px-3 py-2 text-xs font-semibold text-amber-200" style="animation-delay: 1100ms"><Target class="size-4 shrink-0" aria-hidden="true" />Pode melhorar: {{ g }}</li>
                    </ul>
                </div>
            </div>
        </div>

        <p class="relative mt-7 flex items-start gap-2 rounded-xl border-2 border-navy-900 bg-white px-3.5 py-2.5 text-[13px] leading-snug text-navy-900"><Info class="mt-0.5 size-4 shrink-0 text-action-700" aria-hidden="true" /><span><strong class="font-extrabold">Candidatura direto na fonte.</strong> Você vai para o site da empresa e vagas vencidas saem do ar sozinhas.</span></p>
    </div>
</template>
