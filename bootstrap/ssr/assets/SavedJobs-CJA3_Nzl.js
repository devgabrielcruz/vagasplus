import { defineComponent, ref, onMounted, watch, computed, mergeProps, withCtx, unref, createTextVNode, createVNode, toDisplayString, openBlock, createBlock, Fragment, createCommentVNode, renderList, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrRenderList, ssrRenderClass } from "vue/server-renderer";
import { Link } from "@inertiajs/vue3";
import { X, Trash2, Bookmark, Loader2 } from "lucide-vue-next";
import { _ as _sfc_main$2 } from "./Breadcrumbs-C8MHcfb-.js";
import { _ as _sfc_main$5 } from "./CompanyLogo-meQRdREr.js";
import { _ as _sfc_main$6 } from "./ConfirmDialog-CgAQ1lem.js";
import { _ as _sfc_main$3 } from "./EmptyState-QtkKSWjC.js";
import { _ as _sfc_main$4 } from "./JobCard-CV-JBXgW.js";
import { u as useSavedJobs, _ as _sfc_main$1 } from "./PublicLayout-DWxlUL7J.js";
import "./FlashMessages-mTMlubKC.js";
import "./SeoHead-BMQcIEwx.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "SavedJobs",
  __ssrInlineRender: true,
  props: {
    seo: {}
  },
  setup(__props) {
    const { items, remove, clear } = useSavedJobs();
    const ready = ref(false);
    const loading = ref(false);
    const failed = ref(false);
    const open = ref({});
    const closed = ref(/* @__PURE__ */ new Set());
    const confirmClear = ref(false);
    let checked = "";
    async function check() {
      const slugs = items.value.map((j) => j.slug);
      const signature = slugs.join("|");
      if (!slugs.length || signature === checked) return;
      checked = signature;
      loading.value = true;
      failed.value = false;
      try {
        const qs = new URLSearchParams();
        slugs.forEach((s) => qs.append("slugs[]", s));
        const res = await fetch(`/minhas-vagas/consultar?${qs}`, { headers: { Accept: "application/json" }, credentials: "same-origin" });
        if (!res.ok) throw new Error(String(res.status));
        const json = await res.json();
        open.value = Object.fromEntries(json.open.map((j) => [j.slug, j]));
        closed.value = new Set(json.closed);
      } catch {
        failed.value = true;
        checked = "";
      } finally {
        loading.value = false;
      }
    }
    onMounted(() => {
      setTimeout(() => {
        ready.value = true;
        check();
      }, 0);
    });
    watch(() => items.value.length, () => ready.value && check());
    const rows = computed(
      () => items.value.map((s) => open.value[s.slug] ? { kind: "open", card: open.value[s.slug] } : closed.value.has(s.slug) ? { kind: "closed", saved: s } : { kind: "pending", saved: s })
    );
    const closedCount = computed(() => rows.value.filter((r) => r.kind === "closed").length);
    function removeClosed() {
      items.value.filter((s) => closed.value.has(s.slug)).forEach((s) => remove(s.slug));
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$1, mergeProps({ seo: __props.seo }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="container-page py-6 sm:py-10"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$2, { items: [{ label: "Início", url: "/" }, { label: "Minhas vagas", url: null }] }, null, _parent2, _scopeId));
            _push2(`<header class="mt-5 flex flex-wrap items-end justify-between gap-3"${_scopeId}><div${_scopeId}><h1 class="t-h1 text-ink"${_scopeId}>Minhas vagas</h1><p class="mt-1.5 text-sm text-muted" aria-live="polite"${_scopeId}>`);
            if (!ready.value) {
              _push2(`<!--[-->Carregando…<!--]-->`);
            } else if (unref(items).length) {
              _push2(`<!--[-->${ssrInterpolate(unref(items).length)} ${ssrInterpolate(unref(items).length === 1 ? "vaga salva" : "vagas salvas")} neste navegador<!--]-->`);
            } else {
              _push2(`<!--[-->Nenhuma vaga salva<!--]-->`);
            }
            _push2(`</p></div>`);
            if (unref(items).length) {
              _push2(`<div class="flex flex-wrap gap-2"${_scopeId}>`);
              if (closedCount.value) {
                _push2(`<button type="button" class="btn-secondary btn-sm"${_scopeId}>`);
                _push2(ssrRenderComponent(unref(X), {
                  class: "size-4",
                  "aria-hidden": "true"
                }, null, _parent2, _scopeId));
                _push2(`Remover encerradas (${ssrInterpolate(closedCount.value)})</button>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`<button type="button" class="btn-secondary btn-sm text-danger-700 hover:border-danger-700 hover:bg-danger-50"${_scopeId}>`);
              _push2(ssrRenderComponent(unref(Trash2), {
                class: "size-4",
                "aria-hidden": "true"
              }, null, _parent2, _scopeId));
              _push2(`Limpar lista</button></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</header><p class="mt-4 rounded-xl border border-line bg-white px-4 py-3 text-xs text-muted"${_scopeId}>As vagas salvas ficam guardadas <strong class="text-ink"${_scopeId}>somente neste navegador</strong> (nada é enviado ou guardado em conta). Se você limpar os dados do navegador ou usar outro aparelho, a lista não estará lá.</p>`);
            if (ready.value && !unref(items).length) {
              _push2(`<div class="mt-8"${_scopeId}>`);
              _push2(ssrRenderComponent(_sfc_main$3, {
                icon: unref(Bookmark),
                title: "Você ainda não salvou nenhuma vaga",
                description: "Toque no marcador de qualquer vaga para guardá-la aqui e ver depois."
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(unref(Link), {
                      href: "/vagas",
                      class: "btn-primary"
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`Ver vagas abertas`);
                        } else {
                          return [
                            createTextVNode("Ver vagas abertas")
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
                          createTextVNode("Ver vagas abertas")
                        ]),
                        _: 1
                      })
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
            if (failed.value) {
              _push2(`<p class="mt-6 rounded-lg bg-warning-50 p-3 text-sm font-medium text-warning-700" role="alert"${_scopeId}>Não foi possível conferir se as vagas ainda estão abertas. Mostrando o que foi salvo; tente recarregar a página.</p>`);
            } else {
              _push2(`<!---->`);
            }
            if (unref(items).length) {
              _push2(`<div class="relative mt-6 grid gap-4 md:grid-cols-2"${ssrRenderAttr("aria-busy", loading.value)}${_scopeId}><!--[-->`);
              ssrRenderList(rows.value, (r) => {
                _push2(`<!--[-->`);
                if (r.kind === "open") {
                  _push2(ssrRenderComponent(_sfc_main$4, {
                    job: r.card
                  }, null, _parent2, _scopeId));
                } else {
                  _push2(`<article class="${ssrRenderClass([r.kind === "closed" ? "bg-surface" : "", "card relative flex gap-3.5 p-4 sm:p-5"])}"${_scopeId}>`);
                  _push2(ssrRenderComponent(_sfc_main$5, {
                    name: r.saved.company,
                    url: r.saved.logo,
                    size: "md"
                  }, null, _parent2, _scopeId));
                  _push2(`<div class="min-w-0 flex-1"${_scopeId}><div class="flex items-start justify-between gap-2"${_scopeId}><h3 class="${ssrRenderClass([r.kind === "closed" ? "text-muted" : "text-ink", "text-base leading-snug font-bold"])}"${_scopeId}>`);
                  if (r.kind === "pending") {
                    _push2(ssrRenderComponent(unref(Link), {
                      href: r.saved.url,
                      class: "hover:text-action-700"
                    }, {
                      default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                        if (_push3) {
                          _push3(`${ssrInterpolate(r.saved.title)}`);
                        } else {
                          return [
                            createTextVNode(toDisplayString(r.saved.title), 1)
                          ];
                        }
                      }),
                      _: 2
                    }, _parent2, _scopeId));
                  } else {
                    _push2(`<!--[-->${ssrInterpolate(r.saved.title)}<!--]-->`);
                  }
                  _push2(`</h3><button type="button" class="grid size-9 shrink-0 place-items-center rounded-lg text-subtle hover:bg-danger-50 hover:text-danger-700"${ssrRenderAttr("aria-label", `Remover ${r.saved.title} de Minhas vagas`)}${_scopeId}>`);
                  _push2(ssrRenderComponent(unref(X), {
                    class: "size-4.5",
                    "aria-hidden": "true"
                  }, null, _parent2, _scopeId));
                  _push2(`</button></div><p class="text-sm text-muted"${_scopeId}>${ssrInterpolate(r.saved.company)}</p>`);
                  if (r.kind === "closed") {
                    _push2(`<p class="mt-3 inline-flex items-center gap-1.5 rounded-full bg-warning-50 px-2.5 py-1 text-xs font-bold text-warning-700"${_scopeId}>Vaga encerrada ou indisponível</p>`);
                  } else {
                    _push2(`<p class="mt-3 inline-flex items-center gap-1.5 text-xs text-subtle"${_scopeId}>`);
                    _push2(ssrRenderComponent(unref(Loader2), {
                      class: "size-3.5 animate-spin",
                      "aria-hidden": "true"
                    }, null, _parent2, _scopeId));
                    _push2(`Conferindo se continua aberta…</p>`);
                  }
                  _push2(`</div></article>`);
                }
                _push2(`<!--]-->`);
              });
              _push2(`<!--]--></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
            _push2(ssrRenderComponent(_sfc_main$6, {
              open: confirmClear.value,
              danger: "",
              "confirm-label": "Limpar lista",
              title: "Limpar todas as vagas salvas?",
              message: "Elas serão removidas deste navegador. Você poderá salvar de novo quando quiser.",
              onCancel: ($event) => confirmClear.value = false,
              onConfirm: ($event) => {
                unref(clear)();
                confirmClear.value = false;
              }
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode("div", { class: "container-page py-6 sm:py-10" }, [
                createVNode(_sfc_main$2, { items: [{ label: "Início", url: "/" }, { label: "Minhas vagas", url: null }] }),
                createVNode("header", { class: "mt-5 flex flex-wrap items-end justify-between gap-3" }, [
                  createVNode("div", null, [
                    createVNode("h1", { class: "t-h1 text-ink" }, "Minhas vagas"),
                    createVNode("p", {
                      class: "mt-1.5 text-sm text-muted",
                      "aria-live": "polite"
                    }, [
                      !ready.value ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                        createTextVNode("Carregando…")
                      ], 64)) : unref(items).length ? (openBlock(), createBlock(Fragment, { key: 1 }, [
                        createTextVNode(toDisplayString(unref(items).length) + " " + toDisplayString(unref(items).length === 1 ? "vaga salva" : "vagas salvas") + " neste navegador", 1)
                      ], 64)) : (openBlock(), createBlock(Fragment, { key: 2 }, [
                        createTextVNode("Nenhuma vaga salva")
                      ], 64))
                    ])
                  ]),
                  unref(items).length ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "flex flex-wrap gap-2"
                  }, [
                    closedCount.value ? (openBlock(), createBlock("button", {
                      key: 0,
                      type: "button",
                      class: "btn-secondary btn-sm",
                      onClick: removeClosed
                    }, [
                      createVNode(unref(X), {
                        class: "size-4",
                        "aria-hidden": "true"
                      }),
                      createTextVNode("Remover encerradas (" + toDisplayString(closedCount.value) + ")", 1)
                    ])) : createCommentVNode("", true),
                    createVNode("button", {
                      type: "button",
                      class: "btn-secondary btn-sm text-danger-700 hover:border-danger-700 hover:bg-danger-50",
                      onClick: ($event) => confirmClear.value = true
                    }, [
                      createVNode(unref(Trash2), {
                        class: "size-4",
                        "aria-hidden": "true"
                      }),
                      createTextVNode("Limpar lista")
                    ], 8, ["onClick"])
                  ])) : createCommentVNode("", true)
                ]),
                createVNode("p", { class: "mt-4 rounded-xl border border-line bg-white px-4 py-3 text-xs text-muted" }, [
                  createTextVNode("As vagas salvas ficam guardadas "),
                  createVNode("strong", { class: "text-ink" }, "somente neste navegador"),
                  createTextVNode(" (nada é enviado ou guardado em conta). Se você limpar os dados do navegador ou usar outro aparelho, a lista não estará lá.")
                ]),
                ready.value && !unref(items).length ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "mt-8"
                }, [
                  createVNode(_sfc_main$3, {
                    icon: unref(Bookmark),
                    title: "Você ainda não salvou nenhuma vaga",
                    description: "Toque no marcador de qualquer vaga para guardá-la aqui e ver depois."
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(Link), {
                        href: "/vagas",
                        class: "btn-primary"
                      }, {
                        default: withCtx(() => [
                          createTextVNode("Ver vagas abertas")
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }, 8, ["icon"])
                ])) : createCommentVNode("", true),
                failed.value ? (openBlock(), createBlock("p", {
                  key: 1,
                  class: "mt-6 rounded-lg bg-warning-50 p-3 text-sm font-medium text-warning-700",
                  role: "alert"
                }, "Não foi possível conferir se as vagas ainda estão abertas. Mostrando o que foi salvo; tente recarregar a página.")) : createCommentVNode("", true),
                unref(items).length ? (openBlock(), createBlock("div", {
                  key: 2,
                  class: "relative mt-6 grid gap-4 md:grid-cols-2",
                  "aria-busy": loading.value
                }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(rows.value, (r) => {
                    return openBlock(), createBlock(Fragment, {
                      key: r.kind === "open" ? r.card.slug : r.saved.slug
                    }, [
                      r.kind === "open" ? (openBlock(), createBlock(_sfc_main$4, {
                        key: 0,
                        job: r.card
                      }, null, 8, ["job"])) : (openBlock(), createBlock("article", {
                        key: 1,
                        class: ["card relative flex gap-3.5 p-4 sm:p-5", r.kind === "closed" ? "bg-surface" : ""]
                      }, [
                        createVNode(_sfc_main$5, {
                          name: r.saved.company,
                          url: r.saved.logo,
                          size: "md"
                        }, null, 8, ["name", "url"]),
                        createVNode("div", { class: "min-w-0 flex-1" }, [
                          createVNode("div", { class: "flex items-start justify-between gap-2" }, [
                            createVNode("h3", {
                              class: ["text-base leading-snug font-bold", r.kind === "closed" ? "text-muted" : "text-ink"]
                            }, [
                              r.kind === "pending" ? (openBlock(), createBlock(unref(Link), {
                                key: 0,
                                href: r.saved.url,
                                class: "hover:text-action-700"
                              }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(r.saved.title), 1)
                                ]),
                                _: 2
                              }, 1032, ["href"])) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                                createTextVNode(toDisplayString(r.saved.title), 1)
                              ], 64))
                            ], 2),
                            createVNode("button", {
                              type: "button",
                              class: "grid size-9 shrink-0 place-items-center rounded-lg text-subtle hover:bg-danger-50 hover:text-danger-700",
                              "aria-label": `Remover ${r.saved.title} de Minhas vagas`,
                              onClick: ($event) => unref(remove)(r.saved.slug)
                            }, [
                              createVNode(unref(X), {
                                class: "size-4.5",
                                "aria-hidden": "true"
                              })
                            ], 8, ["aria-label", "onClick"])
                          ]),
                          createVNode("p", { class: "text-sm text-muted" }, toDisplayString(r.saved.company), 1),
                          r.kind === "closed" ? (openBlock(), createBlock("p", {
                            key: 0,
                            class: "mt-3 inline-flex items-center gap-1.5 rounded-full bg-warning-50 px-2.5 py-1 text-xs font-bold text-warning-700"
                          }, "Vaga encerrada ou indisponível")) : (openBlock(), createBlock("p", {
                            key: 1,
                            class: "mt-3 inline-flex items-center gap-1.5 text-xs text-subtle"
                          }, [
                            createVNode(unref(Loader2), {
                              class: "size-3.5 animate-spin",
                              "aria-hidden": "true"
                            }),
                            createTextVNode("Conferindo se continua aberta…")
                          ]))
                        ])
                      ], 2))
                    ], 64);
                  }), 128))
                ], 8, ["aria-busy"])) : createCommentVNode("", true)
              ]),
              createVNode(_sfc_main$6, {
                open: confirmClear.value,
                danger: "",
                "confirm-label": "Limpar lista",
                title: "Limpar todas as vagas salvas?",
                message: "Elas serão removidas deste navegador. Você poderá salvar de novo quando quiser.",
                onCancel: ($event) => confirmClear.value = false,
                onConfirm: ($event) => {
                  unref(clear)();
                  confirmClear.value = false;
                }
              }, null, 8, ["open", "onCancel", "onConfirm"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/pages/Public/SavedJobs.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=SavedJobs-CJA3_Nzl.js.map
