<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import { ArrowRight, Briefcase, ExternalLink, Search, Sparkles } from 'lucide-vue-next';
import AdSlot from '@/components/AdSlot.vue';
import CategoryIcon from '@/components/CategoryIcon.vue';
import EmptyState from '@/components/EmptyState.vue';
import HeroStage from '@/components/HeroStage.vue';
import JobCard from '@/components/JobCard.vue';
import PlatformFilterStrip from '@/components/PlatformFilterStrip.vue';
import SearchForm from '@/components/SearchForm.vue';
import { useTypewriter } from '@/composables/useTypewriter';
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

const goal = useTypewriter(['sua vaga', 'o estágio', 'o cargo', 'seu lugar', 'o futuro']);

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
        <section class="hero-dots relative flex flex-col overflow-x-clip border-b border-navy-900/15 lg:min-h-[calc(100svh-4rem)]">
            <!-- Formas decorativas (cortadas à parte para a lista de sugestões da busca poder sobrepor a página) -->
            <div class="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
                <div class="absolute -top-24 -right-32 size-[34rem] rounded-full bg-action-100"></div>
                <div class="absolute top-40 -right-10 size-72 rounded-full border-2 border-dashed border-action-500/40"></div>
                <div class="absolute bottom-24 -left-16 size-44 rounded-full bg-amber-200/70"></div>
            </div>

            <div class="container-page relative grid flex-1 grid-cols-[minmax(0,1fr)] items-center gap-10 py-7 sm:py-14 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-10 lg:py-6">
                <div class="min-w-0">
                    <p v-if="stats.jobs" class="inline-flex items-center gap-2 rounded-full border-2 border-navy-900 bg-white py-1 pr-3.5 pl-2.5 text-xs font-bold text-navy-900"><span class="size-2 animate-pulse rounded-full bg-emerald-500" aria-hidden="true" />{{ stats.jobs }} {{ stats.jobs === 1 ? 'vaga aberta' : 'vagas abertas' }} agora</p>

                    <h1 class="mt-4 text-[1.8rem] leading-[1.06] font-extrabold tracking-tight text-navy-900 sm:text-[2.9rem] lg:text-[clamp(2rem,min(5.4vh,4.2vw),3.2rem)]">
                        <span class="sr-only">Encontre a vaga, simule uma entrevista e conquiste o seu próximo emprego.</span>
                        <span aria-hidden="true" class="block">
                            <span class="block text-balance">Encontre a vaga, simule uma entrevista.</span>
                            <!-- "Conquiste" + palavra na mesma linha, mesmo tamanho de fonte; altura fixa e sem quebra: trocar a palavra nunca empurra o resto da página -->
                            <span class="mt-1.5 flex h-[1.3em] items-center gap-[0.3em] leading-none whitespace-nowrap"><span>Conquiste</span><span class="inline-flex h-full min-w-0 items-center -rotate-1 rounded-xl bg-action-600 px-2.5 pb-[0.06em] text-white shadow-[4px_4px_0_0_var(--color-navy-900)] sm:px-3"><span class="min-w-[1ch]">{{ goal }}</span><span class="caret text-white" /></span></span>
                        </span>
                    </h1>

                    <p class="mt-4 max-w-xl text-[15px] leading-relaxed text-muted sm:mt-5 sm:text-lg">Busque vagas, simule a entrevista com uma IA que conhece a vaga e descubra o quanto o seu currículo combina. <strong class="font-bold text-ink">De graça e sem cadastro.</strong></p>

                    <div class="mt-6 max-w-3xl"><SearchForm /></div>

                    <div class="-mx-4 mt-4 flex items-center gap-2 overflow-x-auto px-4 pb-1 text-sm whitespace-nowrap [scrollbar-width:none] sm:mx-0 sm:mt-5 sm:flex-wrap sm:overflow-visible sm:px-0 [&::-webkit-scrollbar]:hidden">
                        <span class="shrink-0 font-semibold text-muted">Em alta:</span>
                        <Link v-for="q in quick" :key="q.href" :href="q.href" class="shrink-0 rounded-full border-2 border-navy-900/15 bg-white px-3.5 py-1 font-semibold text-navy-900 transition hover:border-navy-900 hover:bg-navy-900 hover:text-white">{{ q.label }}</Link>
                    </div>

                </div>

                <HeroStage v-if="heroJobs.length" :jobs="heroJobs" class="min-w-0 lg:ml-auto" />
            </div>

            <!-- Plataformas em preto e branco (cor só ao passar o mouse) -->
            <div v-if="platforms.length" class="relative border-t border-navy-900/15 bg-white">
                <div class="container-page flex flex-wrap items-center justify-center gap-x-6 gap-y-3 py-3.5 sm:gap-x-8 sm:py-4 lg:justify-between">
                    <Link v-for="(p, i) in platforms.slice(0, 8)" :key="p.value" :href="`/vagas?plataforma=${p.value}`" class="items-center opacity-60 grayscale transition hover:opacity-100 hover:grayscale-0" :class="i < 4 ? 'flex' : 'hidden sm:flex'" :title="`Ver vagas via ${p.label}`">
                        <img v-if="p.logo" :src="p.logo" :alt="p.label" class="h-6 w-auto max-w-[6rem] object-contain" />
                        <span v-else class="text-sm font-extrabold text-navy-900">{{ p.label }}</span>
                    </Link>
                </div>
            </div>
        </section>

        <!-- Números reais -->
        <div v-if="stats.jobs" class="container-page relative z-10 mt-8">
            <dl class="grid grid-cols-3 divide-x divide-line overflow-hidden rounded-(--radius-card) border border-navy-900/10 bg-white shadow-(--shadow-pop)">
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
