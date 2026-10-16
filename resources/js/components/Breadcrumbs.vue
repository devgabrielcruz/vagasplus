<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import { ChevronRight } from 'lucide-vue-next';
import type { Breadcrumb } from '@/types';

defineProps<{ items: Breadcrumb[] }>();
</script>

<template>
    <nav aria-label="Você está em" class="text-[13px] text-muted">
        <ol class="flex flex-wrap items-center gap-1.5">
            <li v-for="(item, i) in items" :key="i" class="flex min-w-0 items-center gap-1.5">
                <Link v-if="item.url" :href="item.url" class="hover:text-action-700 hover:underline">{{ item.label }}</Link>
                <span v-else class="max-w-[16rem] truncate font-medium text-ink" aria-current="page">{{ item.label }}</span>
                <ChevronRight v-if="i < items.length - 1" class="size-3.5 shrink-0 text-subtle" aria-hidden="true" />
            </li>
        </ol>
    </nav>
</template>
