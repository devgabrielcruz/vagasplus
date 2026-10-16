<script setup lang="ts">
import { AlertCircle, CheckCircle2, ChevronDown, Loader2, Sparkles } from 'lucide-vue-next';
import { nextTick, ref } from 'vue';

export interface ImportResult {
    fields: Record<string, unknown>;
    via: 'structured' | 'rules' | 'ai';
    notes: string[];
    company_match: { label: string; logo: string | null; data: Record<string, unknown> } | null;
}

defineProps<{ aiConfigured: boolean }>();
const emit = defineEmits<{ (e: 'imported', r: ImportResult): void }>();

const open = ref(true);
const url = ref('');
const text = ref('');
const loading = ref(false);
const error = ref('');
const result = ref<ImportResult | null>(null);
const textEl = ref<HTMLTextAreaElement | null>(null);

const viaLabel: Record<string, string> = { structured: 'dados estruturados da página, sem IA', rules: 'regras simples, sem IA', ai: 'IA com regras simples' };

function csrf(): string {
    const m = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]+)/);
    return m ? decodeURIComponent(m[1]) : '';
}

async function run() {
    error.value = '';
    result.value = null;

    const link = url.value.trim();
    const body = text.value.trim();

    if (!link && !body) {
        error.value = 'Informe o link da vaga ou cole o texto do anúncio.';
        return;
    }

    // Com texto: o texto é lido e o link (opcional) só identifica a plataforma/origem.
    // Só com link: a página é lida pelo servidor.
    const payload = body ? { source: body, url: link || null } : { source: link };

    loading.value = true;
    try {
        const res = await fetch('/admin/vagas/importar', {
            method: 'POST',
            credentials: 'same-origin',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json', 'X-XSRF-TOKEN': csrf(), 'X-Requested-With': 'XMLHttpRequest' },
            body: JSON.stringify(payload),
        });
        const json = await res.json().catch(() => ({}));
        if (!res.ok) {
            error.value = json.message ?? Object.values(json.errors ?? {}).flat()[0] ?? 'Não foi possível importar. Preencha manualmente.';
            if (!body) {
                await nextTick();
                textEl.value?.focus();
            }
            return;
        }
        result.value = json as ImportResult;
        emit('imported', json as ImportResult);
    } catch {
        error.value = 'Falha de conexão. Tente novamente.';
    } finally {
        loading.value = false;
    }
}
</script>

<template>
    <section class="card mb-6 overflow-hidden" aria-labelledby="imp-title">
        <button type="button" class="flex w-full items-center justify-between gap-3 px-5 py-4 text-left" :aria-expanded="open" aria-controls="imp-body" @click="open = !open">
            <span class="flex items-center gap-3">
                <span class="grid size-9 place-items-center rounded-xl bg-action-50 text-action-700"><Sparkles class="size-5" aria-hidden="true" /></span>
                <span><span id="imp-title" class="block text-base font-extrabold text-ink">Importar de link ou texto</span><span class="block text-xs text-muted">Preenche o formulário para você revisar. Primeiro sem IA; a IA só entra como reserva.</span></span>
            </span>
            <ChevronDown class="size-5 shrink-0 text-muted transition" :class="open ? 'rotate-180' : ''" aria-hidden="true" />
        </button>

        <div v-show="open" id="imp-body" class="space-y-4 border-t border-line px-5 py-4">
            <div>
                <label for="imp-url" class="label">Link da vaga</label>
                <input id="imp-url" v-model="url" type="url" maxlength="1000" class="field" placeholder="https://empresa.gupy.io/jobs/123" :disabled="loading" />
                <p class="hint">Páginas com dados estruturados (Gupy, Greenhouse, Lever…) e a InHire são lidas direto, sem IA; as demais vão para o Gemini.</p>
            </div>

            <div>
                <label for="imp-text" class="label">Ou cole o texto do anúncio <span class="font-normal text-muted">(para páginas que não carregam sozinhas, como a InHire, LinkedIn e Indeed)</span></label>
                <textarea id="imp-text" ref="textEl" v-model="text" rows="5" maxlength="60000" class="field" placeholder="Copie todo o conteúdo da página da vaga e cole aqui. O link acima, se informado, identifica a plataforma e vira o link de candidatura." :disabled="loading" @keydown.ctrl.enter="run" />
                <p class="hint">
                    <template v-if="aiConfigured">Gemini ativo: ele lê links e textos de qualquer site e o resultado é conferido por você antes de salvar.</template>
                    <template v-else>Sem a IA, usamos regras simples (cargo, seções, local, modalidade, salário explícito). Para ler qualquer site com qualidade, cadastre a chave do Gemini em Configurações.</template>
                </p>
            </div>

            <div class="flex flex-wrap items-center gap-3">
                <button type="button" class="btn-primary" :disabled="loading" @click="run">
                    <Loader2 v-if="loading" class="size-4 animate-spin" aria-hidden="true" /><Sparkles v-else class="size-4" aria-hidden="true" />{{ loading ? 'Lendo a vaga…' : 'Importar e preencher' }}
                </button>
                <span v-if="loading" class="text-xs text-muted" role="status">Pode levar alguns segundos.</span>
            </div>

            <p v-if="error" class="flex items-start gap-2 rounded-lg bg-danger-50 p-3 text-sm font-medium text-danger-700" role="alert"><AlertCircle class="mt-0.5 size-4 shrink-0" aria-hidden="true" />{{ error }}</p>

            <div v-if="result" class="rounded-lg bg-success-50 p-3 text-sm text-success-700" role="status">
                <p class="flex items-center gap-2 font-bold"><CheckCircle2 class="size-4" aria-hidden="true" />Formulário preenchido ({{ viaLabel[result.via] }}). Revise tudo antes de salvar.</p>
                <ul class="mt-1.5 list-disc space-y-0.5 pl-6 text-xs">
                    <li v-for="n in result.notes" :key="n">{{ n }}</li>
                </ul>
            </div>
        </div>
    </section>
</template>
