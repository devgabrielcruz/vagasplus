import { defineComponent, mergeProps, withCtx, unref, createVNode, toDisplayString, createTextVNode, openBlock, createBlock, Fragment, renderList, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderList, ssrInterpolate } from "vue/server-renderer";
import { Link } from "@inertiajs/vue3";
import { LayoutGrid } from "lucide-vue-next";
import { _ as _sfc_main$3 } from "./AdSlot-4pkaOtdy.js";
import { _ as _sfc_main$2 } from "./Breadcrumbs-C8MHcfb-.js";
import { _ as _sfc_main$4 } from "./CategoryIcon-Cd_HT9vu.js";
import { _ as _sfc_main$5 } from "./EmptyState-QtkKSWjC.js";
import { _ as _sfc_main$1 } from "./PublicLayout-DWxlUL7J.js";
import "./FlashMessages-mTMlubKC.js";
import "./SeoHead-BMQcIEwx.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Categories",
  __ssrInlineRender: true,
  props: {
    categories: {},
    breadcrumbs: {},
    seo: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$1, mergeProps({ seo: __props.seo }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="container-page py-6 sm:py-10"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$2, { items: __props.breadcrumbs }, null, _parent2, _scopeId));
            _push2(`<header class="mt-5"${_scopeId}><h1 class="t-h1 text-ink"${_scopeId}>Vagas por categoria</h1><p class="mt-2 max-w-2xl text-muted"${_scopeId}>Escolha uma área de atuação e veja as oportunidades abertas agora.</p></header><div class="mt-6"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$3, {
              placement: "categories-top",
              format: "leaderboard"
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
            if (__props.categories.length) {
              _push2(`<ul class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"${_scopeId}><!--[-->`);
              ssrRenderList(__props.categories, (c) => {
                _push2(`<li${_scopeId}>`);
                _push2(ssrRenderComponent(unref(Link), {
                  href: c.url,
                  class: "card group flex h-full items-center gap-4 p-5 transition hover:-translate-y-0.5 hover:border-action-500 hover:shadow-(--shadow-lift)"
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`<span class="grid size-14 shrink-0 place-items-center rounded-2xl bg-action-50 text-action-700 transition group-hover:bg-action-600 group-hover:text-white"${_scopeId2}>`);
                      _push3(ssrRenderComponent(_sfc_main$4, {
                        name: c.icon,
                        class: "size-6"
                      }, null, _parent3, _scopeId2));
                      _push3(`</span><span class="min-w-0"${_scopeId2}><span class="t-h3 block text-ink"${_scopeId2}>${ssrInterpolate(c.name)}</span><span class="text-sm text-muted"${_scopeId2}>${ssrInterpolate(c.count)} ${ssrInterpolate(c.count === 1 ? "vaga aberta" : "vagas abertas")}</span></span>`);
                    } else {
                      return [
                        createVNode("span", { class: "grid size-14 shrink-0 place-items-center rounded-2xl bg-action-50 text-action-700 transition group-hover:bg-action-600 group-hover:text-white" }, [
                          createVNode(_sfc_main$4, {
                            name: c.icon,
                            class: "size-6"
                          }, null, 8, ["name"])
                        ]),
                        createVNode("span", { class: "min-w-0" }, [
                          createVNode("span", { class: "t-h3 block text-ink" }, toDisplayString(c.name), 1),
                          createVNode("span", { class: "text-sm text-muted" }, toDisplayString(c.count) + " " + toDisplayString(c.count === 1 ? "vaga aberta" : "vagas abertas"), 1)
                        ])
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
                _push2(`</li>`);
              });
              _push2(`<!--]--></ul>`);
            } else {
              _push2(`<div class="mt-8"${_scopeId}>`);
              _push2(ssrRenderComponent(_sfc_main$5, {
                icon: unref(LayoutGrid),
                title: "Nenhuma categoria com vagas abertas",
                description: "Volte em breve ou veja todas as vagas."
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(unref(Link), {
                      href: "/vagas",
                      class: "btn-primary"
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`Ver todas as vagas`);
                        } else {
                          return [
                            createTextVNode("Ver todas as vagas")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(unref(Link), {
                        href: "/vagas",
                        class: "btn-primary"
                      }, {
                        default: withCtx(() => [
                          createTextVNode("Ver todas as vagas")
                        ]),
                        _: 1
                      })
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div>`);
            }
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "container-page py-6 sm:py-10" }, [
                createVNode(_sfc_main$2, { items: __props.breadcrumbs }, null, 8, ["items"]),
                createVNode("header", { class: "mt-5" }, [
                  createVNode("h1", { class: "t-h1 text-ink" }, "Vagas por categoria"),
                  createVNode("p", { class: "mt-2 max-w-2xl text-muted" }, "Escolha uma área de atuação e veja as oportunidades abertas agora.")
                ]),
                createVNode("div", { class: "mt-6" }, [
                  createVNode(_sfc_main$3, {
                    placement: "categories-top",
                    format: "leaderboard"
                  })
                ]),
                __props.categories.length ? (openBlock(), createBlock("ul", {
                  key: 0,
                  class: "mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
                }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(__props.categories, (c) => {
                    return openBlock(), createBlock("li", {
                      key: c.slug
                    }, [
                      createVNode(unref(Link), {
                        href: c.url,
                        class: "card group flex h-full items-center gap-4 p-5 transition hover:-translate-y-0.5 hover:border-action-500 hover:shadow-(--shadow-lift)"
                      }, {
                        default: withCtx(() => [
                          createVNode("span", { class: "grid size-14 shrink-0 place-items-center rounded-2xl bg-action-50 text-action-700 transition group-hover:bg-action-600 group-hover:text-white" }, [
                            createVNode(_sfc_main$4, {
                              name: c.icon,
                              class: "size-6"
                            }, null, 8, ["name"])
                          ]),
                          createVNode("span", { class: "min-w-0" }, [
                            createVNode("span", { class: "t-h3 block text-ink" }, toDisplayString(c.name), 1),
                            createVNode("span", { class: "text-sm text-muted" }, toDisplayString(c.count) + " " + toDisplayString(c.count === 1 ? "vaga aberta" : "vagas abertas"), 1)
                          ])
                        ]),
                        _: 2
                      }, 1032, ["href"])
                    ]);
                  }), 128))
                ])) : (openBlock(), createBlock("div", {
                  key: 1,
                  class: "mt-8"
                }, [
                  createVNode(_sfc_main$5, {
                    icon: unref(LayoutGrid),
                    title: "Nenhuma categoria com vagas abertas",
                    description: "Volte em breve ou veja todas as vagas."
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(Link), {
                        href: "/vagas",
                        class: "btn-primary"
                      }, {
                        default: withCtx(() => [
                          createTextVNode("Ver todas as vagas")
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }, 8, ["icon"])
                ]))
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/pages/Public/Categories.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=Categories-Vlaj-B1m.js.map
