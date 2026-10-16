<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import { computed } from 'vue';
import PublicLayout from '@/layouts/PublicLayout.vue';

const props = defineProps<{ status: number }>();

const copy = computed(
    () =>
        ({
            403: { title: 'Acesso negado', text: 'Você não tem permissão para acessar esta página.' },
            404: { title: 'Página não encontrada', text: 'O endereço pode estar incorreto ou a vaga já não está disponível.' },
            410: { title: 'Conteúdo removido', text: 'Este conteúdo foi removido e não está mais disponível.' },
            500: { title: 'Algo deu errado', text: 'Tivemos um problema inesperado. Tente novamente em instantes.' },
            503: { title: 'Em manutenção', text: 'Voltamos já. Obrigado pela paciência.' },
        })[props.status] ?? { title: 'Erro', text: 'Ocorreu um erro.' },
);

const seo = computed(() => ({ title: `${copy.value.title} | VagasPlus`, robots: 'noindex,nofollow' }));
</script>

<template>
    <PublicLayout :seo="seo">
        <div class="container-page grid place-items-center py-20 text-center">
            <p class="text-6xl font-extrabold text-action-600">{{ status }}</p>
            <h1 class="mt-3 text-2xl font-extrabold text-ink">{{ copy.title }}</h1>
            <p class="mt-2 max-w-md text-muted">{{ copy.text }}</p>
            <div class="mt-6 flex gap-2"><Link href="/" class="btn-primary">Ir para a página inicial</Link><Link href="/vagas" class="btn-secondary">Buscar vagas</Link></div>
        </div>
    </PublicLayout>
</template>
