<script setup lang="ts">
import { usePage } from '@inertiajs/vue3';
import { AlertCircle, CheckCircle2, X } from 'lucide-vue-next';
import { ref, watch } from 'vue';

const page = usePage<{ flash: { success?: string | null; error?: string | null } }>();
const message = ref<{ type: 'success' | 'error'; text: string } | null>(null);
let timer: ReturnType<typeof setTimeout> | undefined;

watch(
    () => page.props.flash,
    (flash) => {
        const next = flash?.error ? { type: 'error' as const, text: flash.error } : flash?.success ? { type: 'success' as const, text: flash.success } : null;
        message.value = next;
        clearTimeout(timer);
        if (next?.type === 'success') timer = setTimeout(() => (message.value = null), 6000);
    },
    { immediate: true, deep: true },
);
</script>

<template>
    <div class="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4" aria-live="polite" role="status">
        <Transition enter-active-class="transition duration-200" enter-from-class="-translate-y-2 opacity-0" leave-active-class="transition duration-150" leave-to-class="opacity-0">
            <div
                v-if="message"
                class="pointer-events-auto flex max-w-lg items-start gap-2.5 rounded-xl border px-4 py-3 text-sm font-medium shadow-(--shadow-pop)"
                :class="message.type === 'success' ? 'border-success-700/20 bg-success-50 text-success-700' : 'border-danger-700/20 bg-danger-50 text-danger-700'"
            >
                <CheckCircle2 v-if="message.type === 'success'" class="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                <AlertCircle v-else class="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                <p>{{ message.text }}</p>
                <button type="button" class="-mr-1 ml-2 rounded p-0.5 opacity-70 hover:opacity-100" aria-label="Fechar aviso" @click="message = null"><X class="size-4" /></button>
            </div>
        </Transition>
    </div>
</template>
