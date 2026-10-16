<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import { BadgeCheck, MapPin, Sparkles, Wallet } from 'lucide-vue-next';
import CompanyLogo from '@/components/CompanyLogo.vue';
import type { JobCardData } from '@/types';

/** Prévia estilo aplicativo com vagas REAIS (as mais recentes/em destaque). */
defineProps<{ jobs: JobCardData[] }>();
</script>

<template>
    <div class="relative mx-auto w-full max-w-md" aria-label="Prévia de vagas abertas">
        <div class="pointer-events-none absolute -inset-6 rounded-[2.5rem] bg-action-500/20 blur-3xl" aria-hidden="true" />

        <div class="relative rounded-[1.75rem] border border-white/15 bg-white/[0.08] p-3 shadow-[0_30px_80px_-20px_rgb(0_0_0/0.6)] backdrop-blur-xl">
            <div class="flex items-center justify-between px-2 pt-1 pb-3">
                <p class="flex items-center gap-2 text-sm font-bold text-white"><Sparkles class="size-4 text-action-200" aria-hidden="true" />Vagas para você</p>
                <span class="flex items-center gap-1.5 rounded-full bg-emerald-400/15 px-2.5 py-1 text-[11px] font-bold text-emerald-300"><span class="size-1.5 animate-pulse rounded-full bg-emerald-300" aria-hidden="true" />ao vivo</span>
            </div>

            <ul class="space-y-2.5">
                <li v-for="(job, i) in jobs" :key="job.id" :style="{ marginLeft: `${i % 2 ? 14 : 0}px`, marginRight: `${i % 2 ? 0 : 14}px` }">
                    <Link :href="job.url" class="group flex items-center gap-3 rounded-2xl bg-white p-3 shadow-lg transition hover:-translate-y-0.5">
                        <CompanyLogo :name="job.company.name" :url="job.company.logo_url" size="sm" />
                        <div class="min-w-0 flex-1">
                            <p class="truncate text-sm font-bold text-ink group-hover:text-action-700">{{ job.title }}</p>
                            <p class="truncate text-xs text-muted">{{ job.company.name }}</p>
                            <div class="mt-1.5 flex items-center gap-2 text-[11px] text-muted">
                                <span class="inline-flex items-center gap-1 rounded-full bg-action-50 px-1.5 py-0.5 font-semibold text-action-700">{{ job.work_mode.label }}</span>
                                <span v-if="job.location" class="inline-flex items-center gap-0.5 truncate"><MapPin class="size-3" aria-hidden="true" />{{ job.location }}</span>
                            </div>
                        </div>
                        <img v-if="job.platform.logo" :src="job.platform.logo" :alt="`via ${job.platform.label}`" class="h-7 w-auto max-w-[4.5rem] shrink-0 rounded-lg object-contain" />
                    </Link>
                </li>
            </ul>

            <p class="px-2 pt-3 pb-1 text-center text-xs text-navy-100/70">Candidate-se direto na fonte oficial</p>
        </div>

        <!-- Selos flutuantes -->
        <div v-if="jobs[0]?.salary" class="animate-float absolute -top-4 -right-2 hidden items-center gap-2 rounded-2xl bg-white px-3 py-2 text-xs font-bold text-ink shadow-xl sm:flex">
            <span class="grid size-7 place-items-center rounded-lg bg-success-50 text-success-700"><Wallet class="size-4" aria-hidden="true" /></span>{{ jobs[0].salary }}
        </div>
        <div class="animate-float absolute -bottom-4 -left-3 hidden items-center gap-2 rounded-2xl bg-white px-3 py-2 text-xs font-bold text-ink shadow-xl [animation-delay:-3s] sm:flex">
            <span class="grid size-7 place-items-center rounded-lg bg-action-50 text-action-700"><BadgeCheck class="size-4" aria-hidden="true" /></span>Sem cadastro
        </div>
    </div>
</template>
