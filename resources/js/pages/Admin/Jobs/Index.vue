<script setup lang="ts">
import { Link, router } from '@inertiajs/vue3';
import { ArrowDown, ArrowUp, ArchiveRestore, Archive, Eye, ExternalLink, Pencil, Plus, RefreshCw, Search, Star, X } from 'lucide-vue-next';
import { reactive, ref } from 'vue';
import ConfirmDialog from '@/components/ConfirmDialog.vue';
import EmptyState from '@/components/EmptyState.vue';
import Pagination from '@/components/Pagination.vue';
import RenewDialog from '@/components/RenewDialog.vue';
import StatusBadge from '@/components/StatusBadge.vue';
import AdminLayout from '@/layouts/AdminLayout.vue';
import { formatDate, formatDateTime } from '@/lib/format';
import type { Option, Paginated } from '@/types';

interface Row {
    id: number; title: string; company: string; category: string; platform: string; status: string; status_label: string; is_featured: boolean;
    published_at: string | null; expires_at: string | null; updated_at: string; expiring_soon: boolean;
    edit_url: string; preview_url: string; public_url: string | null;
}

const props = defineProps<{
    jobs: Paginated<Row>;
    filters: { q: string; status: string; date_field: string; from: string; to: string; sort: string; dir: string };
    statuses: Option[];
}>();

const f = reactive({ ...props.filters });
const loading = ref(false);
const archiveTarget = ref<Row | null>(null);
const renewTarget = ref<Row | null>(null);
const acting = ref(false);

function apply(extra: Partial<typeof f> = {}) {
    Object.assign(f, extra);
    const params: Record<string, string> = {};
    for (const [k, v] of Object.entries(f)) if (v) params[k] = String(v);
    router.get('/admin/vagas', params, { preserveState: true, onStart: () => (loading.value = true), onFinish: () => (loading.value = false) });
}

function clear() {
    Object.assign(f, { q: '', status: '', from: '', to: '', date_field: 'published_at', sort: 'updated_at', dir: 'desc' });
    apply();
}

function sortBy(col: string) {
    apply({ sort: col, dir: f.sort === col && f.dir === 'desc' ? 'asc' : 'desc' });
}

const ariaSort = (col: string) => (f.sort === col ? (f.dir === 'asc' ? 'ascending' : 'descending') : 'none');

function post(url: string, done?: () => void) {
    acting.value = true;
    router.post(url, {}, { preserveScroll: true, onFinish: () => { acting.value = false; done?.(); } });
}

const hasFilters = () => !!(f.q || f.status || f.from || f.to);
const columns = [
    { key: 'title', label: 'Vaga' },
    { key: 'status', label: 'Status' },
    { key: 'published_at', label: 'Publicação' },
    { key: 'expires_at', label: 'Expiração' },
    { key: 'updated_at', label: 'Atualizada' },
];
</script>

<template>
    <AdminLayout title="Vagas">
        <div class="mx-auto max-w-7xl">
            <header class="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div><h1 class="text-2xl font-extrabold text-ink">Vagas</h1><p class="text-sm text-muted">{{ jobs.total }} {{ jobs.total === 1 ? 'vaga' : 'vagas' }} encontradas</p></div>
                <Link href="/admin/vagas/criar" class="btn-primary"><Plus class="size-4" aria-hidden="true" />Nova vaga</Link>
            </header>

            <form class="card mb-4 grid gap-3 p-4 md:grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] md:items-end" role="search" aria-label="Filtrar vagas" @submit.prevent="apply()">
                <div class="relative">
                    <label for="q" class="label">Buscar</label>
                    <Search class="pointer-events-none absolute bottom-3 left-3 size-4 text-subtle" aria-hidden="true" />
                    <input id="q" v-model="f.q" type="search" placeholder="Título, empresa, ID ou slug" class="field pl-9" />
                </div>
                <div><label for="status" class="label">Status</label><select id="status" v-model="f.status" class="field" @change="apply()"><option value="">Todos</option><option v-for="s in statuses" :key="s.value" :value="s.value">{{ s.label }}</option></select></div>
                <div><label for="df" class="label">Filtrar data por</label><select id="df" v-model="f.date_field" class="field"><option value="published_at">Publicação</option><option value="expires_at">Expiração</option><option value="updated_at">Atualização</option></select></div>
                <div><label for="from" class="label">De</label><input id="from" v-model="f.from" type="date" class="field" /></div>
                <div><label for="to" class="label">Até</label><input id="to" v-model="f.to" type="date" class="field" /></div>
                <div class="flex gap-2"><button type="submit" class="btn-primary flex-1">Filtrar</button><button v-if="hasFilters()" type="button" class="btn-secondary" aria-label="Limpar filtros" @click="clear"><X class="size-4" /></button></div>
            </form>

            <div class="relative" :aria-busy="loading">
                <div v-if="loading" class="absolute inset-x-0 top-0 z-10 h-0.5 overflow-hidden rounded bg-action-100"><div class="skeleton h-full w-full" /></div>

                <div v-if="jobs.data.length" class="card overflow-hidden" :class="loading ? 'opacity-70' : ''">
                    <div class="overflow-x-auto">
                        <table class="w-full min-w-[56rem] text-left text-sm">
                            <caption class="sr-only">Lista de vagas</caption>
                            <thead class="border-b border-line bg-surface text-xs font-bold tracking-wide text-muted uppercase">
                                <tr>
                                    <th v-for="c in columns" :key="c.key" scope="col" class="px-4 py-3" :aria-sort="ariaSort(c.key)">
                                        <button type="button" class="inline-flex items-center gap-1 uppercase hover:text-ink" @click="sortBy(c.key)">
                                            {{ c.label }}<ArrowUp v-if="f.sort === c.key && f.dir === 'asc'" class="size-3.5" aria-hidden="true" /><ArrowDown v-else-if="f.sort === c.key" class="size-3.5" aria-hidden="true" />
                                        </button>
                                    </th>
                                    <th scope="col" class="px-4 py-3 text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-line">
                                <tr v-for="j in jobs.data" :key="j.id" class="hover:bg-surface/60">
                                    <td class="max-w-xs px-4 py-3">
                                        <Link :href="j.edit_url" class="flex items-center gap-1.5 font-bold text-ink hover:text-action-700"><span class="truncate">{{ j.title }}</span><Star v-if="j.is_featured" class="size-3.5 shrink-0 fill-warning-700 text-warning-700" aria-label="Em destaque" /></Link>
                                        <p class="truncate text-xs text-muted">{{ j.company }} · {{ j.category }} · {{ j.platform }} · #{{ j.id }}</p>
                                    </td>
                                    <td class="px-4 py-3"><StatusBadge :status="j.status" :label="j.status_label" /><p v-if="j.expiring_soon" class="mt-1 text-xs font-semibold text-warning-700">Expira em breve</p></td>
                                    <td class="px-4 py-3 whitespace-nowrap text-muted">{{ formatDate(j.published_at) }}</td>
                                    <td class="px-4 py-3 whitespace-nowrap text-muted">{{ formatDateTime(j.expires_at) }}</td>
                                    <td class="px-4 py-3 whitespace-nowrap text-muted">{{ formatDate(j.updated_at) }}</td>
                                    <td class="px-4 py-3">
                                        <div class="flex justify-end gap-1">
                                            <Link :href="j.edit_url" class="btn-ghost btn-sm size-9 p-0" :aria-label="`Editar ${j.title}`" title="Editar"><Pencil class="size-4" /></Link>
                                            <Link :href="j.preview_url" class="btn-ghost btn-sm size-9 p-0" :aria-label="`Pré-visualizar ${j.title}`" title="Pré-visualizar"><Eye class="size-4" /></Link>
                                            <a v-if="j.public_url" :href="j.public_url" target="_blank" rel="noopener" class="btn-ghost btn-sm size-9 p-0" :aria-label="`Abrir ${j.title} no site`" title="Ver no site"><ExternalLink class="size-4" /></a>
                                            <button v-if="['published', 'expired'].includes(j.status)" type="button" class="btn-ghost btn-sm size-9 p-0" :aria-label="`Renovar ${j.title}`" title="Renovar" @click="renewTarget = j"><RefreshCw class="size-4" /></button>
                                            <button v-if="j.status === 'archived'" type="button" class="btn-ghost btn-sm size-9 p-0" :aria-label="`Restaurar ${j.title}`" title="Restaurar" @click="post(`/admin/vagas/${j.id}/restaurar`)"><ArchiveRestore class="size-4" /></button>
                                            <button v-else type="button" class="btn-ghost btn-sm size-9 p-0 hover:text-danger-700" :aria-label="`Arquivar ${j.title}`" title="Arquivar" @click="archiveTarget = j"><Archive class="size-4" /></button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <EmptyState v-else title="Nenhuma vaga encontrada" :description="hasFilters() ? 'Ajuste ou limpe os filtros para ver mais resultados.' : 'Crie a primeira vaga para começar.'">
                    <button v-if="hasFilters()" type="button" class="btn-secondary" @click="clear">Limpar filtros</button>
                    <Link href="/admin/vagas/criar" class="btn-primary"><Plus class="size-4" aria-hidden="true" />Nova vaga</Link>
                </EmptyState>
            </div>

            <div class="mt-6"><Pagination :meta="jobs" /></div>
        </div>

        <ConfirmDialog :open="!!archiveTarget" danger confirm-label="Arquivar vaga" title="Arquivar esta vaga?" :message="archiveTarget && ['published'].includes(archiveTarget.status) ? `“${archiveTarget.title}” está no ar e será retirada do site imediatamente. A página pública passará a responder como removida.` : `“${archiveTarget?.title}” será arquivada e não aparecerá publicamente.`" :processing="acting" @cancel="archiveTarget = null" @confirm="post(`/admin/vagas/${archiveTarget!.id}/arquivar`, () => (archiveTarget = null))" />
        <RenewDialog v-if="renewTarget" :open="!!renewTarget" :job-id="renewTarget.id" :title="renewTarget.title" :expired="renewTarget.status === 'expired'" @close="renewTarget = null" />
    </AdminLayout>
</template>
