<script setup lang="ts">
import { router } from '@inertiajs/vue3';
import { Search, SlidersHorizontal, X } from 'lucide-vue-next';
import { computed, reactive, ref } from 'vue';
import Autocomplete from '@/components/Autocomplete.vue';
import type { FilterOptions } from '@/types';

const props = defineProps<{
    action: string;
    filters: Record<string, string>;
    options: FilterOptions;
    lockedCategory?: string;
    hideLocation?: boolean;
}>();

const form = reactive({
    q: props.filters.q ?? '',
    local: props.filters.local ?? '',
    categoria: props.filters.categoria ?? '',
    modalidade: props.filters.modalidade ?? '',
    tipo: props.filters.tipo ?? '',
    nivel: props.filters.nivel ?? '',
    plataforma: props.filters.plataforma ?? '',
});

const advancedOpen = ref(!!(form.categoria || form.modalidade || form.tipo || form.nivel || form.plataforma));
const activeCount = computed(() => Object.entries(form).filter(([k, v]) => v && !(k === 'categoria' && props.lockedCategory)).length);

function submit() {
    const params: Record<string, string> = {};
    for (const [k, v] of Object.entries(form)) {
        if (k === 'categoria' && props.lockedCategory) continue;
        if (typeof v === 'string' && v.trim()) params[k] = v.trim();
    }
    router.get(props.action, params, { preserveScroll: false });
}

function clear() {
    Object.keys(form).forEach((k) => ((form as Record<string, string>)[k] = ''));
    router.get(props.action);
}
</script>

<template>
    <form method="get" :action="action" role="search" aria-label="Filtrar vagas" class="card p-3 sm:p-4" @submit.prevent="submit">
        <div class="flex flex-col gap-2 md:flex-row">
            <div class="relative flex-1">
                <Autocomplete id="f-q" v-model="form.q" name="q" label="Cargo, habilidade ou empresa" endpoint="/sugestoes" :params="{ field: 'q' }" placeholder="Cargo, habilidade ou empresa" input-class="field pl-9">
                    <template #icon><Search class="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-subtle" aria-hidden="true" /></template>
                </Autocomplete>
            </div>
            <div v-if="!hideLocation" class="flex-1 md:max-w-xs">
                <Autocomplete id="f-local" v-model="form.local" name="local" label="Cidade ou estado" endpoint="/sugestoes" :params="{ field: 'local' }" placeholder="Cidade ou estado" />
            </div>
            <div class="flex gap-2">
                <button type="button" class="btn-secondary flex-1 md:flex-none" :aria-expanded="advancedOpen" aria-controls="filtros-avancados" @click="advancedOpen = !advancedOpen">
                    <SlidersHorizontal class="size-4" aria-hidden="true" />Filtros
                </button>
                <button type="submit" class="btn-primary flex-1 md:flex-none">Buscar</button>
            </div>
        </div>

        <div v-show="advancedOpen" id="filtros-avancados" class="mt-3 grid gap-3 border-t border-line pt-3 sm:grid-cols-2 lg:grid-cols-3">
            <div v-if="!lockedCategory">
                <label for="f-cat" class="label">Categoria</label>
                <select id="f-cat" v-model="form.categoria" class="field"><option value="">Todas</option><option v-for="o in options.categories" :key="o.value" :value="o.value">{{ o.label }}</option></select>
            </div>
            <div>
                <label for="f-mod" class="label">Modalidade</label>
                <select id="f-mod" v-model="form.modalidade" class="field"><option value="">Todas</option><option v-for="o in options.work_modes" :key="o.value" :value="o.value">{{ o.label }}</option></select>
            </div>
            <div>
                <label for="f-tipo" class="label">Tipo de contratação</label>
                <select id="f-tipo" v-model="form.tipo" class="field"><option value="">Todos</option><option v-for="o in options.employment_types" :key="o.value" :value="o.value">{{ o.label }}</option></select>
            </div>
            <div>
                <label for="f-plat" class="label">Plataforma de contratação</label>
                <select id="f-plat" v-model="form.plataforma" class="field"><option value="">Todas</option><option v-for="o in options.platforms" :key="o.value" :value="o.value">{{ o.label }} ({{ o.count }})</option></select>
            </div>
            <div>
                <label for="f-nivel" class="label">Nível de experiência</label>
                <select id="f-nivel" v-model="form.nivel" class="field"><option value="">Todos</option><option v-for="o in options.experience_levels" :key="o.value" :value="o.value">{{ o.label }}</option></select>
            </div>
        </div>

        <div v-if="activeCount" class="mt-3 flex items-center justify-between text-sm">
            <span class="text-muted">{{ activeCount }} {{ activeCount === 1 ? 'filtro ativo' : 'filtros ativos' }}</span>
            <button type="button" class="inline-flex items-center gap-1 font-semibold text-action-700 hover:underline" @click="clear"><X class="size-4" aria-hidden="true" />Limpar filtros</button>
        </div>
    </form>
</template>
