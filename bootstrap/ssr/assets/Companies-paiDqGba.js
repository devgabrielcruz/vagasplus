import { defineComponent, ref, mergeProps, withCtx, unref, withDirectives, createVNode, vModelText, createTextVNode, openBlock, createBlock, createCommentVNode, withModifiers, toDisplayString, Fragment, renderList, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr, ssrRenderList } from "vue/server-renderer";
import { useForm, Link, router } from "@inertiajs/vue3";
import { Plus, Check, X, Search, ExternalLink, Pencil, Trash2 } from "lucide-vue-next";
import { _ as _sfc_main$4 } from "./CompanyLogo-meQRdREr.js";
import { _ as _sfc_main$7 } from "./ConfirmDialog-CgAQ1lem.js";
import { _ as _sfc_main$5 } from "./EmptyState-QtkKSWjC.js";
import { _ as _sfc_main$2 } from "./Field-CI53GIau.js";
import { _ as _sfc_main$3 } from "./LogoField-D88DZ2aT.js";
import { _ as _sfc_main$6 } from "./Pagination-CQ9B5UeT.js";
import { _ as _sfc_main$1 } from "./AdminLayout-BocNC89A.js";
import "./FlashMessages-mTMlubKC.js";
import "./SeoHead-BMQcIEwx.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Companies",
  __ssrInlineRender: true,
  props: {
    companies: {},
    filters: {}
  },
  setup(__props) {
    const props = __props;
    const q = ref(props.filters.q);
    const editing = ref(null);
    const creating = ref(false);
    const deleting = ref(null);
    const current = ref(null);
    const form = useForm({ _method: "post", name: "", website_url: "", logo_url: "", about: "", logo: null, remove_logo: false });
    function startNew() {
      editing.value = null;
      creating.value = true;
      current.value = null;
      form.reset().clearErrors();
      form.defaults({ _method: "post", name: "", website_url: "", logo_url: "", about: "", logo: null, remove_logo: false }).reset();
    }
    function startEdit(c) {
      creating.value = false;
      editing.value = c;
      current.value = c.logo_src;
      form.clearErrors();
      form.defaults({ _method: "put", name: c.name, website_url: c.website_url ?? "", logo_url: c.logo_url ?? "", about: c.about ?? "", logo: null, remove_logo: false }).reset();
    }
    function cancel() {
      creating.value = false;
      editing.value = null;
      form.reset().clearErrors();
    }
    function save() {
      const url = editing.value ? `/admin/empresas/${editing.value.id}` : "/admin/empresas";
      form.post(url, { forceFormData: true, preserveScroll: true, onSuccess: cancel });
    }
    function search() {
      router.get("/admin/empresas", q.value ? { q: q.value } : {}, { preserveState: true });
    }
    function remove() {
      router.delete(`/admin/empresas/${deleting.value.id}`, { preserveScroll: true, onFinish: () => deleting.value = null });
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$1, mergeProps({ title: "Empresas" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="mx-auto max-w-5xl"${_scopeId}><header class="mb-5 flex flex-wrap items-center justify-between gap-3"${_scopeId}><div${_scopeId}><h1 class="text-2xl font-extrabold text-ink"${_scopeId}>Empresas</h1><p class="text-sm text-muted"${_scopeId}>Empresas cadastradas e seus logotipos. Novas empresas também são criadas ao cadastrar uma vaga.</p></div>`);
            if (!creating.value && !editing.value) {
              _push2(`<button type="button" class="btn-primary"${_scopeId}>`);
              _push2(ssrRenderComponent(unref(Plus), {
                class: "size-4",
                "aria-hidden": "true"
              }, null, _parent2, _scopeId));
              _push2(`Nova empresa</button>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</header>`);
            if (creating.value || editing.value) {
              _push2(`<form class="card mb-5 space-y-4 p-5" aria-label="Formulário de empresa"${_scopeId}><h2 class="text-lg font-extrabold text-ink"${_scopeId}>${ssrInterpolate(editing.value ? `Editar ${editing.value.name}` : "Nova empresa")}</h2><div class="grid gap-4 sm:grid-cols-2"${_scopeId}>`);
              _push2(ssrRenderComponent(_sfc_main$2, {
                id: "co-name",
                label: "Nome",
                error: unref(form).errors.name,
                required: ""
              }, {
                default: withCtx(({ describedBy, invalid }, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<input id="co-name"${ssrRenderAttr("value", unref(form).name)} required maxlength="160" class="field"${ssrRenderAttr("aria-invalid", invalid)}${ssrRenderAttr("aria-describedby", describedBy)}${_scopeId2}>`);
                  } else {
                    return [
                      withDirectives(createVNode("input", {
                        id: "co-name",
                        "onUpdate:modelValue": ($event) => unref(form).name = $event,
                        required: "",
                        maxlength: "160",
                        class: "field",
                        "aria-invalid": invalid,
                        "aria-describedby": describedBy
                      }, null, 8, ["onUpdate:modelValue", "aria-invalid", "aria-describedby"]), [
                        [vModelText, unref(form).name]
                      ])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(_sfc_main$2, {
                id: "co-site",
                label: "Site",
                error: unref(form).errors.website_url,
                hint: "Opcional. Comece com https://"
              }, {
                default: withCtx(({ describedBy, invalid }, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<input id="co-site"${ssrRenderAttr("value", unref(form).website_url)} type="url" class="field" placeholder="https://"${ssrRenderAttr("aria-invalid", invalid)}${ssrRenderAttr("aria-describedby", describedBy)}${_scopeId2}>`);
                  } else {
                    return [
                      withDirectives(createVNode("input", {
                        id: "co-site",
                        "onUpdate:modelValue": ($event) => unref(form).website_url = $event,
                        type: "url",
                        class: "field",
                        placeholder: "https://",
                        "aria-invalid": invalid,
                        "aria-describedby": describedBy
                      }, null, 8, ["onUpdate:modelValue", "aria-invalid", "aria-describedby"]), [
                        [vModelText, unref(form).website_url]
                      ])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div>`);
              _push2(ssrRenderComponent(_sfc_main$3, {
                id: "co-logo",
                url: unref(form).logo_url,
                "onUpdate:url": ($event) => unref(form).logo_url = $event,
                file: unref(form).logo,
                "onUpdate:file": ($event) => unref(form).logo = $event,
                remove: unref(form).remove_logo,
                "onUpdate:remove": ($event) => unref(form).remove_logo = $event,
                current: current.value,
                error: unref(form).errors.logo,
                "url-error": unref(form).errors.logo_url,
                name: unref(form).name
              }, null, _parent2, _scopeId));
              _push2(ssrRenderComponent(_sfc_main$2, {
                id: "co-about",
                label: "Sobre a empresa",
                error: unref(form).errors.about,
                hint: "Somente informações verificadas."
              }, {
                default: withCtx(({ describedBy, invalid }, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<textarea id="co-about" rows="3" maxlength="5000" class="field"${ssrRenderAttr("aria-invalid", invalid)}${ssrRenderAttr("aria-describedby", describedBy)}${_scopeId2}>${ssrInterpolate(unref(form).about)}</textarea>`);
                  } else {
                    return [
                      withDirectives(createVNode("textarea", {
                        id: "co-about",
                        "onUpdate:modelValue": ($event) => unref(form).about = $event,
                        rows: "3",
                        maxlength: "5000",
                        class: "field",
                        "aria-invalid": invalid,
                        "aria-describedby": describedBy
                      }, null, 8, ["onUpdate:modelValue", "aria-invalid", "aria-describedby"]), [
                        [vModelText, unref(form).about]
                      ])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`<div class="flex gap-2"${_scopeId}><button type="submit" class="btn-primary"${ssrIncludeBooleanAttr(unref(form).processing) ? " disabled" : ""}${_scopeId}>`);
              _push2(ssrRenderComponent(unref(Check), {
                class: "size-4",
                "aria-hidden": "true"
              }, null, _parent2, _scopeId));
              _push2(`Salvar</button><button type="button" class="btn-secondary"${_scopeId}>`);
              _push2(ssrRenderComponent(unref(X), {
                class: "size-4",
                "aria-hidden": "true"
              }, null, _parent2, _scopeId));
              _push2(`Cancelar</button></div></form>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<form class="mb-4 flex gap-2" role="search" aria-label="Buscar empresas"${_scopeId}><div class="relative flex-1"${_scopeId}><label for="co-q" class="sr-only"${_scopeId}>Buscar empresa</label>`);
            _push2(ssrRenderComponent(unref(Search), {
              class: "pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-subtle",
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
            _push2(`<input id="co-q"${ssrRenderAttr("value", q.value)} type="search" placeholder="Buscar empresa pelo nome" class="field pl-9"${_scopeId}></div><button type="submit" class="btn-secondary"${_scopeId}>Buscar</button></form>`);
            if (__props.companies.data.length) {
              _push2(`<div class="card overflow-hidden"${_scopeId}><ul class="divide-y divide-line"${_scopeId}><!--[-->`);
              ssrRenderList(__props.companies.data, (c) => {
                _push2(`<li class="flex flex-wrap items-center gap-3 px-4 py-3.5 sm:px-5"${_scopeId}>`);
                _push2(ssrRenderComponent(_sfc_main$4, {
                  name: c.name,
                  url: c.logo_src,
                  size: "md"
                }, null, _parent2, _scopeId));
                _push2(`<div class="min-w-0 flex-1"${_scopeId}><p class="truncate font-bold text-ink"${_scopeId}>${ssrInterpolate(c.name)}</p><p class="truncate text-xs text-muted"${_scopeId}>${ssrInterpolate(c.jobs_count)} ${ssrInterpolate(c.jobs_count === 1 ? "vaga" : "vagas")}`);
                if (c.website_url) {
                  _push2(`<!--[--> · ${ssrInterpolate(c.website_url)}<!--]-->`);
                } else {
                  _push2(`<!---->`);
                }
                if (!c.logo_src) {
                  _push2(`<!--[--> · sem logotipo<!--]-->`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</p></div><div class="flex gap-1"${_scopeId}>`);
                if (c.jobs_count) {
                  _push2(ssrRenderComponent(unref(Link), {
                    href: `/admin/vagas?q=${encodeURIComponent(c.name)}`,
                    class: "btn-ghost btn-sm size-9 p-0",
                    "aria-label": `Ver vagas de ${c.name}`,
                    title: "Ver vagas"
                  }, {
                    default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                      if (_push3) {
                        _push3(ssrRenderComponent(unref(ExternalLink), { class: "size-4" }, null, _parent3, _scopeId2));
                      } else {
                        return [
                          createVNode(unref(ExternalLink), { class: "size-4" })
                        ];
                      }
                    }),
                    _: 2
                  }, _parent2, _scopeId));
                } else {
                  _push2(`<!---->`);
                }
                _push2(`<button type="button" class="btn-ghost btn-sm size-9 p-0"${ssrRenderAttr("aria-label", `Editar ${c.name}`)}${_scopeId}>`);
                _push2(ssrRenderComponent(unref(Pencil), { class: "size-4" }, null, _parent2, _scopeId));
                _push2(`</button><button type="button" class="btn-ghost btn-sm size-9 p-0 hover:text-danger-700"${ssrRenderAttr("aria-label", `Excluir ${c.name}`)}${ssrIncludeBooleanAttr(c.jobs_count > 0) ? " disabled" : ""}${ssrRenderAttr("title", c.jobs_count > 0 ? "Possui vagas e não pode ser excluída" : "Excluir")}${_scopeId}>`);
                _push2(ssrRenderComponent(unref(Trash2), { class: "size-4" }, null, _parent2, _scopeId));
                _push2(`</button></div></li>`);
              });
              _push2(`<!--]--></ul></div>`);
            } else {
              _push2(ssrRenderComponent(_sfc_main$5, {
                title: "Nenhuma empresa encontrada",
                description: "Cadastre uma empresa ou crie uma vaga: a empresa é registrada automaticamente."
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<button type="button" class="btn-primary"${_scopeId2}>`);
                    _push3(ssrRenderComponent(unref(Plus), {
                      class: "size-4",
                      "aria-hidden": "true"
                    }, null, _parent3, _scopeId2));
                    _push3(`Nova empresa</button>`);
                  } else {
                    return [
                      createVNode("button", {
                        type: "button",
                        class: "btn-primary",
                        onClick: startNew
                      }, [
                        createVNode(unref(Plus), {
                          class: "size-4",
                          "aria-hidden": "true"
                        }),
                        createTextVNode("Nova empresa")
                      ])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            }
            _push2(`<div class="mt-6"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$6, { meta: __props.companies }, null, _parent2, _scopeId));
            _push2(`</div></div>`);
            _push2(ssrRenderComponent(_sfc_main$7, {
              open: !!deleting.value,
              danger: "",
              "confirm-label": "Excluir empresa",
              title: "Excluir empresa?",
              message: `“${deleting.value?.name}” e o logotipo enviado serão excluídos definitivamente.`,
              onCancel: ($event) => deleting.value = null,
              onConfirm: remove
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode("div", { class: "mx-auto max-w-5xl" }, [
                createVNode("header", { class: "mb-5 flex flex-wrap items-center justify-between gap-3" }, [
                  createVNode("div", null, [
                    createVNode("h1", { class: "text-2xl font-extrabold text-ink" }, "Empresas"),
                    createVNode("p", { class: "text-sm text-muted" }, "Empresas cadastradas e seus logotipos. Novas empresas também são criadas ao cadastrar uma vaga.")
                  ]),
                  !creating.value && !editing.value ? (openBlock(), createBlock("button", {
                    key: 0,
                    type: "button",
                    class: "btn-primary",
                    onClick: startNew
                  }, [
                    createVNode(unref(Plus), {
                      class: "size-4",
                      "aria-hidden": "true"
                    }),
                    createTextVNode("Nova empresa")
                  ])) : createCommentVNode("", true)
                ]),
                creating.value || editing.value ? (openBlock(), createBlock("form", {
                  key: 0,
                  class: "card mb-5 space-y-4 p-5",
                  "aria-label": "Formulário de empresa",
                  onSubmit: withModifiers(save, ["prevent"])
                }, [
                  createVNode("h2", { class: "text-lg font-extrabold text-ink" }, toDisplayString(editing.value ? `Editar ${editing.value.name}` : "Nova empresa"), 1),
                  createVNode("div", { class: "grid gap-4 sm:grid-cols-2" }, [
                    createVNode(_sfc_main$2, {
                      id: "co-name",
                      label: "Nome",
                      error: unref(form).errors.name,
                      required: ""
                    }, {
                      default: withCtx(({ describedBy, invalid }) => [
                        withDirectives(createVNode("input", {
                          id: "co-name",
                          "onUpdate:modelValue": ($event) => unref(form).name = $event,
                          required: "",
                          maxlength: "160",
                          class: "field",
                          "aria-invalid": invalid,
                          "aria-describedby": describedBy
                        }, null, 8, ["onUpdate:modelValue", "aria-invalid", "aria-describedby"]), [
                          [vModelText, unref(form).name]
                        ])
                      ]),
                      _: 1
                    }, 8, ["error"]),
                    createVNode(_sfc_main$2, {
                      id: "co-site",
                      label: "Site",
                      error: unref(form).errors.website_url,
                      hint: "Opcional. Comece com https://"
                    }, {
                      default: withCtx(({ describedBy, invalid }) => [
                        withDirectives(createVNode("input", {
                          id: "co-site",
                          "onUpdate:modelValue": ($event) => unref(form).website_url = $event,
                          type: "url",
                          class: "field",
                          placeholder: "https://",
                          "aria-invalid": invalid,
                          "aria-describedby": describedBy
                        }, null, 8, ["onUpdate:modelValue", "aria-invalid", "aria-describedby"]), [
                          [vModelText, unref(form).website_url]
                        ])
                      ]),
                      _: 1
                    }, 8, ["error"])
                  ]),
                  createVNode(_sfc_main$3, {
                    id: "co-logo",
                    url: unref(form).logo_url,
                    "onUpdate:url": ($event) => unref(form).logo_url = $event,
                    file: unref(form).logo,
                    "onUpdate:file": ($event) => unref(form).logo = $event,
                    remove: unref(form).remove_logo,
                    "onUpdate:remove": ($event) => unref(form).remove_logo = $event,
                    current: current.value,
                    error: unref(form).errors.logo,
                    "url-error": unref(form).errors.logo_url,
                    name: unref(form).name
                  }, null, 8, ["url", "onUpdate:url", "file", "onUpdate:file", "remove", "onUpdate:remove", "current", "error", "url-error", "name"]),
                  createVNode(_sfc_main$2, {
                    id: "co-about",
                    label: "Sobre a empresa",
                    error: unref(form).errors.about,
                    hint: "Somente informações verificadas."
                  }, {
                    default: withCtx(({ describedBy, invalid }) => [
                      withDirectives(createVNode("textarea", {
                        id: "co-about",
                        "onUpdate:modelValue": ($event) => unref(form).about = $event,
                        rows: "3",
                        maxlength: "5000",
                        class: "field",
                        "aria-invalid": invalid,
                        "aria-describedby": describedBy
                      }, null, 8, ["onUpdate:modelValue", "aria-invalid", "aria-describedby"]), [
                        [vModelText, unref(form).about]
                      ])
                    ]),
                    _: 1
                  }, 8, ["error"]),
                  createVNode("div", { class: "flex gap-2" }, [
                    createVNode("button", {
                      type: "submit",
                      class: "btn-primary",
                      disabled: unref(form).processing
                    }, [
                      createVNode(unref(Check), {
                        class: "size-4",
                        "aria-hidden": "true"
                      }),
                      createTextVNode("Salvar")
                    ], 8, ["disabled"]),
                    createVNode("button", {
                      type: "button",
                      class: "btn-secondary",
                      onClick: cancel
                    }, [
                      createVNode(unref(X), {
                        class: "size-4",
                        "aria-hidden": "true"
                      }),
                      createTextVNode("Cancelar")
                    ])
                  ])
                ], 32)) : createCommentVNode("", true),
                createVNode("form", {
                  class: "mb-4 flex gap-2",
                  role: "search",
                  "aria-label": "Buscar empresas",
                  onSubmit: withModifiers(search, ["prevent"])
                }, [
                  createVNode("div", { class: "relative flex-1" }, [
                    createVNode("label", {
                      for: "co-q",
                      class: "sr-only"
                    }, "Buscar empresa"),
                    createVNode(unref(Search), {
                      class: "pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-subtle",
                      "aria-hidden": "true"
                    }),
                    withDirectives(createVNode("input", {
                      id: "co-q",
                      "onUpdate:modelValue": ($event) => q.value = $event,
                      type: "search",
                      placeholder: "Buscar empresa pelo nome",
                      class: "field pl-9"
                    }, null, 8, ["onUpdate:modelValue"]), [
                      [vModelText, q.value]
                    ])
                  ]),
                  createVNode("button", {
                    type: "submit",
                    class: "btn-secondary"
                  }, "Buscar")
                ], 32),
                __props.companies.data.length ? (openBlock(), createBlock("div", {
                  key: 1,
                  class: "card overflow-hidden"
                }, [
                  createVNode("ul", { class: "divide-y divide-line" }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(__props.companies.data, (c) => {
                      return openBlock(), createBlock("li", {
                        key: c.id,
                        class: "flex flex-wrap items-center gap-3 px-4 py-3.5 sm:px-5"
                      }, [
                        createVNode(_sfc_main$4, {
                          name: c.name,
                          url: c.logo_src,
                          size: "md"
                        }, null, 8, ["name", "url"]),
                        createVNode("div", { class: "min-w-0 flex-1" }, [
                          createVNode("p", { class: "truncate font-bold text-ink" }, toDisplayString(c.name), 1),
                          createVNode("p", { class: "truncate text-xs text-muted" }, [
                            createTextVNode(toDisplayString(c.jobs_count) + " " + toDisplayString(c.jobs_count === 1 ? "vaga" : "vagas"), 1),
                            c.website_url ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                              createTextVNode(" · " + toDisplayString(c.website_url), 1)
                            ], 64)) : createCommentVNode("", true),
                            !c.logo_src ? (openBlock(), createBlock(Fragment, { key: 1 }, [
                              createTextVNode(" · sem logotipo")
                            ], 64)) : createCommentVNode("", true)
                          ])
                        ]),
                        createVNode("div", { class: "flex gap-1" }, [
                          c.jobs_count ? (openBlock(), createBlock(unref(Link), {
                            key: 0,
                            href: `/admin/vagas?q=${encodeURIComponent(c.name)}`,
                            class: "btn-ghost btn-sm size-9 p-0",
                            "aria-label": `Ver vagas de ${c.name}`,
                            title: "Ver vagas"
                          }, {
                            default: withCtx(() => [
                              createVNode(unref(ExternalLink), { class: "size-4" })
                            ]),
                            _: 1
                          }, 8, ["href", "aria-label"])) : createCommentVNode("", true),
                          createVNode("button", {
                            type: "button",
                            class: "btn-ghost btn-sm size-9 p-0",
                            "aria-label": `Editar ${c.name}`,
                            onClick: ($event) => startEdit(c)
                          }, [
                            createVNode(unref(Pencil), { class: "size-4" })
                          ], 8, ["aria-label", "onClick"]),
                          createVNode("button", {
                            type: "button",
                            class: "btn-ghost btn-sm size-9 p-0 hover:text-danger-700",
                            "aria-label": `Excluir ${c.name}`,
                            disabled: c.jobs_count > 0,
                            title: c.jobs_count > 0 ? "Possui vagas e não pode ser excluída" : "Excluir",
                            onClick: ($event) => deleting.value = c
                          }, [
                            createVNode(unref(Trash2), { class: "size-4" })
                          ], 8, ["aria-label", "disabled", "title", "onClick"])
                        ])
                      ]);
                    }), 128))
                  ])
                ])) : (openBlock(), createBlock(_sfc_main$5, {
                  key: 2,
                  title: "Nenhuma empresa encontrada",
                  description: "Cadastre uma empresa ou crie uma vaga: a empresa é registrada automaticamente."
                }, {
                  default: withCtx(() => [
                    createVNode("button", {
                      type: "button",
                      class: "btn-primary",
                      onClick: startNew
                    }, [
                      createVNode(unref(Plus), {
                        class: "size-4",
                        "aria-hidden": "true"
                      }),
                      createTextVNode("Nova empresa")
                    ])
                  ]),
                  _: 1
                })),
                createVNode("div", { class: "mt-6" }, [
                  createVNode(_sfc_main$6, { meta: __props.companies }, null, 8, ["meta"])
                ])
              ]),
              createVNode(_sfc_main$7, {
                open: !!deleting.value,
                danger: "",
                "confirm-label": "Excluir empresa",
                title: "Excluir empresa?",
                message: `“${deleting.value?.name}” e o logotipo enviado serão excluídos definitivamente.`,
                onCancel: ($event) => deleting.value = null,
                onConfirm: remove
              }, null, 8, ["open", "message", "onCancel"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/pages/Admin/Companies.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=Companies-paiDqGba.js.map
