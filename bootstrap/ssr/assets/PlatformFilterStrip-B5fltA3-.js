import { defineComponent, mergeProps, unref, withCtx, createVNode, toDisplayString, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderList, ssrRenderComponent, ssrInterpolate } from "vue/server-renderer";
import { Link } from "@inertiajs/vue3";
import { a as _sfc_main$1 } from "./JobCard-CV-JBXgW.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "PlatformFilterStrip",
  __ssrInlineRender: true,
  props: {
    platforms: {},
    active: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      if (__props.platforms.length) {
        _push(`<nav${ssrRenderAttrs(mergeProps({ "aria-label": "Filtrar por plataforma de contratação" }, _attrs))}><ul class="flex flex-wrap gap-2"><!--[-->`);
        ssrRenderList(__props.platforms, (p) => {
          _push(`<li>`);
          _push(ssrRenderComponent(unref(Link), {
            href: `/vagas?plataforma=${p.value}`,
            "aria-current": __props.active === p.value ? "true" : void 0,
            class: ["inline-flex min-h-10 items-center gap-2 rounded-full border bg-white pr-3 pl-1.5 text-sm font-semibold transition hover:border-action-500 hover:shadow-(--shadow-card)", __props.active === p.value ? "border-action-600 ring-2 ring-action-100" : "border-line-strong"]
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(ssrRenderComponent(_sfc_main$1, {
                  platform: p,
                  variant: "plain",
                  class: "!text-sm !font-semibold !text-ink"
                }, null, _parent2, _scopeId));
                _push2(`<span class="rounded-full bg-surface px-1.5 text-xs text-muted tabular-nums"${_scopeId}>${ssrInterpolate(p.count)}</span>`);
              } else {
                return [
                  createVNode(_sfc_main$1, {
                    platform: p,
                    variant: "plain",
                    class: "!text-sm !font-semibold !text-ink"
                  }, null, 8, ["platform"]),
                  createVNode("span", { class: "rounded-full bg-surface px-1.5 text-xs text-muted tabular-nums" }, toDisplayString(p.count), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`</li>`);
        });
        _push(`<!--]--></ul></nav>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/PlatformFilterStrip.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as _
};
//# sourceMappingURL=PlatformFilterStrip-B5fltA3-.js.map
