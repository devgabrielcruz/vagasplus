import { defineComponent, mergeProps, unref, withCtx, createTextVNode, toDisplayString, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderList, ssrRenderComponent, ssrInterpolate } from "vue/server-renderer";
import { Link } from "@inertiajs/vue3";
import { ChevronRight } from "lucide-vue-next";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Breadcrumbs",
  __ssrInlineRender: true,
  props: {
    items: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<nav${ssrRenderAttrs(mergeProps({
        "aria-label": "Você está em",
        class: "text-[13px] text-muted"
      }, _attrs))}><ol class="flex flex-wrap items-center gap-1.5"><!--[-->`);
      ssrRenderList(__props.items, (item, i) => {
        _push(`<li class="flex min-w-0 items-center gap-1.5">`);
        if (item.url) {
          _push(ssrRenderComponent(unref(Link), {
            href: item.url,
            class: "hover:text-action-700 hover:underline"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(item.label)}`);
              } else {
                return [
                  createTextVNode(toDisplayString(item.label), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
        } else {
          _push(`<span class="max-w-[16rem] truncate font-medium text-ink" aria-current="page">${ssrInterpolate(item.label)}</span>`);
        }
        if (i < __props.items.length - 1) {
          _push(ssrRenderComponent(unref(ChevronRight), {
            class: "size-3.5 shrink-0 text-subtle",
            "aria-hidden": "true"
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</li>`);
      });
      _push(`<!--]--></ol></nav>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/Breadcrumbs.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as _
};
//# sourceMappingURL=Breadcrumbs-C8MHcfb-.js.map
