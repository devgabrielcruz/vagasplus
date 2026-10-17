import { onBeforeUnmount, onMounted, ref } from 'vue';

export const prefersReducedMotion = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Máquina de escrever que apaga e digita a próxima frase em loop.
 * Começa com a primeira frase inteira (o servidor renderiza o texto completo) e só anima depois de montar.
 */
export function useTypewriter(phrases: string[], { type = 70, erase = 35, hold = 1900 } = {}) {
    const text = ref(phrases[0] ?? '');
    let timer: number | undefined;
    let alive = true;

    const wait = (ms: number) => new Promise<void>((r) => (timer = window.setTimeout(r, ms)));

    async function loop() {
        let i = 0;
        while (alive) {
            await wait(hold);
            while (alive && text.value.length) {
                text.value = text.value.slice(0, -1);
                await wait(erase);
            }
            i = (i + 1) % phrases.length;
            await wait(260);
            for (let c = 1; alive && c <= phrases[i].length; c++) {
                text.value = phrases[i].slice(0, c);
                await wait(type + Math.random() * 40);
            }
        }
    }

    onMounted(() => {
        if (phrases.length > 1 && !prefersReducedMotion()) loop();
    });
    onBeforeUnmount(() => {
        alive = false;
        window.clearTimeout(timer);
    });

    return text;
}
