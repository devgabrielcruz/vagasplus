import { defineComponent, ref, mergeProps, withCtx, unref, withDirectives, createVNode, vModelText, openBlock, createBlock, Fragment, renderList, toDisplayString, vModelSelect, createTextVNode, createCommentVNode, withModifiers, vModelCheckbox, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrRenderList, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual } from "vue/server-renderer";
import { useForm, router } from "@inertiajs/vue3";
import { Plus, Check, X, Pencil, Trash2 } from "lucide-vue-next";
import { _ as _sfc_main$3 } from "./CategoryIcon-Cd_HT9vu.js";
import { _ as _sfc_main$4 } from "./ConfirmDialog-CgAQ1lem.js";
import { _ as _sfc_main$2 } from "./Field-CI53GIau.js";
import { _ as _sfc_main$1 } from "./AdminLayout-BocNC89A.js";
import "./FlashMessages-mTMlubKC.js";
import "./SeoHead-BMQcIEwx.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Categories",
  __ssrInlineRender: true,
  props: {
    categories: {},
    icons: {}
  },
  setup(__props) {
    const editingId = ref(null);
    const deleting = ref(null);
    const form = useForm({ name: "", slug: "", icon: "briefcase", description: "", is_active: true, position: 0 });
    function startNew() {
      editingId.value = 0;
      form.reset().clearErrors();
    }
    function startEdit(c) {
      editingId.value = c.id;
      form.clearErrors();
      form.defaults({ name: c.name, slug: c.slug, icon: c.icon, description: c.description ?? "", is_active: c.is_active, position: c.position }).reset();
    }
    function cancel() {
      editingId.value = null;
      form.reset().clearErrors();
    }
    function save() {
      const opts = { preserveScroll: true, onSuccess: cancel };
      if (editingId.value) form.put(`/admin/categorias/${editingId.value}`, opts);
      else form.post("/admin/categorias", opts);
    }
    function remove() {
      router.delete(`/admin/categorias/${deleting.value.id}`, { preserveScroll: true, onFinish: () => deleting.value = null });
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$1, mergeProps({ title: "Categorias" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="mx-auto max-w-5xl"${_scopeId}><header class="mb-5 flex flex-wrap items-center justify-between gap-3"${_scopeId}><div${_scopeId}><h1 class="text-2xl font-extrabold text-ink"${_scopeId}>Categorias</h1><p class="text-sm text-muted"${_scopeId}>Categorias inativas ou sem vagas abertas não aparecem no site.</p></div>`);
            if (editingId.value === null) {
              _push2(`<button type="button" class="btn-primary"${_scopeId}>`);
              _push2(ssrRenderComponent(unref(Plus), {
                class: "size-4",
                "aria-hidden": "true"
              }, null, _parent2, _scopeId));
              _push2(`Nova categoria</button>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</header>`);
            if (editingId.value !== null) {
              _push2(`<form class="card mb-5 space-y-4 p-5" aria-label="Formulário de categoria"${_scopeId}><h2 class="text-lg font-extrabold text-ink"${_scopeId}>${ssrInterpolate(editingId.value ? "Editar categoria" : "Nova categoria")}</h2><div class="grid gap-4 sm:grid-cols-2"${_scopeId}>`);
              _push2(ssrRenderComponent(_sfc_main$2, {
                id: "c-name",
                label: "Nome",
                error: unref(form).errors.name,
                required: ""
              }, {
                default: withCtx(({ describedBy, invalid }, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<input id="c-name"${ssrRenderAttr("value", unref(form).name)} required maxlength="120" class="field"${ssrRenderAttr("aria-invalid", invalid)}${ssrRenderAttr("aria-describedby", describedBy)}${_scopeId2}>`);
                  } else {
                    return [
                      withDirectives(createVNode("input", {
                        id: "c-name",
                        "onUpdate:modelValue": ($event) => unref(form).name = $event,
                        required: "",
                        maxlength: "120",
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
                id: "c-slug",
                label: "Slug",
                error: unref(form).errors.slug,
                hint: "Vazio = gerado a partir do nome."
              }, {
                default: withCtx(({ describedBy, invalid }, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<input id="c-slug"${ssrRenderAttr("value", unref(form).slug)} class="field font-mono text-[13px]"${ssrRenderAttr("aria-invalid", invalid)}${ssrRenderAttr("aria-describedby", describedBy)}${_scopeId2}>`);
                  } else {
                    return [
                      withDirectives(createVNode("input", {
                        id: "c-slug",
                        "onUpdate:modelValue": ($event) => unref(form).slug = $event,
                        class: "field font-mono text-[13px]",
                        "aria-invalid": invalid,
                        "aria-describedby": describedBy
                      }, null, 8, ["onUpdate:modelValue", "aria-invalid", "aria-describedby"]), [
                        [vModelText, unref(form).slug]
                      ])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(_sfc_main$2, {
                id: "c-icon",
                label: "Ícone",
                error: unref(form).errors.icon
              }, {
                default: withCtx(({ describedBy }, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<select id="c-icon" class="field"${ssrRenderAttr("aria-describedby", describedBy)}${_scopeId2}><!--[-->`);
                    ssrRenderList(__props.icons, (i) => {
                      _push3(`<option${ssrRenderAttr("value", i)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).icon) ? ssrLooseContain(unref(form).icon, i) : ssrLooseEqual(unref(form).icon, i)) ? " selected" : ""}${_scopeId2}>${ssrInterpolate(i)}</option>`);
                    });
                    _push3(`<!--]--></select>`);
                  } else {
                    return [
                      withDirectives(createVNode("select", {
                        id: "c-icon",
                        "onUpdate:modelValue": ($event) => unref(form).icon = $event,
                        class: "field",
                        "aria-describedby": describedBy
                      }, [
                        (openBlock(true), createBlock(Fragment, null, renderList(__props.icons, (i) => {
                          return openBlock(), createBlock("option", {
                            key: i,
                            value: i
                          }, toDisplayString(i), 9, ["value"]);
                        }), 128))
                      ], 8, ["onUpdate:modelValue", "aria-describedby"]), [
                        [vModelSelect, unref(form).icon]
                      ])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(_sfc_main$2, {
                id: "c-pos",
                label: "Ordem de exibição",
                error: unref(form).errors.position
              }, {
                default: withCtx(({ describedBy, invalid }, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<input id="c-pos"${ssrRenderAttr("value", unref(form).position)} type="number" min="0" class="field"${ssrRenderAttr("aria-invalid", invalid)}${ssrRenderAttr("aria-describedby", describedBy)}${_scopeId2}>`);
                  } else {
                    return [
                      withDirectives(createVNode("input", {
                        id: "c-pos",
                        "onUpdate:modelValue": ($event) => unref(form).position = $event,
                        type: "number",
                        min: "0",
                        class: "field",
                        "aria-invalid": invalid,
                        "aria-describedby": describedBy
                      }, null, 8, ["onUpdate:modelValue", "aria-invalid", "aria-describedby"]), [
                        [
                          vModelText,
                          unref(form).position,
                          void 0,
                          { number: true }
                        ]
                      ])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div>`);
              _push2(ssrRenderComponent(_sfc_main$2, {
                id: "c-desc",
                label: "Descrição (opcional)",
                error: unref(form).errors.description,
                hint: "Usada na página da categoria e no SEO."
              }, {
                default: withCtx(({ describedBy, invalid }, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<textarea id="c-desc" rows="2" maxlength="500" class="field"${ssrRenderAttr("aria-invalid", invalid)}${ssrRenderAttr("aria-describedby", describedBy)}${_scopeId2}>${ssrInterpolate(unref(form).description)}</textarea>`);
                  } else {
                    return [
                      withDirectives(createVNode("textarea", {
                        id: "c-desc",
                        "onUpdate:modelValue": ($event) => unref(form).description = $event,
                        rows: "2",
                        maxlength: "500",
                        class: "field",
                        "aria-invalid": invalid,
                        "aria-describedby": describedBy
                      }, null, 8, ["onUpdate:modelValue", "aria-invalid", "aria-describedby"]), [
                        [vModelText, unref(form).description]
                      ])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`<label class="flex items-center gap-2 text-sm font-semibold text-ink"${_scopeId}><input${ssrIncludeBooleanAttr(Array.isArray(unref(form).is_active) ? ssrLooseContain(unref(form).is_active, null) : unref(form).is_active) ? " checked" : ""} type="checkbox" class="size-4 rounded border-line-strong text-action-600"${_scopeId}>Categoria ativa</label><div class="flex gap-2"${_scopeId}><button type="submit" class="btn-primary"${ssrIncludeBooleanAttr(unref(form).processing) ? " disabled" : ""}${_scopeId}>`);
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
            _push2(`<div class="card overflow-hidden"${_scopeId}>`);
            if (__props.categories.length) {
              _push2(`<ul class="divide-y divide-line"${_scopeId}><!--[-->`);
              ssrRenderList(__props.categories, (c) => {
                _push2(`<li class="flex flex-wrap items-center gap-3 px-4 py-3.5 sm:px-5"${_scopeId}><span class="grid size-10 shrink-0 place-items-center rounded-lg bg-action-50 text-action-700"${_scopeId}>`);
                _push2(ssrRenderComponent(_sfc_main$3, {
                  name: c.icon,
                  class: "size-5"
                }, null, _parent2, _scopeId));
                _push2(`</span><div class="min-w-0 flex-1"${_scopeId}><p class="flex flex-wrap items-center gap-2 font-bold text-ink"${_scopeId}>${ssrInterpolate(c.name)}`);
                if (!c.is_active) {
                  _push2(`<span class="rounded-full bg-line px-2 py-0.5 text-[11px] font-bold text-muted"${_scopeId}>Inativa</span>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</p><p class="text-xs text-muted"${_scopeId}>/categorias/${ssrInterpolate(c.slug)} · ${ssrInterpolate(c.jobs_count)} ${ssrInterpolate(c.jobs_count === 1 ? "vaga" : "vagas")} · ordem ${ssrInterpolate(c.position)}</p></div><div class="flex gap-1"${_scopeId}><button type="button" class="btn-ghost btn-sm size-9 p-0"${ssrRenderAttr("aria-label", `Editar ${c.name}`)}${_scopeId}>`);
                _push2(ssrRenderComponent(unref(Pencil), { class: "size-4" }, null, _parent2, _scopeId));
                _push2(`</button><button type="button" class="btn-ghost btn-sm size-9 p-0 hover:text-danger-700"${ssrRenderAttr("aria-label", `Excluir ${c.name}`)}${ssrIncludeBooleanAttr(c.jobs_count > 0) ? " disabled" : ""}${ssrRenderAttr("title", c.jobs_count > 0 ? "Possui vagas: desative em vez de excluir" : "Excluir")}${_scopeId}>`);
                _push2(ssrRenderComponent(unref(Trash2), { class: "size-4" }, null, _parent2, _scopeId));
                _push2(`</button></div></li>`);
              });
              _push2(`<!--]--></ul>`);
            } else {
              _push2(`<p class="px-5 py-10 text-center text-sm text-muted"${_scopeId}>Nenhuma categoria cadastrada.</p>`);
            }
            _push2(`</div></div>`);
            _push2(ssrRenderComponent(_sfc_main$4, {
              open: !!deleting.value,
              danger: "",
              "confirm-label": "Excluir categoria",
              title: "Excluir categoria?",
              message: `“${deleting.value?.name}” será excluída definitivamente.`,
              onCancel: ($event) => deleting.value = null,
              onConfirm: remove
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode("div", { class: "mx-auto max-w-5xl" }, [
                createVNode("header", { class: "mb-5 flex flex-wrap items-center justify-between gap-3" }, [
                  createVNode("div", null, [
                    createVNode("h1", { class: "text-2xl font-extrabold text-ink" }, "Categorias"),
                    createVNode("p", { class: "text-sm text-muted" }, "Categorias inativas ou sem vagas abertas não aparecem no site.")
                  ]),
                  editingId.value === null ? (openBlock(), createBlock("button", {
                    key: 0,
                    type: "button",
                    class: "btn-primary",
                    onClick: startNew
                  }, [
                    createVNode(unref(Plus), {
                      class: "size-4",
                      "aria-hidden": "true"
                    }),
                    createTextVNode("Nova categoria")
                  ])) : createCommentVNode("", true)
                ]),
                editingId.value !== null ? (openBlock(), createBlock("form", {
                  key: 0,
                  class: "card mb-5 space-y-4 p-5",
                  "aria-label": "Formulário de categoria",
                  onSubmit: withModifiers(save, ["prevent"])
                }, [
                  createVNode("h2", { class: "text-lg font-extrabold text-ink" }, toDisplayString(editingId.value ? "Editar categoria" : "Nova categoria"), 1),
                  createVNode("div", { class: "grid gap-4 sm:grid-cols-2" }, [
                    createVNode(_sfc_main$2, {
                      id: "c-name",
                      label: "Nome",
                      error: unref(form).errors.name,
                      required: ""
                    }, {
                      default: withCtx(({ describedBy, invalid }) => [
                        withDirectives(createVNode("input", {
                          id: "c-name",
                          "onUpdate:modelValue": ($event) => unref(form).name = $event,
                          required: "",
                          maxlength: "120",
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
                      id: "c-slug",
                      label: "Slug",
                      error: unref(form).errors.slug,
                      hint: "Vazio = gerado a partir do nome."
                    }, {
                      default: withCtx(({ describedBy, invalid }) => [
                        withDirectives(createVNode("input", {
                          id: "c-slug",
                          "onUpdate:modelValue": ($event) => unref(form).slug = $event,
                          class: "field font-mono text-[13px]",
                          "aria-invalid": invalid,
                          "aria-describedby": describedBy
                        }, null, 8, ["onUpdate:modelValue", "aria-invalid", "aria-describedby"]), [
                          [vModelText, unref(form).slug]
                        ])
                      ]),
                      _: 1
                    }, 8, ["error"]),
                    createVNode(_sfc_main$2, {
                      id: "c-icon",
                      label: "Ícone",
                      error: unref(form).errors.icon
                    }, {
                      default: withCtx(({ describedBy }) => [
                        withDirectives(createVNode("select", {
                          id: "c-icon",
                          "onUpdate:modelValue": ($event) => unref(form).icon = $event,
                          class: "field",
                          "aria-describedby": describedBy
                        }, [
                          (openBlock(true), createBlock(Fragment, null, renderList(__props.icons, (i) => {
                            return openBlock(), createBlock("option", {
                              key: i,
                              value: i
                            }, toDisplayString(i), 9, ["value"]);
                          }), 128))
                        ], 8, ["onUpdate:modelValue", "aria-describedby"]), [
                          [vModelSelect, unref(form).icon]
                        ])
                      ]),
                      _: 1
                    }, 8, ["error"]),
                    createVNode(_sfc_main$2, {
                      id: "c-pos",
                      label: "Ordem de exibição",
                      error: unref(form).errors.position
                    }, {
                      default: withCtx(({ describedBy, invalid }) => [
                        withDirectives(createVNode("input", {
                          id: "c-pos",
                          "onUpdate:modelValue": ($event) => unref(form).position = $event,
                          type: "number",
                          min: "0",
                          class: "field",
                          "aria-invalid": invalid,
                          "aria-describedby": describedBy
                        }, null, 8, ["onUpdate:modelValue", "aria-invalid", "aria-describedby"]), [
                          [
                            vModelText,
                            unref(form).position,
                            void 0,
                            { number: true }
                          ]
                        ])
                      ]),
                      _: 1
                    }, 8, ["error"])
                  ]),
                  createVNode(_sfc_main$2, {
                    id: "c-desc",
                    label: "Descrição (opcional)",
                    error: unref(form).errors.description,
                    hint: "Usada na página da categoria e no SEO."
                  }, {
                    default: withCtx(({ describedBy, invalid }) => [
                      withDirectives(createVNode("textarea", {
                        id: "c-desc",
                        "onUpdate:modelValue": ($event) => unref(form).description = $event,
                        rows: "2",
                        maxlength: "500",
                        class: "field",
                        "aria-invalid": invalid,
                        "aria-describedby": describedBy
                      }, null, 8, ["onUpdate:modelValue", "aria-invalid", "aria-describedby"]), [
                        [vModelText, unref(form).description]
                      ])
                    ]),
                    _: 1
                  }, 8, ["error"]),
                  createVNode("label", { class: "flex items-center gap-2 text-sm font-semibold text-ink" }, [
                    withDirectives(createVNode("input", {
                      "onUpdate:modelValue": ($event) => unref(form).is_active = $event,
                      type: "checkbox",
                      class: "size-4 rounded border-line-strong text-action-600"
                    }, null, 8, ["onUpdate:modelValue"]), [
                      [vModelCheckbox, unref(form).is_active]
                    ]),
                    createTextVNode("Categoria ativa")
                  ]),
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
                createVNode("div", { class: "card overflow-hidden" }, [
                  __props.categories.length ? (openBlock(), createBlock("ul", {
                    key: 0,
                    class: "divide-y divide-line"
                  }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(__props.categories, (c) => {
                      return openBlock(), createBlock("li", {
                        key: c.id,
                        class: "flex flex-wrap items-center gap-3 px-4 py-3.5 sm:px-5"
                      }, [
                        createVNode("span", { class: "grid size-10 shrink-0 place-items-center rounded-lg bg-action-50 text-action-700" }, [
                          createVNode(_sfc_main$3, {
                            name: c.icon,
                            class: "size-5"
                          }, null, 8, ["name"])
                        ]),
                        createVNode("div", { class: "min-w-0 flex-1" }, [
                          createVNode("p", { class: "flex flex-wrap items-center gap-2 font-bold text-ink" }, [
                            createTextVNode(toDisplayString(c.name), 1),
                            !c.is_active ? (openBlock(), createBlock("span", {
                              key: 0,
                              class: "rounded-full bg-line px-2 py-0.5 text-[11px] font-bold text-muted"
                            }, "Inativa")) : createCommentVNode("", true)
                          ]),
                          createVNode("p", { class: "text-xs text-muted" }, "/categorias/" + toDisplayString(c.slug) + " · " + toDisplayString(c.jobs_count) + " " + toDisplayString(c.jobs_count === 1 ? "vaga" : "vagas") + " · ordem " + toDisplayString(c.position), 1)
                        ]),
                        createVNode("div", { class: "flex gap-1" }, [
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
                            title: c.jobs_count > 0 ? "Possui vagas: desative em vez de excluir" : "Excluir",
                            onClick: ($event) => deleting.value = c
                          }, [
                            createVNode(unref(Trash2), { class: "size-4" })
                          ], 8, ["aria-label", "disabled", "title", "onClick"])
                        ])
                      ]);
                    }), 128))
                  ])) : (openBlock(), createBlock("p", {
                    key: 1,
                    class: "px-5 py-10 text-center text-sm text-muted"
                  }, "Nenhuma categoria cadastrada."))
                ])
              ]),
              createVNode(_sfc_main$4, {
                open: !!deleting.value,
                danger: "",
                "confirm-label": "Excluir categoria",
                title: "Excluir categoria?",
                message: `“${deleting.value?.name}” será excluída definitivamente.`,
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/pages/Admin/Categories.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=Categories-CsVzUegx.js.map
