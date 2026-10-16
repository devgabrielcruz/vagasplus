<script setup lang="ts">
import { useForm } from '@inertiajs/vue3';
import { CheckCircle2, ClipboardCheck, Loader2, PenLine, Send, ShieldCheck } from 'lucide-vue-next';
import { computed } from 'vue';
import Breadcrumbs from '@/components/Breadcrumbs.vue';
import Field from '@/components/Field.vue';
import LogoField from '@/components/LogoField.vue';
import PublicLayout from '@/layouts/PublicLayout.vue';
import type { Option, Seo } from '@/types';

const props = defineProps<{
    categories: { id: number; name: string }[];
    platforms: { value: number; label: string; logo: string | null; uses_email: boolean }[];
    options: { work_modes: Option[]; employment_types: Option[]; experience_levels: Option[]; salary_periods: Option[] };
    seo: Seo;
}>();

const form = useForm({
    submitter_name: '',
    submitter_email: '',
    submitter_phone: '',
    company_name: '',
    company_website_url: '',
    company_logo: null as File | null,
    title: '',
    category_id: '' as number | '',
    work_mode: 'onsite',
    employment_type: 'clt',
    experience_level: '',
    city: '',
    state: '',
    description: '',
    requirements: '',
    benefits: '',
    salary_min: '',
    salary_max: '',
    salary_period: '',
    platform_id: (props.platforms[0]?.value ?? '') as number | '',
    apply_url: '',
    apply_email: '',
    authorized: false,
    website_confirm: '', // armadilha para robôs
});

const isRemote = computed(() => form.work_mode === 'remote');
const hasSalary = computed(() => form.salary_min !== '' || form.salary_max !== '');
const byEmail = computed(() => !!props.platforms.find((p) => p.value === form.platform_id)?.uses_email);
const errorCount = computed(() => Object.keys(form.errors).length);

const submit = () =>
    form.post('/publicar-vaga', {
        forceFormData: true,
        preserveScroll: true,
        onError: () => document.getElementById('resumo-erros')?.focus(),
    });

const steps = [
    { icon: PenLine, t: 'Você envia', d: 'Preencha os dados da vaga. Não precisa de cadastro.' },
    { icon: ClipboardCheck, t: 'Nós analisamos', d: 'Nossa equipe confere as informações e o link de candidatura.' },
    { icon: CheckCircle2, t: 'Publicamos', d: 'Aprovada, a vaga entra no ar com página própria e link para compartilhar.' },
];
</script>

<template>
    <PublicLayout :seo="seo">
        <div class="container-page py-6 sm:py-10">
            <Breadcrumbs :items="[{ label: 'Início', url: '/' }, { label: 'Publicar uma vaga', url: null }]" />

            <header class="mt-5 max-w-3xl">
                <h1 class="t-h1 text-ink">Publicar uma vaga</h1>
                <p class="mt-2 text-muted">Divulgue sua oportunidade para quem busca emprego todos os dias. A divulgação é gratuita e passa por uma análise antes de ir ao ar.</p>
            </header>

            <ol class="mt-6 grid gap-3 sm:grid-cols-3" aria-label="Como funciona">
                <li v-for="(s, i) in steps" :key="i" class="card flex items-start gap-3 p-4">
                    <span class="grid size-9 shrink-0 place-items-center rounded-xl bg-action-50 text-action-700"><component :is="s.icon" class="size-5" aria-hidden="true" /></span>
                    <span><span class="block text-sm font-bold text-ink">{{ i + 1 }}. {{ s.t }}</span><span class="text-xs text-muted">{{ s.d }}</span></span>
                </li>
            </ol>

            <form class="mt-8 max-w-3xl space-y-6" @submit.prevent="submit">
                <div v-if="errorCount" id="resumo-erros" tabindex="-1" role="alert" class="rounded-xl border border-danger-700/25 bg-danger-50 p-4 text-sm text-danger-700">
                    <p class="font-bold">Corrija {{ errorCount }} {{ errorCount === 1 ? 'campo' : 'campos' }} para enviar:</p>
                    <ul class="mt-1 list-disc pl-5"><li v-for="(msg, key) in form.errors" :key="key">{{ msg }}</li></ul>
                </div>

                <!-- Armadilha para robôs: invisível para pessoas -->
                <div class="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
                    <label for="website_confirm">Não preencha este campo</label>
                    <input id="website_confirm" v-model="form.website_confirm" type="text" tabindex="-1" autocomplete="off" />
                </div>

                <section class="card space-y-4 p-5 sm:p-6" aria-labelledby="s-you">
                    <div><h2 id="s-you" class="t-h2 text-ink">Seus dados</h2><p class="text-sm text-muted">Usados só para a nossa equipe falar com você sobre a vaga. Não são exibidos no site.</p></div>
                    <div class="grid gap-4 sm:grid-cols-2">
                        <Field id="submitter_name" label="Seu nome" :error="form.errors.submitter_name" required v-slot="{ describedBy, invalid }"><input id="submitter_name" v-model="form.submitter_name" required maxlength="120" autocomplete="name" class="field" :aria-invalid="invalid" :aria-describedby="describedBy" /></Field>
                        <Field id="submitter_email" label="Seu e-mail" :error="form.errors.submitter_email" required v-slot="{ describedBy, invalid }"><input id="submitter_email" v-model="form.submitter_email" type="email" required maxlength="190" autocomplete="email" class="field" :aria-invalid="invalid" :aria-describedby="describedBy" /></Field>
                        <Field id="submitter_phone" label="Telefone / WhatsApp" :error="form.errors.submitter_phone" hint="Opcional" v-slot="{ describedBy, invalid }"><input id="submitter_phone" v-model="form.submitter_phone" type="tel" maxlength="30" autocomplete="tel" class="field" :aria-invalid="invalid" :aria-describedby="describedBy" /></Field>
                    </div>
                </section>

                <section class="card space-y-4 p-5 sm:p-6" aria-labelledby="s-company">
                    <h2 id="s-company" class="t-h2 text-ink">Empresa</h2>
                    <div class="grid gap-4 sm:grid-cols-2">
                        <Field id="company_name" label="Nome da empresa" :error="form.errors.company_name" required v-slot="{ describedBy, invalid }"><input id="company_name" v-model="form.company_name" required maxlength="160" autocomplete="organization" class="field" :aria-invalid="invalid" :aria-describedby="describedBy" /></Field>
                        <Field id="company_website_url" label="Site da empresa" :error="form.errors.company_website_url" hint="Opcional. Comece com https://" v-slot="{ describedBy, invalid }"><input id="company_website_url" v-model="form.company_website_url" type="url" class="field" placeholder="https://" :aria-invalid="invalid" :aria-describedby="describedBy" /></Field>
                    </div>
                    <LogoField id="company_logo" url="" v-model:file="form.company_logo" :remove="false" hide-url :error="form.errors.company_logo" :name="form.company_name" />
                </section>

                <section class="card space-y-4 p-5 sm:p-6" aria-labelledby="s-job">
                    <h2 id="s-job" class="t-h2 text-ink">A vaga</h2>
                    <Field id="title" label="Título da vaga" :error="form.errors.title" required v-slot="{ describedBy, invalid }"><input id="title" v-model="form.title" required minlength="3" maxlength="180" class="field" placeholder="Ex.: Analista de Suporte" :aria-invalid="invalid" :aria-describedby="describedBy" /></Field>
                    <div class="grid gap-4 sm:grid-cols-2">
                        <Field id="category_id" label="Categoria" :error="form.errors.category_id" required v-slot="{ describedBy, invalid }"><select id="category_id" v-model="form.category_id" required class="field" :aria-invalid="invalid" :aria-describedby="describedBy"><option value="" disabled>Selecione…</option><option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option></select></Field>
                        <Field id="work_mode" label="Modalidade" :error="form.errors.work_mode" required v-slot="{ describedBy, invalid }"><select id="work_mode" v-model="form.work_mode" class="field" :aria-invalid="invalid" :aria-describedby="describedBy"><option v-for="o in options.work_modes" :key="o.value" :value="o.value">{{ o.label }}</option></select></Field>
                        <Field id="employment_type" label="Tipo de contratação" :error="form.errors.employment_type" required v-slot="{ describedBy, invalid }"><select id="employment_type" v-model="form.employment_type" class="field" :aria-invalid="invalid" :aria-describedby="describedBy"><option v-for="o in options.employment_types" :key="o.value" :value="o.value">{{ o.label }}</option></select></Field>
                        <Field id="experience_level" label="Nível de experiência" :error="form.errors.experience_level" v-slot="{ describedBy, invalid }"><select id="experience_level" v-model="form.experience_level" class="field" :aria-invalid="invalid" :aria-describedby="describedBy"><option value="">Não informado</option><option v-for="o in options.experience_levels" :key="o.value" :value="o.value">{{ o.label }}</option></select></Field>
                        <Field id="city" label="Cidade" :error="form.errors.city" :required="!isRemote" :hint="isRemote ? 'Opcional para vagas remotas.' : undefined" v-slot="{ describedBy, invalid }"><input id="city" v-model="form.city" maxlength="120" :required="!isRemote" class="field" :aria-invalid="invalid" :aria-describedby="describedBy" /></Field>
                        <Field id="state" label="Estado (UF)" :error="form.errors.state" :required="!isRemote" v-slot="{ describedBy, invalid }"><input id="state" v-model="form.state" maxlength="2" :required="!isRemote" class="field uppercase" placeholder="SP" :aria-invalid="invalid" :aria-describedby="describedBy" /></Field>
                    </div>
                    <Field id="description" label="Descrição da vaga" :error="form.errors.description" hint="Atividades do dia a dia, contexto da equipe e o que a pessoa vai fazer." required v-slot="{ describedBy, invalid }"><textarea id="description" v-model="form.description" required rows="6" minlength="30" maxlength="20000" class="field" :aria-invalid="invalid" :aria-describedby="describedBy" /></Field>
                    <Field id="requirements" label="Requisitos" :error="form.errors.requirements" hint="Opcional. Um por linha." v-slot="{ describedBy, invalid }"><textarea id="requirements" v-model="form.requirements" rows="4" maxlength="20000" class="field" :aria-invalid="invalid" :aria-describedby="describedBy" /></Field>
                    <Field id="benefits" label="Benefícios" :error="form.errors.benefits" hint="Opcional." v-slot="{ describedBy, invalid }"><textarea id="benefits" v-model="form.benefits" rows="3" maxlength="20000" class="field" :aria-invalid="invalid" :aria-describedby="describedBy" /></Field>

                    <fieldset>
                        <legend class="label">Salário <span class="font-normal text-muted">(opcional — informe só se for divulgar)</span></legend>
                        <div class="grid gap-4 sm:grid-cols-3">
                            <Field id="salary_min" label="Mínimo (R$)" :error="form.errors.salary_min" v-slot="{ describedBy, invalid }"><input id="salary_min" v-model="form.salary_min" type="number" min="0" step="0.01" inputmode="decimal" class="field" :aria-invalid="invalid" :aria-describedby="describedBy" /></Field>
                            <Field id="salary_max" label="Máximo (R$)" :error="form.errors.salary_max" v-slot="{ describedBy, invalid }"><input id="salary_max" v-model="form.salary_max" type="number" min="0" step="0.01" inputmode="decimal" class="field" :aria-invalid="invalid" :aria-describedby="describedBy" /></Field>
                            <Field id="salary_period" label="Periodicidade" :error="form.errors.salary_period" :required="hasSalary" v-slot="{ describedBy, invalid }"><select id="salary_period" v-model="form.salary_period" :required="hasSalary" class="field" :aria-invalid="invalid" :aria-describedby="describedBy"><option value="">—</option><option v-for="o in options.salary_periods" :key="o.value" :value="o.value">{{ o.label }}</option></select></Field>
                        </div>
                    </fieldset>
                </section>

                <section class="card space-y-4 p-5 sm:p-6" aria-labelledby="s-apply">
                    <div><h2 id="s-apply" class="t-h2 text-ink">Como se candidatar</h2><p class="text-sm text-muted">O candidato será levado diretamente ao canal que você indicar.</p></div>
                    <Field id="platform_id" label="Plataforma de contratação" :error="form.errors.platform_id" required v-slot="{ describedBy, invalid }"><select id="platform_id" v-model="form.platform_id" required class="field" :aria-invalid="invalid" :aria-describedby="describedBy"><option v-for="o in platforms" :key="o.value" :value="o.value">{{ o.label }}</option></select></Field>
                    <Field v-if="byEmail" id="apply_email" label="E-mail para candidaturas" :error="form.errors.apply_email" required v-slot="{ describedBy, invalid }"><input id="apply_email" v-model="form.apply_email" type="email" required maxlength="190" class="field" placeholder="rh@empresa.com.br" :aria-invalid="invalid" :aria-describedby="describedBy" /></Field>
                    <Field v-else id="apply_url" label="Link de candidatura" :error="form.errors.apply_url" hint="Endereço da vaga na plataforma ou no site da empresa. Comece com https://" required v-slot="{ describedBy, invalid }"><input id="apply_url" v-model="form.apply_url" type="url" required maxlength="1000" class="field" placeholder="https://" :aria-invalid="invalid" :aria-describedby="describedBy" /></Field>
                </section>

                <div class="card space-y-4 p-5 sm:p-6">
                    <label class="flex items-start gap-3 text-sm"><input v-model="form.authorized" type="checkbox" class="mt-0.5 size-4 shrink-0 rounded border-line-strong text-action-600" :aria-invalid="!!form.errors.authorized" /><span class="text-ink">Declaro que tenho autorização para divulgar esta vaga e que as informações são verdadeiras. Concordo com os <a href="/termos" target="_blank" class="font-semibold text-action-700 underline">Termos de uso</a> e a <a href="/privacidade" target="_blank" class="font-semibold text-action-700 underline">Política de privacidade</a>.</span></label>
                    <p v-if="form.errors.authorized" class="error-text" role="alert">{{ form.errors.authorized }}</p>

                    <button type="submit" class="btn-primary btn-lg w-full sm:w-auto" :disabled="form.processing"><Loader2 v-if="form.processing" class="size-4.5 animate-spin" aria-hidden="true" /><Send v-else class="size-4.5" aria-hidden="true" />{{ form.processing ? 'Enviando…' : 'Enviar para análise' }}</button>
                    <p class="flex items-start gap-2 text-xs text-muted"><ShieldCheck class="mt-0.5 size-4 shrink-0" aria-hidden="true" />A vaga só aparece no site depois de aprovada pela nossa equipe. Não cobramos nada para analisar.</p>
                </div>
            </form>
        </div>
    </PublicLayout>
</template>
