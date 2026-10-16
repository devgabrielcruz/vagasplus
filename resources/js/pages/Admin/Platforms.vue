<script setup lang="ts">
import { router, useForm } from '@inertiajs/vue3';
import { Check, Pencil, Plus, Trash2, X } from 'lucide-vue-next';
import { ref } from 'vue';
import ConfirmDialog from '@/components/ConfirmDialog.vue';
import Field from '@/components/Field.vue';
import LogoField from '@/components/LogoField.vue';
import AdminLayout from '@/layouts/AdminLayout.vue';

interface Pl { id: number; name: string; slug: string; color: string; logo_src: string | null; logo_url: string | null; has_upload: boolean; uses_email: boolean; is_active: boolean; position: number; jobs_count: number }

defineProps<{ platforms: Pl[] }>();

const editing = ref<Pl | null>(null);
const creating = ref(false);
const deleting = ref<Pl | null>(null);
const current = ref<string | null>(null);

const form = useForm({ _method: 'post', name: '', color: '#2563eb', logo_url: '', logo: null as File | null, remove_logo: false, uses_email: false, is_active: true, position: 0 });

function startNew() {
    editing.value = null;
    creating.value = true;
    current.value = null;
    form.clearErrors();
    form.defaults({ _method: 'post', name: '', color: '#2563eb', logo_url: '', logo: null, remove_logo: false, uses_email: false, is_active: true, position: 0 }).reset();
}

function startEdit(p: Pl) {
    creating.value = false;
    editing.value = p;
    current.value = p.logo_src;
    form.clearErrors();
    form.defaults({ _method: 'put', name: p.name, color: p.color, logo_url: p.logo_url ?? '', logo: null, remove_logo: false, uses_email: p.uses_email, is_active: p.is_active, position: p.position }).reset();
}

function cancel() {
    creating.value = false;
    editing.value = null;
    form.reset().clearErrors();
}

function save() {
    const url = editing.value ? `/admin/plataformas/${editing.value.id}` : '/admin/plataformas';
    form.post(url, { forceFormData: true, preserveScroll: true, onSuccess: cancel });
}

function remove() {
    router.delete(`/admin/plataformas/${deleting.value!.id}`, { preserveScroll: true, onFinish: () => (deleting.value = null) });
}
</script>

<template>
    <AdminLayout title="Plataformas">
        <div class="mx-auto max-w-5xl">
            <header class="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div><h1 class="text-2xl font-extrabold text-ink">Plataformas de contratação</h1><p class="text-sm text-muted">Canais por onde o candidato se inscreve (Gupy, LinkedIn, e-mail…). Usadas no filtro público e no selo de cada vaga.</p></div>
                <button v-if="!creating && !editing" type="button" class="btn-primary" @click="startNew"><Plus class="size-4" aria-hidden="true" />Nova plataforma</button>
            </header>

            <form v-if="creating || editing" class="card mb-5 space-y-4 p-5" aria-label="Formulário de plataforma" @submit.prevent="save">
                <h2 class="text-lg font-extrabold text-ink">{{ editing ? `Editar ${editing.name}` : 'Nova plataforma' }}</h2>
                <div class="grid gap-4 sm:grid-cols-[1fr_9rem_8rem]">
                    <Field id="pl-name" label="Nome" :error="form.errors.name" required v-slot="{ describedBy, invalid }"><input id="pl-name" v-model="form.name" required maxlength="80" class="field" :aria-invalid="invalid" :aria-describedby="describedBy" /></Field>
                    <Field id="pl-color" label="Cor" :error="form.errors.color" hint="Usada quando não há logotipo." v-slot="{ describedBy }"><input id="pl-color" v-model="form.color" type="color" class="field h-11 cursor-pointer p-1" :aria-describedby="describedBy" /></Field>
                    <Field id="pl-pos" label="Ordem" :error="form.errors.position" v-slot="{ describedBy, invalid }"><input id="pl-pos" v-model.number="form.position" type="number" min="0" class="field" :aria-invalid="invalid" :aria-describedby="describedBy" /></Field>
                </div>
                <LogoField id="pl-logo" v-model:url="form.logo_url" v-model:file="form.logo" v-model:remove="form.remove_logo" :current="current" :error="form.errors.logo" :url-error="form.errors.logo_url" :name="form.name" />
                <div class="flex flex-wrap gap-x-8 gap-y-3">
                    <label class="flex items-start gap-2 text-sm"><input v-model="form.uses_email" type="checkbox" class="mt-0.5 size-4 rounded border-line-strong text-action-600" /><span><span class="font-semibold text-ink">Candidatura por e-mail</span><span class="block text-xs text-muted">Sem link: a vaga pede um e-mail de candidatura.</span></span></label>
                    <label class="flex items-start gap-2 text-sm"><input v-model="form.is_active" type="checkbox" class="mt-0.5 size-4 rounded border-line-strong text-action-600" /><span><span class="font-semibold text-ink">Ativa</span><span class="block text-xs text-muted">Inativas não aparecem para novas vagas.</span></span></label>
                </div>
                <div class="flex gap-2"><button type="submit" class="btn-primary" :disabled="form.processing"><Check class="size-4" aria-hidden="true" />Salvar</button><button type="button" class="btn-secondary" @click="cancel"><X class="size-4" aria-hidden="true" />Cancelar</button></div>
            </form>

            <div class="card overflow-hidden">
                <ul v-if="platforms.length" class="divide-y divide-line">
                    <li v-for="p in platforms" :key="p.id" class="flex flex-wrap items-center gap-3 px-4 py-3.5 sm:px-5">
                        <img v-if="p.logo_src" :src="p.logo_src" :alt="`Logotipo ${p.name}`" class="size-11 shrink-0 rounded-xl border border-line bg-white object-contain" />
                        <span v-else class="grid size-11 shrink-0 place-items-center rounded-xl text-base font-extrabold text-white" :style="{ backgroundColor: p.color }" aria-hidden="true">{{ p.name[0] }}</span>
                        <div class="min-w-0 flex-1">
                            <p class="flex flex-wrap items-center gap-2 font-bold text-ink">{{ p.name }}<span v-if="!p.is_active" class="badge bg-line text-muted">Inativa</span><span v-if="p.uses_email" class="badge bg-info-50 text-info-700">E-mail</span></p>
                            <p class="text-xs text-muted">?plataforma={{ p.slug }} · {{ p.jobs_count }} {{ p.jobs_count === 1 ? 'vaga' : 'vagas' }}</p>
                        </div>
                        <div class="flex gap-1">
                            <button type="button" class="btn-ghost btn-sm size-9 p-0" :aria-label="`Editar ${p.name}`" @click="startEdit(p)"><Pencil class="size-4" /></button>
                            <button type="button" class="btn-ghost btn-sm size-9 p-0 hover:text-danger-700" :aria-label="`Excluir ${p.name}`" :disabled="p.jobs_count > 0" :title="p.jobs_count > 0 ? 'Possui vagas: desative em vez de excluir' : 'Excluir'" @click="deleting = p"><Trash2 class="size-4" /></button>
                        </div>
                    </li>
                </ul>
                <p v-else class="px-5 py-10 text-center text-sm text-muted">Nenhuma plataforma cadastrada.</p>
            </div>
        </div>

        <ConfirmDialog :open="!!deleting" danger confirm-label="Excluir plataforma" title="Excluir plataforma?" :message="`“${deleting?.name}” será excluída definitivamente.`" @cancel="deleting = null" @confirm="remove" />
    </AdminLayout>
</template>
