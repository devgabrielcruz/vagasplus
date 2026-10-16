<script setup lang="ts">
import { Sparkles } from 'lucide-vue-next';
import { ASSISTANT_TOOLS, type AssistantTool } from '@/lib/assistant';

// card: bloco da coluna lateral com os 3 atalhos unidos lado a lado. chips: faixa com rolagem abaixo do cabeçalho (celular/tablet).
defineProps<{ variant: 'card' | 'chips' }>();
const emit = defineEmits<{ pick: [tool: AssistantTool] }>();
</script>

<template>
    <section v-if="variant === 'card'" class="card p-3.5" aria-labelledby="assist-title">
        <h2 id="assist-title" class="mb-3 flex items-center gap-2 px-0.5 text-sm font-extrabold text-ink">
            <Sparkles class="size-4 text-action-700" aria-hidden="true" />Prepare-se para esta vaga
            <span class="ml-auto rounded-full bg-navy-900 px-2 py-0.5 text-[10px] font-extrabold tracking-wide text-white uppercase">IA</span>
        </h2>
        <ul class="grid grid-cols-[1fr_1fr_1.25fr] divide-x divide-line overflow-hidden rounded-2xl border border-line bg-surface/60">
            <li v-for="t in ASSISTANT_TOOLS" :key="t.key" class="flex">
                <button type="button" class="group flex w-full flex-col items-center gap-2 px-1.5 py-3.5 text-center transition-colors hover:bg-white focus-visible:bg-white" :title="t.hint" @click="emit('pick', t.key)">
                    <span class="grid size-11 place-items-center rounded-2xl shadow-(--shadow-xs) transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:scale-105" :class="t.tile"><component :is="t.icon" class="size-5" aria-hidden="true" /></span>
                    <span class="text-xs leading-tight font-bold text-ink">{{ t.label }}</span>
                </button>
            </li>
        </ul>
    </section>

    <div v-else class="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0" role="group" aria-label="Prepare-se para esta vaga (IA)">
        <button v-for="t in ASSISTANT_TOOLS" :key="t.key" type="button" class="flex shrink-0 items-center gap-2 rounded-full border border-line-strong bg-white py-2 pr-4 pl-2 text-sm font-bold text-ink shadow-(--shadow-xs) transition-colors hover:border-navy-700" @click="emit('pick', t.key)">
            <span class="grid size-7 place-items-center rounded-full" :class="t.tile"><component :is="t.icon" class="size-4" aria-hidden="true" /></span>{{ t.label }}
        </button>
    </div>
</template>
