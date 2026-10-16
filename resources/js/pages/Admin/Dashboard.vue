<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import { Archive, CalendarClock, CheckCircle2, ClipboardCheck, FilePen, Hourglass, Inbox, Plus, TimerOff } from 'lucide-vue-next';
import AdminLayout from '@/layouts/AdminLayout.vue';
import { daysUntil, formatDateTime } from '@/lib/format';

interface Row { id: number; title: string; company: string; expires_at: string | null; edit_url: string }

defineProps<{
    stats: Record<'submissions' | 'active' | 'draft' | 'scheduled' | 'expiring_soon' | 'expired' | 'recently_expired' | 'needs_review' | 'archived', number>;
    expiringSoon: Row[];
    recentlyExpired: Row[];
}>();

const cards = [
    { key: 'submissions', label: 'Solicitações em análise', icon: Inbox, tone: 'text-action-700 bg-action-50', href: '/admin/solicitacoes' },
    { key: 'active', label: 'Publicadas e válidas', icon: CheckCircle2, tone: 'text-success-700 bg-success-50', href: '/admin/vagas?status=published' },
    { key: 'expiring_soon', label: 'Expiram em 7 dias', icon: Hourglass, tone: 'text-warning-700 bg-warning-50', href: '/admin/vagas?status=published&sort=expires_at&dir=asc' },
    { key: 'draft', label: 'Rascunhos', icon: FilePen, tone: 'text-navy-800 bg-navy-50', href: '/admin/vagas?status=draft' },
    { key: 'scheduled', label: 'Agendadas', icon: CalendarClock, tone: 'text-info-700 bg-info-50', href: '/admin/vagas?status=scheduled' },
    { key: 'recently_expired', label: 'Expiraram (7 dias)', icon: TimerOff, tone: 'text-warning-700 bg-warning-50', href: '/admin/vagas?status=expired&sort=expires_at&dir=desc' },
    { key: 'expired', label: 'Expiradas (total)', icon: TimerOff, tone: 'text-muted bg-line', href: '/admin/vagas?status=expired' },
    { key: 'needs_review', label: 'Aguardando revisão', icon: ClipboardCheck, tone: 'text-danger-700 bg-danger-50', href: '/admin/vagas?status=draft' },
    { key: 'archived', label: 'Arquivadas', icon: Archive, tone: 'text-muted bg-line', href: '/admin/vagas?status=archived' },
] as const;

const remaining = (iso: string | null) => {
    const d = daysUntil(iso);
    return d === null ? '' : d <= 0 ? 'hoje' : d === 1 ? 'amanhã' : `em ${d} dias`;
};
</script>

<template>
    <AdminLayout title="Dashboard">
        <div class="mx-auto max-w-6xl">
            <header class="mb-6 flex flex-wrap items-center justify-between gap-3">
                <div><h1 class="text-2xl font-extrabold text-ink">Dashboard</h1><p class="text-sm text-muted">Situação atual das vagas, direto do banco de dados.</p></div>
                <Link href="/admin/vagas/criar" class="btn-primary"><Plus class="size-4" aria-hidden="true" />Nova vaga</Link>
            </header>

            <ul class="grid grid-cols-2 gap-3 md:grid-cols-4">
                <li v-for="c in cards" :key="c.key">
                    <Link :href="c.href" class="card flex h-full flex-col gap-3 p-4 transition hover:border-action-500 hover:shadow-(--shadow-lift)">
                        <span class="grid size-9 place-items-center rounded-lg" :class="c.tone"><component :is="c.icon" class="size-4.5" aria-hidden="true" /></span>
                        <span><span class="block text-3xl leading-none font-extrabold text-ink tabular-nums">{{ stats[c.key] }}</span><span class="mt-1.5 block text-[13px] font-medium text-muted">{{ c.label }}</span></span>
                    </Link>
                </li>
            </ul>

            <div class="mt-8 grid gap-6 lg:grid-cols-2">
                <section class="card" aria-labelledby="exp-soon">
                    <h2 id="exp-soon" class="flex items-center gap-2 border-b border-line px-5 py-4 font-extrabold text-ink"><Hourglass class="size-4.5 text-warning-700" aria-hidden="true" />Próximas da expiração</h2>
                    <ul v-if="expiringSoon.length" class="divide-y divide-line">
                        <li v-for="r in expiringSoon" :key="r.id" class="flex items-center justify-between gap-3 px-5 py-3">
                            <div class="min-w-0"><Link :href="r.edit_url" class="block truncate text-sm font-bold text-ink hover:text-action-700">{{ r.title }}</Link><p class="truncate text-xs text-muted">{{ r.company }} · {{ formatDateTime(r.expires_at) }}</p></div>
                            <span class="shrink-0 rounded-full bg-warning-50 px-2.5 py-1 text-xs font-bold text-warning-700">{{ remaining(r.expires_at) }}</span>
                        </li>
                    </ul>
                    <p v-else class="px-5 py-8 text-center text-sm text-muted">Nenhuma vaga expira nos próximos 7 dias.</p>
                </section>

                <section class="card" aria-labelledby="exp-recent">
                    <h2 id="exp-recent" class="flex items-center gap-2 border-b border-line px-5 py-4 font-extrabold text-ink"><TimerOff class="size-4.5 text-muted" aria-hidden="true" />Expiraram recentemente</h2>
                    <ul v-if="recentlyExpired.length" class="divide-y divide-line">
                        <li v-for="r in recentlyExpired" :key="r.id" class="flex items-center justify-between gap-3 px-5 py-3">
                            <div class="min-w-0"><Link :href="r.edit_url" class="block truncate text-sm font-bold text-ink hover:text-action-700">{{ r.title }}</Link><p class="truncate text-xs text-muted">{{ r.company }} · expirou em {{ formatDateTime(r.expires_at) }}</p></div>
                            <Link :href="r.edit_url" class="btn-secondary btn-sm shrink-0">Revisar</Link>
                        </li>
                    </ul>
                    <p v-else class="px-5 py-8 text-center text-sm text-muted">Nenhuma vaga expirou nos últimos 7 dias.</p>
                </section>
            </div>
        </div>
    </AdminLayout>
</template>
