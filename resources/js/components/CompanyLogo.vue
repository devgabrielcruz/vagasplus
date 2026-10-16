<script setup lang="ts">
import { computed, ref } from 'vue';

const props = withDefaults(defineProps<{ name: string; url?: string | null; size?: 'sm' | 'md' | 'lg' }>(), { size: 'md', url: null });

const failed = ref(false);

const initials = computed(() =>
    props.name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((w) => w[0]?.toUpperCase())
        .join(''),
);

// Cor estável por empresa (mesmo nome = mesma cor), tons suaves com contraste AA.
const tone = computed(() => {
    let h = 0;
    for (const c of props.name) h = (h * 31 + c.charCodeAt(0)) % 360;
    return { background: `hsl(${h} 70% 94%)`, color: `hsl(${h} 55% 28%)` };
});

const box = { sm: 'size-10 rounded-lg text-sm', md: 'size-12 rounded-xl text-base', lg: 'size-20 rounded-2xl text-2xl' };
</script>

<template>
    <div class="grid shrink-0 place-items-center overflow-hidden border border-line bg-white font-extrabold shadow-(--shadow-xs)" :class="box[size]" :style="url && !failed ? undefined : tone">
        <img v-if="url && !failed" :src="url" :alt="`Logotipo de ${name}`" loading="lazy" decoding="async" referrerpolicy="no-referrer" class="size-full object-contain p-1.5" @error="failed = true" />
        <span v-else aria-hidden="true">{{ initials }}</span>
    </div>
</template>
