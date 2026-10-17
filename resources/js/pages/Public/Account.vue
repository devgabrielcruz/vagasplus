<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import { Bookmark, CreditCard, LogOut, Receipt, Sparkles } from 'lucide-vue-next';
import PublicLayout from '@/layouts/PublicLayout.vue';
import type { Seo } from '@/types';

defineProps<{ member: { name: string; email: string; since: string | null }; seo: Seo }>();

// Recursos que chegam com os planos. Aparecem aqui para o candidato saber o que vem por aí.
const soon = [
    { icon: Sparkles, title: 'Créditos', text: 'Use as entrevistas por vídeo e outros recursos de IA.' },
    { icon: CreditCard, title: 'Planos e pagamentos', text: 'Escolha o plano e gerencie a forma de pagamento.' },
    { icon: Receipt, title: 'Histórico de uso', text: 'Acompanhe o consumo de créditos e as taxas de uso.' },
];
</script>

<template>
    <PublicLayout :seo="seo">
        <div class="container-page max-w-3xl py-8 sm:py-12">
            <h1 class="t-h1 text-ink">Minha conta</h1>

            <section class="card mt-6 p-5 sm:p-6" aria-labelledby="perfil">
                <h2 id="perfil" class="text-sm font-extrabold tracking-wide text-muted uppercase">Seus dados</h2>
                <dl class="mt-4 grid gap-4 text-sm sm:grid-cols-2">
                    <div><dt class="font-semibold text-muted">Nome</dt><dd class="mt-0.5 font-bold text-ink">{{ member.name }}</dd></div>
                    <div><dt class="font-semibold text-muted">E-mail</dt><dd class="mt-0.5 font-bold break-all text-ink">{{ member.email }}</dd></div>
                    <div v-if="member.since"><dt class="font-semibold text-muted">Membro desde</dt><dd class="mt-0.5 font-bold text-ink capitalize">{{ member.since }}</dd></div>
                </dl>
            </section>

            <section class="mt-6" aria-labelledby="atalhos">
                <h2 id="atalhos" class="sr-only">Atalhos</h2>
                <Link href="/minhas-vagas" class="card flex items-center gap-3 p-4 transition-colors hover:border-navy-700">
                    <span class="grid size-10 place-items-center rounded-xl bg-action-50 text-action-700"><Bookmark class="size-5" aria-hidden="true" /></span>
                    <span><span class="block font-bold text-ink">Minhas vagas</span><span class="block text-sm text-muted">Vagas que você salvou neste navegador.</span></span>
                </Link>
            </section>

            <section class="mt-8" aria-labelledby="em-breve">
                <h2 id="em-breve" class="text-sm font-extrabold tracking-wide text-muted uppercase">Em breve</h2>
                <ul class="mt-3 grid gap-3 sm:grid-cols-3">
                    <li v-for="s in soon" :key="s.title" class="rounded-2xl border border-dashed border-line-strong p-4">
                        <component :is="s.icon" class="size-5 text-muted" aria-hidden="true" />
                        <p class="mt-2 font-bold text-ink">{{ s.title }}</p>
                        <p class="mt-1 text-sm text-muted">{{ s.text }}</p>
                    </li>
                </ul>
            </section>

            <Link href="/sair" method="post" as="button" class="btn-secondary mt-10"><LogOut class="size-4" aria-hidden="true" />Sair da conta</Link>
        </div>
    </PublicLayout>
</template>
