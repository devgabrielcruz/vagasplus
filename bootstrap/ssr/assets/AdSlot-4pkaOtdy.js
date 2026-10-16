import { defineComponent, computed, onMounted, mergeProps, unref, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderStyle, ssrRenderAttr, ssrRenderComponent, ssrRenderClass } from "vue/server-renderer";
import { usePage } from "@inertiajs/vue3";
import { Megaphone } from "lucide-vue-next";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "AdSlot",
  __ssrInlineRender: true,
  props: {
    placement: {},
    format: { default: "leaderboard" }
  },
  setup(__props) {
    const props = __props;
    const page = usePage();
    const ads = computed(() => page.props.ads);
    const unitId = computed(() => ads.value?.enabled && ads.value.client ? ads.value.slots?.[props.placement] ?? null : null);
    const mail = computed(() => `mailto:${page.props.app?.contactEmail}?subject=${encodeURIComponent(`Anunciar no VagasPlus — ${props.placement}`)}`);
    const demos = [
      { slug: "cursoplus", name: "CursoPlus" },
      { slug: "fintech-nova", name: "Nova Pay" },
      { slug: "hospedagem-max", name: "HostMax" }
    ];
    const demo = computed(() => {
      if (!ads.value?.demo || unitId.value) return null;
      const d = demos[[...props.placement].reduce((n, c) => n + c.charCodeAt(0), 0) % demos.length];
      if (props.format === "square") return { ...d, src: `/img/promo/${d.slug}-square.svg`, w: 300, h: 250 };
      if (props.format === "card") return { ...d, src: `/img/promo/${d.slug}-card.svg`, w: 544, h: 170 };
      const wide = props.format === "leaderboard" || props.format === "infeed";
      return { ...d, src: `/img/promo/${d.slug}-${wide ? "wide" : "box"}.svg`, w: wide ? 728 : 336, h: wide ? 90 : 280 };
    });
    const size = {
      leaderboard: "min-h-[90px] w-full max-w-[728px]",
      rectangle: "min-h-[280px] w-full max-w-[336px]",
      square: "min-h-[250px] w-full max-w-[300px]",
      sidebar: "min-h-[250px] xl:min-h-[600px] w-full max-w-[336px]",
      infeed: "min-h-[120px] w-full"
    };
    onMounted(() => {
      if (!unitId.value) return;
      try {
        (window.adsbygoogle ||= []).push({});
      } catch {
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      if (__props.format === "card") {
        _push(`<aside${ssrRenderAttrs(mergeProps({
          "aria-label": "Publicidade",
          class: "card flex h-full min-h-[198px] flex-col overflow-hidden",
          "data-slot": __props.placement
        }, _attrs))}><p class="px-4 pt-2.5 pb-1.5 text-[10px] font-semibold tracking-[0.12em] text-subtle uppercase">Anúncio</p><div class="flex flex-1 items-stretch">`);
        if (unitId.value) {
          _push(`<ins class="adsbygoogle block size-full" style="${ssrRenderStyle({ "display": "block" })}"${ssrRenderAttr("data-ad-client", ads.value.client)}${ssrRenderAttr("data-ad-slot", unitId.value)} data-ad-format="auto" data-full-width-responsive="true"></ins>`);
        } else if (demo.value) {
          _push(`<a href="https://example.com" target="_blank" rel="sponsored nofollow noopener noreferrer" class="block size-full"${ssrRenderAttr("aria-label", `Anúncio de demonstração: ${demo.value.name}`)}><img${ssrRenderAttr("src", demo.value.src)}${ssrRenderAttr("alt", `Anúncio de demonstração de ${demo.value.name}`)}${ssrRenderAttr("width", demo.value.w)}${ssrRenderAttr("height", demo.value.h)} class="block size-full object-cover" decoding="async"></a>`);
        } else {
          _push(`<a${ssrRenderAttr("href", mail.value)} class="flex size-full flex-col items-center justify-center gap-1.5 bg-[repeating-linear-gradient(135deg,transparent,transparent_10px,var(--color-surface)_10px,var(--color-surface)_20px)] p-4 text-center transition-colors hover:bg-navy-50">`);
          _push(ssrRenderComponent(unref(Megaphone), {
            class: "size-5 text-action-600",
            "aria-hidden": "true"
          }, null, _parent));
          _push(`<span class="text-sm font-bold text-ink">Anuncie aqui</span><span class="max-w-[34ch] text-xs text-muted">Alcance quem busca emprego todos os dias. Fale com a gente.</span></a>`);
        }
        _push(`</div></aside>`);
      } else {
        _push(`<aside${ssrRenderAttrs(mergeProps({
          "aria-label": "Publicidade",
          class: "flex justify-center",
          "data-slot": __props.placement
        }, _attrs))}><div class="${ssrRenderClass([size[__props.format], "flex items-center justify-center overflow-hidden rounded-xl border border-line bg-white"])}">`);
        if (unitId.value) {
          _push(`<ins class="adsbygoogle block size-full" style="${ssrRenderStyle({ "display": "block" })}"${ssrRenderAttr("data-ad-client", ads.value.client)}${ssrRenderAttr("data-ad-slot", unitId.value)} data-ad-format="auto" data-full-width-responsive="true"></ins>`);
        } else if (demo.value) {
          _push(`<a href="https://example.com" target="_blank" rel="sponsored nofollow noopener noreferrer" class="block w-full"${ssrRenderAttr("aria-label", `Anúncio de demonstração: ${demo.value.name}`)}><img${ssrRenderAttr("src", demo.value.src)}${ssrRenderAttr("alt", `Anúncio de demonstração de ${demo.value.name}`)}${ssrRenderAttr("width", demo.value.w)}${ssrRenderAttr("height", demo.value.h)} class="block h-auto w-full" decoding="async"></a>`);
        } else {
          _push(`<a${ssrRenderAttr("href", mail.value)} class="flex size-full flex-col items-center justify-center gap-1.5 bg-[repeating-linear-gradient(135deg,transparent,transparent_10px,var(--color-surface)_10px,var(--color-surface)_20px)] p-4 text-center transition-colors hover:bg-navy-50">`);
          _push(ssrRenderComponent(unref(Megaphone), {
            class: "size-5 text-action-600",
            "aria-hidden": "true"
          }, null, _parent));
          _push(`<span class="text-sm font-bold text-ink">Anuncie aqui</span><span class="max-w-[28ch] text-xs text-muted">Alcance quem busca emprego todos os dias. Fale com a gente.</span></a>`);
        }
        _push(`</div></aside>`);
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/AdSlot.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as _
};
//# sourceMappingURL=AdSlot-4pkaOtdy.js.map
