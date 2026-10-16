<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import { Bookmark, Loader2, Trash2, X } from 'lucide-vue-next';
import { computed, onMounted, ref, watch } from 'vue';
import Breadcrumbs from '@/components/Breadcrumbs.vue';
import CompanyLogo from '@/components/CompanyLogo.vue';
import ConfirmDialog from '@/components/ConfirmDialog.vue';
import EmptyState from '@/components/EmptyState.vue';
import JobCard from '@/components/JobCard.vue';
import { type SavedJob, useSavedJobs } from '@/composables/useSavedJobs';
import PublicLayout from '@/layouts/PublicLayout.vue';
import type { JobCardData, Seo } from '@/types';

defineProps<{ seo: Seo }>();

const { items, remove, clear } = useSavedJobs();

const ready = ref(false); // lista lida do navegador
const loading = ref(false);
const failed = ref(false);
const open = ref<Record<string, JobCardData>>({});
const closed = ref<Set<string>>(new Set());
const confirmClear = ref(false);
let checked = '';

// Pergunta ao servidor quais vagas salvas continuam abertas (envia só os identificadores).
async function check() {
    const slugs = items.value.map((j) => j.slug);
    const signature = slugs.join('|');
    if (!slugs.length || signature === checked) return;
    checked = signature;
    loading.value = true;
    failed.value = false;

    try {
        const qs = new URLSearchParams();
        slugs.forEach((s) => qs.append('slugs[]', s));
        const res = await fetch(`/minhas-vagas/consultar?${qs}`, { headers: { Accept: 'application/json' }, credentials: 'same-origin' });
        if (!res.ok) throw new Error(String(res.status));
        const json = (await res.json()) as { open: JobCardData[]; closed: string[] };
        open.value = Object.fromEntries(json.open.map((j) => [j.slug, j]));
        closed.value = new Set(json.closed);
    } catch {
        failed.value = true;
        checked = '';
    } finally {
        loading.value = false;
    }
}

onMounted(() => {
    // useSavedJobs carrega o localStorage em onMounted; espera um tick.
    setTimeout(() => {
        ready.value = true;
        check();
    }, 0);
});
watch(() => items.value.length, () => ready.value && check());

type Row = { kind: 'open'; card: JobCardData } | { kind: 'closed'; saved: SavedJob } | { kind: 'pending'; saved: SavedJob };

const rows = computed<Row[]>(() =>
    items.value.map((s) => (open.value[s.slug] ? { kind: 'open', card: open.value[s.slug] } : closed.value.has(s.slug) ? { kind: 'closed', saved: s } : { kind: 'pending', saved: s })),
);

const closedCount = computed(() => rows.value.filter((r) => r.kind === 'closed').length);

function removeClosed() {
    items.value.filter((s) => closed.value.has(s.slug)).forEach((s) => remove(s.slug));
}
</script>

<template>
    <PublicLayout :seo="seo">
        <div class="container-page py-6 sm:py-10">
            <Breadcrumbs :items="[{ label: 'Início', url: '/' }, { label: 'Minhas vagas', url: null }]" />

            <header class="mt-5 flex flex-wrap items-end justify-between gap-3">
                <div>
                    <h1 class="t-h1 text-ink">Minhas vagas</h1>
                    <p class="mt-1.5 text-sm text-muted" aria-live="polite">
                        <template v-if="!ready">Carregando…</template>
                        <template v-else-if="items.length">{{ items.length }} {{ items.length === 1 ? 'vaga salva' : 'vagas salvas' }} neste navegador</template>
                        <template v-else>Nenhuma vaga salva</template>
                    </p>
                </div>
                <div v-if="items.length" class="flex flex-wrap gap-2">
                    <button v-if="closedCount" type="button" class="btn-secondary btn-sm" @click="removeClosed"><X class="size-4" aria-hidden="true" />Remover encerradas ({{ closedCount }})</button>
                    <button type="button" class="btn-secondary btn-sm text-danger-700 hover:border-danger-700 hover:bg-danger-50" @click="confirmClear = true"><Trash2 class="size-4" aria-hidden="true" />Limpar lista</button>
                </div>
            </header>

            <p class="mt-4 rounded-xl border border-line bg-white px-4 py-3 text-xs text-muted">As vagas salvas ficam guardadas <strong class="text-ink">somente neste navegador</strong> (nada é enviado ou guardado em conta). Se você limpar os dados do navegador ou usar outro aparelho, a lista não estará lá.</p>

            <div v-if="ready && !items.length" class="mt-8">
                <EmptyState :icon="Bookmark" title="Você ainda não salvou nenhuma vaga" description="Toque no marcador de qualquer vaga para guardá-la aqui e ver depois.">
                    <Link href="/vagas" class="btn-primary">Ver vagas abertas</Link>
                </EmptyState>
            </div>

            <p v-if="failed" class="mt-6 rounded-lg bg-warning-50 p-3 text-sm font-medium text-warning-700" role="alert">Não foi possível conferir se as vagas ainda estão abertas. Mostrando o que foi salvo; tente recarregar a página.</p>

            <div v-if="items.length" class="relative mt-6 grid gap-4 md:grid-cols-2" :aria-busy="loading">
                <template v-for="r in rows" :key="r.kind === 'open' ? r.card.slug : r.saved.slug">
                    <JobCard v-if="r.kind === 'open'" :job="r.card" />

                    <!-- Encerrada (ou ainda sendo conferida): resumo guardado no navegador -->
                    <article v-else class="card relative flex gap-3.5 p-4 sm:p-5" :class="r.kind === 'closed' ? 'bg-surface' : ''">
                        <CompanyLogo :name="r.saved.company" :url="r.saved.logo" size="md" />
                        <div class="min-w-0 flex-1">
                            <div class="flex items-start justify-between gap-2">
                                <h3 class="text-base leading-snug font-bold" :class="r.kind === 'closed' ? 'text-muted' : 'text-ink'">
                                    <Link v-if="r.kind === 'pending'" :href="r.saved.url" class="hover:text-action-700">{{ r.saved.title }}</Link>
                                    <template v-else>{{ r.saved.title }}</template>
                                </h3>
                                <button type="button" class="grid size-9 shrink-0 place-items-center rounded-lg text-subtle hover:bg-danger-50 hover:text-danger-700" :aria-label="`Remover ${r.saved.title} de Minhas vagas`" @click="remove(r.saved.slug)"><X class="size-4.5" aria-hidden="true" /></button>
                            </div>
                            <p class="text-sm text-muted">{{ r.saved.company }}</p>
                            <p v-if="r.kind === 'closed'" class="mt-3 inline-flex items-center gap-1.5 rounded-full bg-warning-50 px-2.5 py-1 text-xs font-bold text-warning-700">Vaga encerrada ou indisponível</p>
                            <p v-else class="mt-3 inline-flex items-center gap-1.5 text-xs text-subtle"><Loader2 class="size-3.5 animate-spin" aria-hidden="true" />Conferindo se continua aberta…</p>
                        </div>
                    </article>
                </template>
            </div>
        </div>

        <ConfirmDialog :open="confirmClear" danger confirm-label="Limpar lista" title="Limpar todas as vagas salvas?" message="Elas serão removidas deste navegador. Você poderá salvar de novo quando quiser." @cancel="confirmClear = false" @confirm="clear(); confirmClear = false" />
    </PublicLayout>
</template>
