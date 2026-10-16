<script setup lang="ts">
import { AlertTriangle } from 'lucide-vue-next';
import { nextTick, ref, watch } from 'vue';

const props = withDefaults(
    defineProps<{ open: boolean; title: string; message?: string; confirmLabel?: string; danger?: boolean; processing?: boolean }>(),
    { confirmLabel: 'Confirmar', danger: false, processing: false },
);
const emit = defineEmits<{ (e: 'confirm'): void; (e: 'cancel'): void }>();

const dialog = ref<HTMLDialogElement | null>(null);

watch(
    () => props.open,
    async (open) => {
        await nextTick();
        if (!dialog.value) return;
        if (open && !dialog.value.open) dialog.value.showModal();
        if (!open && dialog.value.open) dialog.value.close();
    },
    { immediate: true },
);
</script>

<template>
    <dialog ref="dialog" class="m-auto w-[calc(100%-2rem)] max-w-md rounded-2xl border border-line bg-white p-0 shadow-(--shadow-pop) backdrop:bg-navy-950/50" @cancel.prevent="emit('cancel')" @click.self="emit('cancel')">
        <form class="p-6" @submit.prevent="emit('confirm')">
            <div class="flex items-start gap-3">
                <div class="grid size-10 shrink-0 place-items-center rounded-full" :class="danger ? 'bg-danger-50 text-danger-700' : 'bg-action-50 text-action-700'"><AlertTriangle class="size-5" aria-hidden="true" /></div>
                <div class="min-w-0 flex-1">
                    <h2 class="text-lg font-extrabold text-ink">{{ title }}</h2>
                    <p v-if="message" class="mt-1.5 text-sm text-muted">{{ message }}</p>
                    <div class="mt-4 empty:hidden"><slot /></div>
                </div>
            </div>
            <div class="mt-6 flex justify-end gap-2">
                <button type="button" class="btn-secondary" @click="emit('cancel')">Cancelar</button>
                <button type="submit" :class="danger ? 'btn-danger' : 'btn-primary'" :disabled="processing">{{ processing ? 'Aguarde…' : confirmLabel }}</button>
            </div>
        </form>
    </dialog>
</template>
