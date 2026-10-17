<script setup lang="ts">
import { reactive, watch } from 'vue';
import InterviewTool from '@/components/assistant/InterviewTool.vue';
import MatchTool from '@/components/assistant/MatchTool.vue';
import ModalShell from '@/components/assistant/ModalShell.vue';
import QuestionsTool from '@/components/assistant/QuestionsTool.vue';
import type { AssistantTool } from '@/lib/assistant';

// Um pop-up para cada ferramenta de IA da vaga, cada um com identidade própria:
//  - Entrevista: "chamada" em tema escuro · Perguntas: baralho de estudo em tons de papel · Compatibilidade: relatório verde.
// Cada pop-up só é montado na primeira abertura e depois fica no DOM (oculto): o andamento é mantido ao fechar e reabrir.
defineProps<{ slug: string; title: string; company: string }>();
const tool = defineModel<AssistantTool | null>('tool', { default: null });

const used = reactive<Record<AssistantTool, boolean>>({ interview: false, questions: false, match: false });
watch(tool, (v) => v && (used[v] = true), { immediate: true });

const close = () => (tool.value = null);
</script>

<template>
    <ModalShell v-if="used.interview" :open="tool === 'interview'" label="Simular entrevista" panel-class="bg-[#0b1630] text-white sm:max-w-[40rem] md:max-w-[58rem]" backdrop-class="bg-[#050d22]/55" handle-class="bg-white/30" @close="close">
        <InterviewTool :slug="slug" :title="title" :company="company" :open="tool === 'interview'" @switch="tool = $event" @close="close" />
    </ModalShell>

    <ModalShell v-if="used.questions" :open="tool === 'questions'" label="Perguntas prováveis" panel-class="bg-[#fffaf1] sm:max-w-[36rem] md:max-w-[58rem]" backdrop-class="bg-amber-950/30" handle-class="bg-amber-300" @close="close">
        <QuestionsTool :slug="slug" :title="title" :company="company" :open="tool === 'questions'" @switch="tool = $event" @close="close" />
    </ModalShell>

    <ModalShell v-if="used.match" :open="tool === 'match'" label="Verificar compatibilidade do currículo" panel-class="bg-white sm:max-w-[40rem] md:max-w-[58rem]" backdrop-class="bg-emerald-950/35" handle-class="bg-white/40" @close="close">
        <MatchTool :slug="slug" :title="title" :company="company" :open="tool === 'match'" @switch="tool = $event" @close="close" />
    </ModalShell>
</template>
