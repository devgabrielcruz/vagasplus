<script setup lang="ts">
import { Link, usePage } from '@inertiajs/vue3';
import { SearchX } from 'lucide-vue-next';
import AdSlot from '@/components/AdSlot.vue';
import Breadcrumbs from '@/components/Breadcrumbs.vue';
import EmptyState from '@/components/EmptyState.vue';
import FilterBar from '@/components/FilterBar.vue';
import JobCard from '@/components/JobCard.vue';
import Pagination from '@/components/Pagination.vue';
import PlatformFilterStrip from '@/components/PlatformFilterStrip.vue';
import PublicLayout from '@/layouts/PublicLayout.vue';
import type { Breadcrumb, FilterOptions, JobCardData, Paginated, Seo } from '@/types';

const props = defineProps<{
    heading: string;
    intro: string | null;
    jobs: Paginated<JobCardData>;
    filters: Record<string, string>;
    options: FilterOptions;
    breadcrumbs: Breadcrumb[];
    seo: Seo;
    lockedCategory?: string;
    hideLocationFilter?: boolean;
}>();

const action = usePage().url.split('?')[0];
const hasFilters = () => Object.keys(props.filters ?? {}).length > 0;
</script>

<template>
    <PublicLayout :seo="seo">
        <div class="container-page py-6 sm:py-8">
            <Breadcrumbs :items="breadcrumbs" />

            <header class="mt-4">
                <h1 class="t-h1 text-ink">{{ heading }}</h1>
                <p v-if="intro" class="mt-2 max-w-2xl text-muted">{{ intro }}</p>
                <p class="mt-1.5 text-sm text-muted" aria-live="polite">
                    <template v-if="jobs.total">{{ jobs.total }} {{ jobs.total === 1 ? 'vaga encontrada' : 'vagas encontradas' }}<template v-if="jobs.last_page > 1"> · mostrando {{ jobs.from }}–{{ jobs.to }}</template></template>
                    <template v-else>Nenhuma vaga encontrada</template>
                </p>
            </header>

            <div class="mt-5"><FilterBar :action="action" :filters="filters" :options="options" :locked-category="lockedCategory" :hide-location="hideLocationFilter" /></div>
            <div v-if="options.platforms.length" class="mt-4"><PlatformFilterStrip :platforms="options.platforms" :active="filters.plataforma" /></div>

            <!-- Banner acima das vagas: visível sem rolar -->
            <div v-if="jobs.data.length" class="mt-6"><AdSlot placement="list-top" format="leaderboard" /></div>

            <div v-if="jobs.data.length" class="mt-4 grid gap-4 md:grid-cols-2">
                <template v-for="(job, i) in jobs.data" :key="job.id">
                    <!-- Card de anúncio no meio da lista (ou ao fim dela, se houver poucas vagas) -->
                    <AdSlot v-if="i === 3" placement="list-card" format="card" />
                    <AdSlot v-if="i === 9" placement="list-card-2" format="card" />
                    <JobCard :job="job" />
                </template>
                <AdSlot v-if="jobs.data.length <= 3" placement="list-card" format="card" />
            </div>

            <div v-else class="mt-6">
                <EmptyState :icon="SearchX" :title="hasFilters() ? 'Nenhuma vaga com esses filtros' : 'Nenhuma vaga aberta por aqui'" :description="hasFilters() ? 'Tente remover algum filtro ou buscar por um termo mais amplo.' : 'Novas oportunidades são publicadas com frequência. Volte em breve.'">
                    <Link href="/vagas" class="btn-primary">Ver todas as vagas</Link>
                </EmptyState>
            </div>

            <div class="mt-8"><Pagination :meta="jobs" /></div>
        </div>
    </PublicLayout>
</template>
