<script setup lang="ts">
/**
 * Logotipo oficial (public/img/logo.png, fundo transparente, letras escuras).
 * Em fundos escuros (`light`), vai sobre uma pílula branca para manter o contraste.
 */
withDefaults(defineProps<{ light?: boolean }>(), { light: false });
</script>

<template>
    <span class="flex w-fit items-center" :class="light ? 'rounded-xl bg-white px-3 py-2' : ''">
        <img src="/img/logo.png" alt="VagasPlus" width="1654" height="315" class="h-6 w-auto sm:h-7" decoding="async" />
    </span>
</template>
