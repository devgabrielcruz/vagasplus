import { defineComponent, mergeProps, useSSRContext, h } from "vue";
import { ssrRenderAttrs } from "vue/server-renderer";
import { Head } from "@inertiajs/vue3";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Logo",
  __ssrInlineRender: true,
  props: {
    light: { type: Boolean, default: false }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<span${ssrRenderAttrs(mergeProps({
        class: ["inline-flex items-center", __props.light ? "rounded-xl bg-white px-3 py-2" : ""]
      }, _attrs))}><img src="/img/logo.png" alt="VagasPlus" width="1399" height="352" class="h-7 w-auto translate-y-[15%] sm:h-8" decoding="async"></span>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/Logo.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const SeoHead = defineComponent({
  name: "SeoHead",
  props: { seo: { type: Object, default: void 0 } },
  setup(props) {
    return () => {
      const seo = props.seo;
      if (!seo) return null;
      const children = [
        h("title", seo.title),
        seo.description ? h("meta", { "head-key": "description", name: "description", content: seo.description }) : null,
        h("meta", { "head-key": "robots", name: "robots", content: seo.robots ?? "index,follow" }),
        seo.canonical ? h("link", { "head-key": "canonical", rel: "canonical", href: seo.canonical }) : null,
        h("meta", { "head-key": "og:title", property: "og:title", content: seo.title }),
        seo.description ? h("meta", { "head-key": "og:description", property: "og:description", content: seo.description }) : null,
        h("meta", { "head-key": "og:type", property: "og:type", content: seo.type ?? "website" }),
        h("meta", { "head-key": "og:locale", property: "og:locale", content: "pt_BR" }),
        seo.site ? h("meta", { "head-key": "og:site_name", property: "og:site_name", content: seo.site }) : null,
        seo.canonical ? h("meta", { "head-key": "og:url", property: "og:url", content: seo.canonical }) : null,
        seo.image ? h("meta", { "head-key": "og:image", property: "og:image", content: seo.image }) : null,
        h("meta", { "head-key": "twitter:card", name: "twitter:card", content: seo.image ? "summary_large_image" : "summary" }),
        seo.json_ld ? h("script", { "head-key": "json-ld", type: "application/ld+json" }, seo.json_ld) : null
      ].filter(Boolean);
      return h(Head, null, { default: () => children });
    };
  }
});
export {
  SeoHead as S,
  _sfc_main as _
};
//# sourceMappingURL=SeoHead-BMQcIEwx.js.map
