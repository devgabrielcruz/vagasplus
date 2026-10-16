<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import JobForm from '@/components/JobForm.vue';

/**
 * A mesma tela serve para criar e editar. Ao publicar na criação, o Inertia navega para a edição reaproveitando
 * o componente; o formulário guardava o estado antigo (vaga nula) e o "Salvar" quebrava. A chave faz o
 * formulário ser recriado sempre que a vaga muda (criar → editar, ou de uma vaga para outra).
 */
defineOptions({ inheritAttrs: false });

const attrs = useAttrs();
const formKey = computed(() => (attrs.job as { id?: number } | null)?.id ?? 'nova');
// Repassa só as propriedades da página (as compartilhadas pelo Inertia não pertencem ao formulário).
const forward = computed(() => ({ job: attrs.job, aiConfigured: attrs.aiConfigured, categories: attrs.categories, options: attrs.options, validity: attrs.validity }));
</script>

<template>
    <JobForm :key="formKey" v-bind="forward as any" />
</template>
