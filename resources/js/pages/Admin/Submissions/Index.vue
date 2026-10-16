<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import { Inbox } from 'lucide-vue-next';
import EmptyState from '@/components/EmptyState.vue';
import Pagination from '@/components/Pagination.vue';
import AdminLayout from '@/layouts/AdminLayout.vue';
import { formatDateTime } from '@/lib/format';

interface Row { id: number; title: string; company_name: string; submitter: string; category: string; platform: string; status: string; created_at: string; show_url: string }

defineProps<{
    status: string;
    counts: { value: string; label: string; count: number }[];
    submissions: { data: Row[]; current_page: number; last_page: number; total: number; prev_url: string | null; next_url: string | null; links: { page: number; url: string; active: boolean }[] };
}>();

const tone: Record<string, string> = { pending: 'bg-info-50 text-info-700', approved: 'bg-success-50 text-success-700', rejected: 'bg-danger-50 text-danger-700' };
const label: Record<string, string> = { pending: 'Em análise', approved: 'Aprovada', rejected: 'Recusada' };
</script>

<template>
    <AdminLayout title="Solicitações">
        <div class="mx-auto max-w-5xl">
            <header class="mb-5"><h1 class="text-2xl font-extrabold text-ink">Solicitações de vagas</h1><p class="text-sm text-muted">Vagas enviadas pelo site aguardando análise. Aprovar cria a vaga como rascunho para você revisar e publicar.</p></header>

            <nav class="mb-4 flex flex-wrap gap-2" aria-label="Filtrar por situação">
                <Link v-for="c in counts" :key="c.value" :href="`/admin/solicitacoes?status=${c.value}`" :aria-current="status === c.value ? 'page' : undefined" class="inline-flex min-h-10 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition" :class="status === c.value ? 'border-action-600 bg-action-50 text-action-700' : 'border-line-strong bg-white text-ink hover:bg-navy-50'">
                    {{ c.label }}<span class="rounded-full bg-white/80 px-1.5 text-xs tabular-nums ring-1 ring-line">{{ c.count }}</span>
                </Link>
            </nav>

            <div v-if="submissions.data.length" class="card overflow-hidden">
                <ul class="divide-y divide-line">
                    <li v-for="s in submissions.data" :key="s.id">
                        <Link :href="s.show_url" class="flex flex-wrap items-center gap-3 px-4 py-4 transition hover:bg-surface sm:px-5">
                            <div class="min-w-0 flex-1">
                                <p class="truncate font-bold text-ink">{{ s.title }}</p>
                                <p class="truncate text-sm text-muted">{{ s.company_name }} · {{ s.category }} · via {{ s.platform }}</p>
                                <p class="text-xs text-subtle">Enviada por {{ s.submitter }} em {{ formatDateTime(s.created_at) }}</p>
                            </div>
                            <span class="badge px-2.5 py-1" :class="tone[s.status]">{{ label[s.status] }}</span>
                        </Link>
                    </li>
                </ul>
            </div>
            <EmptyState v-else :icon="Inbox" title="Nenhuma solicitação aqui" :description="status === 'pending' ? 'Quando alguém enviar uma vaga pelo site, ela aparecerá nesta lista.' : 'Nada nesta situação por enquanto.'" />

            <div class="mt-6"><Pagination :meta="submissions" /></div>
        </div>
    </AdminLayout>
</template>
