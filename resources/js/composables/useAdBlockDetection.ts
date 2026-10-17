import { onBeforeUnmount, onMounted, ref } from 'vue';

const SCRIPT_URL = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';

/** Elemento-isca com nomes de classe que as listas de filtros escondem. */
function baitBlocked(): boolean {
    const bait = document.createElement('div');
    bait.className = 'adsbox ad-banner ad-placement adsbygoogle pub_300x250 text-ad';
    bait.style.cssText = 'position:absolute;left:-9999px;top:-9999px;width:10px;height:10px';
    bait.innerHTML = '&nbsp;';
    document.body.appendChild(bait);
    const style = getComputedStyle(bait);
    const hidden = bait.offsetHeight === 0 || style.display === 'none' || style.visibility === 'hidden';
    bait.remove();
    return hidden;
}

/** Bloqueadores de rede derrubam o pedido ao script do AdSense; sem internet, não conta como bloqueio. */
async function requestBlocked(): Promise<boolean> {
    if (navigator.onLine === false) return false;
    try {
        await fetch(SCRIPT_URL, { method: 'HEAD', mode: 'no-cors', cache: 'no-store' });
        return false;
    } catch {
        return true;
    }
}

async function detectAdBlock(): Promise<boolean> {
    if ((window as unknown as { __adsBlocked?: boolean }).__adsBlocked) return true;
    if (baitBlocked()) return true;
    return requestBlocked();
}

/** `blocked` fica true enquanto houver bloqueador; reavalia a cada poucos segundos, então o aviso some sozinho. */
export function useAdBlockDetection(enabled: () => boolean) {
    const blocked = ref(false);
    const checking = ref(false);
    let timer: number | undefined;

    async function check() {
        if (!enabled()) return;
        checking.value = true;
        try {
            blocked.value = await detectAdBlock();
        } finally {
            checking.value = false;
        }
    }

    onMounted(() => {
        if (!enabled() || /bot|crawl|spider|lighthouse|googleother|mediapartners/i.test(navigator.userAgent)) return;
        // Dá tempo para o script do AdSense carregar antes da primeira checagem.
        window.setTimeout(check, 1200);
        timer = window.setInterval(check, 5000);
    });
    onBeforeUnmount(() => window.clearInterval(timer));

    return { blocked, checking, check };
}
