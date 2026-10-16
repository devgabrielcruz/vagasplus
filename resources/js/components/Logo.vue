<script setup lang="ts">
/**
 * Logotipo oficial (public/img/logo.png, fundo transparente, letras escuras).
 * Em fundos escuros (`light`), vai sobre uma pílula branca para manter o contraste.
 */
withDefaults(defineProps<{ light?: boolean }>(), { light: false });
</script>

<template>
    <span class="inline-flex items-center" :class="light ? 'rounded-xl bg-white px-3 py-2' : ''">
        <img src="/img/logo.png" alt="VagasPlus" width="1399" height="352" class="h-7 w-auto translate-y-[15%] sm:h-8" decoding="async" />
    </span>
</template>
