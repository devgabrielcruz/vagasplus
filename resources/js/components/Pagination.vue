<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import { ChevronLeft, ChevronRight } from 'lucide-vue-next';
import { computed } from 'vue';
import type { Paginated } from '@/types';

const props = defineProps<{ meta: Pick<Paginated<unknown>, 'current_page' | 'last_page' | 'links'> & { prev_url?: string | null; next_url?: string | null } }>();

// Insere reticências quando há saltos entre páginas.
const items = computed(() => {
    const out: ({ gap: true } | { page: number; url: string; active: boolean })[] = [];
    let last = 0;
    for (const l of props.meta.links) {
        if (last && l.page - last > 1) out.push({ gap: true });
        out.push(l);
        last = l.page;
    }
    return out;
});
</script>

<template>
    <nav v-if="meta.last_page > 1" aria-label="Paginação" class="flex flex-wrap items-center justify-center gap-1.5">
        <Link v-if="meta.prev_url" :href="meta.prev_url" rel="prev" class="btn-secondary btn-sm"><ChevronLeft class="size-4" aria-hidden="true" />Anterior</Link>
        <template v-for="(item, i) in items" :key="i">
            <span v-if="'gap' in item" class="px-1 text-subtle" aria-hidden="true">…</span>
            <Link
                v-else
                :href="item.url"
                :aria-current="item.active ? 'page' : undefined"
                :aria-label="`Página ${item.page}`"
                class="grid min-h-9 min-w-9 place-items-center rounded-(--radius-control) px-2 text-sm font-semibold"
                :class="item.active ? 'bg-navy-900 text-white' : 'text-muted hover:bg-navy-50 hover:text-ink'"
            >{{ item.page }}</Link>
        </template>
        <Link v-if="meta.next_url" :href="meta.next_url" rel="next" class="btn-secondary btn-sm">Próxima<ChevronRight class="size-4" aria-hidden="true" /></Link>
    </nav>
</template>
