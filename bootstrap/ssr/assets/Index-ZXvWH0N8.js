import { defineComponent, mergeProps, withCtx, unref, createTextVNode, toDisplayString, createVNode, openBlock, createBlock, Fragment, renderList, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderList, ssrInterpolate, ssrRenderClass } from "vue/server-renderer";
import { Link } from "@inertiajs/vue3";
import { Inbox } from "lucide-vue-next";
import { _ as _sfc_main$2 } from "./EmptyState-QtkKSWjC.js";
import { _ as _sfc_main$3 } from "./Pagination-CQ9B5UeT.js";
import { _ as _sfc_main$1 } from "./AdminLayout-BocNC89A.js";
import { f as formatDateTime } from "./format-D8ppHDIy.js";
import "./FlashMessages-mTMlubKC.js";
import "./SeoHead-BMQcIEwx.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Index",
  __ssrInlineRender: true,
  props: {
    status: {},
    counts: {},
    submissions: {}
  },
  setup(__props) {
    const tone = { pending: "bg-info-50 text-info-700", approved: "bg-success-50 text-success-700", rejected: "bg-danger-50 text-danger-700" };
    const label = { pending: "Em análise", approved: "Aprovada", rejected: "Recusada" };
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$1, mergeProps({ title: "Solicitações" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="mx-auto max-w-5xl"${_scopeId}><header class="mb-5"${_scopeId}><h1 class="text-2xl font-extrabold text-ink"${_scopeId}>Solicitações de vagas</h1><p class="text-sm text-muted"${_scopeId}>Vagas enviadas pelo site aguardando análise. Aprovar cria a vaga como rascunho para você revisar e publicar.</p></header><nav class="mb-4 flex flex-wrap gap-2" aria-label="Filtrar por situação"${_scopeId}><!--[-->`);
            ssrRenderList(__props.counts, (c) => {
              _push2(ssrRenderComponent(unref(Link), {
                key: c.value,
                href: `/admin/solicitacoes?status=${c.value}`,
                "aria-current": __props.status === c.value ? "page" : void 0,
                class: ["inline-flex min-h-10 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition", __props.status === c.value ? "border-action-600 bg-action-50 text-action-700" : "border-line-strong bg-white text-ink hover:bg-navy-50"]
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${ssrInterpolate(c.label)}<span class="rounded-full bg-white/80 px-1.5 text-xs tabular-nums ring-1 ring-line"${_scopeId2}>${ssrInterpolate(c.count)}</span>`);
                  } else {
                    return [
                      createTextVNode(toDisplayString(c.label), 1),
                      createVNode("span", { class: "rounded-full bg-white/80 px-1.5 text-xs tabular-nums ring-1 ring-line" }, toDisplayString(c.count), 1)
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            });
            _push2(`<!--]--></nav>`);
            if (__props.submissions.data.length) {
              _push2(`<div class="card overflow-hidden"${_scopeId}><ul class="divide-y divide-line"${_scopeId}><!--[-->`);
              ssrRenderList(__props.submissions.data, (s) => {
                _push2(`<li${_scopeId}>`);
                _push2(ssrRenderComponent(unref(Link), {
                  href: s.show_url,
                  class: "flex flex-wrap items-center gap-3 px-4 py-4 transition hover:bg-surface sm:px-5"
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`<div class="min-w-0 flex-1"${_scopeId2}><p class="truncate font-bold text-ink"${_scopeId2}>${ssrInterpolate(s.title)}</p><p class="truncate text-sm text-muted"${_scopeId2}>${ssrInterpolate(s.company_name)} · ${ssrInterpolate(s.category)} · via ${ssrInterpolate(s.platform)}</p><p class="text-xs text-subtle"${_scopeId2}>Enviada por ${ssrInterpolate(s.submitter)} em ${ssrInterpolate(unref(formatDateTime)(s.created_at))}</p></div><span class="${ssrRenderClass([tone[s.status], "badge px-2.5 py-1"])}"${_scopeId2}>${ssrInterpolate(label[s.status])}</span>`);
                    } else {
                      return [
                        createVNode("div", { class: "min-w-0 flex-1" }, [
                          createVNode("p", { class: "truncate font-bold text-ink" }, toDisplayString(s.title), 1),
                          createVNode("p", { class: "truncate text-sm text-muted" }, toDisplayString(s.company_name) + " · " + toDisplayString(s.category) + " · via " + toDisplayString(s.platform), 1),
                          createVNode("p", { class: "text-xs text-subtle" }, "Enviada por " + toDisplayString(s.submitter) + " em " + toDisplayString(unref(formatDateTime)(s.created_at)), 1)
                        ]),
                        createVNode("span", {
                          class: ["badge px-2.5 py-1", tone[s.status]]
                        }, toDisplayString(label[s.status]), 3)
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
                _push2(`</li>`);
              });
              _push2(`<!--]--></ul></div>`);
            } else {
              _push2(ssrRenderComponent(_sfc_main$2, {
                icon: unref(Inbox),
                title: "Nenhuma solicitação aqui",
                description: __props.status === "pending" ? "Quando alguém enviar uma vaga pelo site, ela aparecerá nesta lista." : "Nada nesta situação por enquanto."
              }, null, _parent2, _scopeId));
            }
            _push2(`<div class="mt-6"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$3, { meta: __props.submissions }, null, _parent2, _scopeId));
            _push2(`</div></div>`);
          } else {
            return [
              createVNode("div", { class: "mx-auto max-w-5xl" }, [
                createVNode("header", { class: "mb-5" }, [
                  createVNode("h1", { class: "text-2xl font-extrabold text-ink" }, "Solicitações de vagas"),
                  createVNode("p", { class: "text-sm text-muted" }, "Vagas enviadas pelo site aguardando análise. Aprovar cria a vaga como rascunho para você revisar e publicar.")
                ]),
                createVNode("nav", {
                  class: "mb-4 flex flex-wrap gap-2",
                  "aria-label": "Filtrar por situação"
                }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(__props.counts, (c) => {
                    return openBlock(), createBlock(unref(Link), {
                      key: c.value,
                      href: `/admin/solicitacoes?status=${c.value}`,
                      "aria-current": __props.status === c.value ? "page" : void 0,
                      class: ["inline-flex min-h-10 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition", __props.status === c.value ? "border-action-600 bg-action-50 text-action-700" : "border-line-strong bg-white text-ink hover:bg-navy-50"]
                    }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(c.label), 1),
                        createVNode("span", { class: "rounded-full bg-white/80 px-1.5 text-xs tabular-nums ring-1 ring-line" }, toDisplayString(c.count), 1)
                      ]),
                      _: 2
                    }, 1032, ["href", "aria-current", "class"]);
                  }), 128))
                ]),
                __props.submissions.data.length ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "card overflow-hidden"
                }, [
                  createVNode("ul", { class: "divide-y divide-line" }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(__props.submissions.data, (s) => {
                      return openBlock(), createBlock("li", {
                        key: s.id
                      }, [
                        createVNode(unref(Link), {
                          href: s.show_url,
                          class: "flex flex-wrap items-center gap-3 px-4 py-4 transition hover:bg-surface sm:px-5"
                        }, {
                          default: withCtx(() => [
                            createVNode("div", { class: "min-w-0 flex-1" }, [
                              createVNode("p", { class: "truncate font-bold text-ink" }, toDisplayString(s.title), 1),
                              createVNode("p", { class: "truncate text-sm text-muted" }, toDisplayString(s.company_name) + " · " + toDisplayString(s.category) + " · via " + toDisplayString(s.platform), 1),
                              createVNode("p", { class: "text-xs text-subtle" }, "Enviada por " + toDisplayString(s.submitter) + " em " + toDisplayString(unref(formatDateTime)(s.created_at)), 1)
                            ]),
                            createVNode("span", {
                              class: ["badge px-2.5 py-1", tone[s.status]]
                            }, toDisplayString(label[s.status]), 3)
                          ]),
                          _: 2
                        }, 1032, ["href"])
                      ]);
                    }), 128))
                  ])
                ])) : (openBlock(), createBlock(_sfc_main$2, {
                  key: 1,
                  icon: unref(Inbox),
                  title: "Nenhuma solicitação aqui",
                  description: __props.status === "pending" ? "Quando alguém enviar uma vaga pelo site, ela aparecerá nesta lista." : "Nada nesta situação por enquanto."
                }, null, 8, ["icon", "description"])),
                createVNode("div", { class: "mt-6" }, [
                  createVNode(_sfc_main$3, { meta: __props.submissions }, null, 8, ["meta"])
                ])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/pages/Admin/Submissions/Index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=Index-ZXvWH0N8.js.map
