<script setup lang="ts">
import PublicLayout from '@/layouts/PublicLayout.vue';
import type { Seo } from '@/types';

defineProps<{ page: 'about' | 'privacy' | 'terms'; title: string; contactEmail: string; seo: Seo }>();
</script>

<template>
    <PublicLayout :seo="seo">
        <div class="container-page py-8 sm:py-12">
            <article class="card mx-auto max-w-3xl p-6 sm:p-10">
                <h1 class="text-3xl font-extrabold tracking-tight text-ink">{{ title }}</h1>

                <div v-if="page === 'about'" class="prose-job mt-6">
                    <p>O VagasPlus é um portal que reúne oportunidades profissionais para facilitar a descoberta de vagas. Nosso objetivo é reduzir a distância entre encontrar uma vaga e se candidatar.</p>
                    <h3>Como funciona</h3>
                    <ul>
                        <li>Você pesquisa e consulta as vagas sem precisar criar conta.</li>
                        <li>Cada vaga possui uma página própria e um link permanente para compartilhar.</li>
                        <li>Ao clicar em <strong>Candidatar-se à vaga</strong>, você é levado ao site da empresa ou da plataforma de recrutamento (como Gupy ou LinkedIn), onde a candidatura de fato acontece.</li>
                    </ul>
                    <h3>Validade das vagas</h3>
                    <p>Toda vaga tem um prazo de validade no portal. Quando o prazo termina, a vaga sai das listagens e da busca automaticamente. O prazo é uma regra operacional do VagasPlus: a empresa pode encerrar o processo seletivo antes dele.</p>
                    <h3>O que não fazemos</h3>
                    <p>O VagasPlus não é uma plataforma de recrutamento, não participa dos processos seletivos e não cobra candidatos. Nunca pague para se candidatar a uma vaga.</p>
                    <p>Dúvidas, correções ou pedidos de remoção: <a :href="`mailto:${contactEmail}`">{{ contactEmail }}</a>.</p>
                </div>

                <div v-else-if="page === 'privacy'" class="prose-job mt-6">
                    <p>Esta política descreve como o VagasPlus trata informações pessoais, em conformidade com a Lei Geral de Proteção de Dados (LGPD – Lei nº 13.709/2018).</p>
                    <h3>Dados que coletamos</h3>
                    <p>Candidatos não precisam de cadastro e não fornecem dados pessoais ao navegar pelo portal. Podem ser registrados dados técnicos de acesso (como endereço IP, navegador e páginas acessadas) para segurança e estatísticas agregadas.</p>
                    <h3>Candidaturas</h3>
                    <p>A candidatura acontece em sites de terceiros. Os dados que você informar lá são tratados pela empresa ou plataforma responsável, segundo as políticas deles.</p>
                    <h3>Cookies e publicidade</h3>
                    <p>Usamos cookies essenciais para o funcionamento do portal. Futuramente poderemos exibir anúncios de redes de publicidade, que podem usar cookies próprios; quando isso ocorrer, esta página será atualizada e o consentimento exigido será solicitado.</p>
                    <h3>Seus direitos</h3>
                    <p>Você pode solicitar acesso, correção ou eliminação de dados pessoais pelo e-mail <a :href="`mailto:${contactEmail}`">{{ contactEmail }}</a>.</p>
                </div>

                <div v-else class="prose-job mt-6">
                    <p>Ao utilizar o VagasPlus, você concorda com os termos abaixo.</p>
                    <h3>Uso do portal</h3>
                    <p>O portal é de uso gratuito e destinado a quem busca oportunidades profissionais. É proibido utilizar mecanismos automatizados para copiar o conteúdo em massa ou prejudicar o funcionamento do serviço.</p>
                    <h3>Conteúdo das vagas</h3>
                    <p>As vagas são divulgadas com base em informações das empresas e fontes indicadas. O VagasPlus não garante a disponibilidade, o salário ou o resultado de qualquer processo seletivo, e não é parte na relação entre candidato e empresa.</p>
                    <h3>Links externos</h3>
                    <p>O botão de candidatura leva a sites de terceiros, sobre os quais o VagasPlus não tem controle. Confira sempre o endereço do site antes de informar dados pessoais.</p>
                    <h3>Contato</h3>
                    <p>Para solicitar a correção ou a remoção de uma vaga, escreva para <a :href="`mailto:${contactEmail}`">{{ contactEmail }}</a>.</p>
                </div>
            </article>
        </div>
    </PublicLayout>
</template>
