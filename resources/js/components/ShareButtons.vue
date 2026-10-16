<script setup lang="ts">
import { siFacebook, siTelegram, siWhatsapp, siX } from 'simple-icons';
import { Check, Copy, Mail, Share2 } from 'lucide-vue-next';
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';

/**
 * Compartilhar, em duas linhas compactas:
 *   1) ícones das redes (WhatsApp, Facebook, X, LinkedIn, Telegram, e-mail e o compartilhar nativo do aparelho)
 *   2) o link da vaga com botão de copiar
 */
const props = defineProps<{ url: string; title: string }>();

// LinkedIn não faz parte do pacote de marcas usado nas demais redes: ícone próprio (24×24).
const LINKEDIN =
    'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z';

const enc = (s: string) => encodeURIComponent(s);

const networks = computed(() => [
    { name: 'WhatsApp', path: siWhatsapp.path, color: '#25D366', href: `https://wa.me/?text=${enc(`${props.title} ${props.url}`)}` },
    { name: 'Facebook', path: siFacebook.path, color: '#1877F2', href: `https://www.facebook.com/sharer/sharer.php?u=${enc(props.url)}` },
    { name: 'X', path: siX.path, color: '#000000', href: `https://twitter.com/intent/tweet?text=${enc(props.title)}&url=${enc(props.url)}` },
    { name: 'LinkedIn', path: LINKEDIN, color: '#0A66C2', href: `https://www.linkedin.com/sharing/share-offsite/?url=${enc(props.url)}` },
    { name: 'Telegram', path: siTelegram.path, color: '#26A5E4', href: `https://t.me/share/url?url=${enc(props.url)}&text=${enc(props.title)}` },
]);

const mail = computed(() => `mailto:?subject=${enc(props.title)}&body=${enc(`Olha essa vaga: ${props.url}`)}`);
const shown = computed(() => props.url.replace(/^https?:\/\//, ''));

const canShare = ref(false);
const copied = ref(false);
const failed = ref(false);
let timer: ReturnType<typeof setTimeout> | undefined;

onMounted(() => {
    canShare.value = typeof navigator !== 'undefined' && typeof navigator.share === 'function';
});
onBeforeUnmount(() => clearTimeout(timer));

function flash(ok: boolean) {
    copied.value = ok;
    failed.value = !ok;
    clearTimeout(timer);
    timer = setTimeout(() => {
        copied.value = false;
        failed.value = false;
    }, 2200);
}

async function copy() {
    try {
        if (navigator.clipboard?.writeText) {
            await navigator.clipboard.writeText(props.url);
        } else {
            const area = document.createElement('textarea');
            area.value = props.url;
            area.setAttribute('readonly', '');
            area.style.cssText = 'position:fixed;opacity:0';
            document.body.appendChild(area);
            area.select();
            const ok = document.execCommand('copy');
            document.body.removeChild(area);
            if (!ok) throw new Error('copy failed');
        }
        flash(true);
    } catch {
        flash(false);
    }
}

async function nativeShare() {
    try {
        await navigator.share({ title: props.title, text: props.title, url: props.url });
    } catch (e) {
        if ((e as DOMException).name !== 'AbortError') flash(false);
    }
}

const btn = 'grid size-9 place-items-center rounded-full border border-line bg-white text-muted transition-colors duration-150 hover:border-transparent hover:text-white';
</script>

<template>
    <div>
        <p class="mb-2 text-[11px] font-bold tracking-widest text-muted uppercase">Compartilhar vaga</p>

        <ul class="flex flex-wrap gap-1.5">
            <li v-for="n in networks" :key="n.name">
                <a :href="n.href" target="_blank" rel="noopener noreferrer" :class="btn" :style="{ '--brand': n.color }" class="hover:bg-(--brand)" :aria-label="`Compartilhar no ${n.name}`" :title="n.name">
                    <svg viewBox="0 0 24 24" class="size-[17px] fill-current" aria-hidden="true"><path :d="n.path" /></svg>
                </a>
            </li>
            <li>
                <a :href="mail" :class="btn" class="hover:bg-navy-700" aria-label="Compartilhar por e-mail" title="E-mail"><Mail class="size-[17px]" aria-hidden="true" /></a>
            </li>
            <li v-if="canShare">
                <button type="button" :class="btn" class="hover:bg-action-600" aria-label="Mais opções de compartilhamento" title="Mais" @click="nativeShare"><Share2 class="size-[17px]" aria-hidden="true" /></button>
            </li>
        </ul>

        <!-- Link + copiar -->
        <div class="mt-2.5 flex items-center gap-1 rounded-xl border bg-surface py-0.5 pr-0.5 pl-3 transition-colors" :class="copied ? 'border-success-700/40 bg-success-50' : failed ? 'border-danger-700/40 bg-danger-50' : 'border-line-strong'">
            <span class="min-w-0 flex-1 truncate text-xs" :class="copied ? 'font-semibold text-success-700' : failed ? 'font-semibold text-danger-700' : 'text-muted'" :title="url">
                {{ copied ? 'Link copiado!' : failed ? 'Não foi possível copiar' : shown }}
            </span>
            <button type="button" class="grid size-8 shrink-0 place-items-center rounded-lg transition-colors hover:bg-white" :class="copied ? 'text-success-700' : 'text-ink'" aria-label="Copiar link da vaga" title="Copiar link" @click="copy">
                <Check v-if="copied" class="size-4" aria-hidden="true" /><Copy v-else class="size-4" aria-hidden="true" />
            </button>
        </div>

        <p class="sr-only" role="status" aria-live="polite">{{ copied ? 'Link copiado' : failed ? 'Não foi possível copiar o link' : '' }}</p>
    </div>
</template>
