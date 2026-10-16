<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import { CheckCircle2 } from 'lucide-vue-next';
import PublicLayout from '@/layouts/PublicLayout.vue';
import type { Seo } from '@/types';

defineProps<{ seo: Seo }>();
</script>

<template>
    <PublicLayout :seo="seo">
        <div class="container-page grid place-items-center py-16 sm:py-24">
            <div class="card max-w-lg p-8 text-center sm:p-10">
                <span class="mx-auto grid size-16 place-items-center rounded-full bg-success-50 text-success-700"><CheckCircle2 class="size-9" aria-hidden="true" /></span>
                <h1 class="t-h1 mt-5 text-ink">Vaga enviada!</h1>
                <p class="mt-3 text-muted">Recebemos sua solicitação e nossa equipe vai analisá-la. Se tudo estiver certo, a vaga será publicada no site. Caso precisemos de algum ajuste, entraremos em contato pelo e-mail informado.</p>
                <div class="mt-7 flex flex-wrap justify-center gap-2">
                    <Link href="/vagas" class="btn-primary">Ver vagas abertas</Link>
                    <Link href="/publicar-vaga" class="btn-secondary">Enviar outra vaga</Link>
                </div>
            </div>
        </div>
    </PublicLayout>
</template>
