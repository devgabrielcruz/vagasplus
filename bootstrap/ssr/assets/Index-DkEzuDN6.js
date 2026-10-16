import { defineComponent, reactive, ref, mergeProps, withCtx, unref, createVNode, createTextVNode, toDisplayString, openBlock, createBlock, createCommentVNode, withModifiers, withDirectives, vModelText, Fragment, renderList, vModelSelect, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList, ssrRenderClass } from "vue/server-renderer";
import { Link, router } from "@inertiajs/vue3";
import { Plus, Search, X, ArrowUp, ArrowDown, Star, Pencil, Eye, ExternalLink, RefreshCw, ArchiveRestore, Archive } from "lucide-vue-next";
import { _ as _sfc_main$5 } from "./ConfirmDialog-CgAQ1lem.js";
import { _ as _sfc_main$3 } from "./EmptyState-QtkKSWjC.js";
import { _ as _sfc_main$4 } from "./Pagination-CQ9B5UeT.js";
import { _ as _sfc_main$2, a as _sfc_main$6 } from "./StatusBadge-Crn78Iy0.js";
import { _ as _sfc_main$1 } from "./AdminLayout-BocNC89A.js";
import { a as formatDate, f as formatDateTime } from "./format-D8ppHDIy.js";
import "./FlashMessages-mTMlubKC.js";
import "./SeoHead-BMQcIEwx.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Index",
  __ssrInlineRender: true,
  props: {
    jobs: {},
    filters: {},
    statuses: {}
  },
  setup(__props) {
    const props = __props;
    const f = reactive({ ...props.filters });
    const loading = ref(false);
    const archiveTarget = ref(null);
    const renewTarget = ref(null);
    const acting = ref(false);
    function apply(extra = {}) {
      Object.assign(f, extra);
      const params = {};
      for (const [k, v] of Object.entries(f)) if (v) params[k] = String(v);
      router.get("/admin/vagas", params, { preserveState: true, onStart: () => loading.value = true, onFinish: () => loading.value = false });
    }
    function clear() {
      Object.assign(f, { q: "", status: "", from: "", to: "", date_field: "published_at", sort: "updated_at", dir: "desc" });
      apply();
    }
    function sortBy(col) {
      apply({ sort: col, dir: f.sort === col && f.dir === "desc" ? "asc" : "desc" });
    }
    const ariaSort = (col) => f.sort === col ? f.dir === "asc" ? "ascending" : "descending" : "none";
    function post(url, done) {
      acting.value = true;
      router.post(url, {}, { preserveScroll: true, onFinish: () => {
        acting.value = false;
        done?.();
      } });
    }
    const hasFilters = () => !!(f.q || f.status || f.from || f.to);
    const columns = [
      { key: "title", label: "Vaga" },
      { key: "status", label: "Status" },
      { key: "published_at", label: "Publicação" },
      { key: "expires_at", label: "Expiração" },
      { key: "updated_at", label: "Atualizada" }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$1, mergeProps({ title: "Vagas" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="mx-auto max-w-7xl"${_scopeId}><header class="mb-5 flex flex-wrap items-center justify-between gap-3"${_scopeId}><div${_scopeId}><h1 class="text-2xl font-extrabold text-ink"${_scopeId}>Vagas</h1><p class="text-sm text-muted"${_scopeId}>${ssrInterpolate(__props.jobs.total)} ${ssrInterpolate(__props.jobs.total === 1 ? "vaga" : "vagas")} encontradas</p></div>`);
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
            _push2(`</header><form class="card mb-4 grid gap-3 p-4 md:grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] md:items-end" role="search" aria-label="Filtrar vagas"${_scopeId}><div class="relative"${_scopeId}><label for="q" class="label"${_scopeId}>Buscar</label>`);
            _push2(ssrRenderComponent(unref(Search), {
              class: "pointer-events-none absolute bottom-3 left-3 size-4 text-subtle",
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
            _push2(`<input id="q"${ssrRenderAttr("value", f.q)} type="search" placeholder="Título, empresa, ID ou slug" class="field pl-9"${_scopeId}></div><div${_scopeId}><label for="status" class="label"${_scopeId}>Status</label><select id="status" class="field"${_scopeId}><option value=""${ssrIncludeBooleanAttr(Array.isArray(f.status) ? ssrLooseContain(f.status, "") : ssrLooseEqual(f.status, "")) ? " selected" : ""}${_scopeId}>Todos</option><!--[-->`);
            ssrRenderList(__props.statuses, (s) => {
              _push2(`<option${ssrRenderAttr("value", s.value)}${ssrIncludeBooleanAttr(Array.isArray(f.status) ? ssrLooseContain(f.status, s.value) : ssrLooseEqual(f.status, s.value)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(s.label)}</option>`);
            });
            _push2(`<!--]--></select></div><div${_scopeId}><label for="df" class="label"${_scopeId}>Filtrar data por</label><select id="df" class="field"${_scopeId}><option value="published_at"${ssrIncludeBooleanAttr(Array.isArray(f.date_field) ? ssrLooseContain(f.date_field, "published_at") : ssrLooseEqual(f.date_field, "published_at")) ? " selected" : ""}${_scopeId}>Publicação</option><option value="expires_at"${ssrIncludeBooleanAttr(Array.isArray(f.date_field) ? ssrLooseContain(f.date_field, "expires_at") : ssrLooseEqual(f.date_field, "expires_at")) ? " selected" : ""}${_scopeId}>Expiração</option><option value="updated_at"${ssrIncludeBooleanAttr(Array.isArray(f.date_field) ? ssrLooseContain(f.date_field, "updated_at") : ssrLooseEqual(f.date_field, "updated_at")) ? " selected" : ""}${_scopeId}>Atualização</option></select></div><div${_scopeId}><label for="from" class="label"${_scopeId}>De</label><input id="from"${ssrRenderAttr("value", f.from)} type="date" class="field"${_scopeId}></div><div${_scopeId}><label for="to" class="label"${_scopeId}>Até</label><input id="to"${ssrRenderAttr("value", f.to)} type="date" class="field"${_scopeId}></div><div class="flex gap-2"${_scopeId}><button type="submit" class="btn-primary flex-1"${_scopeId}>Filtrar</button>`);
            if (hasFilters()) {
              _push2(`<button type="button" class="btn-secondary" aria-label="Limpar filtros"${_scopeId}>`);
              _push2(ssrRenderComponent(unref(X), { class: "size-4" }, null, _parent2, _scopeId));
              _push2(`</button>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></form><div class="relative"${ssrRenderAttr("aria-busy", loading.value)}${_scopeId}>`);
            if (loading.value) {
              _push2(`<div class="absolute inset-x-0 top-0 z-10 h-0.5 overflow-hidden rounded bg-action-100"${_scopeId}><div class="skeleton h-full w-full"${_scopeId}></div></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.jobs.data.length) {
              _push2(`<div class="${ssrRenderClass([loading.value ? "opacity-70" : "", "card overflow-hidden"])}"${_scopeId}><div class="overflow-x-auto"${_scopeId}><table class="w-full min-w-[56rem] text-left text-sm"${_scopeId}><caption class="sr-only"${_scopeId}>Lista de vagas</caption><thead class="border-b border-line bg-surface text-xs font-bold tracking-wide text-muted uppercase"${_scopeId}><tr${_scopeId}><!--[-->`);
              ssrRenderList(columns, (c) => {
                _push2(`<th scope="col" class="px-4 py-3"${ssrRenderAttr("aria-sort", ariaSort(c.key))}${_scopeId}><button type="button" class="inline-flex items-center gap-1 uppercase hover:text-ink"${_scopeId}>${ssrInterpolate(c.label)}`);
                if (f.sort === c.key && f.dir === "asc") {
                  _push2(ssrRenderComponent(unref(ArrowUp), {
                    class: "size-3.5",
                    "aria-hidden": "true"
                  }, null, _parent2, _scopeId));
                } else if (f.sort === c.key) {
                  _push2(ssrRenderComponent(unref(ArrowDown), {
                    class: "size-3.5",
                    "aria-hidden": "true"
                  }, null, _parent2, _scopeId));
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</button></th>`);
              });
              _push2(`<!--]--><th scope="col" class="px-4 py-3 text-right"${_scopeId}>Ações</th></tr></thead><tbody class="divide-y divide-line"${_scopeId}><!--[-->`);
              ssrRenderList(__props.jobs.data, (j) => {
                _push2(`<tr class="hover:bg-surface/60"${_scopeId}><td class="max-w-xs px-4 py-3"${_scopeId}>`);
                _push2(ssrRenderComponent(unref(Link), {
                  href: j.edit_url,
                  class: "flex items-center gap-1.5 font-bold text-ink hover:text-action-700"
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`<span class="truncate"${_scopeId2}>${ssrInterpolate(j.title)}</span>`);
                      if (j.is_featured) {
                        _push3(ssrRenderComponent(unref(Star), {
                          class: "size-3.5 shrink-0 fill-warning-700 text-warning-700",
                          "aria-label": "Em destaque"
                        }, null, _parent3, _scopeId2));
                      } else {
                        _push3(`<!---->`);
                      }
                    } else {
                      return [
                        createVNode("span", { class: "truncate" }, toDisplayString(j.title), 1),
                        j.is_featured ? (openBlock(), createBlock(unref(Star), {
                          key: 0,
                          class: "size-3.5 shrink-0 fill-warning-700 text-warning-700",
                          "aria-label": "Em destaque"
                        })) : createCommentVNode("", true)
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
                _push2(`<p class="truncate text-xs text-muted"${_scopeId}>${ssrInterpolate(j.company)} · ${ssrInterpolate(j.category)} · ${ssrInterpolate(j.platform)} · #${ssrInterpolate(j.id)}</p></td><td class="px-4 py-3"${_scopeId}>`);
                _push2(ssrRenderComponent(_sfc_main$2, {
                  status: j.status,
                  label: j.status_label
                }, null, _parent2, _scopeId));
                if (j.expiring_soon) {
                  _push2(`<p class="mt-1 text-xs font-semibold text-warning-700"${_scopeId}>Expira em breve</p>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</td><td class="px-4 py-3 whitespace-nowrap text-muted"${_scopeId}>${ssrInterpolate(unref(formatDate)(j.published_at))}</td><td class="px-4 py-3 whitespace-nowrap text-muted"${_scopeId}>${ssrInterpolate(unref(formatDateTime)(j.expires_at))}</td><td class="px-4 py-3 whitespace-nowrap text-muted"${_scopeId}>${ssrInterpolate(unref(formatDate)(j.updated_at))}</td><td class="px-4 py-3"${_scopeId}><div class="flex justify-end gap-1"${_scopeId}>`);
                _push2(ssrRenderComponent(unref(Link), {
                  href: j.edit_url,
                  class: "btn-ghost btn-sm size-9 p-0",
                  "aria-label": `Editar ${j.title}`,
                  title: "Editar"
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(ssrRenderComponent(unref(Pencil), { class: "size-4" }, null, _parent3, _scopeId2));
                    } else {
                      return [
                        createVNode(unref(Pencil), { class: "size-4" })
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
                _push2(ssrRenderComponent(unref(Link), {
                  href: j.preview_url,
                  class: "btn-ghost btn-sm size-9 p-0",
                  "aria-label": `Pré-visualizar ${j.title}`,
                  title: "Pré-visualizar"
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(ssrRenderComponent(unref(Eye), { class: "size-4" }, null, _parent3, _scopeId2));
                    } else {
                      return [
                        createVNode(unref(Eye), { class: "size-4" })
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
                if (j.public_url) {
                  _push2(`<a${ssrRenderAttr("href", j.public_url)} target="_blank" rel="noopener" class="btn-ghost btn-sm size-9 p-0"${ssrRenderAttr("aria-label", `Abrir ${j.title} no site`)} title="Ver no site"${_scopeId}>`);
                  _push2(ssrRenderComponent(unref(ExternalLink), { class: "size-4" }, null, _parent2, _scopeId));
                  _push2(`</a>`);
                } else {
                  _push2(`<!---->`);
                }
                if (["published", "expired"].includes(j.status)) {
                  _push2(`<button type="button" class="btn-ghost btn-sm size-9 p-0"${ssrRenderAttr("aria-label", `Renovar ${j.title}`)} title="Renovar"${_scopeId}>`);
                  _push2(ssrRenderComponent(unref(RefreshCw), { class: "size-4" }, null, _parent2, _scopeId));
                  _push2(`</button>`);
                } else {
                  _push2(`<!---->`);
                }
                if (j.status === "archived") {
                  _push2(`<button type="button" class="btn-ghost btn-sm size-9 p-0"${ssrRenderAttr("aria-label", `Restaurar ${j.title}`)} title="Restaurar"${_scopeId}>`);
                  _push2(ssrRenderComponent(unref(ArchiveRestore), { class: "size-4" }, null, _parent2, _scopeId));
                  _push2(`</button>`);
                } else {
                  _push2(`<button type="button" class="btn-ghost btn-sm size-9 p-0 hover:text-danger-700"${ssrRenderAttr("aria-label", `Arquivar ${j.title}`)} title="Arquivar"${_scopeId}>`);
                  _push2(ssrRenderComponent(unref(Archive), { class: "size-4" }, null, _parent2, _scopeId));
                  _push2(`</button>`);
                }
                _push2(`</div></td></tr>`);
              });
              _push2(`<!--]--></tbody></table></div></div>`);
            } else {
              _push2(ssrRenderComponent(_sfc_main$3, {
                title: "Nenhuma vaga encontrada",
                description: hasFilters() ? "Ajuste ou limpe os filtros para ver mais resultados." : "Crie a primeira vaga para começar."
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    if (hasFilters()) {
                      _push3(`<button type="button" class="btn-secondary"${_scopeId2}>Limpar filtros</button>`);
                    } else {
                      _push3(`<!---->`);
                    }
                    _push3(ssrRenderComponent(unref(Link), {
                      href: "/admin/vagas/criar",
                      class: "btn-primary"
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(unref(Plus), {
                            class: "size-4",
                            "aria-hidden": "true"
                          }, null, _parent4, _scopeId3));
                          _push4(`Nova vaga`);
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
                    }, _parent3, _scopeId2));
                  } else {
                    return [
                      hasFilters() ? (openBlock(), createBlock("button", {
                        key: 0,
                        type: "button",
                        class: "btn-secondary",
                        onClick: clear
                      }, "Limpar filtros")) : createCommentVNode("", true),
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
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            }
            _push2(`</div><div class="mt-6"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$4, { meta: __props.jobs }, null, _parent2, _scopeId));
            _push2(`</div></div>`);
            _push2(ssrRenderComponent(_sfc_main$5, {
              open: !!archiveTarget.value,
              danger: "",
              "confirm-label": "Arquivar vaga",
              title: "Arquivar esta vaga?",
              message: archiveTarget.value && ["published"].includes(archiveTarget.value.status) ? `“${archiveTarget.value.title}” está no ar e será retirada do site imediatamente. A página pública passará a responder como removida.` : `“${archiveTarget.value?.title}” será arquivada e não aparecerá publicamente.`,
              processing: acting.value,
              onCancel: ($event) => archiveTarget.value = null,
              onConfirm: ($event) => post(`/admin/vagas/${archiveTarget.value.id}/arquivar`, () => archiveTarget.value = null)
            }, null, _parent2, _scopeId));
            if (renewTarget.value) {
              _push2(ssrRenderComponent(_sfc_main$6, {
                open: !!renewTarget.value,
                "job-id": renewTarget.value.id,
                title: renewTarget.value.title,
                expired: renewTarget.value.status === "expired",
                onClose: ($event) => renewTarget.value = null
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              createVNode("div", { class: "mx-auto max-w-7xl" }, [
                createVNode("header", { class: "mb-5 flex flex-wrap items-center justify-between gap-3" }, [
                  createVNode("div", null, [
                    createVNode("h1", { class: "text-2xl font-extrabold text-ink" }, "Vagas"),
                    createVNode("p", { class: "text-sm text-muted" }, toDisplayString(__props.jobs.total) + " " + toDisplayString(__props.jobs.total === 1 ? "vaga" : "vagas") + " encontradas", 1)
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
                createVNode("form", {
                  class: "card mb-4 grid gap-3 p-4 md:grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] md:items-end",
                  role: "search",
                  "aria-label": "Filtrar vagas",
                  onSubmit: withModifiers(($event) => apply(), ["prevent"])
                }, [
                  createVNode("div", { class: "relative" }, [
                    createVNode("label", {
                      for: "q",
                      class: "label"
                    }, "Buscar"),
                    createVNode(unref(Search), {
                      class: "pointer-events-none absolute bottom-3 left-3 size-4 text-subtle",
                      "aria-hidden": "true"
                    }),
                    withDirectives(createVNode("input", {
                      id: "q",
                      "onUpdate:modelValue": ($event) => f.q = $event,
                      type: "search",
                      placeholder: "Título, empresa, ID ou slug",
                      class: "field pl-9"
                    }, null, 8, ["onUpdate:modelValue"]), [
                      [vModelText, f.q]
                    ])
                  ]),
                  createVNode("div", null, [
                    createVNode("label", {
                      for: "status",
                      class: "label"
                    }, "Status"),
                    withDirectives(createVNode("select", {
                      id: "status",
                      "onUpdate:modelValue": ($event) => f.status = $event,
                      class: "field",
                      onChange: ($event) => apply()
                    }, [
                      createVNode("option", { value: "" }, "Todos"),
                      (openBlock(true), createBlock(Fragment, null, renderList(__props.statuses, (s) => {
                        return openBlock(), createBlock("option", {
                          key: s.value,
                          value: s.value
                        }, toDisplayString(s.label), 9, ["value"]);
                      }), 128))
                    ], 40, ["onUpdate:modelValue", "onChange"]), [
                      [vModelSelect, f.status]
                    ])
                  ]),
                  createVNode("div", null, [
                    createVNode("label", {
                      for: "df",
                      class: "label"
                    }, "Filtrar data por"),
                    withDirectives(createVNode("select", {
                      id: "df",
                      "onUpdate:modelValue": ($event) => f.date_field = $event,
                      class: "field"
                    }, [
                      createVNode("option", { value: "published_at" }, "Publicação"),
                      createVNode("option", { value: "expires_at" }, "Expiração"),
                      createVNode("option", { value: "updated_at" }, "Atualização")
                    ], 8, ["onUpdate:modelValue"]), [
                      [vModelSelect, f.date_field]
                    ])
                  ]),
                  createVNode("div", null, [
                    createVNode("label", {
                      for: "from",
                      class: "label"
                    }, "De"),
                    withDirectives(createVNode("input", {
                      id: "from",
                      "onUpdate:modelValue": ($event) => f.from = $event,
                      type: "date",
                      class: "field"
                    }, null, 8, ["onUpdate:modelValue"]), [
                      [vModelText, f.from]
                    ])
                  ]),
                  createVNode("div", null, [
                    createVNode("label", {
                      for: "to",
                      class: "label"
                    }, "Até"),
                    withDirectives(createVNode("input", {
                      id: "to",
                      "onUpdate:modelValue": ($event) => f.to = $event,
                      type: "date",
                      class: "field"
                    }, null, 8, ["onUpdate:modelValue"]), [
                      [vModelText, f.to]
                    ])
                  ]),
                  createVNode("div", { class: "flex gap-2" }, [
                    createVNode("button", {
                      type: "submit",
                      class: "btn-primary flex-1"
                    }, "Filtrar"),
                    hasFilters() ? (openBlock(), createBlock("button", {
                      key: 0,
                      type: "button",
                      class: "btn-secondary",
                      "aria-label": "Limpar filtros",
                      onClick: clear
                    }, [
                      createVNode(unref(X), { class: "size-4" })
                    ])) : createCommentVNode("", true)
                  ])
                ], 40, ["onSubmit"]),
                createVNode("div", {
                  class: "relative",
                  "aria-busy": loading.value
                }, [
                  loading.value ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "absolute inset-x-0 top-0 z-10 h-0.5 overflow-hidden rounded bg-action-100"
                  }, [
                    createVNode("div", { class: "skeleton h-full w-full" })
                  ])) : createCommentVNode("", true),
                  __props.jobs.data.length ? (openBlock(), createBlock("div", {
                    key: 1,
                    class: ["card overflow-hidden", loading.value ? "opacity-70" : ""]
                  }, [
                    createVNode("div", { class: "overflow-x-auto" }, [
                      createVNode("table", { class: "w-full min-w-[56rem] text-left text-sm" }, [
                        createVNode("caption", { class: "sr-only" }, "Lista de vagas"),
                        createVNode("thead", { class: "border-b border-line bg-surface text-xs font-bold tracking-wide text-muted uppercase" }, [
                          createVNode("tr", null, [
                            (openBlock(), createBlock(Fragment, null, renderList(columns, (c) => {
                              return createVNode("th", {
                                key: c.key,
                                scope: "col",
                                class: "px-4 py-3",
                                "aria-sort": ariaSort(c.key)
                              }, [
                                createVNode("button", {
                                  type: "button",
                                  class: "inline-flex items-center gap-1 uppercase hover:text-ink",
                                  onClick: ($event) => sortBy(c.key)
                                }, [
                                  createTextVNode(toDisplayString(c.label), 1),
                                  f.sort === c.key && f.dir === "asc" ? (openBlock(), createBlock(unref(ArrowUp), {
                                    key: 0,
                                    class: "size-3.5",
                                    "aria-hidden": "true"
                                  })) : f.sort === c.key ? (openBlock(), createBlock(unref(ArrowDown), {
                                    key: 1,
                                    class: "size-3.5",
                                    "aria-hidden": "true"
                                  })) : createCommentVNode("", true)
                                ], 8, ["onClick"])
                              ], 8, ["aria-sort"]);
                            }), 64)),
                            createVNode("th", {
                              scope: "col",
                              class: "px-4 py-3 text-right"
                            }, "Ações")
                          ])
                        ]),
                        createVNode("tbody", { class: "divide-y divide-line" }, [
                          (openBlock(true), createBlock(Fragment, null, renderList(__props.jobs.data, (j) => {
                            return openBlock(), createBlock("tr", {
                              key: j.id,
                              class: "hover:bg-surface/60"
                            }, [
                              createVNode("td", { class: "max-w-xs px-4 py-3" }, [
                                createVNode(unref(Link), {
                                  href: j.edit_url,
                                  class: "flex items-center gap-1.5 font-bold text-ink hover:text-action-700"
                                }, {
                                  default: withCtx(() => [
                                    createVNode("span", { class: "truncate" }, toDisplayString(j.title), 1),
                                    j.is_featured ? (openBlock(), createBlock(unref(Star), {
                                      key: 0,
                                      class: "size-3.5 shrink-0 fill-warning-700 text-warning-700",
                                      "aria-label": "Em destaque"
                                    })) : createCommentVNode("", true)
                                  ]),
                                  _: 2
                                }, 1032, ["href"]),
                                createVNode("p", { class: "truncate text-xs text-muted" }, toDisplayString(j.company) + " · " + toDisplayString(j.category) + " · " + toDisplayString(j.platform) + " · #" + toDisplayString(j.id), 1)
                              ]),
                              createVNode("td", { class: "px-4 py-3" }, [
                                createVNode(_sfc_main$2, {
                                  status: j.status,
                                  label: j.status_label
                                }, null, 8, ["status", "label"]),
                                j.expiring_soon ? (openBlock(), createBlock("p", {
                                  key: 0,
                                  class: "mt-1 text-xs font-semibold text-warning-700"
                                }, "Expira em breve")) : createCommentVNode("", true)
                              ]),
                              createVNode("td", { class: "px-4 py-3 whitespace-nowrap text-muted" }, toDisplayString(unref(formatDate)(j.published_at)), 1),
                              createVNode("td", { class: "px-4 py-3 whitespace-nowrap text-muted" }, toDisplayString(unref(formatDateTime)(j.expires_at)), 1),
                              createVNode("td", { class: "px-4 py-3 whitespace-nowrap text-muted" }, toDisplayString(unref(formatDate)(j.updated_at)), 1),
                              createVNode("td", { class: "px-4 py-3" }, [
                                createVNode("div", { class: "flex justify-end gap-1" }, [
                                  createVNode(unref(Link), {
                                    href: j.edit_url,
                                    class: "btn-ghost btn-sm size-9 p-0",
                                    "aria-label": `Editar ${j.title}`,
                                    title: "Editar"
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(unref(Pencil), { class: "size-4" })
                                    ]),
                                    _: 1
                                  }, 8, ["href", "aria-label"]),
                                  createVNode(unref(Link), {
                                    href: j.preview_url,
                                    class: "btn-ghost btn-sm size-9 p-0",
                                    "aria-label": `Pré-visualizar ${j.title}`,
                                    title: "Pré-visualizar"
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(unref(Eye), { class: "size-4" })
                                    ]),
                                    _: 1
                                  }, 8, ["href", "aria-label"]),
                                  j.public_url ? (openBlock(), createBlock("a", {
                                    key: 0,
                                    href: j.public_url,
                                    target: "_blank",
                                    rel: "noopener",
                                    class: "btn-ghost btn-sm size-9 p-0",
                                    "aria-label": `Abrir ${j.title} no site`,
                                    title: "Ver no site"
                                  }, [
                                    createVNode(unref(ExternalLink), { class: "size-4" })
                                  ], 8, ["href", "aria-label"])) : createCommentVNode("", true),
                                  ["published", "expired"].includes(j.status) ? (openBlock(), createBlock("button", {
                                    key: 1,
                                    type: "button",
                                    class: "btn-ghost btn-sm size-9 p-0",
                                    "aria-label": `Renovar ${j.title}`,
                                    title: "Renovar",
                                    onClick: ($event) => renewTarget.value = j
                                  }, [
                                    createVNode(unref(RefreshCw), { class: "size-4" })
                                  ], 8, ["aria-label", "onClick"])) : createCommentVNode("", true),
                                  j.status === "archived" ? (openBlock(), createBlock("button", {
                                    key: 2,
                                    type: "button",
                                    class: "btn-ghost btn-sm size-9 p-0",
                                    "aria-label": `Restaurar ${j.title}`,
                                    title: "Restaurar",
                                    onClick: ($event) => post(`/admin/vagas/${j.id}/restaurar`)
                                  }, [
                                    createVNode(unref(ArchiveRestore), { class: "size-4" })
                                  ], 8, ["aria-label", "onClick"])) : (openBlock(), createBlock("button", {
                                    key: 3,
                                    type: "button",
                                    class: "btn-ghost btn-sm size-9 p-0 hover:text-danger-700",
                                    "aria-label": `Arquivar ${j.title}`,
                                    title: "Arquivar",
                                    onClick: ($event) => archiveTarget.value = j
                                  }, [
                                    createVNode(unref(Archive), { class: "size-4" })
                                  ], 8, ["aria-label", "onClick"]))
                                ])
                              ])
                            ]);
                          }), 128))
                        ])
                      ])
                    ])
                  ], 2)) : (openBlock(), createBlock(_sfc_main$3, {
                    key: 2,
                    title: "Nenhuma vaga encontrada",
                    description: hasFilters() ? "Ajuste ou limpe os filtros para ver mais resultados." : "Crie a primeira vaga para começar."
                  }, {
                    default: withCtx(() => [
                      hasFilters() ? (openBlock(), createBlock("button", {
                        key: 0,
                        type: "button",
                        class: "btn-secondary",
                        onClick: clear
                      }, "Limpar filtros")) : createCommentVNode("", true),
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
                    _: 1
                  }, 8, ["description"]))
                ], 8, ["aria-busy"]),
                createVNode("div", { class: "mt-6" }, [
                  createVNode(_sfc_main$4, { meta: __props.jobs }, null, 8, ["meta"])
                ])
              ]),
              createVNode(_sfc_main$5, {
                open: !!archiveTarget.value,
                danger: "",
                "confirm-label": "Arquivar vaga",
                title: "Arquivar esta vaga?",
                message: archiveTarget.value && ["published"].includes(archiveTarget.value.status) ? `“${archiveTarget.value.title}” está no ar e será retirada do site imediatamente. A página pública passará a responder como removida.` : `“${archiveTarget.value?.title}” será arquivada e não aparecerá publicamente.`,
                processing: acting.value,
                onCancel: ($event) => archiveTarget.value = null,
                onConfirm: ($event) => post(`/admin/vagas/${archiveTarget.value.id}/arquivar`, () => archiveTarget.value = null)
              }, null, 8, ["open", "message", "processing", "onCancel", "onConfirm"]),
              renewTarget.value ? (openBlock(), createBlock(_sfc_main$6, {
                key: 0,
                open: !!renewTarget.value,
                "job-id": renewTarget.value.id,
                title: renewTarget.value.title,
                expired: renewTarget.value.status === "expired",
                onClose: ($event) => renewTarget.value = null
              }, null, 8, ["open", "job-id", "title", "expired", "onClose"])) : createCommentVNode("", true)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/pages/Admin/Jobs/Index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=Index-DkEzuDN6.js.map
