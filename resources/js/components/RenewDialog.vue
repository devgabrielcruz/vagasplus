<script setup lang="ts">
import { useForm } from '@inertiajs/vue3';
import { computed, watch } from 'vue';
import ConfirmDialog from '@/components/ConfirmDialog.vue';

const props = defineProps<{ open: boolean; jobId: number; title: string; expired: boolean; presets?: number[] }>();
const emit = defineEmits<{ (e: 'close'): void }>();

const form = useForm({ validity_days: 30 as number | null, expires_at: '', confirm: false });
const days = computed(() => props.presets ?? [7, 15, 30, 60]);
const statusError = computed(() => (form.errors as Record<string, string>).status);

watch(
    () => props.open,
    (open) => open && form.reset().clearErrors(),
);

function pick(d: number) {
    form.validity_days = d;
    form.expires_at = '';
}

function submit() {
    form.post(`/admin/vagas/${props.jobId}/renovar`, { preserveScroll: true, onSuccess: () => emit('close') });
}
</script>

<template>
    <ConfirmDialog :open="open" :title="expired ? 'Renovar vaga expirada' : 'Renovar validade'" :message="`“${title}” — defina por quanto tempo a vaga continuará no ar a partir de agora.`" confirm-label="Renovar vaga" :processing="form.processing" @confirm="submit" @cancel="emit('close')">
        <fieldset>
            <legend class="label">Nova validade</legend>
            <div class="flex flex-wrap gap-2">
                <button v-for="d in days" :key="d" type="button" class="btn-sm btn rounded-full border" :class="form.validity_days === d && !form.expires_at ? 'border-action-600 bg-action-50 text-action-700' : 'border-line-strong bg-white text-ink'" :aria-pressed="form.validity_days === d && !form.expires_at" @click="pick(d)">{{ d }} dias</button>
            </div>
            <label for="renew-custom" class="label mt-3">Ou escolha uma data</label>
            <input id="renew-custom" v-model="form.expires_at" type="datetime-local" class="field" @input="form.validity_days = null" />
            <p v-if="form.errors.expires_at" class="error-text" role="alert">{{ form.errors.expires_at }}</p>
        </fieldset>
        <label v-if="expired" class="mt-4 flex items-start gap-2 rounded-lg bg-warning-50 p-3 text-sm text-warning-700">
            <input v-model="form.confirm" type="checkbox" class="mt-0.5 size-4 rounded border-line-strong text-action-600" />
            <span>Confirmo que a oportunidade <strong>continua aberta</strong> e pode voltar a ser exibida publicamente.</span>
        </label>
        <p v-if="form.errors.confirm" class="error-text" role="alert">{{ form.errors.confirm }}</p>
        <p v-if="statusError" class="error-text" role="alert">{{ statusError }}</p>
    </ConfirmDialog>
</template>
