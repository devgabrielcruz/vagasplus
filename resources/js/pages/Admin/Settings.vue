<script setup lang="ts">
import { useForm } from '@inertiajs/vue3';
import { CheckCircle2, ExternalLink, Loader2, Save, XCircle } from 'lucide-vue-next';
import { ref } from 'vue';
import Field from '@/components/Field.vue';
import AdminLayout from '@/layouts/AdminLayout.vue';

const props = defineProps<{
    settings: { default_validity_days: number; max_validity_days: number; contact_email: string; adsense_enabled: boolean; adsense_client: string; adsense_slots: Record<string, string> };
    placements: { key: string; label: string }[];
    gemini: { has_key: boolean; source: 'painel' | '.env' | null; masked: string | null; model: string; models: string[] };
}>();

const form = useForm({
    default_validity_days: props.settings.default_validity_days,
    max_validity_days: props.settings.max_validity_days,
    contact_email: props.settings.contact_email,
    adsense_enabled: props.settings.adsense_enabled,
    adsense_client: props.settings.adsense_client,
    gemini_api_key: '',
    remove_gemini_key: false,
    gemini_model: props.gemini.model,
    adsense_slots: Object.fromEntries(props.placements.map((p) => [p.key, props.settings.adsense_slots?.[p.key] ?? ''])) as Record<string, string>,
});

const save = () => form.put('/admin/configuracoes', { preserveScroll: true, onSuccess: () => { form.gemini_api_key = ''; form.remove_gemini_key = false; } });

// Teste de conexão com o Gemini (usa a chave digitada ou, se vazia, a salva).
const testing = ref(false);
const testResult = ref<{ ok: boolean; message: string; received?: string | null } | null>(null);

function csrf(): string {
    const m = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]+)/);
    return m ? decodeURIComponent(m[1]) : '';
}

async function testGemini() {
    testing.value = true;
    testResult.value = null;
    try {
        const res = await fetch('/admin/configuracoes/testar-gemini', {
            method: 'POST',
            credentials: 'same-origin',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json', 'X-XSRF-TOKEN': csrf(), 'X-Requested-With': 'XMLHttpRequest' },
            body: JSON.stringify({ key: form.gemini_api_key || null, model: form.gemini_model || null }),
        });
        const json = await res.json().catch(() => ({}));
        testResult.value = { ok: res.ok && json.ok === true, message: json.message ?? Object.values(json.errors ?? {}).flat()[0] ?? 'Falha no teste.', received: json.received ?? null };
    } catch {
        testResult.value = { ok: false, message: 'Falha de conexão.' };
    } finally {
        testing.value = false;
    }
}
const slotError = (key: string) => (form.errors as Record<string, string>)[`adsense_slots.${key}`];
</script>

<template>
    <AdminLayout title="Configurações">
        <div class="mx-auto max-w-3xl">
            <header class="mb-5"><h1 class="text-2xl font-extrabold text-ink">Configurações</h1><p class="text-sm text-muted">Regras operacionais e publicidade do portal.</p></header>

            <form class="space-y-6" @submit.prevent="save">
                <section class="card space-y-5 p-5 sm:p-6" aria-labelledby="cfg-validade">
                    <h2 id="cfg-validade" class="text-lg font-extrabold text-ink">Validade das vagas</h2>
                    <div class="grid gap-4 sm:grid-cols-2">
                        <Field id="default_validity_days" label="Validade padrão (dias)" :error="form.errors.default_validity_days" hint="Sugerida ao publicar uma vaga." required v-slot="{ describedBy, invalid }"><input id="default_validity_days" v-model.number="form.default_validity_days" type="number" min="1" max="365" required class="field" :aria-invalid="invalid" :aria-describedby="describedBy" /></Field>
                        <Field id="max_validity_days" label="Validade máxima (dias)" :error="form.errors.max_validity_days" hint="Nenhuma vaga pode ser publicada ou renovada além deste prazo." required v-slot="{ describedBy, invalid }"><input id="max_validity_days" v-model.number="form.max_validity_days" type="number" min="1" max="365" required class="field" :aria-invalid="invalid" :aria-describedby="describedBy" /></Field>
                    </div>
                    <Field id="contact_email" label="E-mail de contato público" :error="form.errors.contact_email" hint="Exibido no rodapé, nas páginas institucionais e nos espaços “Anuncie aqui”." required v-slot="{ describedBy, invalid }"><input id="contact_email" v-model="form.contact_email" type="email" required class="field" :aria-invalid="invalid" :aria-describedby="describedBy" /></Field>
                </section>

                <section class="card space-y-5 p-5 sm:p-6" aria-labelledby="cfg-ia">
                    <div>
                        <h2 id="cfg-ia" class="text-lg font-extrabold text-ink">IA para importar vagas (Google Gemini)</h2>
                        <p class="mt-1 text-sm text-muted">Lê links e textos de qualquer site e preenche o formulário da vaga. A chave é gratuita em <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1 font-semibold text-action-700 hover:underline">Google AI Studio<ExternalLink class="size-3" aria-hidden="true" /></a>. Só é usada quando você importa uma vaga; o site público nunca chama a IA.</p>
                    </div>

                    <p class="flex items-center gap-2 text-sm font-semibold" :class="gemini.has_key ? 'text-success-700' : 'text-warning-700'">
                        <CheckCircle2 v-if="gemini.has_key" class="size-4" aria-hidden="true" /><XCircle v-else class="size-4" aria-hidden="true" />
                        <template v-if="gemini.has_key">Chave configurada ({{ gemini.masked }}) · origem: {{ gemini.source === 'painel' ? 'este painel' : 'arquivo .env' }}</template>
                        <template v-else>Nenhuma chave configurada. Sem ela, só páginas com dados estruturados e o texto colado (regras simples) são lidos.</template>
                    </p>

                    <Field id="gemini_api_key" label="Chave de API do Gemini" :error="form.errors.gemini_api_key" :hint="gemini.has_key ? 'Deixe em branco para manter a chave atual. Digite uma nova para substituir.' : 'Cole a chave inteira, sem aspas nem espaços. Fica guardada criptografada.'" v-slot="{ describedBy, invalid }">
                        <input id="gemini_api_key" v-model="form.gemini_api_key" type="text" name="gemini-key-field" class="field font-mono text-[13px] [-webkit-text-security:disc]" placeholder="Cole a chave aqui" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" data-1p-ignore data-lpignore="true" :aria-invalid="invalid" :aria-describedby="describedBy" />
                    </Field>

                    <Field id="gemini_model" label="Modelo" :error="form.errors.gemini_model" hint="Padrão: gemini-3.5-flash-lite (rápido e com camada gratuita). O Google desativa modelos antigos: se der erro de modelo, troque por outro da lista." v-slot="{ describedBy, invalid }">
                        <input id="gemini_model" v-model="form.gemini_model" list="gemini-models" class="field font-mono text-[13px]" autocomplete="off" :aria-invalid="invalid" :aria-describedby="describedBy" />
                        <datalist id="gemini-models"><option v-for="m in gemini.models" :key="m" :value="m" /></datalist>
                    </Field>

                    <div class="flex flex-wrap items-center gap-3">
                        <button type="button" class="btn-secondary" :disabled="testing || (!gemini.has_key && !form.gemini_api_key)" @click="testGemini">
                            <Loader2 v-if="testing" class="size-4 animate-spin" aria-hidden="true" />{{ testing ? 'Testando…' : 'Testar conexão' }}
                        </button>
                        <label v-if="gemini.source === 'painel'" class="flex items-center gap-2 text-sm text-muted"><input v-model="form.remove_gemini_key" type="checkbox" class="size-4 rounded border-line-strong text-action-600" />Remover a chave salva</label>
                    </div>
                    <p v-if="testResult" class="flex items-start gap-2 rounded-lg p-3 text-sm font-medium" :class="testResult.ok ? 'bg-success-50 text-success-700' : 'bg-danger-50 text-danger-700'" role="status">
                        <CheckCircle2 v-if="testResult.ok" class="mt-0.5 size-4 shrink-0" aria-hidden="true" /><XCircle v-else class="mt-0.5 size-4 shrink-0" aria-hidden="true" />{{ testResult.message }}
                        <span v-if="testResult.received" class="mt-1 block text-xs font-normal">Chave recebida pelo sistema: {{ testResult.received }}. Compare com a que você copiou.</span>
                    </p>
                    <p class="text-xs text-muted">Privacidade: no plano gratuito o Google pode usar o conteúdo enviado para melhorar os produtos dele. Só enviamos o texto público da vaga, nunca dados de candidatos ou de quem enviou a vaga.</p>
                </section>
                <section class="card space-y-5 p-5 sm:p-6" aria-labelledby="cfg-ads">
                    <div>
                        <h2 id="cfg-ads" class="text-lg font-extrabold text-ink">Google AdSense</h2>
                        <p class="mt-1 text-sm text-muted">Cole o ID do editor e o ID de cada unidade de anúncio criada no <a href="https://adsense.google.com" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1 font-semibold text-action-700 hover:underline">painel do AdSense<ExternalLink class="size-3" aria-hidden="true" /></a>. Posições sem ID continuam mostrando “Anuncie aqui” (venda direta).</p>
                    </div>

                    <label class="flex items-start gap-2 text-sm"><input v-model="form.adsense_enabled" type="checkbox" class="mt-0.5 size-4 rounded border-line-strong text-action-600" /><span><span class="font-semibold text-ink">Ativar AdSense no site</span><span class="block text-xs text-muted">Carrega o script do Google e exibe as unidades configuradas abaixo.</span></span></label>

                    <Field id="adsense_client" label="ID do editor" :error="form.errors.adsense_client" hint="Formato: ca-pub-0000000000000000. O arquivo /ads.txt é gerado automaticamente a partir dele." v-slot="{ describedBy, invalid }">
                        <input id="adsense_client" v-model="form.adsense_client" class="field font-mono text-[13px]" placeholder="ca-pub-0000000000000000" autocomplete="off" spellcheck="false" :aria-invalid="invalid" :aria-describedby="describedBy" />
                    </Field>

                    <fieldset>
                        <legend class="label">ID da unidade de anúncio por posição</legend>
                        <div class="divide-y divide-line rounded-xl border border-line">
                            <div v-for="p in placements" :key="p.key" class="grid items-center gap-2 px-4 py-3 sm:grid-cols-[1fr_12rem]">
                                <label :for="`slot-${p.key}`" class="text-sm font-medium text-ink">{{ p.label }}</label>
                                <div>
                                    <input :id="`slot-${p.key}`" v-model="form.adsense_slots[p.key]" inputmode="numeric" class="field font-mono text-[13px]" placeholder="1234567890" autocomplete="off" :aria-invalid="!!slotError(p.key)" />
                                    <p v-if="slotError(p.key)" class="error-text" role="alert">{{ slotError(p.key) }}</p>
                                </div>
                            </div>
                        </div>
                    </fieldset>
                </section>

                <button type="submit" class="btn-primary" :disabled="form.processing"><Save class="size-4" aria-hidden="true" />Salvar configurações</button>
            </form>
        </div>
    </AdminLayout>
</template>
