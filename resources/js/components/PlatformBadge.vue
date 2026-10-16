<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(defineProps<{ platform: { value: string; label: string; color: string; logo: string | null }; variant?: 'chip' | 'plain' | 'large' }>(), { variant: 'chip' });

const text = computed(() => (props.platform.value === 'email' ? 'Candidatura por e-mail' : props.platform.value === 'company_site' ? 'Site da empresa' : `via ${props.platform.label}`));
</script>

<template>
    <span
        class="inline-flex items-center font-semibold whitespace-nowrap"
        :class="{
            'gap-1.5 rounded-full border border-line bg-white py-0.5 pr-2.5 pl-0.5 text-xs text-ink': variant === 'chip',
            'gap-1.5 text-xs text-muted': variant === 'plain',
            'gap-2.5 text-sm text-ink': variant === 'large',
        }"
    >
        <!-- Logos fictícias de demonstração em /img/platforms/*.svg (substitua pelos arquivos oficiais licenciados) -->
        <img v-if="platform.logo" :src="platform.logo" :alt="platform.label" loading="lazy" decoding="async" class="w-auto shrink-0 rounded-md object-contain" :class="variant === 'large' ? 'h-9 max-w-[6rem]' : 'h-5 max-w-[3.5rem]'" />
        <span v-else class="grid shrink-0 place-items-center rounded-md font-extrabold text-white" :class="variant === 'large' ? 'size-9 text-sm' : 'size-5 text-[11px]'" :style="{ backgroundColor: platform.color }" aria-hidden="true">{{ platform.label[0] }}</span>
        {{ text }}
    </span>
</template>
