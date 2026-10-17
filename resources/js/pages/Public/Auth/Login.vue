<script setup lang="ts">
import { Link, useForm } from '@inertiajs/vue3';
import { Loader2, LogIn } from 'lucide-vue-next';
import PublicLayout from '@/layouts/PublicLayout.vue';
import type { Seo } from '@/types';

defineProps<{ seo: Seo }>();

const form = useForm({ email: '', password: '', remember: true });
const submit = () => form.post('/entrar', { onFinish: () => form.reset('password') });
</script>

<template>
    <PublicLayout :seo="seo">
        <div class="container-page grid place-items-center py-10 sm:py-16">
            <form class="card w-full max-w-md p-6 sm:p-8" novalidate @submit.prevent="submit">
                <h1 class="t-h1 text-ink">Entrar</h1>
                <p class="mt-1.5 text-sm text-muted">Acesse a sua conta no VagasPlus.</p>

                <div class="mt-6">
                    <label for="email" class="label">E-mail</label>
                    <input id="email" v-model="form.email" type="email" autocomplete="username" inputmode="email" required autofocus class="field" :aria-invalid="!!form.errors.email" :aria-describedby="form.errors.email ? 'email-erro' : undefined" />
                    <p v-if="form.errors.email" id="email-erro" class="error-text" role="alert">{{ form.errors.email }}</p>
                </div>
                <div class="mt-4">
                    <label for="password" class="label">Senha</label>
                    <input id="password" v-model="form.password" type="password" autocomplete="current-password" required class="field" :aria-invalid="!!form.errors.password" :aria-describedby="form.errors.password ? 'senha-erro' : undefined" />
                    <p v-if="form.errors.password" id="senha-erro" class="error-text" role="alert">{{ form.errors.password }}</p>
                </div>
                <label class="mt-4 flex items-center gap-2 text-sm text-muted"><input v-model="form.remember" type="checkbox" class="size-4 rounded border-line-strong text-action-600" />Manter conectado</label>

                <button type="submit" class="btn-primary mt-6 w-full" :disabled="form.processing">
                    <Loader2 v-if="form.processing" class="size-4 animate-spin" aria-hidden="true" /><LogIn v-else class="size-4" aria-hidden="true" />{{ form.processing ? 'Entrando…' : 'Entrar' }}
                </button>

                <p class="mt-5 text-center text-sm text-muted">Ainda não tem conta? <Link href="/cadastro" class="font-bold text-action-700 hover:underline">Criar conta grátis</Link></p>
            </form>
        </div>
    </PublicLayout>
</template>
