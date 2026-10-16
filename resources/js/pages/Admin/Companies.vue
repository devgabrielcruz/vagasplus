<script setup lang="ts">
import { Link, router, useForm } from '@inertiajs/vue3';
import { Check, ExternalLink, Pencil, Plus, Search, Trash2, X } from 'lucide-vue-next';
import { ref } from 'vue';
import CompanyLogo from '@/components/CompanyLogo.vue';
import ConfirmDialog from '@/components/ConfirmDialog.vue';
import EmptyState from '@/components/EmptyState.vue';
import Field from '@/components/Field.vue';
import LogoField from '@/components/LogoField.vue';
import Pagination from '@/components/Pagination.vue';
import AdminLayout from '@/layouts/AdminLayout.vue';

interface Co { id: number; name: string; slug: string; website_url: string | null; logo_src: string | null; logo_url: string | null; has_upload: boolean; about: string | null; jobs_count: number }

const props = defineProps<{ companies: { data: Co[]; current_page: number; last_page: number; total: number; prev_url: string | null; next_url: string | null; links: { page: number; url: string; active: boolean }[] }; filters: { q: string } }>();

const q = ref(props.filters.q);
const editing = ref<Co | null>(null);
const creating = ref(false);
const deleting = ref<Co | null>(null);
const current = ref<string | null>(null);

const form = useForm({ _method: 'post', name: '', website_url: '', logo_url: '', about: '', logo: null as File | null, remove_logo: false });

function startNew() {
    editing.value = null;
    creating.value = true;
    current.value = null;
    form.reset().clearErrors();
    form.defaults({ _method: 'post', name: '', website_url: '', logo_url: '', about: '', logo: null, remove_logo: false }).reset();
}

function startEdit(c: Co) {
    creating.value = false;
    editing.value = c;
    current.value = c.logo_src;
    form.clearErrors();
    form.defaults({ _method: 'put', name: c.name, website_url: c.website_url ?? '', logo_url: c.logo_url ?? '', about: c.about ?? '', logo: null, remove_logo: false }).reset();
}

function cancel() {
    creating.value = false;
    editing.value = null;
    form.reset().clearErrors();
}

// Upload exige multipart; o PUT é simulado com _method para o PHP ler os arquivos.
function save() {
    const url = editing.value ? `/admin/empresas/${editing.value.id}` : '/admin/empresas';
    form.post(url, { forceFormData: true, preserveScroll: true, onSuccess: cancel });
}

function search() {
    router.get('/admin/empresas', q.value ? { q: q.value } : {}, { preserveState: true });
}

function remove() {
    router.delete(`/admin/empresas/${deleting.value!.id}`, { preserveScroll: true, onFinish: () => (deleting.value = null) });
}
</script>

<template>
    <AdminLayout title="Empresas">
        <div class="mx-auto max-w-5xl">
            <header class="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div><h1 class="text-2xl font-extrabold text-ink">Empresas</h1><p class="text-sm text-muted">Empresas cadastradas e seus logotipos. Novas empresas também são criadas ao cadastrar uma vaga.</p></div>
                <button v-if="!creating && !editing" type="button" class="btn-primary" @click="startNew"><Plus class="size-4" aria-hidden="true" />Nova empresa</button>
            </header>

            <form v-if="creating || editing" class="card mb-5 space-y-4 p-5" aria-label="Formulário de empresa" @submit.prevent="save">
                <h2 class="text-lg font-extrabold text-ink">{{ editing ? `Editar ${editing.name}` : 'Nova empresa' }}</h2>
                <div class="grid gap-4 sm:grid-cols-2">
                    <Field id="co-name" label="Nome" :error="form.errors.name" required v-slot="{ describedBy, invalid }"><input id="co-name" v-model="form.name" required maxlength="160" class="field" :aria-invalid="invalid" :aria-describedby="describedBy" /></Field>
                    <Field id="co-site" label="Site" :error="form.errors.website_url" hint="Opcional. Comece com https://" v-slot="{ describedBy, invalid }"><input id="co-site" v-model="form.website_url" type="url" class="field" placeholder="https://" :aria-invalid="invalid" :aria-describedby="describedBy" /></Field>
                </div>
                <LogoField id="co-logo" v-model:url="form.logo_url" v-model:file="form.logo" v-model:remove="form.remove_logo" :current="current" :error="form.errors.logo" :url-error="form.errors.logo_url" :name="form.name" />
                <Field id="co-about" label="Sobre a empresa" :error="form.errors.about" hint="Somente informações verificadas." v-slot="{ describedBy, invalid }"><textarea id="co-about" v-model="form.about" rows="3" maxlength="5000" class="field" :aria-invalid="invalid" :aria-describedby="describedBy" /></Field>
                <div class="flex gap-2"><button type="submit" class="btn-primary" :disabled="form.processing"><Check class="size-4" aria-hidden="true" />Salvar</button><button type="button" class="btn-secondary" @click="cancel"><X class="size-4" aria-hidden="true" />Cancelar</button></div>
            </form>

            <form class="mb-4 flex gap-2" role="search" aria-label="Buscar empresas" @submit.prevent="search">
                <div class="relative flex-1"><label for="co-q" class="sr-only">Buscar empresa</label><Search class="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-subtle" aria-hidden="true" /><input id="co-q" v-model="q" type="search" placeholder="Buscar empresa pelo nome" class="field pl-9" /></div>
                <button type="submit" class="btn-secondary">Buscar</button>
            </form>

            <div v-if="companies.data.length" class="card overflow-hidden">
                <ul class="divide-y divide-line">
                    <li v-for="c in companies.data" :key="c.id" class="flex flex-wrap items-center gap-3 px-4 py-3.5 sm:px-5">
                        <CompanyLogo :name="c.name" :url="c.logo_src" size="md" />
                        <div class="min-w-0 flex-1">
                            <p class="truncate font-bold text-ink">{{ c.name }}</p>
                            <p class="truncate text-xs text-muted">{{ c.jobs_count }} {{ c.jobs_count === 1 ? 'vaga' : 'vagas' }}<template v-if="c.website_url"> · {{ c.website_url }}</template><template v-if="!c.logo_src"> · sem logotipo</template></p>
                        </div>
                        <div class="flex gap-1">
                            <Link v-if="c.jobs_count" :href="`/admin/vagas?q=${encodeURIComponent(c.name)}`" class="btn-ghost btn-sm size-9 p-0" :aria-label="`Ver vagas de ${c.name}`" title="Ver vagas"><ExternalLink class="size-4" /></Link>
                            <button type="button" class="btn-ghost btn-sm size-9 p-0" :aria-label="`Editar ${c.name}`" @click="startEdit(c)"><Pencil class="size-4" /></button>
                            <button type="button" class="btn-ghost btn-sm size-9 p-0 hover:text-danger-700" :aria-label="`Excluir ${c.name}`" :disabled="c.jobs_count > 0" :title="c.jobs_count > 0 ? 'Possui vagas e não pode ser excluída' : 'Excluir'" @click="deleting = c"><Trash2 class="size-4" /></button>
                        </div>
                    </li>
                </ul>
            </div>
            <EmptyState v-else title="Nenhuma empresa encontrada" description="Cadastre uma empresa ou crie uma vaga: a empresa é registrada automaticamente."><button type="button" class="btn-primary" @click="startNew"><Plus class="size-4" aria-hidden="true" />Nova empresa</button></EmptyState>

            <div class="mt-6"><Pagination :meta="companies" /></div>
        </div>

        <ConfirmDialog :open="!!deleting" danger confirm-label="Excluir empresa" title="Excluir empresa?" :message="`“${deleting?.name}” e o logotipo enviado serão excluídos definitivamente.`" @cancel="deleting = null" @confirm="remove" />
    </AdminLayout>
</template>
