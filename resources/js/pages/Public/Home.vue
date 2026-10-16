<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import { ArrowRight, Briefcase, ExternalLink, Search, Sparkles } from 'lucide-vue-next';
import AdSlot from '@/components/AdSlot.vue';
import CategoryIcon from '@/components/CategoryIcon.vue';
import EmptyState from '@/components/EmptyState.vue';
import HeroPreview from '@/components/HeroPreview.vue';
import JobCard from '@/components/JobCard.vue';
import PlatformFilterStrip from '@/components/PlatformFilterStrip.vue';
import SearchForm from '@/components/SearchForm.vue';
import PublicLayout from '@/layouts/PublicLayout.vue';
import type { CategorySummary, FilterOptions, JobCardData, PlatformInfo, Seo } from '@/types';

defineProps<{
    featured: JobCardData[];
    recent: JobCardData[];
    categories: CategorySummary[];
    platforms: (PlatformInfo & { count: number })[];
    stats: { jobs: number; companies: number; platforms: number };
    heroJobs: JobCardData[];
    options: FilterOptions;
    seo: Seo;
}>();

const quick = [
    { label: 'Remoto', href: '/vagas?modalidade=remote' },
    { label: 'Híbrido', href: '/vagas?modalidade=hybrid' },
    { label: 'Estágio', href: '/vagas?tipo=internship' },
    { label: 'Júnior', href: '/vagas?nivel=junior' },
    { label: 'CLT', href: '/vagas?tipo=clt' },
];
</script>

<template>
    <PublicLayout :seo="seo">
        <section class="hero-app text-white">
            <div class="container-page grid items-center gap-12 pt-12 pb-20 sm:pt-16 sm:pb-24 lg:grid-cols-[1.15fr_0.85fr] lg:gap-8">
                <div>
                    <p v-if="stats.jobs" class="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] py-1 pr-3.5 pl-2.5 text-xs font-semibold text-navy-100 backdrop-blur"><span class="size-2 animate-pulse rounded-full bg-emerald-400" aria-hidden="true" />{{ stats.jobs }} {{ stats.jobs === 1 ? 'vaga aberta' : 'vagas abertas' }} agora</p>
                    <h1 class="t-display mt-5 max-w-2xl !leading-[1.05] sm:!text-[3.6rem]">Sua próxima oportunidade <span class="text-gradient">começa aqui.</span></h1>
                    <p class="mt-5 max-w-xl text-base text-navy-100/85 sm:text-lg">Encontre vagas, descubra novas possibilidades e vá direto para a candidatura.</p>

                    <div class="mt-8 max-w-3xl"><SearchForm /></div>

                    <div class="mt-5 flex flex-wrap items-center gap-2 text-sm">
                        <span class="text-navy-100/70">Em alta:</span>
                        <Link v-for="q in quick" :key="q.href" :href="q.href" class="rounded-full border border-white/15 bg-white/[0.06] px-3.5 py-1.5 font-medium text-white/90 transition hover:border-white/30 hover:bg-white/15">{{ q.label }}</Link>
                    </div>

                    <div v-if="platforms.length" class="mt-9 flex flex-wrap items-center gap-x-5 gap-y-3">
                        <span class="text-xs font-semibold tracking-widest text-navy-100/60 uppercase">Vagas de</span>
                        <Link v-for="p in platforms.slice(0, 6)" :key="p.value" :href="`/vagas?plataforma=${p.value}`" class="flex items-center gap-2 text-sm font-semibold text-white/85 transition hover:text-white" :title="`Ver vagas via ${p.label}`">
                            <img v-if="p.logo" :src="p.logo" :alt="p.label" class="h-6 w-auto max-w-[5rem] rounded-md object-contain" />{{ p.label }}
                        </Link>
                    </div>
                </div>

                <HeroPreview v-if="heroJobs.length" :jobs="heroJobs" class="hidden sm:block" />
            </div>
        </section>

        <!-- Números reais, sobrepostos ao hero -->
        <div v-if="stats.jobs" class="container-page relative z-10 -mt-9">
            <dl class="grid grid-cols-3 divide-x divide-line overflow-hidden rounded-(--radius-card) border border-line bg-white shadow-(--shadow-pop)">
                <div v-for="s in [{ n: stats.jobs, l: stats.jobs === 1 ? 'vaga aberta' : 'vagas abertas' }, { n: stats.companies, l: stats.companies === 1 ? 'empresa contratando' : 'empresas contratando' }, { n: stats.platforms, l: stats.platforms === 1 ? 'plataforma' : 'plataformas' }]" :key="s.l" class="px-3 py-4 text-center sm:py-5">
                    <dd class="text-2xl font-extrabold tracking-tight text-navy-900 tabular-nums sm:text-3xl">{{ s.n }}</dd>
                    <dt class="mt-0.5 text-xs font-medium text-muted sm:text-sm">{{ s.l }}</dt>
                </div>
            </dl>
        </div>

        <!-- Anúncio 1: leaderboard logo abaixo do hero (acima da dobra no desktop) -->
        <div class="container-page pt-8 pb-2"><AdSlot placement="home-top" format="leaderboard" /></div>

        <div class="container-page">
            <section v-if="platforms.length" aria-labelledby="plataformas" class="pb-2">
                <h2 id="plataformas" class="t-eyebrow mb-3 text-muted">Vagas por plataforma de contratação</h2>
                <PlatformFilterStrip :platforms="platforms" />
            </section>

            <section v-if="featured.length" class="pt-10" aria-labelledby="destaques">
                <div class="mb-5 flex items-center gap-2"><Sparkles class="size-5 text-action-600" aria-hidden="true" /><h2 id="destaques" class="t-h2 text-ink">Vagas em destaque</h2></div>
                <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3"><JobCard v-for="job in featured" :key="job.id" :job="job" /></div>
            </section>

            <section v-if="categories.length" id="categorias" class="scroll-mt-20 pt-14" aria-labelledby="categorias-titulo">
                <div class="mb-5 flex items-end justify-between gap-3">
                    <h2 id="categorias-titulo" class="t-h2 text-ink">Navegue por categoria</h2>
                    <Link href="/categorias" class="btn-secondary btn-sm">Ver todas<ArrowRight class="size-4" aria-hidden="true" /></Link>
                </div>
                <ul class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                    <li v-for="c in categories.slice(0, 8)" :key="c.slug">
                        <Link :href="c.url" class="card flex h-full items-center gap-3 p-3.5 transition hover:border-action-500 hover:shadow-(--shadow-lift)">
                            <span class="grid size-11 shrink-0 place-items-center rounded-xl bg-action-50 text-action-700"><CategoryIcon :name="c.icon" class="size-5" /></span>
                            <span class="min-w-0"><span class="block truncate text-sm font-bold text-ink">{{ c.name }}</span><span class="text-xs text-muted">{{ c.count }} {{ c.count === 1 ? 'vaga' : 'vagas' }}</span></span>
                        </Link>
                    </li>
                </ul>
            </section>

            <div class="py-10"><AdSlot placement="home-mid" format="leaderboard" /></div>

            <section aria-labelledby="recentes">
                <div class="mb-5 flex items-end justify-between gap-3">
                    <h2 id="recentes" class="t-h2 text-ink">Vagas recentes</h2>
                    <Link v-if="recent.length" href="/vagas" class="inline-flex items-center gap-1 text-sm font-bold text-action-700 hover:underline">Ver todas<ArrowRight class="size-4" aria-hidden="true" /></Link>
                </div>
                <div v-if="recent.length" class="grid gap-4 md:grid-cols-2 lg:grid-cols-3"><JobCard v-for="job in recent" :key="job.id" :job="job" /></div>
                <EmptyState v-else :icon="Briefcase" title="Ainda não há vagas abertas" description="Novas oportunidades são publicadas com frequência. Volte em breve." />
                <div v-if="recent.length" class="mt-7 text-center"><Link href="/vagas" class="btn-primary btn-lg"><Search class="size-4.5" aria-hidden="true" />Explorar todas as vagas</Link></div>
            </section>

            <section class="panel mt-16 grid gap-6 p-6 sm:grid-cols-3 sm:p-9" aria-label="Como funciona">
                <div v-for="(step, i) in [
                    { t: 'Busque', d: 'Pesquise por cargo, cidade, modalidade, nível e plataforma, sem criar conta.' },
                    { t: 'Confira os detalhes', d: 'Veja requisitos, benefícios e salário quando divulgado pela empresa.' },
                    { t: 'Candidate-se na fonte', d: 'Você vai direto ao site, plataforma ou e-mail oficial da empresa.' },
                ]" :key="i">
                    <span class="grid size-9 place-items-center rounded-full bg-navy-900 text-sm font-bold text-white">{{ i + 1 }}</span>
                    <h3 class="t-h3 mt-4 text-ink">{{ step.t }}</h3>
                    <p class="mt-1.5 text-sm text-muted">{{ step.d }}</p>
                </div>
            </section>
            <p class="mt-4 flex items-center gap-1.5 text-xs text-subtle"><ExternalLink class="size-3.5" aria-hidden="true" />Ao clicar em candidatar-se, você sai do VagasPlus e segue para o site da empresa ou plataforma de recrutamento.</p>
        </div>
    </PublicLayout>
</template>
