<script setup lang="ts">
import { ImagePlus } from 'lucide-vue-next';
import { onBeforeUnmount, ref, watch } from 'vue';

/**
 * Logo por upload (PNG/JPG/WEBP até 1 MB) ou por URL https. Mostra a prévia e permite remover o atual.
 */
const props = defineProps<{
    id: string;
    current?: string | null; // logo atual (src)
    url: string;
    file: File | null;
    remove: boolean;
    error?: string;
    urlError?: string;
    name?: string;
    hideUrl?: boolean;
}>();

const emit = defineEmits<{ (e: 'update:url', v: string): void; (e: 'update:file', v: File | null): void; (e: 'update:remove', v: boolean): void }>();

const preview = ref<string | null>(null);

function revoke() {
    if (preview.value) URL.revokeObjectURL(preview.value);
    preview.value = null;
}

function onFile(e: Event) {
    const f = (e.target as HTMLInputElement).files?.[0] ?? null;
    revoke();
    if (f) {
        preview.value = URL.createObjectURL(f);
        emit('update:remove', false);
    }
    emit('update:file', f);
}

watch(
    () => props.file,
    (f) => {
        if (!f) revoke();
    },
);
onBeforeUnmount(revoke);

const shown = () => (props.remove ? null : (preview.value ?? (props.url && /^https:/.test(props.url) ? props.url : props.current)));
</script>

<template>
    <div class="flex items-start gap-4">
        <div class="grid size-16 shrink-0 place-items-center overflow-hidden rounded-xl border border-line bg-surface text-subtle">
            <img v-if="shown()" :src="shown()!" alt="Prévia do logotipo" class="size-full object-contain p-1" />
            <ImagePlus v-else class="size-6" aria-hidden="true" />
        </div>
        <div class="min-w-0 flex-1 space-y-2">
            <div>
                <label :for="id" class="label">Logotipo{{ name ? ` de ${name}` : '' }}</label>
                <input :id="id" type="file" accept="image/png,image/jpeg,image/webp" class="block w-full text-sm text-muted file:mr-3 file:min-h-9 file:cursor-pointer file:rounded-lg file:border-0 file:bg-navy-50 file:px-3 file:text-[13px] file:font-semibold file:text-navy-800 hover:file:bg-navy-100" @change="onFile" />
                <p class="hint">PNG, JPG ou WEBP, até 1 MB. Imagens quadradas ficam melhores. Use somente logotipos que você tem autorização para exibir.</p>
                <p v-if="error" class="error-text" role="alert">{{ error }}</p>
            </div>
            <div v-if="!hideUrl">
                <label :for="`${id}-url`" class="label">ou endereço (URL) do logotipo</label>
                <input :id="`${id}-url`" :value="url" type="url" maxlength="500" placeholder="https://" class="field" :aria-invalid="!!urlError" @input="emit('update:url', ($event.target as HTMLInputElement).value)" />
                <p v-if="urlError" class="error-text" role="alert">{{ urlError }}</p>
            </div>
            <label v-if="current" class="flex items-center gap-2 text-sm text-muted"><input :checked="remove" type="checkbox" class="size-4 rounded border-line-strong text-action-600" @change="emit('update:remove', ($event.target as HTMLInputElement).checked)" />Remover o logotipo atual</label>
        </div>
    </div>
</template>
