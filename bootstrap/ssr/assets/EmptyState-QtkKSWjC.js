import { defineComponent, mergeProps, createVNode, resolveDynamicComponent, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderVNode, ssrInterpolate, ssrRenderSlot } from "vue/server-renderer";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "EmptyState",
  __ssrInlineRender: true,
  props: {
    title: {},
    description: {},
    icon: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "card flex flex-col items-center px-6 py-12 text-center" }, _attrs))}>`);
      if (__props.icon) {
        _push(`<div class="mb-4 grid size-12 place-items-center rounded-full bg-navy-50 text-navy-700">`);
        ssrRenderVNode(_push, createVNode(resolveDynamicComponent(__props.icon), {
          class: "size-6",
          "aria-hidden": "true"
        }, null), _parent);
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<h2 class="text-lg font-bold text-ink">${ssrInterpolate(__props.title)}</h2>`);
      if (__props.description) {
        _push(`<p class="mt-1.5 max-w-md text-sm text-muted">${ssrInterpolate(__props.description)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="mt-5 flex flex-wrap justify-center gap-2">`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/EmptyState.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as _
};
//# sourceMappingURL=EmptyState-QtkKSWjC.js.map
