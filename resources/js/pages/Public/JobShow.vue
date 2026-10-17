<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import { ArrowLeft, Banknote, CalendarDays, ExternalLink, Eye, Lock, Mail, MapPin, Pencil, SearchX, ShieldAlert, Wifi } from 'lucide-vue-next';
import { computed, ref } from 'vue';
import AdSlot from '@/components/AdSlot.vue';
import Breadcrumbs from '@/components/Breadcrumbs.vue';
import CompanyLogo from '@/components/CompanyLogo.vue';
import AssistantHub from '@/components/AssistantHub.vue';
import AssistantTools from '@/components/AssistantTools.vue';
import type { AssistantTool } from '@/lib/assistant';
import JobCard from '@/components/JobCard.vue';
import JobSectionNav from '@/components/JobSectionNav.vue';
import SaveJobButton from '@/components/SaveJobButton.vue';
import PlatformBadge from '@/components/PlatformBadge.vue';
import ShareButtons from '@/components/ShareButtons.vue';
import PublicLayout from '@/layouts/PublicLayout.vue';
import type { Breadcrumb, JobCardData, JobDetailData, Seo } from '@/types';

const props = defineProps<{
    job: JobDetailData;
    closed: boolean;
    preview: boolean;
    assistantEnabled?: boolean;
    videoEnabled?: boolean;
    previewStatus?: string;
    editUrl?: string;
    related: JobCardData[];
    breadcrumbs: Breadcrumb[];
    seo: Seo;
}>();

const shareUrl = computed(() => props.seo.canonical ?? '');

const sections = [
    { key: 'description', title: 'Sobre a oportunidade' },
    { key: 'responsibilities', title: 'Responsabilidades' },
    { key: 'requirements', title: 'Requisitos' },
    { key: 'nice_to_have', title: 'Diferenciais' },
    { key: 'benefits', title: 'Benefícios' },
    { key: 'additional_info', title: 'Informações adicionais' },
] as const;

const visible = computed(() => sections.filter((s) => props.job.sections[s.key]));

// Índice lateral: seções com conteúdo (+ "Sobre a empresa"). Só aparece com 2 ou mais.
const navItems = computed(() => [
    ...visible.value.map((s) => ({ id: `sec-${s.key}`, title: s.title })),
    ...(props.job.company_about ? [{ id: 'sec-company', title: `Sobre a ${props.job.company.name}` }] : []),
]);

// Ferramenta de IA aberta no painel (null = fechado). Trocar de aba não fecha o painel.
const tool = ref<AssistantTool | null>(null);

const byEmail = computed(() => !!props.job.apply_email);
const canApply = computed(() => !props.closed && (!!props.job.apply_url || byEmail.value));
const mailHref = computed(() => `mailto:${props.job.apply_email}?subject=${encodeURIComponent(`Candidatura: ${props.job.title}`)}`);
</script>

<template>
    <PublicLayout :seo="seo">
        <div v-if="preview" class="border-b border-warning-700/20 bg-warning-50">
            <div class="container-page flex flex-wrap items-center justify-between gap-2 py-2.5 text-sm text-warning-700">
                <p class="inline-flex items-center gap-2 font-semibold"><Eye class="size-4" aria-hidden="true" />Pré-visualização administrativa · status: {{ previewStatus }} · não indexável</p>
                <Link v-if="editUrl" :href="editUrl" class="inline-flex items-center gap-1.5 font-bold hover:underline"><Pencil class="size-4" aria-hidden="true" />Voltar para a edição</Link>
            </div>
        </div>

        <div class="container-page py-6 sm:py-8 xl:max-w-[1360px]">
            <Breadcrumbs :items="breadcrumbs" />

            <!-- Vaga encerrada -->
            <section v-if="closed" class="panel mt-5 p-6 sm:p-9" aria-labelledby="encerrada">
                <div class="flex flex-col gap-5 sm:flex-row sm:items-start">
                    <CompanyLogo :name="job.company.name" :url="job.company.logo_url" size="lg" />
                    <div>
                        <p class="t-eyebrow inline-flex items-center gap-1.5 text-warning-700"><ShieldAlert class="size-4" aria-hidden="true" />Oportunidade encerrada</p>
                        <h1 id="encerrada" class="t-h1 mt-1.5 text-ink">{{ job.title }}</h1>
                        <p class="mt-1 text-muted">{{ job.company.name }}</p>
                        <p class="mt-4 max-w-2xl text-[15px] text-ink/85">Esta vaga não está mais disponível no VagasPlus e as candidaturas por aqui foram encerradas. Confira abaixo oportunidades semelhantes que continuam abertas.</p>
                        <div class="mt-5 flex flex-wrap gap-2">
                            <Link v-if="job.category" :href="`/categorias/${job.category.slug}`" class="btn-primary">Mais vagas de {{ job.category.name }}</Link>
                            <Link href="/vagas" class="btn-secondary"><SearchX class="size-4" aria-hidden="true" />Buscar outras vagas</Link>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Vaga aberta -->
            <div v-else class="mt-5 grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] xl:grid-cols-[13.5rem_minmax(0,1fr)_20rem]">
                <!-- Coluna esquerda (xl+): índice das seções e compartilhar, fixos ao rolar -->
                <div class="hidden xl:block">
                    <div class="sticky top-24 space-y-4">
                        <JobSectionNav v-if="navItems.length >= 2" variant="card" :items="navItems" />
                        <div class="card p-3.5"><ShareButtons :url="shareUrl" :title="`${job.title} - ${job.company.name}`" /></div>
                    </div>
                </div>

                <article>
                    <JobSectionNav v-if="navItems.length >= 2" variant="chips" :items="navItems" />

                    <header class="card p-5 sm:p-7">
                        <div class="flex items-start gap-4">
                            <CompanyLogo :name="job.company.name" :url="job.company.logo_url" size="lg" />
                            <div class="min-w-0 flex-1">
                                <h1 class="text-2xl leading-tight font-extrabold tracking-tight text-balance text-ink sm:text-3xl">{{ job.title }}</h1>
                                <p class="mt-1 text-[15px] font-medium text-muted">
                                    <a v-if="job.company_website" :href="job.company_website" target="_blank" rel="noopener noreferrer nofollow" class="hover:text-action-700 hover:underline">{{ job.company.name }}</a>
                                    <template v-else>{{ job.company.name }}</template>
                                </p>
                                <PlatformBadge :platform="job.platform" class="mt-2" />
                            </div>
                            <!-- Salvar em "Minhas vagas": canto superior direito do card -->
                            <SaveJobButton :job="job" variant="corner" class="shrink-0" />
                        </div>

                        <dl class="mt-5 grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
                            <div v-if="job.location" class="flex items-center gap-2.5"><MapPin class="size-4 text-subtle" aria-hidden="true" /><dt class="sr-only">Localização</dt><dd class="font-medium text-ink">{{ job.location }}</dd></div>
                            <div class="flex items-center gap-2.5"><Wifi class="size-4 text-subtle" aria-hidden="true" /><dt class="sr-only">Modalidade</dt><dd class="font-medium text-ink">{{ job.work_mode.label }} · {{ job.employment_type }}<template v-if="job.experience_level"> · {{ job.experience_level }}</template></dd></div>
                            <div class="flex items-center gap-2.5"><Banknote class="size-4 text-subtle" aria-hidden="true" /><dt class="sr-only">Salário</dt><dd :class="job.salary ? 'font-semibold text-ink' : 'text-subtle'">{{ job.salary ?? 'Salário não informado' }}</dd></div>
                            <div class="flex items-center gap-2.5"><CalendarDays class="size-4 text-subtle" aria-hidden="true" /><dt class="sr-only">Publicação</dt><dd class="text-ink">Publicada em {{ job.published_date_label }}</dd></div>
                        </dl>

                        <div class="mt-5 flex flex-wrap items-center gap-3 border-t border-line pt-5">
                            <span class="inline-flex items-center gap-1.5 rounded-full bg-success-50 px-3 py-1 text-xs font-bold text-success-700"><span class="size-1.5 rounded-full bg-success-700" aria-hidden="true" />Vaga aberta</span>
                            <span v-if="job.expires_label" class="text-xs text-muted">Anunciada até {{ job.expires_label }}. A empresa pode encerrar antes.</span>
                        </div>

                        <div v-if="canApply" class="mt-5 space-y-2 lg:hidden">
                            <a v-if="byEmail" :href="mailHref" class="btn-primary btn-lg w-full">Candidatar-se por e-mail<Mail class="size-4.5" aria-hidden="true" /></a>
                            <a v-else :href="job.apply_url!" target="_blank" rel="noopener noreferrer nofollow" class="btn-primary btn-lg w-full">Candidatar-se à vaga<ExternalLink class="size-4.5" aria-hidden="true" /></a>
                        </div>
                    </header>

                    <!-- Celular/tablet: ferramentas de IA logo abaixo do cabeçalho (no desktop ficam na coluna lateral direita) -->
                    <AssistantTools v-if="assistantEnabled || videoEnabled" variant="chips" :text="!!assistantEnabled" :video="!!videoEnabled" class="mt-4 lg:hidden" @pick="tool = $event" />

                    <!-- Anúncio logo abaixo do cabeçalho: visível sem rolar -->
                    <div class="mt-4"><AdSlot placement="job-top" format="leaderboard" /></div>

                    <div class="mt-4 space-y-4">
                        <template v-for="(s, i) in visible" :key="s.key">
                            <section :id="`sec-${s.key}`" class="card scroll-mt-36 p-5 sm:p-7 lg:scroll-mt-28" :aria-labelledby="`sec-${s.key}-t`">
                                <h2 :id="`sec-${s.key}-t`" tabindex="-1" class="t-h2 mb-3 text-ink outline-none">{{ s.title }}</h2>
                                <div class="prose-job" v-html="job.sections[s.key]" />
                            </section>
                            <AdSlot v-if="i === 1" placement="job-mid" format="leaderboard" />
                        </template>

                        <section v-if="job.company_about" id="sec-company" class="card scroll-mt-36 p-5 sm:p-7 lg:scroll-mt-28" aria-labelledby="sec-company-t">
                            <h2 id="sec-company-t" tabindex="-1" class="t-h2 mb-3 text-ink outline-none">Sobre a {{ job.company.name }}</h2>
                            <div class="prose-job" v-html="job.company_about" />
                        </section>
                    </div>

                    <div class="mt-8"><AdSlot placement="job-bottom" format="leaderboard" /></div>
                </article>

                <aside aria-label="Candidatura e compartilhamento">
                    <!-- Coluna da direita sempre fixa ao rolar: candidatura, compartilhar e anúncio quadrado -->
                    <div class="space-y-4 lg:sticky lg:top-20 lg:-m-1 lg:max-h-[calc(100vh-5.5rem)] lg:overflow-y-auto lg:overscroll-contain lg:p-1">
                        <div class="panel p-5">
                            <template v-if="canApply">
                                <a v-if="byEmail" :href="mailHref" class="btn-primary btn-lg w-full">Candidatar-se por e-mail<Mail class="size-4.5" aria-hidden="true" /></a>
                                <a v-else :href="job.apply_url!" target="_blank" rel="noopener noreferrer nofollow" class="btn-primary btn-lg w-full">Candidatar-se à vaga<ExternalLink class="size-4.5" aria-hidden="true" /></a>

                                <p v-if="byEmail" class="mt-3 flex items-start gap-2 text-xs leading-relaxed text-muted">
                                    <Mail class="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
                                    <span>Candidatura por e-mail para <strong class="break-words text-ink">{{ job.apply_email }}</strong>, sem link de inscrição.</span>
                                </p>
                                <p v-else class="mt-3 flex items-start gap-2 text-xs leading-relaxed text-muted">
                                    <Lock class="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
                                    <span :title="`Destino: ${job.apply_host}`">Você será direcionado à página de candidatura, fora do VagasPlus.</span>
                                </p>
                            </template>
                            <p v-else class="rounded-lg bg-surface p-3 text-center text-sm text-muted">Candidatura indisponível.</p>

                        </div>

                        <AssistantTools v-if="assistantEnabled || videoEnabled" variant="card" :text="!!assistantEnabled" :video="!!videoEnabled" class="hidden lg:block" @pick="tool = $event" />

                        <!-- Abaixo de xl a coluna esquerda não existe: o compartilhar fica aqui -->
                        <div class="card p-3.5 xl:hidden"><ShareButtons :url="shareUrl" :title="`${job.title} - ${job.company.name}`" /></div>

                        <!-- Anúncio quadrado (300×250) logo abaixo do compartilhar: sempre presente -->
                        <AdSlot placement="job-side" format="square" />
                    </div>
                </aside>
            </div>

            <section v-if="related.length" class="mt-12" aria-labelledby="relacionadas">
                <h2 id="relacionadas" class="t-h2 mb-5 text-ink">{{ closed ? 'Vagas semelhantes ainda abertas' : 'Vagas relacionadas' }}</h2>
                <div class="grid gap-4 md:grid-cols-2"><JobCard v-for="r in related" :key="r.id" :job="r" /></div>
            </section>

            <div v-if="!closed && !preview" class="mt-8"><Link href="/vagas" class="inline-flex items-center gap-1.5 text-sm font-bold text-action-700 hover:underline"><ArrowLeft class="size-4" aria-hidden="true" />Voltar para todas as vagas</Link></div>
        </div>
        <AssistantHub v-if="assistantEnabled || videoEnabled"v-model:tool="tool" :slug="job.slug" :title="job.title" :company="job.company.name" />
    </PublicLayout>
</template>
