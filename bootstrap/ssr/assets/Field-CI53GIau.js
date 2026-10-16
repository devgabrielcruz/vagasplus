import { defineComponent, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderAttr, ssrInterpolate, ssrRenderSlot } from "vue/server-renderer";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Field",
  __ssrInlineRender: true,
  props: {
    id: {},
    label: {},
    error: {},
    hint: {},
    required: { type: Boolean }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)}><label${ssrRenderAttr("for", __props.id)} class="label">${ssrInterpolate(__props.label)}`);
      if (__props.required) {
        _push(`<span class="text-danger-700" aria-hidden="true"> *</span>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.required) {
        _push(`<span class="sr-only"> (obrigatório)</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</label>`);
      ssrRenderSlot(_ctx.$slots, "default", {
        describedBy: [__props.hint ? `${__props.id}-hint` : "", __props.error ? `${__props.id}-erro` : ""].filter(Boolean).join(" ") || void 0,
        invalid: !!__props.error
      }, null, _push, _parent);
      if (__props.hint && !__props.error) {
        _push(`<p${ssrRenderAttr("id", `${__props.id}-hint`)} class="hint">${ssrInterpolate(__props.hint)}</p>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.error) {
        _push(`<p${ssrRenderAttr("id", `${__props.id}-erro`)} class="error-text" role="alert">${ssrInterpolate(__props.error)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/Field.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as _
};
//# sourceMappingURL=Field-CI53GIau.js.map
