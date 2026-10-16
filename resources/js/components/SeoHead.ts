import { Head } from '@inertiajs/vue3';
import { defineComponent, h, type PropType } from 'vue';
import type { Seo } from '@/types';

/**
 * Metadados da página (title, description, canonical, Open Graph, JSON-LD).
 * Renderizado no servidor via SSR do Inertia.
 */
export default defineComponent({
    name: 'SeoHead',
    props: { seo: { type: Object as PropType<Seo | undefined>, default: undefined } },
    setup(props) {
        return () => {
            const seo = props.seo;
            if (!seo) return null;

            const children = [
                h('title', seo.title),
                seo.description ? h('meta', { 'head-key': 'description', name: 'description', content: seo.description }) : null,
                h('meta', { 'head-key': 'robots', name: 'robots', content: seo.robots ?? 'index,follow' }),
                seo.canonical ? h('link', { 'head-key': 'canonical', rel: 'canonical', href: seo.canonical }) : null,
                h('meta', { 'head-key': 'og:title', property: 'og:title', content: seo.title }),
                seo.description ? h('meta', { 'head-key': 'og:description', property: 'og:description', content: seo.description }) : null,
                h('meta', { 'head-key': 'og:type', property: 'og:type', content: seo.type ?? 'website' }),
                h('meta', { 'head-key': 'og:locale', property: 'og:locale', content: 'pt_BR' }),
                seo.site ? h('meta', { 'head-key': 'og:site_name', property: 'og:site_name', content: seo.site }) : null,
                seo.canonical ? h('meta', { 'head-key': 'og:url', property: 'og:url', content: seo.canonical }) : null,
                seo.image ? h('meta', { 'head-key': 'og:image', property: 'og:image', content: seo.image }) : null,
                h('meta', { 'head-key': 'twitter:card', name: 'twitter:card', content: seo.image ? 'summary_large_image' : 'summary' }),
                seo.json_ld ? h('script', { 'head-key': 'json-ld', type: 'application/ld+json' }, seo.json_ld) : null,
            ].filter(Boolean);

            return h(Head, null, { default: () => children });
        };
    },
});
