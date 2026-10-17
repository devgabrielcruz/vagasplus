<script lang="ts">
// Painéis abertos ao mesmo tempo: o scroll da página só volta quando o último fecha.
let scrollLocks = 0;
</script>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';

/**
 * Casca comum dos pop-ups do assistente: modal no desktop, bottom sheet arrastável no celular.
 * O visual (cores, largura, cabeçalho) é de cada ferramenta: aqui ficam só comportamento e animação.
 */
const props = defineProps<{ open: boolean; label: string; panelClass?: string; backdropClass?: string; handleClass?: string }>();
const emit = defineEmits<{ close: [] }>();

// O Teleport só existe no navegador: hidratá-lo com o HTML do SSR o casa com nós errados do <body>.
const mounted = ref(false);
onMounted(() => (mounted.value = true));

const panelEl = ref<HTMLElement | null>(null);
let opener: HTMLElement | null = null;
let locked = false;

function lock(on: boolean) {
    if (on === locked) return;
    locked = on;
    scrollLocks += on ? 1 : -1;
    document.documentElement.style.overflow = scrollLocks > 0 ? 'hidden' : '';
}

function focusContent() {
    nextTick(() => (panelEl.value?.querySelector<HTMLElement>('[data-autofocus]') ?? panelEl.value)?.focus({ preventScroll: true }));
}

function onKeydown(e: KeyboardEvent) {
    if (!props.open) return;
    if (e.key === 'Escape') {
        emit('close');
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

watch(
    () => props.open,
    (v) => {
        if (v) {
            opener = document.activeElement as HTMLElement | null;
            lock(true);
            window.addEventListener('keydown', onKeydown);
            focusContent();
        } else {
            lock(false);
            window.removeEventListener('keydown', onKeydown);
            opener?.focus?.();
        }
    },
);

onBeforeUnmount(() => {
    lock(false);
    window.removeEventListener('keydown', onKeydown);
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
    if (far) emit('close');
}

defineExpose({ focusContent });
</script>

<template>
    <Teleport v-if="mounted" to="body">
        <Transition name="ah">
            <div v-show="open" class="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6">
                <div class="absolute inset-0 backdrop-blur-[6px]" :class="backdropClass ?? 'bg-navy-950/40'" aria-hidden="true" @click="emit('close')" />

                <section
                    ref="panelEl"
                    class="ah-panel relative flex h-[94dvh] w-full flex-col overflow-hidden rounded-t-[28px] shadow-[0_-16px_60px_-16px_rgb(7_20_51/0.5)] outline-none sm:h-[min(44rem,calc(100dvh-3rem))] sm:rounded-[28px] md:h-[min(37rem,calc(100dvh-3rem))] sm:shadow-[0_40px_100px_-24px_rgb(7_20_51/0.55)]"
                    :class="[panelClass ?? 'bg-white sm:max-w-[38rem]', dragging ? '' : 'ah-settle']"
                    :style="dragY ? { transform: `translateY(${dragY}px)` } : undefined"
                    role="dialog"
                    aria-modal="true"
                    :aria-label="label"
                    tabindex="-1"
                >
                    <!-- Alça de arrastar (celular), sobreposta ao cabeçalho de cada ferramenta -->
                    <div class="absolute inset-x-0 top-0 z-20 mx-auto h-6 w-24 touch-none sm:hidden" @pointerdown="dragStart" @pointermove="dragMove" @pointerup="dragEnd" @pointercancel="dragEnd">
                        <span class="mx-auto mt-2 block h-1.5 w-11 rounded-full" :class="handleClass ?? 'bg-line-strong'" aria-hidden="true" />
                    </div>

                    <slot />
                </section>
            </div>
        </Transition>
    </Teleport>
</template>

<style scoped>
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
</style>
