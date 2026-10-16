<script setup lang="ts">
import { Link, router, useForm } from '@inertiajs/vue3';
import { Archive, ArchiveRestore, CalendarClock, Eye, ExternalLink, Loader2, RefreshCw, Save, Send, Undo2 } from 'lucide-vue-next';
import { computed, ref } from 'vue';
import Autocomplete, { type Suggestion } from '@/components/Autocomplete.vue';
import ConfirmDialog from '@/components/ConfirmDialog.vue';
import Field from '@/components/Field.vue';
import ImportPanel, { type ImportResult } from '@/components/ImportPanel.vue';
import LogoField from '@/components/LogoField.vue';
import RenewDialog from '@/components/RenewDialog.vue';
import RichEditor from '@/components/RichEditor.vue';
import StatusBadge from '@/components/StatusBadge.vue';
import AdminLayout from '@/layouts/AdminLayout.vue';
import { formatDateTime } from '@/lib/format';
import type { Option } from '@/types';

interface Job {
    id: number; status: string; status_label: string; slug: string; title: string;
    company_name: string; company_website_url: string | null; company_logo_url: string | null; company_logo_src: string | null; company_about: string | null;
    description: string | null; responsibilities: string | null; requirements: string | null; nice_to_have: string | null; benefits: string | null; additional_info: string | null;
    category_id: number; city: string | null; state: string | null; work_mode: string; employment_type: string; experience_level: string | null;
    salary_min: string | null; salary_max: string | null; salary_currency: string; salary_period: string | null;
    source_name: string | null; source_url: string | null; platform_id: number; apply_url: string | null; apply_email: string | null; source_published_at: string | null; is_featured: boolean;
    publish_at: string | null; expires_at: string | null; public_url: string | null; preview_url: string;
    history: { id: number; event: string; from: string | null; to: string | null; user: string; at: string; meta: Record<string, unknown> | null }[];
}

const props = defineProps<{
    job: Job | null;
    aiConfigured?: boolean;
    categories: { id: number; name: string; is_active: boolean }[];
    options: { work_modes: Option[]; employment_types: Option[]; experience_levels: Option[]; salary_periods: Option[]; platforms: { value: number; label: string; logo: string | null; uses_email: boolean }[] };
    validity: { presets: number[]; default: number; max: number };
}>();

const editing = computed(() => props.job !== null);
const status = computed(() => props.job?.status ?? 'new');
const lifecycleEditable = computed(() => !editing.value || ['draft', 'scheduled'].includes(status.value));
const j = props.job;

const form = useForm({
    _method: (j ? 'put' : 'post') as string,
    action: 'save',
    title: j?.title ?? '',
    slug: j?.slug ?? '',
    company_name: j?.company_name ?? '',
    company_website_url: j?.company_website_url ?? '',
    company_logo_url: j?.company_logo_url ?? '',
    company_logo: null as File | null,
    remove_company_logo: false,
    company_about: j?.company_about ?? '',
    category_id: (j?.category_id ?? '') as number | '',
    work_mode: j?.work_mode ?? 'onsite',
    city: j?.city ?? '',
    state: j?.state ?? '',
    employment_type: j?.employment_type ?? 'clt',
    experience_level: j?.experience_level ?? '',
    description: j?.description ?? '',
    responsibilities: j?.responsibilities ?? '',
    requirements: j?.requirements ?? '',
    nice_to_have: j?.nice_to_have ?? '',
    benefits: j?.benefits ?? '',
    additional_info: j?.additional_info ?? '',
    salary_min: j?.salary_min ?? '',
    salary_max: j?.salary_max ?? '',
    salary_currency: j?.salary_currency ?? 'BRL',
    salary_period: j?.salary_period ?? '',
    platform_id: (j?.platform_id ?? props.options.platforms[0]?.value ?? '') as number | '',
    apply_url: j?.apply_url ?? '',
    apply_email: j?.apply_email ?? '',
    source_url: j?.source_url ?? '',
    source_name: j?.source_name ?? '',
    source_published_at: j?.source_published_at ?? '',
    is_featured: j?.is_featured ?? false,
    publish_at: j?.publish_at ?? '',
    validity_days: (j?.expires_at ? null : props.validity.default) as number | null,
    expires_at: j?.expires_at ?? '',
});

// Empresa: escolhida entre as cadastradas ou criada ao salvar a vaga.
const pickedCompany = ref<Suggestion | null>(j ? { label: j.company_name, logo: j.company_logo_src, data: { website_url: j.company_website_url, about: j.company_about } } : null);
const isNewCompany = computed(() => form.company_name.trim() !== '' && pickedCompany.value?.label.toLowerCase() !== form.company_name.trim().toLowerCase());

function onCompanyInput() {
    // Ao digitar outro nome, deixa de ser a empresa selecionada.
    if (pickedCompany.value && pickedCompany.value.label.toLowerCase() !== form.company_name.trim().toLowerCase()) pickedCompany.value = null;
}

function onCompanySelect(s: Suggestion) {
    pickedCompany.value = s;
    form.company_name = s.label;
    form.company_website_url = (s.data?.website_url as string) ?? '';
    form.company_about = '';
    form.company_logo = null;
}

// Preenche o formulário com o resultado da importação (link/texto). O administrador revisa e salva como rascunho.
function applyImport(r: ImportResult) {
    const target = form as unknown as Record<string, unknown>;
    for (const [key, value] of Object.entries(r.fields)) {
        if (key in target) target[key] = value;
    }
    form.company_logo = null;
    pickedCompany.value = r.company_match ? ({ label: r.company_match.label, logo: r.company_match.logo, data: r.company_match.data } as Suggestion) : null;
    if (r.company_match) form.company_website_url = (r.company_match.data.website_url as string) ?? '';
    form.clearErrors();
}

const customValidity = ref(!!j?.expires_at);
const slugEdit = ref(false);
const byEmail = computed(() => !!props.options.platforms.find((p) => p.value === form.platform_id)?.uses_email);
const isRemote = computed(() => form.work_mode === 'remote');
const hasSalary = computed(() => form.salary_min !== '' || form.salary_max !== '');
const errorCount = computed(() => Object.keys(form.errors).length);

function pickValidity(days: number | null) {
    if (days === null) {
        customValidity.value = true;
        form.validity_days = null;
        return;
    }
    customValidity.value = false;
    form.validity_days = days;
    form.expires_at = '';
}

function submit(action: 'save' | 'publish' | 'schedule') {
    form.action = action;
    if (!customValidity.value) form.expires_at = '';
    // "Publicar agora" ignora a data de publicação preenchida (use "Agendar" para datas futuras).
    form.transform((d) => (action === 'publish' ? { ...d, publish_at: '' } : d));
    const opts = { preserveScroll: true, onError: () => document.getElementById('resumo-erros')?.focus() };
    // Upload de logotipo exige multipart; o PUT é simulado por _method.
    const multipart = { ...opts, forceFormData: true };
    if (editing.value) form.post(`/admin/vagas/${j!.id}`, multipart);
    else form.post('/admin/vagas', multipart);
}

// Ações de ciclo de vida
const confirmArchive = ref(false);
const renewOpen = ref(false);
const acting = ref(false);
function post(url: string, done?: () => void) {
    acting.value = true;
    router.post(url, {}, { preserveScroll: true, onFinish: () => { acting.value = false; done?.(); } });
}

const eventLabel: Record<string, string> = {
    created: 'Criada', updated: 'Editada', published: 'Publicada', scheduled: 'Agendada', renewed: 'Renovada', expired: 'Expirada automaticamente', archived: 'Arquivada', restored: 'Restaurada',
};

const rich = [
    { key: 'description', label: 'Sobre a oportunidade', required: true },
    { key: 'responsibilities', label: 'Responsabilidades' },
    { key: 'requirements', label: 'Requisitos' },
    { key: 'nice_to_have', label: 'Diferenciais' },
    { key: 'benefits', label: 'Benefícios' },
    { key: 'additional_info', label: 'Informações adicionais' },
] as const;
</script>

<template>
    <AdminLayout :title="editing ? 'Editar vaga' : 'Nova vaga'">
        <div v-if="!editing" class="mx-auto max-w-6xl"><ImportPanel :ai-configured="!!aiConfigured" @imported="applyImport" /></div>
        <form class="mx-auto max-w-6xl" @submit.prevent="submit('save')">
            <header class="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div>
                    <Link href="/admin/vagas" class="text-sm font-semibold text-action-700 hover:underline">← Vagas</Link>
                    <h1 class="mt-1 flex flex-wrap items-center gap-3 text-2xl font-extrabold text-ink">{{ editing ? 'Editar vaga' : 'Nova vaga' }}<StatusBadge v-if="j" :status="j.status" :label="j.status_label" /></h1>
                </div>
            </header>

            <div v-if="errorCount" id="resumo-erros" tabindex="-1" role="alert" class="mb-5 rounded-xl border border-danger-700/25 bg-danger-50 p-4 text-sm text-danger-700">
                <p class="font-bold">Corrija {{ errorCount }} {{ errorCount === 1 ? 'campo' : 'campos' }} antes de continuar:</p>
                <ul class="mt-1 list-disc pl-5"><li v-for="(msg, key) in form.errors" :key="key">{{ msg }}</li></ul>
            </div>

            <div class="grid gap-6 lg:grid-cols-[1fr_20rem] lg:items-start">
                <div class="space-y-6">
                    <section class="card space-y-4 p-5" aria-labelledby="s-basico">
                        <h2 id="s-basico" class="text-lg font-extrabold text-ink">Informações básicas</h2>
                        <Field id="title" label="Título da vaga" :error="form.errors.title" required v-slot="{ describedBy, invalid }"><input id="title" v-model="form.title" required minlength="3" maxlength="180" class="field" :aria-invalid="invalid" :aria-describedby="describedBy" /></Field>
                        <div class="grid gap-4 sm:grid-cols-2">
                            <Field id="company_name" label="Empresa contratante" :error="form.errors.company_name" required v-slot="{ invalid }">
                                <Autocomplete id="company_name" v-model="form.company_name" label="Empresa contratante" endpoint="/admin/empresas/sugestoes" :min-chars="1" :maxlength="160" required :invalid="invalid" placeholder="Digite para buscar ou cadastrar" @update:model-value="onCompanyInput" @select="onCompanySelect" />
                                <p v-if="pickedCompany && !isNewCompany" class="mt-1.5 flex items-center gap-2 text-xs font-semibold text-success-700"><img v-if="pickedCompany.logo" :src="pickedCompany.logo" alt="" class="size-5 rounded border border-line bg-white object-contain" />Empresa já cadastrada: os dados e o logotipo serão reaproveitados.</p>
                                <p v-else-if="isNewCompany" class="mt-1.5 text-xs font-semibold text-info-700">Empresa nova: será cadastrada junto com a vaga. Informe o logotipo abaixo.</p>
                            </Field>
                            <Field id="category_id" label="Categoria" :error="form.errors.category_id" required v-slot="{ describedBy, invalid }">
                                <select id="category_id" v-model="form.category_id" required class="field" :aria-invalid="invalid" :aria-describedby="describedBy"><option value="" disabled>Selecione…</option><option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}{{ c.is_active ? '' : ' (inativa)' }}</option></select>
                            </Field>
                            <Field id="company_website_url" label="Site da empresa" :error="form.errors.company_website_url" hint="Opcional. Deve começar com https://" v-slot="{ describedBy, invalid }"><input id="company_website_url" v-model="form.company_website_url" type="url" class="field" placeholder="https://" :aria-invalid="invalid" :aria-describedby="describedBy" /></Field>
                        </div>
                        <div v-if="!pickedCompany || !pickedCompany.logo || !isNewCompany" class="rounded-xl border border-line bg-surface p-4">
                            <LogoField id="company_logo" v-model:url="form.company_logo_url" v-model:file="form.company_logo" v-model:remove="form.remove_company_logo" :current="pickedCompany?.logo ?? null" :error="form.errors.company_logo" :url-error="form.errors.company_logo_url" :name="form.company_name" />
                        </div>
                        <div>
                            <Field id="slug" label="Slug (URL da vaga)" :error="form.errors.slug" :hint="editing ? 'Alterar o slug muda a URL pública. Prefira manter.' : 'Deixe em branco para gerar automaticamente (título + empresa + código).'" v-slot="{ describedBy, invalid }">
                                <input id="slug" v-model="form.slug" class="field font-mono text-[13px]" :readonly="editing && !slugEdit" :placeholder="editing ? '' : 'gerado-automaticamente'" :aria-invalid="invalid" :aria-describedby="describedBy" />
                            </Field>
                            <button v-if="editing && !slugEdit" type="button" class="mt-1.5 text-xs font-bold text-action-700 hover:underline" @click="slugEdit = true">Editar slug</button>
                        </div>
                    </section>

                    <section class="card space-y-4 p-5" aria-labelledby="s-local">
                        <h2 id="s-local" class="text-lg font-extrabold text-ink">Local e contratação</h2>
                        <div class="grid gap-4 sm:grid-cols-2">
                            <Field id="work_mode" label="Modalidade" :error="form.errors.work_mode" required v-slot="{ describedBy, invalid }"><select id="work_mode" v-model="form.work_mode" class="field" :aria-invalid="invalid" :aria-describedby="describedBy"><option v-for="o in options.work_modes" :key="o.value" :value="o.value">{{ o.label }}</option></select></Field>
                            <Field id="employment_type" label="Tipo de contratação" :error="form.errors.employment_type" required v-slot="{ describedBy, invalid }"><select id="employment_type" v-model="form.employment_type" class="field" :aria-invalid="invalid" :aria-describedby="describedBy"><option v-for="o in options.employment_types" :key="o.value" :value="o.value">{{ o.label }}</option></select></Field>
                            <Field id="city" label="Cidade" :error="form.errors.city" :required="!isRemote" :hint="isRemote ? 'Opcional para vagas remotas.' : undefined" v-slot="{ describedBy, invalid }"><input id="city" v-model="form.city" maxlength="120" :required="!isRemote" class="field" :aria-invalid="invalid" :aria-describedby="describedBy" /></Field>
                            <Field id="state" label="Estado (UF)" :error="form.errors.state" :required="!isRemote" v-slot="{ describedBy, invalid }"><input id="state" v-model="form.state" maxlength="2" :required="!isRemote" class="field uppercase" placeholder="SP" :aria-invalid="invalid" :aria-describedby="describedBy" /></Field>
                            <Field id="experience_level" label="Nível de experiência" :error="form.errors.experience_level" v-slot="{ describedBy, invalid }"><select id="experience_level" v-model="form.experience_level" class="field" :aria-invalid="invalid" :aria-describedby="describedBy"><option value="">Não informado</option><option v-for="o in options.experience_levels" :key="o.value" :value="o.value">{{ o.label }}</option></select></Field>
                        </div>
                    </section>

                    <section class="card space-y-4 p-5" aria-labelledby="s-salario">
                        <div><h2 id="s-salario" class="text-lg font-extrabold text-ink">Remuneração</h2><p class="text-sm text-muted">Preencha somente se o salário foi divulgado na fonte. Nunca estime valores.</p></div>
                        <div class="grid gap-4 sm:grid-cols-4">
                            <Field id="salary_min" label="Mínimo" :error="form.errors.salary_min" v-slot="{ describedBy, invalid }"><input id="salary_min" v-model="form.salary_min" type="number" min="0" step="0.01" inputmode="decimal" class="field" :aria-invalid="invalid" :aria-describedby="describedBy" /></Field>
                            <Field id="salary_max" label="Máximo" :error="form.errors.salary_max" v-slot="{ describedBy, invalid }"><input id="salary_max" v-model="form.salary_max" type="number" min="0" step="0.01" inputmode="decimal" class="field" :aria-invalid="invalid" :aria-describedby="describedBy" /></Field>
                            <Field id="salary_currency" label="Moeda" v-slot="{ describedBy }"><select id="salary_currency" v-model="form.salary_currency" class="field" :aria-describedby="describedBy"><option value="BRL">BRL (R$)</option><option value="USD">USD</option><option value="EUR">EUR</option></select></Field>
                            <Field id="salary_period" label="Periodicidade" :error="form.errors.salary_period" :required="hasSalary" v-slot="{ describedBy, invalid }"><select id="salary_period" v-model="form.salary_period" :required="hasSalary" class="field" :aria-invalid="invalid" :aria-describedby="describedBy"><option value="">—</option><option v-for="o in options.salary_periods" :key="o.value" :value="o.value">{{ o.label }}</option></select></Field>
                        </div>
                    </section>

                    <section class="card space-y-5 p-5" aria-labelledby="s-conteudo">
                        <div><h2 id="s-conteudo" class="text-lg font-extrabold text-ink">Conteúdo da vaga</h2><p class="text-sm text-muted">Preserve o texto da fonte. Campos vazios não são exibidos no site. O HTML é sanitizado ao salvar.</p></div>
                        <Field v-for="r in rich" :id="r.key" :key="r.key" :label="r.label" :error="form.errors[r.key]" :required="'required' in r && r.required">
                            <RichEditor :id="r.key" v-model="form[r.key]" :label="r.label" :invalid="!!form.errors[r.key]" :min-height="r.key === 'description' ? '12rem' : '8rem'" />
                        </Field>
                        <Field id="company_about" label="Sobre a empresa" :error="form.errors.company_about" hint="Somente informações verificadas." v-slot="{ describedBy, invalid }"><textarea id="company_about" v-model="form.company_about" rows="3" maxlength="5000" class="field" :aria-invalid="invalid" :aria-describedby="describedBy" /></Field>
                    </section>

                    <section class="card space-y-4 p-5" aria-labelledby="s-fonte">
                        <h2 id="s-fonte" class="text-lg font-extrabold text-ink">Candidatura e fonte</h2>
                        <Field id="platform" label="Plataforma de contratação" :error="form.errors.platform_id" hint="Por onde o candidato se inscreve. Gerencie a lista em Plataformas." required v-slot="{ describedBy, invalid }">
                            <select id="platform" v-model="form.platform_id" required class="field" :aria-invalid="invalid" :aria-describedby="describedBy"><option v-for="o in options.platforms" :key="o.value" :value="o.value">{{ o.label }}</option></select>
                        </Field>
                        <Field v-if="byEmail" id="apply_email" label="E-mail para candidatura" :error="form.errors.apply_email" hint="Candidatura sem link: o botão abrirá o e-mail do candidato já endereçado." required v-slot="{ describedBy, invalid }"><input id="apply_email" v-model="form.apply_email" type="email" required maxlength="190" class="field" placeholder="rh@empresa.com.br" :aria-invalid="invalid" :aria-describedby="describedBy" /></Field>
                        <Field v-else id="apply_url" label="URL direta de candidatura" :error="form.errors.apply_url" hint="Para onde o candidato será levado. Aceita apenas http(s); prefira https." required v-slot="{ describedBy, invalid }"><input id="apply_url" v-model="form.apply_url" type="url" required maxlength="1000" class="field" placeholder="https://" :aria-invalid="invalid" :aria-describedby="describedBy" /></Field>
                        <div class="grid gap-4 sm:grid-cols-2">
                            <Field id="source_url" label="URL original da vaga" :error="form.errors.source_url" v-slot="{ describedBy, invalid }"><input id="source_url" v-model="form.source_url" type="url" maxlength="1000" class="field" placeholder="https://" :aria-invalid="invalid" :aria-describedby="describedBy" /></Field>
                            <Field id="source_name" label="Fonte" :error="form.errors.source_name" hint="Ex.: Gupy, LinkedIn, site da empresa" v-slot="{ describedBy, invalid }"><input id="source_name" v-model="form.source_name" maxlength="120" class="field" :aria-invalid="invalid" :aria-describedby="describedBy" /></Field>
                            <Field id="source_published_at" label="Publicada originalmente em" :error="form.errors.source_published_at" hint="Data na fonte. Não altera a data de publicação no VagasPlus." v-slot="{ describedBy, invalid }"><input id="source_published_at" v-model="form.source_published_at" type="datetime-local" class="field" :aria-invalid="invalid" :aria-describedby="describedBy" /></Field>
                        </div>
                    </section>
                </div>

                <!-- Coluna lateral: publicação e ciclo de vida -->
                <aside class="space-y-4 lg:sticky lg:top-6" aria-label="Publicação">
                    <section class="card space-y-4 p-5" aria-labelledby="s-pub">
                        <h2 id="s-pub" class="text-lg font-extrabold text-ink">Publicação</h2>

                        <template v-if="lifecycleEditable">
                            <fieldset>
                                <legend class="label">Validade da vaga</legend>
                                <div class="flex flex-wrap gap-1.5">
                                    <button v-for="d in validity.presets" :key="d" type="button" class="btn btn-sm rounded-full border" :class="!customValidity && form.validity_days === d ? 'border-action-600 bg-action-50 text-action-700' : 'border-line-strong bg-white text-ink'" :aria-pressed="!customValidity && form.validity_days === d" @click="pickValidity(d)">{{ d }} dias</button>
                                    <button type="button" class="btn btn-sm rounded-full border" :class="customValidity ? 'border-action-600 bg-action-50 text-action-700' : 'border-line-strong bg-white text-ink'" :aria-pressed="customValidity" @click="pickValidity(null)">Personalizada</button>
                                </div>
                                <p class="hint">Padrão: {{ validity.default }} dias · máximo: {{ validity.max }} dias. É um prazo operacional do portal, não garante que a vaga siga aberta.</p>
                            </fieldset>
                            <Field v-if="customValidity" id="expires_at" label="Expira em" :error="form.errors.expires_at" v-slot="{ describedBy, invalid }"><input id="expires_at" v-model="form.expires_at" type="datetime-local" class="field" :aria-invalid="invalid" :aria-describedby="describedBy" /></Field>
                            <p v-else-if="form.errors.expires_at" class="error-text" role="alert">{{ form.errors.expires_at }}</p>
                            <Field id="publish_at" label="Publicar em" :error="form.errors.publish_at" hint="Deixe vazio para publicar agora. Use data futura para agendar." v-slot="{ describedBy, invalid }"><input id="publish_at" v-model="form.publish_at" type="datetime-local" class="field" :aria-invalid="invalid" :aria-describedby="describedBy" /></Field>
                        </template>
                        <dl v-else-if="j" class="space-y-2 text-sm">
                            <div class="flex justify-between gap-3"><dt class="text-muted">Publicada em</dt><dd class="font-semibold text-ink">{{ formatDateTime(j.publish_at) }}</dd></div>
                            <div class="flex justify-between gap-3"><dt class="text-muted">Expira em</dt><dd class="font-semibold text-ink">{{ formatDateTime(j.expires_at) }}</dd></div>
                        </dl>

                        <label class="flex items-start gap-2 text-sm"><input v-model="form.is_featured" type="checkbox" class="mt-0.5 size-4 rounded border-line-strong text-action-600" /><span><span class="font-semibold text-ink">Vaga em destaque</span><span class="block text-xs text-muted">Aparece na home enquanto estiver válida.</span></span></label>

                        <div class="space-y-2 border-t border-line pt-4">
                            <template v-if="lifecycleEditable">
                                <button type="button" class="btn-primary w-full" :disabled="form.processing" @click="submit('publish')"><Loader2 v-if="form.processing && form.action === 'publish'" class="size-4 animate-spin" /><Send v-else class="size-4" aria-hidden="true" />Publicar agora</button>
                                <button type="button" class="btn-secondary w-full" :disabled="form.processing" @click="submit('schedule')"><CalendarClock class="size-4" aria-hidden="true" />Agendar publicação</button>
                            </template>
                            <button type="submit" class="w-full" :class="lifecycleEditable ? 'btn-ghost' : 'btn-primary'" :disabled="form.processing"><Loader2 v-if="form.processing && form.action === 'save'" class="size-4 animate-spin" /><Save v-else class="size-4" aria-hidden="true" />{{ lifecycleEditable ? 'Salvar como rascunho' : 'Salvar alterações' }}</button>
                        </div>
                    </section>

                    <section v-if="j" class="card space-y-2 p-5" aria-labelledby="s-acoes">
                        <h2 id="s-acoes" class="text-lg font-extrabold text-ink">Ações</h2>
                        <a :href="j.preview_url" target="_blank" rel="noopener" class="btn-secondary w-full"><Eye class="size-4" aria-hidden="true" />Pré-visualizar</a>
                        <a v-if="j.public_url" :href="j.public_url" target="_blank" rel="noopener" class="btn-secondary w-full"><ExternalLink class="size-4" aria-hidden="true" />Ver no site</a>
                        <button v-if="['published', 'expired'].includes(j.status)" type="button" class="btn-secondary w-full" @click="renewOpen = true"><RefreshCw class="size-4" aria-hidden="true" />Renovar validade</button>
                        <button v-if="j.status === 'scheduled'" type="button" class="btn-secondary w-full" :disabled="acting" @click="post(`/admin/vagas/${j.id}/cancelar-agendamento`)"><Undo2 class="size-4" aria-hidden="true" />Cancelar agendamento</button>
                        <button v-if="j.status === 'archived'" type="button" class="btn-secondary w-full" :disabled="acting" @click="post(`/admin/vagas/${j.id}/restaurar`)"><ArchiveRestore class="size-4" aria-hidden="true" />Restaurar como rascunho</button>
                        <button v-else type="button" class="btn-secondary w-full text-danger-700 hover:border-danger-700 hover:bg-danger-50" @click="confirmArchive = true"><Archive class="size-4" aria-hidden="true" />Arquivar</button>
                    </section>

                    <section v-if="j && j.history.length" class="card p-5" aria-labelledby="s-hist">
                        <h2 id="s-hist" class="mb-3 text-lg font-extrabold text-ink">Histórico</h2>
                        <ol class="space-y-3 border-l border-line pl-4">
                            <li v-for="h in j.history" :key="h.id" class="relative text-sm">
                                <span class="absolute top-1.5 -left-[1.3rem] size-2 rounded-full bg-action-600 ring-4 ring-white" aria-hidden="true" />
                                <p class="font-semibold text-ink">{{ eventLabel[h.event] ?? h.event }}</p>
                                <p class="text-xs text-muted">{{ h.user }} · {{ formatDateTime(h.at) }}</p>
                                <p v-if="h.event === 'renewed' && h.meta?.expires_at" class="text-xs text-muted">Nova expiração: {{ formatDateTime(h.meta.expires_at as string) }}</p>
                            </li>
                        </ol>
                    </section>
                </aside>
            </div>
        </form>

        <template v-if="j">
            <ConfirmDialog :open="confirmArchive" danger confirm-label="Arquivar vaga" title="Arquivar esta vaga?" :message="status === 'published' ? 'A vaga está no ar e será retirada do site imediatamente.' : 'A vaga será arquivada e não aparecerá publicamente.'" :processing="acting" @cancel="confirmArchive = false" @confirm="post(`/admin/vagas/${j.id}/arquivar`, () => (confirmArchive = false))" />
            <RenewDialog :open="renewOpen" :job-id="j.id" :title="j.title" :expired="j.status === 'expired'" :presets="validity.presets" @close="renewOpen = false" />
        </template>
    </AdminLayout>
</template>
