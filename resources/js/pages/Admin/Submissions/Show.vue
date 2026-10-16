<script setup lang="ts">
import { Link, router, useForm } from '@inertiajs/vue3';
import { Check, ExternalLink, Mail, Pencil, Phone, X } from 'lucide-vue-next';
import { ref } from 'vue';
import CompanyLogo from '@/components/CompanyLogo.vue';
import ConfirmDialog from '@/components/ConfirmDialog.vue';
import AdminLayout from '@/layouts/AdminLayout.vue';
import { formatDateTime } from '@/lib/format';

interface Sub {
    id: number; status: string; status_label: string; created_at: string;
    submitter: { name: string; email: string; phone: string | null; ip: string | null };
    company: { name: string; website_url: string | null; logo: string | null };
    title: string; category: string; work_mode: string; employment_type: string; experience_level: string | null; location: string | null;
    description: string; requirements: string | null; benefits: string | null; salary: string | null;
    platform: { label: string; logo: string | null; uses_email: boolean }; apply_url: string | null; apply_email: string | null;
    rejection_reason: string | null; reviewed_at: string | null; reviewer: string | null; job_edit_url: string | null;
}

const props = defineProps<{ submission: Sub }>();
const s = props.submission;

const approving = ref(false);
const rejecting = ref(false);
const busy = ref(false);
const reject = useForm({ reason: '' });

function approve() {
    busy.value = true;
    router.post(`/admin/solicitacoes/${s.id}/aprovar`, {}, { onFinish: () => { busy.value = false; approving.value = false; } });
}

function doReject() {
    reject.post(`/admin/solicitacoes/${s.id}/recusar`, { onSuccess: () => (rejecting.value = false) });
}

const sections = [
    { t: 'Descrição', v: s.description },
    { t: 'Requisitos', v: s.requirements },
    { t: 'Benefícios', v: s.benefits },
].filter((x) => x.v);
</script>

<template>
    <AdminLayout :title="`Solicitação #${s.id}`">
        <div class="mx-auto max-w-5xl">
            <Link href="/admin/solicitacoes" class="text-sm font-semibold text-action-700 hover:underline">← Solicitações</Link>

            <header class="mt-2 mb-5 flex flex-wrap items-start justify-between gap-3">
                <div class="flex items-start gap-4">
                    <CompanyLogo :name="s.company.name" :url="s.company.logo" size="lg" />
                    <div>
                        <p class="text-xs font-bold tracking-widest text-subtle uppercase">Solicitação #{{ s.id }} · {{ s.status_label }}</p>
                        <h1 class="mt-1 text-2xl font-extrabold text-ink">{{ s.title }}</h1>
                        <p class="text-muted">{{ s.company.name }}</p>
                    </div>
                </div>
                <div v-if="s.status === 'pending'" class="flex flex-wrap gap-2">
                    <button type="button" class="btn-secondary text-danger-700 hover:border-danger-700 hover:bg-danger-50" @click="rejecting = true"><X class="size-4" aria-hidden="true" />Recusar</button>
                    <button type="button" class="btn-primary" @click="approving = true"><Check class="size-4" aria-hidden="true" />Aprovar e criar rascunho</button>
                </div>
                <Link v-else-if="s.job_edit_url" :href="s.job_edit_url" class="btn-primary"><Pencil class="size-4" aria-hidden="true" />Abrir a vaga</Link>
            </header>

            <div v-if="s.status === 'rejected'" class="mb-5 rounded-xl border border-danger-700/20 bg-danger-50 p-4 text-sm text-danger-700"><p class="font-bold">Recusada por {{ s.reviewer }} em {{ formatDateTime(s.reviewed_at) }}</p><p class="mt-1">Motivo: {{ s.rejection_reason }}</p></div>
            <div v-if="s.status === 'approved'" class="mb-5 rounded-xl border border-success-700/20 bg-success-50 p-4 text-sm text-success-700"><p class="font-bold">Aprovada por {{ s.reviewer }} em {{ formatDateTime(s.reviewed_at) }}</p></div>

            <div class="grid gap-6 lg:grid-cols-[1fr_20rem] lg:items-start">
                <div class="space-y-4">
                    <section class="card p-5" aria-labelledby="d-resumo">
                        <h2 id="d-resumo" class="mb-3 text-lg font-extrabold text-ink">Resumo</h2>
                        <dl class="grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
                            <div><dt class="text-muted">Categoria</dt><dd class="font-semibold text-ink">{{ s.category }}</dd></div>
                            <div><dt class="text-muted">Modalidade</dt><dd class="font-semibold text-ink">{{ s.work_mode }}</dd></div>
                            <div><dt class="text-muted">Contratação</dt><dd class="font-semibold text-ink">{{ s.employment_type }}</dd></div>
                            <div><dt class="text-muted">Nível</dt><dd class="font-semibold text-ink">{{ s.experience_level ?? 'Não informado' }}</dd></div>
                            <div><dt class="text-muted">Local</dt><dd class="font-semibold text-ink">{{ s.location ?? 'Remoto / não informado' }}</dd></div>
                            <div><dt class="text-muted">Salário</dt><dd class="font-semibold text-ink">{{ s.salary ?? 'Não informado' }}</dd></div>
                        </dl>
                    </section>

                    <section v-for="x in sections" :key="x.t" class="card p-5">
                        <h2 class="mb-3 text-lg font-extrabold text-ink">{{ x.t }}</h2>
                        <div class="prose-job" v-html="x.v" />
                    </section>
                </div>

                <aside class="space-y-4">
                    <section class="card space-y-3 p-5" aria-labelledby="d-cand">
                        <h2 id="d-cand" class="text-lg font-extrabold text-ink">Candidatura</h2>
                        <div class="flex items-center gap-2.5 text-sm font-semibold text-ink"><img v-if="s.platform.logo" :src="s.platform.logo" alt="" class="h-6 w-auto max-w-[4rem] rounded object-contain" />{{ s.platform.label }}</div>
                        <a v-if="s.apply_url" :href="s.apply_url" target="_blank" rel="noopener noreferrer nofollow" class="flex items-start gap-1.5 text-sm break-all text-action-700 hover:underline"><ExternalLink class="mt-0.5 size-4 shrink-0" aria-hidden="true" />{{ s.apply_url }}</a>
                        <a v-if="s.apply_email" :href="`mailto:${s.apply_email}`" class="flex items-center gap-1.5 text-sm break-all text-action-700 hover:underline"><Mail class="size-4 shrink-0" aria-hidden="true" />{{ s.apply_email }}</a>
                        <p class="text-xs text-muted">Abra o link e confirme que a vaga existe e está aberta antes de aprovar.</p>
                    </section>

                    <section class="card space-y-2 p-5" aria-labelledby="d-envio">
                        <h2 id="d-envio" class="text-lg font-extrabold text-ink">Quem enviou</h2>
                        <p class="text-sm font-semibold text-ink">{{ s.submitter.name }}</p>
                        <a :href="`mailto:${s.submitter.email}`" class="flex items-center gap-1.5 text-sm break-all text-action-700 hover:underline"><Mail class="size-4 shrink-0" aria-hidden="true" />{{ s.submitter.email }}</a>
                        <p v-if="s.submitter.phone" class="flex items-center gap-1.5 text-sm text-ink"><Phone class="size-4 shrink-0 text-subtle" aria-hidden="true" />{{ s.submitter.phone }}</p>
                        <p class="text-xs text-muted">Enviada em {{ formatDateTime(s.created_at) }}<template v-if="s.submitter.ip"> · IP {{ s.submitter.ip }}</template></p>
                        <a v-if="s.company.website_url" :href="s.company.website_url" target="_blank" rel="noopener noreferrer nofollow" class="flex items-center gap-1.5 text-sm break-all text-action-700 hover:underline"><ExternalLink class="size-4 shrink-0" aria-hidden="true" />{{ s.company.website_url }}</a>
                    </section>
                </aside>
            </div>
        </div>

        <ConfirmDialog :open="approving" confirm-label="Aprovar" title="Aprovar esta solicitação?" message="A vaga será criada como rascunho (a empresa é cadastrada se ainda não existir). Nada vai ao ar até você publicar." :processing="busy" @cancel="approving = false" @confirm="approve" />
        <ConfirmDialog :open="rejecting" danger confirm-label="Recusar" title="Recusar esta solicitação?" message="Explique o motivo para o registro interno. O logotipo enviado será apagado." :processing="reject.processing" @cancel="rejecting = false" @confirm="doReject">
            <label for="reason" class="label">Motivo</label>
            <textarea id="reason" v-model="reject.reason" rows="3" maxlength="500" class="field" :aria-invalid="!!reject.errors.reason" />
            <p v-if="reject.errors.reason" class="error-text" role="alert">{{ reject.errors.reason }}</p>
        </ConfirmDialog>
    </AdminLayout>
</template>
