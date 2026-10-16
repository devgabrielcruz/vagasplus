import { defineComponent, mergeProps, withCtx, unref, createVNode, createTextVNode, resolveDynamicComponent, openBlock, createBlock, toDisplayString, Fragment, renderList, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderList, ssrRenderClass, ssrRenderVNode, ssrInterpolate } from "vue/server-renderer";
import { Link } from "@inertiajs/vue3";
import { Plus, Inbox, CheckCircle2, Hourglass, FilePen, CalendarClock, TimerOff, ClipboardCheck, Archive } from "lucide-vue-next";
import { _ as _sfc_main$1 } from "./AdminLayout-BocNC89A.js";
import { f as formatDateTime, d as daysUntil } from "./format-D8ppHDIy.js";
import "./FlashMessages-mTMlubKC.js";
import "./SeoHead-BMQcIEwx.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Dashboard",
  __ssrInlineRender: true,
  props: {
    stats: {},
    expiringSoon: {},
    recentlyExpired: {}
  },
  setup(__props) {
    const cards = [
      { key: "submissions", label: "Solicitações em análise", icon: Inbox, tone: "text-action-700 bg-action-50", href: "/admin/solicitacoes" },
      { key: "active", label: "Publicadas e válidas", icon: CheckCircle2, tone: "text-success-700 bg-success-50", href: "/admin/vagas?status=published" },
      { key: "expiring_soon", label: "Expiram em 7 dias", icon: Hourglass, tone: "text-warning-700 bg-warning-50", href: "/admin/vagas?status=published&sort=expires_at&dir=asc" },
      { key: "draft", label: "Rascunhos", icon: FilePen, tone: "text-navy-800 bg-navy-50", href: "/admin/vagas?status=draft" },
      { key: "scheduled", label: "Agendadas", icon: CalendarClock, tone: "text-info-700 bg-info-50", href: "/admin/vagas?status=scheduled" },
      { key: "recently_expired", label: "Expiraram (7 dias)", icon: TimerOff, tone: "text-warning-700 bg-warning-50", href: "/admin/vagas?status=expired&sort=expires_at&dir=desc" },
      { key: "expired", label: "Expiradas (total)", icon: TimerOff, tone: "text-muted bg-line", href: "/admin/vagas?status=expired" },
      { key: "needs_review", label: "Aguardando revisão", icon: ClipboardCheck, tone: "text-danger-700 bg-danger-50", href: "/admin/vagas?status=draft" },
      { key: "archived", label: "Arquivadas", icon: Archive, tone: "text-muted bg-line", href: "/admin/vagas?status=archived" }
    ];
    const remaining = (iso) => {
      const d = daysUntil(iso);
      return d === null ? "" : d <= 0 ? "hoje" : d === 1 ? "amanhã" : `em ${d} dias`;
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$1, mergeProps({ title: "Dashboard" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="mx-auto max-w-6xl"${_scopeId}><header class="mb-6 flex flex-wrap items-center justify-between gap-3"${_scopeId}><div${_scopeId}><h1 class="text-2xl font-extrabold text-ink"${_scopeId}>Dashboard</h1><p class="text-sm text-muted"${_scopeId}>Situação atual das vagas, direto do banco de dados.</p></div>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: "/admin/vagas/criar",
              class: "btn-primary"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(Plus), {
                    class: "size-4",
                    "aria-hidden": "true"
                  }, null, _parent3, _scopeId2));
                  _push3(`Nova vaga`);
                } else {
                  return [
                    createVNode(unref(Plus), {
                      class: "size-4",
                      "aria-hidden": "true"
                    }),
                    createTextVNode("Nova vaga")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</header><ul class="grid grid-cols-2 gap-3 md:grid-cols-4"${_scopeId}><!--[-->`);
            ssrRenderList(cards, (c) => {
              _push2(`<li${_scopeId}>`);
              _push2(ssrRenderComponent(unref(Link), {
                href: c.href,
                class: "card flex h-full flex-col gap-3 p-4 transition hover:border-action-500 hover:shadow-(--shadow-lift)"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<span class="${ssrRenderClass([c.tone, "grid size-9 place-items-center rounded-lg"])}"${_scopeId2}>`);
                    ssrRenderVNode(_push3, createVNode(resolveDynamicComponent(c.icon), {
                      class: "size-4.5",
                      "aria-hidden": "true"
                    }, null), _parent3, _scopeId2);
                    _push3(`</span><span${_scopeId2}><span class="block text-3xl leading-none font-extrabold text-ink tabular-nums"${_scopeId2}>${ssrInterpolate(__props.stats[c.key])}</span><span class="mt-1.5 block text-[13px] font-medium text-muted"${_scopeId2}>${ssrInterpolate(c.label)}</span></span>`);
                  } else {
                    return [
                      createVNode("span", {
                        class: ["grid size-9 place-items-center rounded-lg", c.tone]
                      }, [
                        (openBlock(), createBlock(resolveDynamicComponent(c.icon), {
                          class: "size-4.5",
                          "aria-hidden": "true"
                        }))
                      ], 2),
                      createVNode("span", null, [
                        createVNode("span", { class: "block text-3xl leading-none font-extrabold text-ink tabular-nums" }, toDisplayString(__props.stats[c.key]), 1),
                        createVNode("span", { class: "mt-1.5 block text-[13px] font-medium text-muted" }, toDisplayString(c.label), 1)
                      ])
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
              _push2(`</li>`);
            });
            _push2(`<!--]--></ul><div class="mt-8 grid gap-6 lg:grid-cols-2"${_scopeId}><section class="card" aria-labelledby="exp-soon"${_scopeId}><h2 id="exp-soon" class="flex items-center gap-2 border-b border-line px-5 py-4 font-extrabold text-ink"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Hourglass), {
              class: "size-4.5 text-warning-700",
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
            _push2(`Próximas da expiração</h2>`);
            if (__props.expiringSoon.length) {
              _push2(`<ul class="divide-y divide-line"${_scopeId}><!--[-->`);
              ssrRenderList(__props.expiringSoon, (r) => {
                _push2(`<li class="flex items-center justify-between gap-3 px-5 py-3"${_scopeId}><div class="min-w-0"${_scopeId}>`);
                _push2(ssrRenderComponent(unref(Link), {
                  href: r.edit_url,
                  class: "block truncate text-sm font-bold text-ink hover:text-action-700"
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`${ssrInterpolate(r.title)}`);
                    } else {
                      return [
                        createTextVNode(toDisplayString(r.title), 1)
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
                _push2(`<p class="truncate text-xs text-muted"${_scopeId}>${ssrInterpolate(r.company)} · ${ssrInterpolate(unref(formatDateTime)(r.expires_at))}</p></div><span class="shrink-0 rounded-full bg-warning-50 px-2.5 py-1 text-xs font-bold text-warning-700"${_scopeId}>${ssrInterpolate(remaining(r.expires_at))}</span></li>`);
              });
              _push2(`<!--]--></ul>`);
            } else {
              _push2(`<p class="px-5 py-8 text-center text-sm text-muted"${_scopeId}>Nenhuma vaga expira nos próximos 7 dias.</p>`);
            }
            _push2(`</section><section class="card" aria-labelledby="exp-recent"${_scopeId}><h2 id="exp-recent" class="flex items-center gap-2 border-b border-line px-5 py-4 font-extrabold text-ink"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(TimerOff), {
              class: "size-4.5 text-muted",
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
            _push2(`Expiraram recentemente</h2>`);
            if (__props.recentlyExpired.length) {
              _push2(`<ul class="divide-y divide-line"${_scopeId}><!--[-->`);
              ssrRenderList(__props.recentlyExpired, (r) => {
                _push2(`<li class="flex items-center justify-between gap-3 px-5 py-3"${_scopeId}><div class="min-w-0"${_scopeId}>`);
                _push2(ssrRenderComponent(unref(Link), {
                  href: r.edit_url,
                  class: "block truncate text-sm font-bold text-ink hover:text-action-700"
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`${ssrInterpolate(r.title)}`);
                    } else {
                      return [
                        createTextVNode(toDisplayString(r.title), 1)
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
                _push2(`<p class="truncate text-xs text-muted"${_scopeId}>${ssrInterpolate(r.company)} · expirou em ${ssrInterpolate(unref(formatDateTime)(r.expires_at))}</p></div>`);
                _push2(ssrRenderComponent(unref(Link), {
                  href: r.edit_url,
                  class: "btn-secondary btn-sm shrink-0"
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`Revisar`);
                    } else {
                      return [
                        createTextVNode("Revisar")
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
                _push2(`</li>`);
              });
              _push2(`<!--]--></ul>`);
            } else {
              _push2(`<p class="px-5 py-8 text-center text-sm text-muted"${_scopeId}>Nenhuma vaga expirou nos últimos 7 dias.</p>`);
            }
            _push2(`</section></div></div>`);
          } else {
            return [
              createVNode("div", { class: "mx-auto max-w-6xl" }, [
                createVNode("header", { class: "mb-6 flex flex-wrap items-center justify-between gap-3" }, [
                  createVNode("div", null, [
                    createVNode("h1", { class: "text-2xl font-extrabold text-ink" }, "Dashboard"),
                    createVNode("p", { class: "text-sm text-muted" }, "Situação atual das vagas, direto do banco de dados.")
                  ]),
                  createVNode(unref(Link), {
                    href: "/admin/vagas/criar",
                    class: "btn-primary"
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(Plus), {
                        class: "size-4",
                        "aria-hidden": "true"
                      }),
                      createTextVNode("Nova vaga")
                    ]),
                    _: 1
                  })
                ]),
                createVNode("ul", { class: "grid grid-cols-2 gap-3 md:grid-cols-4" }, [
                  (openBlock(), createBlock(Fragment, null, renderList(cards, (c) => {
                    return createVNode("li", {
                      key: c.key
                    }, [
                      createVNode(unref(Link), {
                        href: c.href,
                        class: "card flex h-full flex-col gap-3 p-4 transition hover:border-action-500 hover:shadow-(--shadow-lift)"
                      }, {
                        default: withCtx(() => [
                          createVNode("span", {
                            class: ["grid size-9 place-items-center rounded-lg", c.tone]
                          }, [
                            (openBlock(), createBlock(resolveDynamicComponent(c.icon), {
                              class: "size-4.5",
                              "aria-hidden": "true"
                            }))
                          ], 2),
                          createVNode("span", null, [
                            createVNode("span", { class: "block text-3xl leading-none font-extrabold text-ink tabular-nums" }, toDisplayString(__props.stats[c.key]), 1),
                            createVNode("span", { class: "mt-1.5 block text-[13px] font-medium text-muted" }, toDisplayString(c.label), 1)
                          ])
                        ]),
                        _: 2
                      }, 1032, ["href"])
                    ]);
                  }), 64))
                ]),
                createVNode("div", { class: "mt-8 grid gap-6 lg:grid-cols-2" }, [
                  createVNode("section", {
                    class: "card",
                    "aria-labelledby": "exp-soon"
                  }, [
                    createVNode("h2", {
                      id: "exp-soon",
                      class: "flex items-center gap-2 border-b border-line px-5 py-4 font-extrabold text-ink"
                    }, [
                      createVNode(unref(Hourglass), {
                        class: "size-4.5 text-warning-700",
                        "aria-hidden": "true"
                      }),
                      createTextVNode("Próximas da expiração")
                    ]),
                    __props.expiringSoon.length ? (openBlock(), createBlock("ul", {
                      key: 0,
                      class: "divide-y divide-line"
                    }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(__props.expiringSoon, (r) => {
                        return openBlock(), createBlock("li", {
                          key: r.id,
                          class: "flex items-center justify-between gap-3 px-5 py-3"
                        }, [
                          createVNode("div", { class: "min-w-0" }, [
                            createVNode(unref(Link), {
                              href: r.edit_url,
                              class: "block truncate text-sm font-bold text-ink hover:text-action-700"
                            }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(r.title), 1)
                              ]),
                              _: 2
                            }, 1032, ["href"]),
                            createVNode("p", { class: "truncate text-xs text-muted" }, toDisplayString(r.company) + " · " + toDisplayString(unref(formatDateTime)(r.expires_at)), 1)
                          ]),
                          createVNode("span", { class: "shrink-0 rounded-full bg-warning-50 px-2.5 py-1 text-xs font-bold text-warning-700" }, toDisplayString(remaining(r.expires_at)), 1)
                        ]);
                      }), 128))
                    ])) : (openBlock(), createBlock("p", {
                      key: 1,
                      class: "px-5 py-8 text-center text-sm text-muted"
                    }, "Nenhuma vaga expira nos próximos 7 dias."))
                  ]),
                  createVNode("section", {
                    class: "card",
                    "aria-labelledby": "exp-recent"
                  }, [
                    createVNode("h2", {
                      id: "exp-recent",
                      class: "flex items-center gap-2 border-b border-line px-5 py-4 font-extrabold text-ink"
                    }, [
                      createVNode(unref(TimerOff), {
                        class: "size-4.5 text-muted",
                        "aria-hidden": "true"
                      }),
                      createTextVNode("Expiraram recentemente")
                    ]),
                    __props.recentlyExpired.length ? (openBlock(), createBlock("ul", {
                      key: 0,
                      class: "divide-y divide-line"
                    }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(__props.recentlyExpired, (r) => {
                        return openBlock(), createBlock("li", {
                          key: r.id,
                          class: "flex items-center justify-between gap-3 px-5 py-3"
                        }, [
                          createVNode("div", { class: "min-w-0" }, [
                            createVNode(unref(Link), {
                              href: r.edit_url,
                              class: "block truncate text-sm font-bold text-ink hover:text-action-700"
                            }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(r.title), 1)
                              ]),
                              _: 2
                            }, 1032, ["href"]),
                            createVNode("p", { class: "truncate text-xs text-muted" }, toDisplayString(r.company) + " · expirou em " + toDisplayString(unref(formatDateTime)(r.expires_at)), 1)
                          ]),
                          createVNode(unref(Link), {
                            href: r.edit_url,
                            class: "btn-secondary btn-sm shrink-0"
                          }, {
                            default: withCtx(() => [
                              createTextVNode("Revisar")
                            ]),
                            _: 1
                          }, 8, ["href"])
                        ]);
                      }), 128))
                    ])) : (openBlock(), createBlock("p", {
                      key: 1,
                      class: "px-5 py-8 text-center text-sm text-muted"
                    }, "Nenhuma vaga expirou nos últimos 7 dias."))
                  ])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/pages/Admin/Dashboard.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=Dashboard-DuAcIkMF.js.map
