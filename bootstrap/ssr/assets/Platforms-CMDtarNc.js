import { defineComponent, ref, mergeProps, withCtx, unref, withDirectives, createVNode, vModelText, openBlock, createBlock, createTextVNode, createCommentVNode, withModifiers, toDisplayString, vModelCheckbox, Fragment, renderList, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrRenderList, ssrRenderStyle } from "vue/server-renderer";
import { useForm, router } from "@inertiajs/vue3";
import { Plus, Check, X, Pencil, Trash2 } from "lucide-vue-next";
import { _ as _sfc_main$4 } from "./ConfirmDialog-CgAQ1lem.js";
import { _ as _sfc_main$2 } from "./Field-CI53GIau.js";
import { _ as _sfc_main$3 } from "./LogoField-D88DZ2aT.js";
import { _ as _sfc_main$1 } from "./AdminLayout-BocNC89A.js";
import "./FlashMessages-mTMlubKC.js";
import "./SeoHead-BMQcIEwx.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Platforms",
  __ssrInlineRender: true,
  props: {
    platforms: {}
  },
  setup(__props) {
    const editing = ref(null);
    const creating = ref(false);
    const deleting = ref(null);
    const current = ref(null);
    const form = useForm({ _method: "post", name: "", color: "#2563eb", logo_url: "", logo: null, remove_logo: false, uses_email: false, is_active: true, position: 0 });
    function startNew() {
      editing.value = null;
      creating.value = true;
      current.value = null;
      form.clearErrors();
      form.defaults({ _method: "post", name: "", color: "#2563eb", logo_url: "", logo: null, remove_logo: false, uses_email: false, is_active: true, position: 0 }).reset();
    }
    function startEdit(p) {
      creating.value = false;
      editing.value = p;
      current.value = p.logo_src;
      form.clearErrors();
      form.defaults({ _method: "put", name: p.name, color: p.color, logo_url: p.logo_url ?? "", logo: null, remove_logo: false, uses_email: p.uses_email, is_active: p.is_active, position: p.position }).reset();
    }
    function cancel() {
      creating.value = false;
      editing.value = null;
      form.reset().clearErrors();
    }
    function save() {
      const url = editing.value ? `/admin/plataformas/${editing.value.id}` : "/admin/plataformas";
      form.post(url, { forceFormData: true, preserveScroll: true, onSuccess: cancel });
    }
    function remove() {
      router.delete(`/admin/plataformas/${deleting.value.id}`, { preserveScroll: true, onFinish: () => deleting.value = null });
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$1, mergeProps({ title: "Plataformas" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="mx-auto max-w-5xl"${_scopeId}><header class="mb-5 flex flex-wrap items-center justify-between gap-3"${_scopeId}><div${_scopeId}><h1 class="text-2xl font-extrabold text-ink"${_scopeId}>Plataformas de contratação</h1><p class="text-sm text-muted"${_scopeId}>Canais por onde o candidato se inscreve (Gupy, LinkedIn, e-mail…). Usadas no filtro público e no selo de cada vaga.</p></div>`);
            if (!creating.value && !editing.value) {
              _push2(`<button type="button" class="btn-primary"${_scopeId}>`);
              _push2(ssrRenderComponent(unref(Plus), {
                class: "size-4",
                "aria-hidden": "true"
              }, null, _parent2, _scopeId));
              _push2(`Nova plataforma</button>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</header>`);
            if (creating.value || editing.value) {
              _push2(`<form class="card mb-5 space-y-4 p-5" aria-label="Formulário de plataforma"${_scopeId}><h2 class="text-lg font-extrabold text-ink"${_scopeId}>${ssrInterpolate(editing.value ? `Editar ${editing.value.name}` : "Nova plataforma")}</h2><div class="grid gap-4 sm:grid-cols-[1fr_9rem_8rem]"${_scopeId}>`);
              _push2(ssrRenderComponent(_sfc_main$2, {
                id: "pl-name",
                label: "Nome",
                error: unref(form).errors.name,
                required: ""
              }, {
                default: withCtx(({ describedBy, invalid }, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<input id="pl-name"${ssrRenderAttr("value", unref(form).name)} required maxlength="80" class="field"${ssrRenderAttr("aria-invalid", invalid)}${ssrRenderAttr("aria-describedby", describedBy)}${_scopeId2}>`);
                  } else {
                    return [
                      withDirectives(createVNode("input", {
                        id: "pl-name",
                        "onUpdate:modelValue": ($event) => unref(form).name = $event,
                        required: "",
                        maxlength: "80",
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
                id: "pl-color",
                label: "Cor",
                error: unref(form).errors.color,
                hint: "Usada quando não há logotipo."
              }, {
                default: withCtx(({ describedBy }, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<input id="pl-color"${ssrRenderAttr("value", unref(form).color)} type="color" class="field h-11 cursor-pointer p-1"${ssrRenderAttr("aria-describedby", describedBy)}${_scopeId2}>`);
                  } else {
                    return [
                      withDirectives(createVNode("input", {
                        id: "pl-color",
                        "onUpdate:modelValue": ($event) => unref(form).color = $event,
                        type: "color",
                        class: "field h-11 cursor-pointer p-1",
                        "aria-describedby": describedBy
                      }, null, 8, ["onUpdate:modelValue", "aria-describedby"]), [
                        [vModelText, unref(form).color]
                      ])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(_sfc_main$2, {
                id: "pl-pos",
                label: "Ordem",
                error: unref(form).errors.position
              }, {
                default: withCtx(({ describedBy, invalid }, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<input id="pl-pos"${ssrRenderAttr("value", unref(form).position)} type="number" min="0" class="field"${ssrRenderAttr("aria-invalid", invalid)}${ssrRenderAttr("aria-describedby", describedBy)}${_scopeId2}>`);
                  } else {
                    return [
                      withDirectives(createVNode("input", {
                        id: "pl-pos",
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
              _push2(ssrRenderComponent(_sfc_main$3, {
                id: "pl-logo",
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
              _push2(`<div class="flex flex-wrap gap-x-8 gap-y-3"${_scopeId}><label class="flex items-start gap-2 text-sm"${_scopeId}><input${ssrIncludeBooleanAttr(Array.isArray(unref(form).uses_email) ? ssrLooseContain(unref(form).uses_email, null) : unref(form).uses_email) ? " checked" : ""} type="checkbox" class="mt-0.5 size-4 rounded border-line-strong text-action-600"${_scopeId}><span${_scopeId}><span class="font-semibold text-ink"${_scopeId}>Candidatura por e-mail</span><span class="block text-xs text-muted"${_scopeId}>Sem link: a vaga pede um e-mail de candidatura.</span></span></label><label class="flex items-start gap-2 text-sm"${_scopeId}><input${ssrIncludeBooleanAttr(Array.isArray(unref(form).is_active) ? ssrLooseContain(unref(form).is_active, null) : unref(form).is_active) ? " checked" : ""} type="checkbox" class="mt-0.5 size-4 rounded border-line-strong text-action-600"${_scopeId}><span${_scopeId}><span class="font-semibold text-ink"${_scopeId}>Ativa</span><span class="block text-xs text-muted"${_scopeId}>Inativas não aparecem para novas vagas.</span></span></label></div><div class="flex gap-2"${_scopeId}><button type="submit" class="btn-primary"${ssrIncludeBooleanAttr(unref(form).processing) ? " disabled" : ""}${_scopeId}>`);
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
            if (__props.platforms.length) {
              _push2(`<ul class="divide-y divide-line"${_scopeId}><!--[-->`);
              ssrRenderList(__props.platforms, (p) => {
                _push2(`<li class="flex flex-wrap items-center gap-3 px-4 py-3.5 sm:px-5"${_scopeId}>`);
                if (p.logo_src) {
                  _push2(`<img${ssrRenderAttr("src", p.logo_src)}${ssrRenderAttr("alt", `Logotipo ${p.name}`)} class="size-11 shrink-0 rounded-xl border border-line bg-white object-contain"${_scopeId}>`);
                } else {
                  _push2(`<span class="grid size-11 shrink-0 place-items-center rounded-xl text-base font-extrabold text-white" style="${ssrRenderStyle({ backgroundColor: p.color })}" aria-hidden="true"${_scopeId}>${ssrInterpolate(p.name[0])}</span>`);
                }
                _push2(`<div class="min-w-0 flex-1"${_scopeId}><p class="flex flex-wrap items-center gap-2 font-bold text-ink"${_scopeId}>${ssrInterpolate(p.name)}`);
                if (!p.is_active) {
                  _push2(`<span class="badge bg-line text-muted"${_scopeId}>Inativa</span>`);
                } else {
                  _push2(`<!---->`);
                }
                if (p.uses_email) {
                  _push2(`<span class="badge bg-info-50 text-info-700"${_scopeId}>E-mail</span>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</p><p class="text-xs text-muted"${_scopeId}>?plataforma=${ssrInterpolate(p.slug)} · ${ssrInterpolate(p.jobs_count)} ${ssrInterpolate(p.jobs_count === 1 ? "vaga" : "vagas")}</p></div><div class="flex gap-1"${_scopeId}><button type="button" class="btn-ghost btn-sm size-9 p-0"${ssrRenderAttr("aria-label", `Editar ${p.name}`)}${_scopeId}>`);
                _push2(ssrRenderComponent(unref(Pencil), { class: "size-4" }, null, _parent2, _scopeId));
                _push2(`</button><button type="button" class="btn-ghost btn-sm size-9 p-0 hover:text-danger-700"${ssrRenderAttr("aria-label", `Excluir ${p.name}`)}${ssrIncludeBooleanAttr(p.jobs_count > 0) ? " disabled" : ""}${ssrRenderAttr("title", p.jobs_count > 0 ? "Possui vagas: desative em vez de excluir" : "Excluir")}${_scopeId}>`);
                _push2(ssrRenderComponent(unref(Trash2), { class: "size-4" }, null, _parent2, _scopeId));
                _push2(`</button></div></li>`);
              });
              _push2(`<!--]--></ul>`);
            } else {
              _push2(`<p class="px-5 py-10 text-center text-sm text-muted"${_scopeId}>Nenhuma plataforma cadastrada.</p>`);
            }
            _push2(`</div></div>`);
            _push2(ssrRenderComponent(_sfc_main$4, {
              open: !!deleting.value,
              danger: "",
              "confirm-label": "Excluir plataforma",
              title: "Excluir plataforma?",
              message: `“${deleting.value?.name}” será excluída definitivamente.`,
              onCancel: ($event) => deleting.value = null,
              onConfirm: remove
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode("div", { class: "mx-auto max-w-5xl" }, [
                createVNode("header", { class: "mb-5 flex flex-wrap items-center justify-between gap-3" }, [
                  createVNode("div", null, [
                    createVNode("h1", { class: "text-2xl font-extrabold text-ink" }, "Plataformas de contratação"),
                    createVNode("p", { class: "text-sm text-muted" }, "Canais por onde o candidato se inscreve (Gupy, LinkedIn, e-mail…). Usadas no filtro público e no selo de cada vaga.")
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
                    createTextVNode("Nova plataforma")
                  ])) : createCommentVNode("", true)
                ]),
                creating.value || editing.value ? (openBlock(), createBlock("form", {
                  key: 0,
                  class: "card mb-5 space-y-4 p-5",
                  "aria-label": "Formulário de plataforma",
                  onSubmit: withModifiers(save, ["prevent"])
                }, [
                  createVNode("h2", { class: "text-lg font-extrabold text-ink" }, toDisplayString(editing.value ? `Editar ${editing.value.name}` : "Nova plataforma"), 1),
                  createVNode("div", { class: "grid gap-4 sm:grid-cols-[1fr_9rem_8rem]" }, [
                    createVNode(_sfc_main$2, {
                      id: "pl-name",
                      label: "Nome",
                      error: unref(form).errors.name,
                      required: ""
                    }, {
                      default: withCtx(({ describedBy, invalid }) => [
                        withDirectives(createVNode("input", {
                          id: "pl-name",
                          "onUpdate:modelValue": ($event) => unref(form).name = $event,
                          required: "",
                          maxlength: "80",
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
                      id: "pl-color",
                      label: "Cor",
                      error: unref(form).errors.color,
                      hint: "Usada quando não há logotipo."
                    }, {
                      default: withCtx(({ describedBy }) => [
                        withDirectives(createVNode("input", {
                          id: "pl-color",
                          "onUpdate:modelValue": ($event) => unref(form).color = $event,
                          type: "color",
                          class: "field h-11 cursor-pointer p-1",
                          "aria-describedby": describedBy
                        }, null, 8, ["onUpdate:modelValue", "aria-describedby"]), [
                          [vModelText, unref(form).color]
                        ])
                      ]),
                      _: 1
                    }, 8, ["error"]),
                    createVNode(_sfc_main$2, {
                      id: "pl-pos",
                      label: "Ordem",
                      error: unref(form).errors.position
                    }, {
                      default: withCtx(({ describedBy, invalid }) => [
                        withDirectives(createVNode("input", {
                          id: "pl-pos",
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
                  createVNode(_sfc_main$3, {
                    id: "pl-logo",
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
                  createVNode("div", { class: "flex flex-wrap gap-x-8 gap-y-3" }, [
                    createVNode("label", { class: "flex items-start gap-2 text-sm" }, [
                      withDirectives(createVNode("input", {
                        "onUpdate:modelValue": ($event) => unref(form).uses_email = $event,
                        type: "checkbox",
                        class: "mt-0.5 size-4 rounded border-line-strong text-action-600"
                      }, null, 8, ["onUpdate:modelValue"]), [
                        [vModelCheckbox, unref(form).uses_email]
                      ]),
                      createVNode("span", null, [
                        createVNode("span", { class: "font-semibold text-ink" }, "Candidatura por e-mail"),
                        createVNode("span", { class: "block text-xs text-muted" }, "Sem link: a vaga pede um e-mail de candidatura.")
                      ])
                    ]),
                    createVNode("label", { class: "flex items-start gap-2 text-sm" }, [
                      withDirectives(createVNode("input", {
                        "onUpdate:modelValue": ($event) => unref(form).is_active = $event,
                        type: "checkbox",
                        class: "mt-0.5 size-4 rounded border-line-strong text-action-600"
                      }, null, 8, ["onUpdate:modelValue"]), [
                        [vModelCheckbox, unref(form).is_active]
                      ]),
                      createVNode("span", null, [
                        createVNode("span", { class: "font-semibold text-ink" }, "Ativa"),
                        createVNode("span", { class: "block text-xs text-muted" }, "Inativas não aparecem para novas vagas.")
                      ])
                    ])
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
                  __props.platforms.length ? (openBlock(), createBlock("ul", {
                    key: 0,
                    class: "divide-y divide-line"
                  }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(__props.platforms, (p) => {
                      return openBlock(), createBlock("li", {
                        key: p.id,
                        class: "flex flex-wrap items-center gap-3 px-4 py-3.5 sm:px-5"
                      }, [
                        p.logo_src ? (openBlock(), createBlock("img", {
                          key: 0,
                          src: p.logo_src,
                          alt: `Logotipo ${p.name}`,
                          class: "size-11 shrink-0 rounded-xl border border-line bg-white object-contain"
                        }, null, 8, ["src", "alt"])) : (openBlock(), createBlock("span", {
                          key: 1,
                          class: "grid size-11 shrink-0 place-items-center rounded-xl text-base font-extrabold text-white",
                          style: { backgroundColor: p.color },
                          "aria-hidden": "true"
                        }, toDisplayString(p.name[0]), 5)),
                        createVNode("div", { class: "min-w-0 flex-1" }, [
                          createVNode("p", { class: "flex flex-wrap items-center gap-2 font-bold text-ink" }, [
                            createTextVNode(toDisplayString(p.name), 1),
                            !p.is_active ? (openBlock(), createBlock("span", {
                              key: 0,
                              class: "badge bg-line text-muted"
                            }, "Inativa")) : createCommentVNode("", true),
                            p.uses_email ? (openBlock(), createBlock("span", {
                              key: 1,
                              class: "badge bg-info-50 text-info-700"
                            }, "E-mail")) : createCommentVNode("", true)
                          ]),
                          createVNode("p", { class: "text-xs text-muted" }, "?plataforma=" + toDisplayString(p.slug) + " · " + toDisplayString(p.jobs_count) + " " + toDisplayString(p.jobs_count === 1 ? "vaga" : "vagas"), 1)
                        ]),
                        createVNode("div", { class: "flex gap-1" }, [
                          createVNode("button", {
                            type: "button",
                            class: "btn-ghost btn-sm size-9 p-0",
                            "aria-label": `Editar ${p.name}`,
                            onClick: ($event) => startEdit(p)
                          }, [
                            createVNode(unref(Pencil), { class: "size-4" })
                          ], 8, ["aria-label", "onClick"]),
                          createVNode("button", {
                            type: "button",
                            class: "btn-ghost btn-sm size-9 p-0 hover:text-danger-700",
                            "aria-label": `Excluir ${p.name}`,
                            disabled: p.jobs_count > 0,
                            title: p.jobs_count > 0 ? "Possui vagas: desative em vez de excluir" : "Excluir",
                            onClick: ($event) => deleting.value = p
                          }, [
                            createVNode(unref(Trash2), { class: "size-4" })
                          ], 8, ["aria-label", "disabled", "title", "onClick"])
                        ])
                      ]);
                    }), 128))
                  ])) : (openBlock(), createBlock("p", {
                    key: 1,
                    class: "px-5 py-10 text-center text-sm text-muted"
                  }, "Nenhuma plataforma cadastrada."))
                ])
              ]),
              createVNode(_sfc_main$4, {
                open: !!deleting.value,
                danger: "",
                "confirm-label": "Excluir plataforma",
                title: "Excluir plataforma?",
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/pages/Admin/Platforms.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=Platforms-CMDtarNc.js.map
