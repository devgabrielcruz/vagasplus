<script setup lang="ts">
import { router } from '@inertiajs/vue3';
import { MapPin, Search } from 'lucide-vue-next';
import { reactive } from 'vue';
import Autocomplete from '@/components/Autocomplete.vue';

const props = withDefaults(defineProps<{ q?: string; local?: string }>(), { q: '', local: '' });

const form = reactive({ q: props.q, local: props.local });

// Funciona sem JavaScript (GET nativo para /vagas); com JS usa navegação do Inertia.
function submit() {
    const params: Record<string, string> = {};
    if (form.q.trim()) params.q = form.q.trim();
    if (form.local.trim()) params.local = form.local.trim();
    router.get('/vagas', params);
}
</script>

<template>
    <form method="get" action="/vagas" role="search" class="flex flex-col gap-2 rounded-[1.4rem] bg-white p-2.5 shadow-[0_20px_50px_-15px_rgb(0_0_0/0.5)] sm:flex-row sm:items-center" @submit.prevent="submit">
        <div class="flex-1">
            <Autocomplete id="hero-q" v-model="form.q" name="q" label="Cargo, habilidade ou palavra-chave" endpoint="/sugestoes" :params="{ field: 'q' }" placeholder="Cargo, habilidade ou empresa" input-class="field border-transparent pl-10 focus:border-action-600 sm:min-h-12">
                <template #icon><Search class="pointer-events-none absolute top-1/2 left-3.5 size-4.5 -translate-y-1/2 text-subtle" aria-hidden="true" /></template>
            </Autocomplete>
        </div>
        <div class="hidden h-7 w-px bg-line sm:block" aria-hidden="true" />
        <div class="flex-1">
            <Autocomplete id="hero-local" v-model="form.local" name="local" label="Cidade ou estado" endpoint="/sugestoes" :params="{ field: 'local' }" placeholder="Cidade ou estado (ex.: Curitiba ou PR)" input-class="field border-transparent pl-10 focus:border-action-600 sm:min-h-12">
                <template #icon><MapPin class="pointer-events-none absolute top-1/2 left-3.5 size-4.5 -translate-y-1/2 text-subtle" aria-hidden="true" /></template>
            </Autocomplete>
        </div>
        <button type="submit" class="btn-primary btn-lg w-full sm:w-auto"><Search class="size-4.5" aria-hidden="true" />Buscar vagas</button>
    </form>
</template>
