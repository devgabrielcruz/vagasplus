<script setup lang="ts">
import { router, useForm } from '@inertiajs/vue3';
import { Check, Pencil, Plus, Trash2, X } from 'lucide-vue-next';
import { ref } from 'vue';
import CategoryIcon from '@/components/CategoryIcon.vue';
import ConfirmDialog from '@/components/ConfirmDialog.vue';
import Field from '@/components/Field.vue';
import AdminLayout from '@/layouts/AdminLayout.vue';

interface Cat { id: number; name: string; slug: string; icon: string | null; description: string | null; is_active: boolean; position: number; jobs_count: number }

defineProps<{ categories: Cat[]; icons: string[] }>();

const editingId = ref<number | null>(null);
const deleting = ref<Cat | null>(null);
const form = useForm({ name: '', slug: '', icon: 'briefcase' as string | null, description: '', is_active: true, position: 0 });

function startNew() {
    editingId.value = 0;
    form.reset().clearErrors();
}

function startEdit(c: Cat) {
    editingId.value = c.id;
    form.clearErrors();
    form.defaults({ name: c.name, slug: c.slug, icon: c.icon, description: c.description ?? '', is_active: c.is_active, position: c.position }).reset();
}

function cancel() {
    editingId.value = null;
    form.reset().clearErrors();
}

function save() {
    const opts = { preserveScroll: true, onSuccess: cancel };
    if (editingId.value) form.put(`/admin/categorias/${editingId.value}`, opts);
    else form.post('/admin/categorias', opts);
}

function remove() {
    router.delete(`/admin/categorias/${deleting.value!.id}`, { preserveScroll: true, onFinish: () => (deleting.value = null) });
}
</script>

<template>
    <AdminLayout title="Categorias">
        <div class="mx-auto max-w-5xl">
            <header class="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div><h1 class="text-2xl font-extrabold text-ink">Categorias</h1><p class="text-sm text-muted">Categorias inativas ou sem vagas abertas não aparecem no site.</p></div>
                <button v-if="editingId === null" type="button" class="btn-primary" @click="startNew"><Plus class="size-4" aria-hidden="true" />Nova categoria</button>
            </header>

            <form v-if="editingId !== null" class="card mb-5 space-y-4 p-5" aria-label="Formulário de categoria" @submit.prevent="save">
                <h2 class="text-lg font-extrabold text-ink">{{ editingId ? 'Editar categoria' : 'Nova categoria' }}</h2>
                <div class="grid gap-4 sm:grid-cols-2">
                    <Field id="c-name" label="Nome" :error="form.errors.name" required v-slot="{ describedBy, invalid }"><input id="c-name" v-model="form.name" required maxlength="120" class="field" :aria-invalid="invalid" :aria-describedby="describedBy" /></Field>
                    <Field id="c-slug" label="Slug" :error="form.errors.slug" hint="Vazio = gerado a partir do nome." v-slot="{ describedBy, invalid }"><input id="c-slug" v-model="form.slug" class="field font-mono text-[13px]" :aria-invalid="invalid" :aria-describedby="describedBy" /></Field>
                    <Field id="c-icon" label="Ícone" :error="form.errors.icon" v-slot="{ describedBy }"><select id="c-icon" v-model="form.icon" class="field" :aria-describedby="describedBy"><option v-for="i in icons" :key="i" :value="i">{{ i }}</option></select></Field>
                    <Field id="c-pos" label="Ordem de exibição" :error="form.errors.position" v-slot="{ describedBy, invalid }"><input id="c-pos" v-model.number="form.position" type="number" min="0" class="field" :aria-invalid="invalid" :aria-describedby="describedBy" /></Field>
                </div>
                <Field id="c-desc" label="Descrição (opcional)" :error="form.errors.description" hint="Usada na página da categoria e no SEO." v-slot="{ describedBy, invalid }"><textarea id="c-desc" v-model="form.description" rows="2" maxlength="500" class="field" :aria-invalid="invalid" :aria-describedby="describedBy" /></Field>
                <label class="flex items-center gap-2 text-sm font-semibold text-ink"><input v-model="form.is_active" type="checkbox" class="size-4 rounded border-line-strong text-action-600" />Categoria ativa</label>
                <div class="flex gap-2"><button type="submit" class="btn-primary" :disabled="form.processing"><Check class="size-4" aria-hidden="true" />Salvar</button><button type="button" class="btn-secondary" @click="cancel"><X class="size-4" aria-hidden="true" />Cancelar</button></div>
            </form>

            <div class="card overflow-hidden">
                <ul v-if="categories.length" class="divide-y divide-line">
                    <li v-for="c in categories" :key="c.id" class="flex flex-wrap items-center gap-3 px-4 py-3.5 sm:px-5">
                        <span class="grid size-10 shrink-0 place-items-center rounded-lg bg-action-50 text-action-700"><CategoryIcon :name="c.icon" class="size-5" /></span>
                        <div class="min-w-0 flex-1">
                            <p class="flex flex-wrap items-center gap-2 font-bold text-ink">{{ c.name }}<span v-if="!c.is_active" class="rounded-full bg-line px-2 py-0.5 text-[11px] font-bold text-muted">Inativa</span></p>
                            <p class="text-xs text-muted">/categorias/{{ c.slug }} · {{ c.jobs_count }} {{ c.jobs_count === 1 ? 'vaga' : 'vagas' }} · ordem {{ c.position }}</p>
                        </div>
                        <div class="flex gap-1">
                            <button type="button" class="btn-ghost btn-sm size-9 p-0" :aria-label="`Editar ${c.name}`" @click="startEdit(c)"><Pencil class="size-4" /></button>
                            <button type="button" class="btn-ghost btn-sm size-9 p-0 hover:text-danger-700" :aria-label="`Excluir ${c.name}`" :disabled="c.jobs_count > 0" :title="c.jobs_count > 0 ? 'Possui vagas: desative em vez de excluir' : 'Excluir'" @click="deleting = c"><Trash2 class="size-4" /></button>
                        </div>
                    </li>
                </ul>
                <p v-else class="px-5 py-10 text-center text-sm text-muted">Nenhuma categoria cadastrada.</p>
            </div>
        </div>

        <ConfirmDialog :open="!!deleting" danger confirm-label="Excluir categoria" title="Excluir categoria?" :message="`“${deleting?.name}” será excluída definitivamente.`" @cancel="deleting = null" @confirm="remove" />
    </AdminLayout>
</template>
