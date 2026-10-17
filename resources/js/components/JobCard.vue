<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import { Clock, MapPin, Wallet, Wifi } from 'lucide-vue-next';
import CompanyLogo from '@/components/CompanyLogo.vue';
import PlatformBadge from '@/components/PlatformBadge.vue';
import SaveJobButton from '@/components/SaveJobButton.vue';
import type { JobCardData } from '@/types';

defineProps<{ job: JobCardData }>();

const modeStyle: Record<string, string> = {
    remote: 'bg-action-50 text-action-700 ring-action-100',
    hybrid: 'bg-warning-50 text-warning-700 ring-warning-50',
    onsite: 'bg-navy-50 text-navy-800 ring-navy-100',
};
</script>

<template>
    <article class="group card relative p-4 transition duration-150 hover:-translate-y-0.5 hover:border-navy-900/25 hover:shadow-(--shadow-lift) sm:p-5">
        <div class="flex gap-3.5">
            <CompanyLogo :name="job.company.name" :url="job.company.logo_url" size="md" />

            <div class="min-w-0 flex-1">
                <div class="flex items-start justify-between gap-3">
                    <h3 class="text-base leading-snug font-bold text-ink">
                        <!-- O link cobre o card inteiro (::after), mantendo semântica de âncora e foco por teclado -->
                        <Link :href="job.url" class="after:absolute after:inset-0 after:content-[''] hover:text-action-700 focus-visible:outline-offset-4">{{ job.title }}</Link>
                    </h3>
                    <div class="-mt-1.5 -mr-2 flex shrink-0 items-center gap-1">
                        <span v-if="job.is_new" class="rounded-full bg-success-50 px-2 py-0.5 text-[11px] font-bold tracking-wide text-success-700 uppercase">Nova</span>
                        <SaveJobButton :job="job" />
                    </div>
                </div>
                <p class="mt-0.5 text-sm text-muted">{{ job.company.name }}</p>

                <ul class="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[13px] text-muted">
                    <li v-if="job.location" class="inline-flex items-center gap-1.5"><MapPin class="size-3.5 text-subtle" aria-hidden="true" />{{ job.location }}</li>
                    <li>
                        <span class="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ring-inset" :class="modeStyle[job.work_mode.value]">
                            <Wifi v-if="job.work_mode.value === 'remote'" class="size-3" aria-hidden="true" />{{ job.work_mode.label }}
                        </span>
                    </li>
                    <li>{{ job.employment_type }}</li>
                    <li v-if="job.experience_level">{{ job.experience_level }}</li>
                </ul>

                <div class="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-line pt-3 text-[13px]">
                    <span class="inline-flex items-center gap-1.5 font-semibold" :class="job.salary ? 'text-ink' : 'font-normal text-subtle'">
                        <Wallet class="size-3.5 text-subtle" aria-hidden="true" />{{ job.salary ?? 'Salário não informado' }}
                    </span>
                    <span class="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <PlatformBadge :platform="job.platform" />
                        <span v-if="job.published_label" class="inline-flex items-center gap-1.5 text-subtle"><Clock class="size-3.5" aria-hidden="true" />{{ job.published_label }}</span>
                    </span>
                </div>
            </div>
        </div>
    </article>
</template>
