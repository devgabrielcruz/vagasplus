<script setup lang="ts">
import { useForm } from '@inertiajs/vue3';
import { Loader2, LogIn } from 'lucide-vue-next';
import Logo from '@/components/Logo.vue';
import SeoHead from '@/components/SeoHead';
import type { Seo } from '@/types';

defineProps<{ seo: Seo }>();

const form = useForm({ email: '', password: '', remember: false });
const submit = () => form.post('/admin/login', { onFinish: () => form.reset('password') });
</script>

<template>
    <SeoHead :seo="{ ...seo, robots: 'noindex,nofollow' }" />
    <div class="grid min-h-screen place-items-center bg-surface px-4 py-10">
        <div class="w-full max-w-sm">
            <div class="mb-6 flex justify-center"><Logo /></div>
            <form class="card p-6 sm:p-7" novalidate @submit.prevent="submit">
                <h1 class="text-xl font-extrabold text-ink">Acesso ao painel</h1>
                <p class="mt-1 text-sm text-muted">Área restrita à equipe do VagasPlus.</p>

                <div class="mt-5">
                    <label for="email" class="label">E-mail</label>
                    <input id="email" v-model="form.email" type="email" autocomplete="username" required autofocus class="field" :aria-invalid="!!form.errors.email" :aria-describedby="form.errors.email ? 'email-erro' : undefined" />
                    <p v-if="form.errors.email" id="email-erro" class="error-text" role="alert">{{ form.errors.email }}</p>
                </div>
                <div class="mt-4">
                    <label for="password" class="label">Senha</label>
                    <input id="password" v-model="form.password" type="password" autocomplete="current-password" required class="field" :aria-invalid="!!form.errors.password" />
                    <p v-if="form.errors.password" class="error-text" role="alert">{{ form.errors.password }}</p>
                </div>
                <label class="mt-4 flex items-center gap-2 text-sm text-muted"><input v-model="form.remember" type="checkbox" class="size-4 rounded border-line-strong text-action-600" />Manter conectado</label>

                <button type="submit" class="btn-primary mt-5 w-full" :disabled="form.processing">
                    <Loader2 v-if="form.processing" class="size-4 animate-spin" aria-hidden="true" /><LogIn v-else class="size-4" aria-hidden="true" />{{ form.processing ? 'Entrando…' : 'Entrar' }}
                </button>
            </form>
        </div>
    </div>
</template>
