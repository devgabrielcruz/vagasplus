<script setup lang="ts">
import type { Component } from 'vue';

defineProps<{ title: string; description?: string; icon?: Component }>();
</script>

<template>
    <div class="card flex flex-col items-center px-6 py-12 text-center">
        <div v-if="icon" class="mb-4 grid size-12 place-items-center rounded-full bg-navy-50 text-navy-700"><component :is="icon" class="size-6" aria-hidden="true" /></div>
        <h2 class="text-lg font-bold text-ink">{{ title }}</h2>
        <p v-if="description" class="mt-1.5 max-w-md text-sm text-muted">{{ description }}</p>
        <div class="mt-5 flex flex-wrap justify-center gap-2"><slot /></div>
    </div>
</template>
