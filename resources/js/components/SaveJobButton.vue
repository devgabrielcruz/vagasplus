<script setup lang="ts">
import { Bookmark, BookmarkCheck } from 'lucide-vue-next';
import { useSavedJobs } from '@/composables/useSavedJobs';
import type { JobCardData } from '@/types';

/** Botão de salvar/remover a vaga em "Minhas vagas". Variantes: ícone (cards) e texto (página da vaga). */
withDefaults(defineProps<{ job: JobCardData; variant?: 'icon' | 'corner' | 'text' }>(), { variant: 'icon' });

const { isSaved, toggle } = useSavedJobs();
</script>

<template>
    <button
        v-if="variant === 'icon'"
        type="button"
        class="relative z-10 grid size-9 place-items-center rounded-lg transition-colors hover:bg-action-50"
        :class="isSaved(job.slug) ? 'text-action-700' : 'text-subtle hover:text-action-700'"
        :aria-pressed="isSaved(job.slug)"
        :aria-label="isSaved(job.slug) ? `Remover ${job.title} de Minhas vagas` : `Salvar ${job.title} em Minhas vagas`"
        :title="isSaved(job.slug) ? 'Remover de Minhas vagas' : 'Salvar para ver depois'"
        @click.stop.prevent="toggle(job)"
    >
        <BookmarkCheck v-if="isSaved(job.slug)" class="size-5 fill-action-100" aria-hidden="true" /><Bookmark v-else class="size-5" aria-hidden="true" />
    </button>

    <!-- Canto do card da vaga: marcador com borda, mais visível que o dos cards da listagem -->
    <button
        v-else-if="variant === 'corner'"
        type="button"
        class="grid size-11 place-items-center rounded-xl border transition-colors"
        :class="isSaved(job.slug) ? 'border-action-600 bg-action-50 text-action-700' : 'border-line-strong bg-white text-muted hover:border-action-600 hover:text-action-700'"
        :aria-pressed="isSaved(job.slug)"
        :aria-label="isSaved(job.slug) ? 'Remover vaga de Minhas vagas' : 'Salvar vaga em Minhas vagas'"
        :title="isSaved(job.slug) ? 'Salva — clique para remover' : 'Salvar para ver depois'"
        @click="toggle(job)"
    >
        <BookmarkCheck v-if="isSaved(job.slug)" class="size-5 fill-action-100" aria-hidden="true" /><Bookmark v-else class="size-5" aria-hidden="true" />
    </button>

    <button v-else type="button" class="btn-secondary w-full" :aria-pressed="isSaved(job.slug)" @click="toggle(job)">
        <BookmarkCheck v-if="isSaved(job.slug)" class="size-4.5 fill-action-100 text-action-700" aria-hidden="true" /><Bookmark v-else class="size-4.5" aria-hidden="true" />
        {{ isSaved(job.slug) ? 'Vaga salva' : 'Salvar para ver depois' }}
    </button>
</template>
