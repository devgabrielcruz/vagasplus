import { defineComponent, ref, computed, mergeProps, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderAttr, ssrInterpolate } from "vue/server-renderer";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "CompanyLogo",
  __ssrInlineRender: true,
  props: {
    name: {},
    url: { default: null },
    size: { default: "md" }
  },
  setup(__props) {
    const props = __props;
    const failed = ref(false);
    const initials = computed(
      () => props.name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]?.toUpperCase()).join("")
    );
    const tone = computed(() => {
      let h = 0;
      for (const c of props.name) h = (h * 31 + c.charCodeAt(0)) % 360;
      return { background: `hsl(${h} 70% 94%)`, color: `hsl(${h} 55% 28%)` };
    });
    const box = { sm: "size-10 rounded-lg text-sm", md: "size-12 rounded-xl text-base", lg: "size-20 rounded-2xl text-2xl" };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ["grid shrink-0 place-items-center overflow-hidden border border-line bg-white font-extrabold shadow-(--shadow-xs)", box[__props.size]],
        style: __props.url && !failed.value ? void 0 : tone.value
      }, _attrs))}>`);
      if (__props.url && !failed.value) {
        _push(`<img${ssrRenderAttr("src", __props.url)}${ssrRenderAttr("alt", `Logotipo de ${__props.name}`)} loading="lazy" decoding="async" referrerpolicy="no-referrer" class="size-full object-contain p-1.5">`);
      } else {
        _push(`<span aria-hidden="true">${ssrInterpolate(initials.value)}</span>`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/CompanyLogo.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as _
};
//# sourceMappingURL=CompanyLogo-meQRdREr.js.map
