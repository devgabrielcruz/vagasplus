<script setup lang="ts">
import { Link, usePage } from '@inertiajs/vue3';
import { Bookmark, Mail, Menu, PenLine, X } from 'lucide-vue-next';
import { ref } from 'vue';
import FlashMessages from '@/components/FlashMessages.vue';
import Logo from '@/components/Logo.vue';
import SeoHead from '@/components/SeoHead';
import { useSavedJobs } from '@/composables/useSavedJobs';
import type { Seo } from '@/types';

defineProps<{ seo?: Seo }>();

const page = usePage<{ app: { contactEmail: string } }>();
const open = ref(false);
const { count: savedCount, message: savedMessage } = useSavedJobs();

const links = [
    { label: 'Buscar vagas', href: '/vagas' },
    { label: 'Categorias', href: '/categorias' },
    { label: 'Vagas remotas', href: '/vagas?modalidade=remote' },
];
</script>

<template>
    <SeoHead :seo="seo" />
    <FlashMessages />
    <div class="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex justify-center px-4" role="status" aria-live="polite">
        <Transition enter-active-class="transition duration-200" enter-from-class="translate-y-2 opacity-0" leave-active-class="transition duration-150" leave-to-class="opacity-0">
            <p v-if="savedMessage" class="pointer-events-auto rounded-xl bg-navy-900 px-4 py-2.5 text-sm font-semibold text-white shadow-(--shadow-pop)">{{ savedMessage }}</p>
        </Transition>
    </div>

    <a href="#conteudo" class="sr-only z-50 rounded-md bg-white px-4 py-2 font-semibold text-navy-900 focus:not-sr-only focus:fixed focus:top-2 focus:left-2">Pular para o conteúdo</a>

    <div class="flex min-h-screen flex-col">
        <header class="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85">
            <div class="container-page flex h-16 items-center justify-between gap-4">
                <Link href="/" aria-label="VagasPlus — página inicial"><Logo /></Link>

                <nav aria-label="Principal" class="hidden items-center gap-1 md:flex">
                    <Link v-for="l in links" :key="l.href" :href="l.href" class="rounded-lg px-3 py-2 text-sm font-semibold text-muted hover:bg-navy-50 hover:text-ink">{{ l.label }}</Link>
                </nav>

                <div class="flex items-center gap-2">
                    <Link href="/minhas-vagas" class="btn-ghost btn-sm relative hidden sm:inline-flex" :aria-label="savedCount ? `Minhas vagas (${savedCount} salvas)` : 'Minhas vagas'">
                        <Bookmark class="size-4" aria-hidden="true" />Minhas vagas<span v-if="savedCount" class="grid min-w-5 place-items-center rounded-full bg-action-600 px-1.5 text-[11px] font-bold text-white" aria-hidden="true">{{ savedCount }}</span>
                    </Link>
                    <Link href="/publicar-vaga" class="btn-primary btn-sm hidden sm:inline-flex"><PenLine class="size-4" aria-hidden="true" />Publicar uma vaga</Link>
                    <button type="button" class="btn-ghost size-11 p-0 md:hidden" :aria-expanded="open" aria-controls="menu-mobile" :aria-label="open ? 'Fechar menu' : 'Abrir menu'" @click="open = !open">
                        <X v-if="open" class="size-5" /><Menu v-else class="size-5" />
                    </button>
                </div>
            </div>

            <nav v-show="open" id="menu-mobile" aria-label="Menu móvel" class="border-t border-line bg-white md:hidden">
                <div class="container-page flex flex-col py-2">
                    <Link v-for="l in links" :key="l.href" :href="l.href" class="rounded-lg px-2 py-3 text-[15px] font-semibold text-ink hover:bg-navy-50" @click="open = false">{{ l.label }}</Link>
                    <Link href="/minhas-vagas" class="flex items-center gap-2 rounded-lg px-2 py-3 text-[15px] font-semibold text-ink hover:bg-navy-50" @click="open = false"><Bookmark class="size-4.5" aria-hidden="true" />Minhas vagas<span v-if="savedCount" class="ml-1 grid min-w-5 place-items-center rounded-full bg-action-600 px-1.5 text-[11px] font-bold text-white">{{ savedCount }}</span></Link>
                    <Link href="/publicar-vaga" class="btn-primary my-2" @click="open = false"><PenLine class="size-4" aria-hidden="true" />Publicar uma vaga</Link>
                </div>
            </nav>
        </header>

        <main id="conteudo" class="flex-1" tabindex="-1">
            <slot />
        </main>

        <footer class="mt-16 bg-navy-950 text-navy-100">
            <div class="container-page grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
                <div>
                    <Logo light />
                    <p class="mt-4 max-w-xs text-sm leading-relaxed text-navy-100/75">Facilitamos a descoberta de oportunidades. A candidatura é feita no site da empresa ou na plataforma de origem da vaga.</p>
                </div>
                <nav aria-label="Navegação do rodapé">
                    <h2 class="text-xs font-bold tracking-widest text-white/60 uppercase">Vagas</h2>
                    <ul class="mt-4 space-y-2.5 text-sm">
                        <li><Link href="/vagas" class="hover:text-white">Todas as vagas</Link></li>
                        <li><Link href="/vagas?modalidade=remote" class="hover:text-white">Vagas remotas</Link></li>
                        <li><Link href="/categorias" class="hover:text-white">Categorias</Link></li>
                        <li><Link href="/publicar-vaga" class="hover:text-white">Publicar uma vaga</Link></li>
                    </ul>
                </nav>
                <nav aria-label="Institucional">
                    <h2 class="text-xs font-bold tracking-widest text-white/60 uppercase">Institucional</h2>
                    <ul class="mt-4 space-y-2.5 text-sm">
                        <li><Link href="/sobre" class="hover:text-white">Sobre o VagasPlus</Link></li>
                        <li><Link href="/privacidade" class="hover:text-white">Política de privacidade</Link></li>
                        <li><Link href="/termos" class="hover:text-white">Termos de uso</Link></li>
                    </ul>
                </nav>
                <div>
                    <h2 class="text-xs font-bold tracking-widest text-white/60 uppercase">Contato</h2>
                    <a :href="`mailto:${page.props.app?.contactEmail}`" class="mt-4 inline-flex items-center gap-2 text-sm hover:text-white"><Mail class="size-4" aria-hidden="true" />{{ page.props.app?.contactEmail }}</a>
                </div>
            </div>
            <div class="border-t border-white/10">
                <p class="container-page py-5 text-xs text-navy-100/60">© {{ new Date().getFullYear() }} VagasPlus. Todos os direitos reservados. As vagas são de responsabilidade das empresas anunciantes.</p>
            </div>
        </footer>
    </div>
</template>
