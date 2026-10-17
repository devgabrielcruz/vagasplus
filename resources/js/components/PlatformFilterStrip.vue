<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import PlatformBadge from '@/components/PlatformBadge.vue';
import type { PlatformInfo } from '@/types';

defineProps<{ platforms: (PlatformInfo & { count: number })[]; active?: string }>();
</script>

<template>
    <nav v-if="platforms.length" aria-label="Filtrar por plataforma de contratação">
        <ul class="flex flex-wrap gap-2">
            <li v-for="p in platforms" :key="p.value">
                <Link :href="`/vagas?plataforma=${p.value}`" :aria-current="active === p.value ? 'true' : undefined" class="inline-flex min-h-10 items-center gap-2 rounded-full border bg-white pr-3 pl-1.5 text-sm font-semibold transition hover:border-action-500 hover:shadow-(--shadow-card)" :class="active === p.value ? 'border-action-600 ring-2 ring-action-100' : 'border-navy-900/20'">
                    <PlatformBadge :platform="p" variant="plain" class="!text-sm !font-semibold !text-ink" />
                    <span class="rounded-full bg-surface px-1.5 text-xs text-muted tabular-nums">{{ p.count }}</span>
                </Link>
            </li>
        </ul>
    </nav>
</template>
