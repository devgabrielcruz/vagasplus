<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import { LayoutGrid } from 'lucide-vue-next';
import AdSlot from '@/components/AdSlot.vue';
import Breadcrumbs from '@/components/Breadcrumbs.vue';
import CategoryIcon from '@/components/CategoryIcon.vue';
import EmptyState from '@/components/EmptyState.vue';
import PublicLayout from '@/layouts/PublicLayout.vue';
import type { Breadcrumb, CategorySummary, Seo } from '@/types';

defineProps<{ categories: CategorySummary[]; breadcrumbs: Breadcrumb[]; seo: Seo }>();
</script>

<template>
    <PublicLayout :seo="seo">
        <div class="container-page py-6 sm:py-10">
            <Breadcrumbs :items="breadcrumbs" />
            <header class="mt-5">
                <h1 class="t-h1 text-ink">Vagas por categoria</h1>
                <p class="mt-2 max-w-2xl text-muted">Escolha uma área de atuação e veja as oportunidades abertas agora.</p>
            </header>

            <div class="mt-6"><AdSlot placement="categories-top" format="leaderboard" /></div>

            <ul v-if="categories.length" class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <li v-for="c in categories" :key="c.slug">
                    <Link :href="c.url" class="card group flex h-full items-center gap-4 p-5 transition hover:-translate-y-0.5 hover:border-action-500 hover:shadow-(--shadow-lift)">
                        <span class="grid size-14 shrink-0 place-items-center rounded-2xl bg-action-50 text-action-700 transition group-hover:bg-action-600 group-hover:text-white"><CategoryIcon :name="c.icon" class="size-6" /></span>
                        <span class="min-w-0"><span class="t-h3 block text-ink">{{ c.name }}</span><span class="text-sm text-muted">{{ c.count }} {{ c.count === 1 ? 'vaga aberta' : 'vagas abertas' }}</span></span>
                    </Link>
                </li>
            </ul>
            <div v-else class="mt-8"><EmptyState :icon="LayoutGrid" title="Nenhuma categoria com vagas abertas" description="Volte em breve ou veja todas as vagas."><Link href="/vagas" class="btn-primary">Ver todas as vagas</Link></EmptyState></div>
        </div>
    </PublicLayout>
</template>
