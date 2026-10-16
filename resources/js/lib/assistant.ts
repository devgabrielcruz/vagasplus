import { ClipboardList, MessagesSquare, Target } from 'lucide-vue-next';

export type AssistantTool = 'interview' | 'questions' | 'match';

// Metadados das ferramentas de IA da vaga: usados pelo atalho da página e pelas abas do painel.
export const ASSISTANT_TOOLS = [
    { key: 'interview', label: 'Simular entrevista', tab: 'Entrevista', tabShort: 'Entrevista', hint: 'Converse com um recrutador virtual', icon: MessagesSquare, tile: 'bg-action-50 text-action-700', glow: 'bg-action-500/25' },
    { key: 'questions', label: 'Perguntas prováveis', tab: 'Perguntas', tabShort: 'Perguntas', hint: 'O que costumam perguntar e como responder', icon: ClipboardList, tile: 'bg-warning-50 text-warning-700', glow: 'bg-amber-400/30' },
    { key: 'match', label: 'Verificar minha compatibilidade', tab: 'Compatibilidade', tabShort: 'Currículo', hint: 'Veja se seu currículo combina com a vaga', icon: Target, tile: 'bg-success-50 text-success-700', glow: 'bg-emerald-400/30' },
] as const;

export function csrfToken(): string {
    const m = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]+)/);
    return m ? decodeURIComponent(m[1]) : '';
}

export async function postJson<T = Record<string, unknown>>(url: string, body?: unknown): Promise<{ ok: boolean; status: number; json: T & { message?: string; errors?: Record<string, string[]> } }> {
    const res = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json', 'X-XSRF-TOKEN': csrfToken(), 'X-Requested-With': 'XMLHttpRequest' },
        body: body === undefined ? undefined : JSON.stringify(body),
    });

    return { ok: res.ok, status: res.status, json: await res.json().catch(() => ({})) };
}
