<script setup lang="ts">
import { Archive, CalendarClock, CircleCheck, FilePen, TimerOff } from 'lucide-vue-next';
import { computed } from 'vue';

const props = defineProps<{ status: string; label: string }>();

// Cor + ícone + texto: o status nunca depende só da cor.
const style = computed(
    () =>
        ({
            published: { cls: 'bg-success-50 text-success-700', icon: CircleCheck },
            scheduled: { cls: 'bg-info-50 text-info-700', icon: CalendarClock },
            draft: { cls: 'bg-navy-50 text-navy-800', icon: FilePen },
            expired: { cls: 'bg-warning-50 text-warning-700', icon: TimerOff },
            archived: { cls: 'bg-line text-muted', icon: Archive },
        })[props.status] ?? { cls: 'bg-line text-muted', icon: FilePen },
);
</script>

<template>
    <span class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold whitespace-nowrap" :class="style.cls">
        <component :is="style.icon" class="size-3.5" aria-hidden="true" />{{ label }}
    </span>
</template>
