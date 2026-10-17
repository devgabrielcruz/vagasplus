<script setup lang="ts">
import { Link, useForm } from '@inertiajs/vue3';
import { Eye, EyeOff, Loader2, UserPlus } from 'lucide-vue-next';
import { ref } from 'vue';
import PublicLayout from '@/layouts/PublicLayout.vue';
import type { Seo } from '@/types';

defineProps<{ seo: Seo }>();

const form = useForm({ name: '', email: '', password: '', accepted: false });
const show = ref(false);
const submit = () => form.post('/cadastro', { onFinish: () => form.reset('password') });
</script>

<template>
    <PublicLayout :seo="seo">
        <div class="container-page grid place-items-center py-10 sm:py-16">
            <form class="card w-full max-w-md p-6 sm:p-8" novalidate @submit.prevent="submit">
                <h1 class="t-h1 text-ink">Criar conta</h1>
                <p class="mt-1.5 text-sm text-muted">Grátis. Leva menos de um minuto.</p>

                <div class="mt-6">
                    <label for="name" class="label">Nome</label>
                    <input id="name" v-model="form.name" type="text" autocomplete="name" required autofocus maxlength="120" class="field" :aria-invalid="!!form.errors.name" :aria-describedby="form.errors.name ? 'nome-erro' : undefined" />
                    <p v-if="form.errors.name" id="nome-erro" class="error-text" role="alert">{{ form.errors.name }}</p>
                </div>
                <div class="mt-4">
                    <label for="email" class="label">E-mail</label>
                    <input id="email" v-model="form.email" type="email" autocomplete="email" inputmode="email" required class="field" :aria-invalid="!!form.errors.email" :aria-describedby="form.errors.email ? 'email-erro' : undefined" />
                    <p v-if="form.errors.email" id="email-erro" class="error-text" role="alert">{{ form.errors.email }}</p>
                </div>
                <div class="mt-4">
                    <label for="password" class="label">Senha</label>
                    <div class="relative">
                        <input id="password" v-model="form.password" :type="show ? 'text' : 'password'" autocomplete="new-password" required class="field pr-11" :aria-invalid="!!form.errors.password" aria-describedby="senha-dica" />
                        <button type="button" class="absolute inset-y-0 right-0 grid w-11 place-items-center text-muted hover:text-ink" :aria-label="show ? 'Ocultar senha' : 'Mostrar senha'" :aria-pressed="show" @click="show = !show"><EyeOff v-if="show" class="size-4.5" aria-hidden="true" /><Eye v-else class="size-4.5" aria-hidden="true" /></button>
                    </div>
                    <p v-if="form.errors.password" class="error-text" role="alert">{{ form.errors.password }}</p>
                    <p id="senha-dica" class="mt-1.5 text-xs text-muted">Mínimo de 8 caracteres, com letras e números.</p>
                </div>

                <label class="mt-5 flex items-start gap-2.5 text-sm text-muted">
                    <input v-model="form.accepted" type="checkbox" class="mt-0.5 size-4 shrink-0 rounded border-line-strong text-action-600" :aria-invalid="!!form.errors.accepted" />
                    <span>Li e aceito os <Link href="/termos" class="font-semibold text-action-700 hover:underline">Termos de uso</Link> e a <Link href="/privacidade" class="font-semibold text-action-700 hover:underline">Política de privacidade</Link>.</span>
                </label>
                <p v-if="form.errors.accepted" class="error-text" role="alert">{{ form.errors.accepted }}</p>

                <button type="submit" class="btn-primary mt-6 w-full" :disabled="form.processing">
                    <Loader2 v-if="form.processing" class="size-4 animate-spin" aria-hidden="true" /><UserPlus v-else class="size-4" aria-hidden="true" />{{ form.processing ? 'Criando conta…' : 'Criar conta' }}
                </button>

                <p class="mt-5 text-center text-sm text-muted">Já tem conta? <Link href="/entrar" class="font-bold text-action-700 hover:underline">Entrar</Link></p>
            </form>
        </div>
    </PublicLayout>
</template>
