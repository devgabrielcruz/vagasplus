<script setup lang="ts">
import {
    Briefcase, Building2, Code2, Factory, GraduationCap, Headset, HeartPulse, Landmark, Megaphone,
    Palette, Scale, ShoppingCart, Truck, Users, Utensils, Wrench,
} from 'lucide-vue-next';
import { computed } from 'vue';

const props = defineProps<{ name?: string | null }>();

const icons: Record<string, unknown> = {
    briefcase: Briefcase, code: Code2, headset: Headset, megaphone: Megaphone, landmark: Landmark,
    'heart-pulse': HeartPulse, 'graduation-cap': GraduationCap, truck: Truck, 'shopping-cart': ShoppingCart,
    wrench: Wrench, palette: Palette, scale: Scale, users: Users, utensils: Utensils, factory: Factory, building: Building2,
};

const icon = computed(() => icons[props.name ?? ''] ?? Briefcase);
</script>

<template>
    <component :is="icon" aria-hidden="true" />
</template>
