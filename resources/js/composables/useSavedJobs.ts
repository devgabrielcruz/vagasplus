import { computed, onMounted, ref } from 'vue';
import type { JobCardData } from '@/types';

/**
 * "Minhas vagas": vagas salvas no localStorage do navegador (nada vai para o servidor).
 * Estado compartilhado entre todos os componentes; sincroniza entre abas pela API "storage".
 * Guarda um resumo da vaga para a lista funcionar mesmo que a vaga seja encerrada depois.
 */
export interface SavedJob {
    slug: string;
    url: string;
    title: string;
    company: string;
    logo: string | null;
    location: string | null;
    work_mode: string;
    salary: string | null;
    platform: string | null;
    saved_at: number;
}

const KEY = 'vagasplus:saved:v1';
export const MAX_SAVED = 50;

const items = ref<SavedJob[]>([]);
const message = ref<string | null>(null);
let started = false;
let timer: ReturnType<typeof setTimeout> | undefined;

const isValid = (v: unknown): v is SavedJob =>
    typeof v === 'object' && v !== null && typeof (v as SavedJob).slug === 'string' && typeof (v as SavedJob).title === 'string' && typeof (v as SavedJob).url === 'string';

function read(): SavedJob[] {
    try {
        const parsed = JSON.parse(localStorage.getItem(KEY) ?? '[]');
        return Array.isArray(parsed) ? parsed.filter(isValid).slice(0, MAX_SAVED) : [];
    } catch {
        return [];
    }
}

function notify(text: string) {
    message.value = text;
    clearTimeout(timer);
    timer = setTimeout(() => (message.value = null), 3000);
}

function persist(): boolean {
    try {
        localStorage.setItem(KEY, JSON.stringify(items.value));
        return true;
    } catch {
        notify('Não foi possível salvar: o armazenamento do navegador está bloqueado ou cheio.');
        return false;
    }
}

function start() {
    if (started || typeof window === 'undefined') return;
    started = true;
    items.value = read();
    window.addEventListener('storage', (e) => {
        if (e.key === KEY || e.key === null) items.value = read();
    });
}

export function useSavedJobs() {
    // Só no navegador (o servidor renderiza com a lista vazia; sem diferença na hidratação).
    onMounted(start);

    const isSaved = (slug: string) => items.value.some((j) => j.slug === slug);

    function toggle(job: JobCardData) {
        if (isSaved(job.slug)) {
            remove(job.slug);
            return;
        }

        if (items.value.length >= MAX_SAVED) {
            notify(`Você já salvou ${MAX_SAVED} vagas. Remova alguma para salvar outra.`);
            return;
        }

        const before = items.value;
        items.value = [
            {
                slug: job.slug,
                url: job.url,
                title: job.title,
                company: job.company.name,
                logo: job.company.logo_url,
                location: job.location,
                work_mode: job.work_mode.label,
                salary: job.salary,
                platform: job.platform?.label ?? null,
                saved_at: Date.now(),
            },
            ...before,
        ];

        if (persist()) notify('Vaga salva em Minhas vagas.');
        else items.value = before;
    }

    function remove(slug: string) {
        const before = items.value;
        items.value = before.filter((j) => j.slug !== slug);

        if (persist()) notify('Vaga removida de Minhas vagas.');
        else items.value = before;
    }

    function clear() {
        items.value = [];
        persist();
    }

    return { items, count: computed(() => items.value.length), message, isSaved, toggle, remove, clear };
}
