<script setup lang="ts">
import { AlertTriangle, ArrowRight, Camera, Check, Clock, Loader2, Mic, PhoneOff, RotateCcw, Video, X } from 'lucide-vue-next';
import { computed, onBeforeUnmount, ref, watch } from 'vue';
import { csrfToken, postJson, type AssistantTool } from '@/lib/assistant';

const props = defineProps<{ slug: string; title: string; company: string; open: boolean }>();
const emit = defineEmits<{ switch: [tool: AssistantTool]; close: [] }>();

type Phase = 'intro' | 'loading' | 'call' | 'ended';

const phase = ref<Phase>('intro');
const error = ref('');
const roomUrl = ref('');
const conversationId = ref('');
const secondsLeft = ref(0);
let timer: ReturnType<typeof setInterval> | undefined;

const clock = computed(() => `${Math.floor(secondsLeft.value / 60)}:${String(secondsLeft.value % 60).padStart(2, '0')}`);

async function begin() {
    error.value = '';
    phase.value = 'loading';

    try {
        const { ok, json } = await postJson<{ id: string; url: string; seconds: number }>(`/vagas/${props.slug}/entrevista-video`);
        if (!ok || !json.url) {
            error.value = json.message ?? 'Não foi possível iniciar a videochamada. Tente novamente.';
            phase.value = 'intro';
            return;
        }
        conversationId.value = json.id;
        roomUrl.value = json.url;
        secondsLeft.value = json.seconds;
        phase.value = 'call';
        timer = setInterval(() => (--secondsLeft.value <= 0 ? hangUp() : undefined), 1000);
    } catch {
        error.value = 'Sem conexão. Verifique a internet e tente novamente.';
        phase.value = 'intro';
    }
}

// Encerra a sala no servidor (para a cobrança) e remove o iframe, o que desliga câmera e microfone.
function hangUp() {
    clearInterval(timer);
    if (conversationId.value) {
        // keepalive: o pedido termina mesmo se a página/modal estiver sendo fechado.
        fetch(`/entrevista-video/${conversationId.value}/encerrar`, {
            method: 'POST',
            keepalive: true,
            credentials: 'same-origin',
            headers: { Accept: 'application/json', 'X-XSRF-TOKEN': csrfToken(), 'X-Requested-With': 'XMLHttpRequest' },
        }).catch(() => undefined);
    }
    conversationId.value = '';
    roomUrl.value = '';
    if (phase.value === 'call') phase.value = 'ended';
}

function restart() {
    phase.value = 'intro';
    error.value = '';
}

// Fechar o pop-up durante a chamada encerra a chamada (o painel continua montado, só oculto).
watch(() => props.open, (v) => !v && phase.value === 'call' && hangUp());
onBeforeUnmount(hangUp);
</script>

<template>
    <div class="relative flex h-full min-h-[28rem] flex-col">
        <button type="button" class="absolute top-3 right-3 z-10 grid size-10 place-items-center rounded-full text-white/60 transition-colors hover:bg-white/10 hover:text-white" aria-label="Fechar" @click="emit('close')"><X class="size-5" aria-hidden="true" /></button>

        <header class="flex items-center gap-3 border-b border-white/10 bg-gradient-to-b from-navy-800 to-[#0b1630] px-4 py-4 pr-14 sm:px-6">
            <span class="relative shrink-0">
                <span class="grid size-11 place-items-center rounded-full bg-gradient-to-br from-action-500 to-[#7c5cff] text-white"><Video class="size-5" aria-hidden="true" /></span>
                <span v-if="phase === 'call'" class="absolute -right-0.5 -bottom-0.5 size-3.5 rounded-full border-2 border-navy-800 bg-emerald-400" aria-hidden="true" />
            </span>
            <div class="min-w-0 flex-1">
                <h2 class="text-sm font-extrabold text-white">Entrevista por vídeo</h2>
                <p class="truncate text-xs text-navy-100/70">{{ title }} · {{ company }}</p>
            </div>
            <p v-if="phase === 'call'" class="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white tabular-nums" aria-label="Tempo restante"><Clock class="mr-1 -mt-0.5 inline size-3.5" aria-hidden="true" />{{ clock }}</p>
        </header>

        <!-- Introdução e consentimento: a sala (e a cobrança) só começam quando a pessoa decide entrar -->
        <div v-if="phase === 'intro' || phase === 'loading'" class="flex min-h-0 flex-1 flex-col overflow-y-auto px-6 py-8 sm:px-12">
            <div class="my-auto text-center">
                <h3 class="text-3xl leading-tight font-extrabold tracking-tight text-balance text-white">Entrevista em videochamada</h3>
                <p class="mx-auto mt-3 max-w-md text-base leading-relaxed text-navy-100/80">Converse por voz e vídeo com um recrutador virtual sobre <span class="font-semibold text-white">{{ title }}</span>.</p>
                <ul class="mx-auto mt-7 grid max-w-sm grid-cols-3 gap-2.5">
                    <li class="rounded-2xl bg-white/[0.06] px-2 py-3 ring-1 ring-white/10"><Camera class="mx-auto size-5 text-action-200" aria-hidden="true" /><p class="mt-1.5 text-[11px] text-navy-100/70">câmera</p></li>
                    <li class="rounded-2xl bg-white/[0.06] px-2 py-3 ring-1 ring-white/10"><Mic class="mx-auto size-5 text-action-200" aria-hidden="true" /><p class="mt-1.5 text-[11px] text-navy-100/70">microfone</p></li>
                    <li class="rounded-2xl bg-white/[0.06] px-2 py-3 ring-1 ring-white/10"><Clock class="mx-auto size-5 text-action-200" aria-hidden="true" /><p class="mt-1.5 text-[11px] text-navy-100/70">poucos minutos</p></li>
                </ul>
            </div>
            <div class="mx-auto mt-8 w-full max-w-sm">
                <p v-if="error" class="mb-4 flex items-start gap-2 rounded-xl bg-red-500/15 px-3 py-2.5 text-sm text-red-100" role="alert"><AlertTriangle class="mt-0.5 size-4 shrink-0" aria-hidden="true" />{{ error }}</p>
                <button type="button" data-autofocus class="btn-primary btn-lg w-full" :disabled="phase === 'loading'" @click="begin">
                    <template v-if="phase === 'loading'"><Loader2 class="size-4.5 animate-spin" aria-hidden="true" />Preparando a sala…</template>
                    <template v-else>Entrar na chamada<ArrowRight class="size-4.5" aria-hidden="true" /></template>
                </button>
                <p class="mt-4 text-center text-xs leading-relaxed text-navy-100/55">Ao entrar, você autoriza o uso da câmera e do microfone nesta chamada, processada por um provedor de IA de vídeo. Nada é gravado por nós. Simulação: não avalia você de verdade e não tem ligação com a empresa.</p>
                <button type="button" class="mx-auto mt-3 block text-sm font-semibold text-navy-100/70 transition-colors hover:text-white" @click="emit('switch', 'interview')">Prefiro a entrevista por texto</button>
            </div>
        </div>

        <!-- Chamada -->
        <div v-else-if="phase === 'call'" class="flex min-h-0 flex-1 flex-col bg-black">
            <iframe :src="roomUrl" title="Videochamada com o recrutador virtual" class="min-h-[22rem] w-full flex-1 border-0" allow="camera; microphone; fullscreen; display-capture; autoplay" />
            <div class="flex justify-center bg-[#0b1630] p-3">
                <button type="button" class="inline-flex items-center gap-2 rounded-full bg-red-600 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-red-500" @click="hangUp"><PhoneOff class="size-4" aria-hidden="true" />Encerrar chamada</button>
            </div>
        </div>

        <!-- Fim -->
        <div v-else class="flex min-h-0 flex-1 flex-col items-center justify-center px-6 py-10 text-center">
            <span class="grid size-14 place-items-center rounded-full bg-emerald-400 text-navy-900"><Check class="size-7" aria-hidden="true" /></span>
            <h3 class="mt-5 text-2xl font-extrabold text-white">Chamada encerrada</h3>
            <p class="mt-2 max-w-sm text-sm leading-relaxed text-navy-100/75">Boa prática! Repita quantas vezes quiser ou treine com as perguntas prováveis.</p>
            <div class="mt-6 flex flex-wrap justify-center gap-3">
                <button type="button" class="btn-primary" @click="restart"><RotateCcw class="size-4" aria-hidden="true" />Nova chamada</button>
                <button type="button" class="rounded-full px-4 py-2 text-sm font-semibold text-navy-100/80 ring-1 ring-white/20 transition-colors hover:text-white" @click="emit('switch', 'questions')">Ver perguntas prováveis</button>
            </div>
        </div>
    </div>
</template>
