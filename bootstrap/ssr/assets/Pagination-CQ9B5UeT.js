import { defineComponent, computed, mergeProps, unref, withCtx, createVNode, createTextVNode, toDisplayString, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate } from "vue/server-renderer";
import { Link } from "@inertiajs/vue3";
import { ChevronLeft, ChevronRight } from "lucide-vue-next";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Pagination",
  __ssrInlineRender: true,
  props: {
    meta: {}
  },
  setup(__props) {
    const props = __props;
    const items = computed(() => {
      const out = [];
      let last = 0;
      for (const l of props.meta.links) {
        if (last && l.page - last > 1) out.push({ gap: true });
        out.push(l);
        last = l.page;
      }
      return out;
    });
    return (_ctx, _push, _parent, _attrs) => {
      if (__props.meta.last_page > 1) {
        _push(`<nav${ssrRenderAttrs(mergeProps({
          "aria-label": "Paginação",
          class: "flex flex-wrap items-center justify-center gap-1.5"
        }, _attrs))}>`);
        if (__props.meta.prev_url) {
          _push(ssrRenderComponent(unref(Link), {
            href: __props.meta.prev_url,
            rel: "prev",
            class: "btn-secondary btn-sm"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(ssrRenderComponent(unref(ChevronLeft), {
                  class: "size-4",
                  "aria-hidden": "true"
                }, null, _parent2, _scopeId));
                _push2(`Anterior`);
              } else {
                return [
                  createVNode(unref(ChevronLeft), {
                    class: "size-4",
                    "aria-hidden": "true"
                  }),
                  createTextVNode("Anterior")
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`<!--[-->`);
        ssrRenderList(items.value, (item, i) => {
          _push(`<!--[-->`);
          if ("gap" in item) {
            _push(`<span class="px-1 text-subtle" aria-hidden="true">…</span>`);
          } else {
            _push(ssrRenderComponent(unref(Link), {
              href: item.url,
              "aria-current": item.active ? "page" : void 0,
              "aria-label": `Página ${item.page}`,
              class: ["grid min-h-9 min-w-9 place-items-center rounded-(--radius-control) px-2 text-sm font-semibold", item.active ? "bg-navy-900 text-white" : "text-muted hover:bg-navy-50 hover:text-ink"]
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`${ssrInterpolate(item.page)}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(item.page), 1)
                  ];
                }
              }),
              _: 2
            }, _parent));
          }
          _push(`<!--]-->`);
        });
        _push(`<!--]-->`);
        if (__props.meta.next_url) {
          _push(ssrRenderComponent(unref(Link), {
            href: __props.meta.next_url,
            rel: "next",
            class: "btn-secondary btn-sm"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`Próxima`);
                _push2(ssrRenderComponent(unref(ChevronRight), {
                  class: "size-4",
                  "aria-hidden": "true"
                }, null, _parent2, _scopeId));
              } else {
                return [
                  createTextVNode("Próxima"),
                  createVNode(unref(ChevronRight), {
                    class: "size-4",
                    "aria-hidden": "true"
                  })
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</nav>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/Pagination.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as _
};
//# sourceMappingURL=Pagination-CQ9B5UeT.js.map
