<script setup lang="ts">
defineProps<{ id: string; label: string; error?: string; hint?: string; required?: boolean }>();
</script>

<template>
    <div>
        <label :for="id" class="label">{{ label }}<span v-if="required" class="text-danger-700" aria-hidden="true"> *</span><span v-if="required" class="sr-only"> (obrigatório)</span></label>
        <slot :described-by="[hint ? `${id}-hint` : '', error ? `${id}-erro` : ''].filter(Boolean).join(' ') || undefined" :invalid="!!error" />
        <p v-if="hint && !error" :id="`${id}-hint`" class="hint">{{ hint }}</p>
        <p v-if="error" :id="`${id}-erro`" class="error-text" role="alert">{{ error }}</p>
    </div>
</template>
