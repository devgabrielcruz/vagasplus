<script setup lang="ts">
import { Link, router, usePage } from '@inertiajs/vue3';
import { Briefcase, Building2, ExternalLink, Inbox, LayoutDashboard, LogOut, Menu, Plug, Plus, Settings, Tags, X } from 'lucide-vue-next';
import { computed, ref } from 'vue';
import FlashMessages from '@/components/FlashMessages.vue';
import Logo from '@/components/Logo.vue';
import SeoHead from '@/components/SeoHead';

defineProps<{ title: string }>();

const page = usePage<{ auth: { user: { name: string; email: string } | null }; pendingSubmissions: number }>();
const open = ref(false);
const path = computed(() => page.url.split('?')[0]);

const nav = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard, exact: true },
    { label: 'Vagas', href: '/admin/vagas', icon: Briefcase },
    { label: 'Solicitações', href: '/admin/solicitacoes', icon: Inbox, badge: true },
    { label: 'Empresas', href: '/admin/empresas', icon: Building2 },
    { label: 'Plataformas', href: '/admin/plataformas', icon: Plug },
    { label: 'Categorias', href: '/admin/categorias', icon: Tags },
    { label: 'Configurações', href: '/admin/configuracoes', icon: Settings },
];

const isActive = (item: (typeof nav)[number]) => (item.exact ? path.value === item.href : path.value.startsWith(item.href));
const logout = () => router.post('/admin/logout');
</script>

<template>
    <SeoHead :seo="{ title: `${title} | Painel VagasPlus`, robots: 'noindex,nofollow' }" />
    <FlashMessages />

    <div class="min-h-screen bg-surface lg:grid lg:grid-cols-[16rem_1fr]">
        <!-- Barra superior móvel -->
        <div class="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-line bg-white px-4 lg:hidden">
            <Link href="/admin"><Logo /></Link>
            <button type="button" class="btn-ghost size-11 p-0" :aria-expanded="open" aria-controls="admin-nav" aria-label="Abrir menu" @click="open = !open"><X v-if="open" class="size-5" /><Menu v-else class="size-5" /></button>
        </div>

        <aside id="admin-nav" class="border-line bg-navy-950 text-navy-100 lg:sticky lg:top-0 lg:block lg:h-screen lg:border-r" :class="open ? 'block' : 'hidden'">
            <div class="flex h-full flex-col p-4">
                <Link href="/admin" class="mb-6 hidden px-2 py-1 lg:block" aria-label="Painel VagasPlus"><Logo light /></Link>

                <Link href="/admin/vagas/criar" class="btn-primary mb-4 w-full" @click="open = false"><Plus class="size-4" aria-hidden="true" />Nova vaga</Link>

                <nav aria-label="Painel administrativo" class="space-y-1">
                    <Link v-for="item in nav" :key="item.href" :href="item.href" :aria-current="isActive(item) ? 'page' : undefined" class="flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-semibold transition-colors" :class="isActive(item) ? 'bg-white/10 text-white' : 'text-navy-100/75 hover:bg-white/5 hover:text-white'" @click="open = false">
                        <component :is="item.icon" class="size-4.5" aria-hidden="true" />{{ item.label }}
                        <span v-if="'badge' in item && page.props.pendingSubmissions" class="ml-auto grid min-w-5 place-items-center rounded-full bg-action-500 px-1.5 text-[11px] font-bold text-white" :aria-label="`${page.props.pendingSubmissions} em análise`">{{ page.props.pendingSubmissions }}</span>
                    </Link>
                </nav>

                <div class="mt-auto space-y-1 border-t border-white/10 pt-4">
                    <a href="/" target="_blank" rel="noopener" class="flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-semibold text-navy-100/75 hover:bg-white/5 hover:text-white"><ExternalLink class="size-4.5" aria-hidden="true" />Ver site</a>
                    <div class="px-3 py-2 text-xs"><p class="truncate font-semibold text-white">{{ page.props.auth.user?.name }}</p><p class="truncate text-navy-100/60">{{ page.props.auth.user?.email }}</p></div>
                    <button type="button" class="flex min-h-11 w-full items-center gap-3 rounded-lg px-3 text-sm font-semibold text-navy-100/75 hover:bg-white/5 hover:text-white" @click="logout"><LogOut class="size-4.5" aria-hidden="true" />Sair</button>
                </div>
            </div>
        </aside>

        <main class="min-w-0 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <slot />
        </main>
    </div>
</template>
