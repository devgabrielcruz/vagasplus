<script setup lang="ts">
import { router } from '@inertiajs/vue3';
import { Briefcase, Building2, MapPin, Tag } from 'lucide-vue-next';
import { computed, onBeforeUnmount, ref } from 'vue';

export interface Suggestion {
    label: string;
    group?: string;
    hint?: string;
    value?: string;
    url?: string;
    logo?: string | null;
    icon?: 'briefcase' | 'building' | 'tag' | 'pin';
    data?: Record<string, unknown>;
}

/**
 * Campo com sugestões conforme o usuário digita (padrão ARIA combobox/listbox).
 * Setas navegam, Enter escolhe, Esc fecha. Digitar livremente continua permitido.
 */
const props = withDefaults(
    defineProps<{
        id: string;
        modelValue: string;
        label: string;
        endpoint: string;
        params?: Record<string, string>;
        placeholder?: string;
        minChars?: number;
        maxlength?: number;
        name?: string;
        required?: boolean;
        invalid?: boolean;
        inputClass?: string;
    }>(),
    { params: () => ({}), minChars: 2, maxlength: 100, placeholder: '', inputClass: 'field' },
);

const emit = defineEmits<{ (e: 'update:modelValue', v: string): void; (e: 'select', s: Suggestion): void }>();

const items = ref<Suggestion[]>([]);
const open = ref(false);
const active = ref(-1);
const loading = ref(false);
let timer: ReturnType<typeof setTimeout> | undefined;
let controller: AbortController | undefined;

const listId = computed(() => `${props.id}-lista`);
const optionId = (i: number) => `${props.id}-opt-${i}`;

const icons = { briefcase: Briefcase, building: Building2, tag: Tag, pin: MapPin };

function onInput(e: Event) {
    const value = (e.target as HTMLInputElement).value;
    emit('update:modelValue', value);
    clearTimeout(timer);

    if (value.trim().length < props.minChars) {
        close();
        return;
    }

    timer = setTimeout(() => fetchItems(value.trim()), 180);
}

async function fetchItems(term: string) {
    controller?.abort();
    controller = new AbortController();
    loading.value = true;

    try {
        const qs = new URLSearchParams({ ...props.params, term });
        const res = await fetch(`${props.endpoint}?${qs}`, { headers: { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' }, signal: controller.signal, credentials: 'same-origin' });
        if (!res.ok) throw new Error(String(res.status));
        const json = (await res.json()) as { items: Suggestion[] };
        items.value = json.items;
        active.value = -1;
        open.value = json.items.length > 0;
    } catch (e) {
        if ((e as Error).name !== 'AbortError') close();
    } finally {
        loading.value = false;
    }
}

function close() {
    open.value = false;
    active.value = -1;
}

function choose(s: Suggestion) {
    close();
    emit('select', s);
    if (s.url) {
        router.visit(s.url);
        return;
    }
    emit('update:modelValue', s.value ?? s.label);
}

function onKey(e: KeyboardEvent) {
    if (!open.value) {
        if (e.key === 'ArrowDown' && items.value.length) open.value = true;
        return;
    }
    if (e.key === 'ArrowDown') {
        e.preventDefault();
        active.value = (active.value + 1) % items.value.length;
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        active.value = (active.value - 1 + items.value.length) % items.value.length;
    } else if (e.key === 'Enter' && active.value >= 0) {
        e.preventDefault();
        choose(items.value[active.value]);
    } else if (e.key === 'Escape') {
        close();
    } else if (e.key === 'Tab') {
        close();
    }
}

// Destaca o trecho digitado sem usar v-html (evita injeção).
function parts(label: string): { text: string; hit: boolean }[] {
    const term = props.modelValue.trim();
    if (!term) return [{ text: label, hit: false }];
    const idx = label.toLocaleLowerCase().indexOf(term.toLocaleLowerCase());
    if (idx < 0) return [{ text: label, hit: false }];
    return [
        { text: label.slice(0, idx), hit: false },
        { text: label.slice(idx, idx + term.length), hit: true },
        { text: label.slice(idx + term.length), hit: false },
    ].filter((p) => p.text);
}

const showGroup = (i: number) => !!items.value[i].group && items.value[i].group !== items.value[i - 1]?.group;

onBeforeUnmount(() => {
    clearTimeout(timer);
    controller?.abort();
});
</script>

<template>
    <div class="relative">
        <label :for="id" class="sr-only">{{ label }}</label>
        <slot name="icon" />
        <input
            :id="id"
            :value="modelValue"
            :name="name"
            type="text"
            role="combobox"
            autocomplete="off"
            :maxlength="maxlength"
            :placeholder="placeholder"
            :required="required"
            :class="inputClass"
            :aria-invalid="invalid"
            aria-autocomplete="list"
            :aria-expanded="open"
            :aria-controls="listId"
            :aria-activedescendant="active >= 0 ? optionId(active) : undefined"
            @input="onInput"
            @keydown="onKey"
            @focus="open = items.length > 0 && modelValue.trim().length >= minChars"
            @blur="close"
        />

        <ul v-show="open" :id="listId" role="listbox" :aria-label="`Sugestões para ${label}`" class="absolute inset-x-0 top-full z-40 mt-1.5 max-h-80 overflow-auto rounded-xl border border-line bg-white py-1.5 text-left shadow-(--shadow-pop)">
            <template v-for="(s, i) in items" :key="`${s.group}-${s.label}-${i}`">
                <li v-if="showGroup(i)" role="presentation" class="px-3 pt-2 pb-1 text-[11px] font-bold tracking-widest text-subtle uppercase">{{ s.group }}</li>
                <li :id="optionId(i)" role="option" :aria-selected="active === i" class="mx-1.5 flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-ink" :class="active === i ? 'bg-action-50' : 'hover:bg-surface'" @mousedown.prevent="choose(s)" @mousemove="active = i">
                    <img v-if="s.logo" :src="s.logo" alt="" class="size-6 shrink-0 rounded-md border border-line bg-white object-contain" loading="lazy" />
                    <component :is="icons[s.icon ?? 'briefcase']" v-else class="size-4 shrink-0 text-subtle" aria-hidden="true" />
                    <span class="min-w-0 flex-1 truncate"><template v-for="(p, k) in parts(s.label)" :key="k"><strong v-if="p.hit" class="font-extrabold text-action-700">{{ p.text }}</strong><template v-else>{{ p.text }}</template></template></span>
                    <span v-if="s.hint" class="shrink-0 text-xs text-muted">{{ s.hint }}</span>
                </li>
            </template>
        </ul>
        <span class="sr-only" role="status" aria-live="polite">{{ open ? `${items.length} sugestões disponíveis` : '' }}</span>
    </div>
</template>
