<script setup lang="ts">
import { Bold, Italic, Link2, List, ListOrdered, RemoveFormatting } from 'lucide-vue-next';
import { onMounted, ref, watch } from 'vue';

/**
 * Editor simples de formatação controlada (negrito, itálico, listas, link).
 * O HTML é sanitizado novamente no servidor; aqui só facilitamos a edição.
 */
const props = defineProps<{ modelValue: string | null; id: string; label: string; invalid?: boolean; minHeight?: string }>();
const emit = defineEmits<{ (e: 'update:modelValue', v: string): void }>();

const el = ref<HTMLDivElement | null>(null);
const mounted = ref(false);

onMounted(() => {
    if (el.value) el.value.innerHTML = props.modelValue ?? '';
    mounted.value = true;
});

// Atualização externa (ex.: reset do formulário) sem mover o cursor durante a digitação.
watch(
    () => props.modelValue,
    (v) => {
        if (el.value && (v ?? '') !== el.value.innerHTML && document.activeElement !== el.value) el.value.innerHTML = v ?? '';
    },
);

function sync() {
    const html = el.value?.innerHTML ?? '';
    emit('update:modelValue', html === '<br>' ? '' : html);
}

function run(command: string, value?: string) {
    el.value?.focus();
    document.execCommand(command, false, value);
    sync();
}

function link() {
    const url = window.prompt('Endereço do link (https://...)');
    if (!url) return;
    if (!/^https?:\/\//i.test(url) && !/^mailto:/i.test(url)) {
        window.alert('Use um endereço que comece com https://');
        return;
    }
    run('createLink', url);
}

function paste(e: ClipboardEvent) {
    e.preventDefault();
    const text = e.clipboardData?.getData('text/plain') ?? '';
    document.execCommand('insertText', false, text);
}

const tools = [
    { label: 'Negrito', icon: Bold, action: () => run('bold') },
    { label: 'Itálico', icon: Italic, action: () => run('italic') },
    { label: 'Lista com marcadores', icon: List, action: () => run('insertUnorderedList') },
    { label: 'Lista numerada', icon: ListOrdered, action: () => run('insertOrderedList') },
    { label: 'Inserir link', icon: Link2, action: link },
    { label: 'Limpar formatação', icon: RemoveFormatting, action: () => run('removeFormat') },
];
</script>

<template>
    <div class="overflow-hidden rounded-(--radius-control) border bg-white focus-within:border-action-600 focus-within:ring-2 focus-within:ring-action-100" :class="invalid ? 'border-danger-700' : 'border-line-strong'">
        <div class="flex flex-wrap gap-0.5 border-b border-line bg-surface p-1" role="toolbar" :aria-label="`Formatação de ${label}`">
            <button v-for="t in tools" :key="t.label" type="button" class="grid size-9 place-items-center rounded-md text-muted hover:bg-white hover:text-ink" :title="t.label" :aria-label="t.label" @mousedown.prevent @click="t.action"><component :is="t.icon" class="size-4" /></button>
        </div>
        <div :id="id" ref="el" contenteditable="true" role="textbox" aria-multiline="true" :aria-label="label" :aria-invalid="invalid" class="prose-job px-3 py-2.5 text-sm outline-none" :style="{ minHeight: minHeight ?? '9rem' }" @input="sync" @blur="sync" @paste="paste" />
    </div>
</template>
