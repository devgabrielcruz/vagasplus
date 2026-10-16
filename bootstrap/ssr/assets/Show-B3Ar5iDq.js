import { defineComponent, ref, mergeProps, unref, withCtx, createTextVNode, createVNode, withDirectives, vModelText, openBlock, createBlock, toDisplayString, createCommentVNode, Fragment, renderList, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderAttr } from "vue/server-renderer";
import { useForm, Link, router } from "@inertiajs/vue3";
import { X, Check, Pencil, ExternalLink, Mail, Phone } from "lucide-vue-next";
import { _ as _sfc_main$2 } from "./CompanyLogo-meQRdREr.js";
import { _ as _sfc_main$3 } from "./ConfirmDialog-CgAQ1lem.js";
import { _ as _sfc_main$1 } from "./AdminLayout-BocNC89A.js";
import { f as formatDateTime } from "./format-D8ppHDIy.js";
import "./FlashMessages-mTMlubKC.js";
import "./SeoHead-BMQcIEwx.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Show",
  __ssrInlineRender: true,
  props: {
    submission: {}
  },
  setup(__props) {
    const props = __props;
    const s = props.submission;
    const approving = ref(false);
    const rejecting = ref(false);
    const busy = ref(false);
    const reject = useForm({ reason: "" });
    function approve() {
      busy.value = true;
      router.post(`/admin/solicitacoes/${s.id}/aprovar`, {}, { onFinish: () => {
        busy.value = false;
        approving.value = false;
      } });
    }
    function doReject() {
      reject.post(`/admin/solicitacoes/${s.id}/recusar`, { onSuccess: () => rejecting.value = false });
    }
    const sections = [
      { t: "Descrição", v: s.description },
      { t: "Requisitos", v: s.requirements },
      { t: "Benefícios", v: s.benefits }
    ].filter((x) => x.v);
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$1, mergeProps({
        title: `Solicitação #${unref(s).id}`
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="mx-auto max-w-5xl"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: "/admin/solicitacoes",
              class: "text-sm font-semibold text-action-700 hover:underline"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`← Solicitações`);
                } else {
                  return [
                    createTextVNode("← Solicitações")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`<header class="mt-2 mb-5 flex flex-wrap items-start justify-between gap-3"${_scopeId}><div class="flex items-start gap-4"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$2, {
              name: unref(s).company.name,
              url: unref(s).company.logo,
              size: "lg"
            }, null, _parent2, _scopeId));
            _push2(`<div${_scopeId}><p class="text-xs font-bold tracking-widest text-subtle uppercase"${_scopeId}>Solicitação #${ssrInterpolate(unref(s).id)} · ${ssrInterpolate(unref(s).status_label)}</p><h1 class="mt-1 text-2xl font-extrabold text-ink"${_scopeId}>${ssrInterpolate(unref(s).title)}</h1><p class="text-muted"${_scopeId}>${ssrInterpolate(unref(s).company.name)}</p></div></div>`);
            if (unref(s).status === "pending") {
              _push2(`<div class="flex flex-wrap gap-2"${_scopeId}><button type="button" class="btn-secondary text-danger-700 hover:border-danger-700 hover:bg-danger-50"${_scopeId}>`);
              _push2(ssrRenderComponent(unref(X), {
                class: "size-4",
                "aria-hidden": "true"
              }, null, _parent2, _scopeId));
              _push2(`Recusar</button><button type="button" class="btn-primary"${_scopeId}>`);
              _push2(ssrRenderComponent(unref(Check), {
                class: "size-4",
                "aria-hidden": "true"
              }, null, _parent2, _scopeId));
              _push2(`Aprovar e criar rascunho</button></div>`);
            } else if (unref(s).job_edit_url) {
              _push2(ssrRenderComponent(unref(Link), {
                href: unref(s).job_edit_url,
                class: "btn-primary"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(unref(Pencil), {
                      class: "size-4",
                      "aria-hidden": "true"
                    }, null, _parent3, _scopeId2));
                    _push3(`Abrir a vaga`);
                  } else {
                    return [
                      createVNode(unref(Pencil), {
                        class: "size-4",
                        "aria-hidden": "true"
                      }),
                      createTextVNode("Abrir a vaga")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(`</header>`);
            if (unref(s).status === "rejected") {
              _push2(`<div class="mb-5 rounded-xl border border-danger-700/20 bg-danger-50 p-4 text-sm text-danger-700"${_scopeId}><p class="font-bold"${_scopeId}>Recusada por ${ssrInterpolate(unref(s).reviewer)} em ${ssrInterpolate(unref(formatDateTime)(unref(s).reviewed_at))}</p><p class="mt-1"${_scopeId}>Motivo: ${ssrInterpolate(unref(s).rejection_reason)}</p></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (unref(s).status === "approved") {
              _push2(`<div class="mb-5 rounded-xl border border-success-700/20 bg-success-50 p-4 text-sm text-success-700"${_scopeId}><p class="font-bold"${_scopeId}>Aprovada por ${ssrInterpolate(unref(s).reviewer)} em ${ssrInterpolate(unref(formatDateTime)(unref(s).reviewed_at))}</p></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="grid gap-6 lg:grid-cols-[1fr_20rem] lg:items-start"${_scopeId}><div class="space-y-4"${_scopeId}><section class="card p-5" aria-labelledby="d-resumo"${_scopeId}><h2 id="d-resumo" class="mb-3 text-lg font-extrabold text-ink"${_scopeId}>Resumo</h2><dl class="grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2"${_scopeId}><div${_scopeId}><dt class="text-muted"${_scopeId}>Categoria</dt><dd class="font-semibold text-ink"${_scopeId}>${ssrInterpolate(unref(s).category)}</dd></div><div${_scopeId}><dt class="text-muted"${_scopeId}>Modalidade</dt><dd class="font-semibold text-ink"${_scopeId}>${ssrInterpolate(unref(s).work_mode)}</dd></div><div${_scopeId}><dt class="text-muted"${_scopeId}>Contratação</dt><dd class="font-semibold text-ink"${_scopeId}>${ssrInterpolate(unref(s).employment_type)}</dd></div><div${_scopeId}><dt class="text-muted"${_scopeId}>Nível</dt><dd class="font-semibold text-ink"${_scopeId}>${ssrInterpolate(unref(s).experience_level ?? "Não informado")}</dd></div><div${_scopeId}><dt class="text-muted"${_scopeId}>Local</dt><dd class="font-semibold text-ink"${_scopeId}>${ssrInterpolate(unref(s).location ?? "Remoto / não informado")}</dd></div><div${_scopeId}><dt class="text-muted"${_scopeId}>Salário</dt><dd class="font-semibold text-ink"${_scopeId}>${ssrInterpolate(unref(s).salary ?? "Não informado")}</dd></div></dl></section><!--[-->`);
            ssrRenderList(unref(sections), (x) => {
              _push2(`<section class="card p-5"${_scopeId}><h2 class="mb-3 text-lg font-extrabold text-ink"${_scopeId}>${ssrInterpolate(x.t)}</h2><div class="prose-job"${_scopeId}>${x.v ?? ""}</div></section>`);
            });
            _push2(`<!--]--></div><aside class="space-y-4"${_scopeId}><section class="card space-y-3 p-5" aria-labelledby="d-cand"${_scopeId}><h2 id="d-cand" class="text-lg font-extrabold text-ink"${_scopeId}>Candidatura</h2><div class="flex items-center gap-2.5 text-sm font-semibold text-ink"${_scopeId}>`);
            if (unref(s).platform.logo) {
              _push2(`<img${ssrRenderAttr("src", unref(s).platform.logo)} alt="" class="h-6 w-auto max-w-[4rem] rounded object-contain"${_scopeId}>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`${ssrInterpolate(unref(s).platform.label)}</div>`);
            if (unref(s).apply_url) {
              _push2(`<a${ssrRenderAttr("href", unref(s).apply_url)} target="_blank" rel="noopener noreferrer nofollow" class="flex items-start gap-1.5 text-sm break-all text-action-700 hover:underline"${_scopeId}>`);
              _push2(ssrRenderComponent(unref(ExternalLink), {
                class: "mt-0.5 size-4 shrink-0",
                "aria-hidden": "true"
              }, null, _parent2, _scopeId));
              _push2(`${ssrInterpolate(unref(s).apply_url)}</a>`);
            } else {
              _push2(`<!---->`);
            }
            if (unref(s).apply_email) {
              _push2(`<a${ssrRenderAttr("href", `mailto:${unref(s).apply_email}`)} class="flex items-center gap-1.5 text-sm break-all text-action-700 hover:underline"${_scopeId}>`);
              _push2(ssrRenderComponent(unref(Mail), {
                class: "size-4 shrink-0",
                "aria-hidden": "true"
              }, null, _parent2, _scopeId));
              _push2(`${ssrInterpolate(unref(s).apply_email)}</a>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<p class="text-xs text-muted"${_scopeId}>Abra o link e confirme que a vaga existe e está aberta antes de aprovar.</p></section><section class="card space-y-2 p-5" aria-labelledby="d-envio"${_scopeId}><h2 id="d-envio" class="text-lg font-extrabold text-ink"${_scopeId}>Quem enviou</h2><p class="text-sm font-semibold text-ink"${_scopeId}>${ssrInterpolate(unref(s).submitter.name)}</p><a${ssrRenderAttr("href", `mailto:${unref(s).submitter.email}`)} class="flex items-center gap-1.5 text-sm break-all text-action-700 hover:underline"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Mail), {
              class: "size-4 shrink-0",
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
            _push2(`${ssrInterpolate(unref(s).submitter.email)}</a>`);
            if (unref(s).submitter.phone) {
              _push2(`<p class="flex items-center gap-1.5 text-sm text-ink"${_scopeId}>`);
              _push2(ssrRenderComponent(unref(Phone), {
                class: "size-4 shrink-0 text-subtle",
                "aria-hidden": "true"
              }, null, _parent2, _scopeId));
              _push2(`${ssrInterpolate(unref(s).submitter.phone)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<p class="text-xs text-muted"${_scopeId}>Enviada em ${ssrInterpolate(unref(formatDateTime)(unref(s).created_at))}`);
            if (unref(s).submitter.ip) {
              _push2(`<!--[--> · IP ${ssrInterpolate(unref(s).submitter.ip)}<!--]-->`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</p>`);
            if (unref(s).company.website_url) {
              _push2(`<a${ssrRenderAttr("href", unref(s).company.website_url)} target="_blank" rel="noopener noreferrer nofollow" class="flex items-center gap-1.5 text-sm break-all text-action-700 hover:underline"${_scopeId}>`);
              _push2(ssrRenderComponent(unref(ExternalLink), {
                class: "size-4 shrink-0",
                "aria-hidden": "true"
              }, null, _parent2, _scopeId));
              _push2(`${ssrInterpolate(unref(s).company.website_url)}</a>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</section></aside></div></div>`);
            _push2(ssrRenderComponent(_sfc_main$3, {
              open: approving.value,
              "confirm-label": "Aprovar",
              title: "Aprovar esta solicitação?",
              message: "A vaga será criada como rascunho (a empresa é cadastrada se ainda não existir). Nada vai ao ar até você publicar.",
              processing: busy.value,
              onCancel: ($event) => approving.value = false,
              onConfirm: approve
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$3, {
              open: rejecting.value,
              danger: "",
              "confirm-label": "Recusar",
              title: "Recusar esta solicitação?",
              message: "Explique o motivo para o registro interno. O logotipo enviado será apagado.",
              processing: unref(reject).processing,
              onCancel: ($event) => rejecting.value = false,
              onConfirm: doReject
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<label for="reason" class="label"${_scopeId2}>Motivo</label><textarea id="reason" rows="3" maxlength="500" class="field"${ssrRenderAttr("aria-invalid", !!unref(reject).errors.reason)}${_scopeId2}>${ssrInterpolate(unref(reject).reason)}</textarea>`);
                  if (unref(reject).errors.reason) {
                    _push3(`<p class="error-text" role="alert"${_scopeId2}>${ssrInterpolate(unref(reject).errors.reason)}</p>`);
                  } else {
                    _push3(`<!---->`);
                  }
                } else {
                  return [
                    createVNode("label", {
                      for: "reason",
                      class: "label"
                    }, "Motivo"),
                    withDirectives(createVNode("textarea", {
                      id: "reason",
                      "onUpdate:modelValue": ($event) => unref(reject).reason = $event,
                      rows: "3",
                      maxlength: "500",
                      class: "field",
                      "aria-invalid": !!unref(reject).errors.reason
                    }, null, 8, ["onUpdate:modelValue", "aria-invalid"]), [
                      [vModelText, unref(reject).reason]
                    ]),
                    unref(reject).errors.reason ? (openBlock(), createBlock("p", {
                      key: 0,
                      class: "error-text",
                      role: "alert"
                    }, toDisplayString(unref(reject).errors.reason), 1)) : createCommentVNode("", true)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode("div", { class: "mx-auto max-w-5xl" }, [
                createVNode(unref(Link), {
                  href: "/admin/solicitacoes",
                  class: "text-sm font-semibold text-action-700 hover:underline"
                }, {
                  default: withCtx(() => [
                    createTextVNode("← Solicitações")
                  ]),
                  _: 1
                }),
                createVNode("header", { class: "mt-2 mb-5 flex flex-wrap items-start justify-between gap-3" }, [
                  createVNode("div", { class: "flex items-start gap-4" }, [
                    createVNode(_sfc_main$2, {
                      name: unref(s).company.name,
                      url: unref(s).company.logo,
                      size: "lg"
                    }, null, 8, ["name", "url"]),
                    createVNode("div", null, [
                      createVNode("p", { class: "text-xs font-bold tracking-widest text-subtle uppercase" }, "Solicitação #" + toDisplayString(unref(s).id) + " · " + toDisplayString(unref(s).status_label), 1),
                      createVNode("h1", { class: "mt-1 text-2xl font-extrabold text-ink" }, toDisplayString(unref(s).title), 1),
                      createVNode("p", { class: "text-muted" }, toDisplayString(unref(s).company.name), 1)
                    ])
                  ]),
                  unref(s).status === "pending" ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "flex flex-wrap gap-2"
                  }, [
                    createVNode("button", {
                      type: "button",
                      class: "btn-secondary text-danger-700 hover:border-danger-700 hover:bg-danger-50",
                      onClick: ($event) => rejecting.value = true
                    }, [
                      createVNode(unref(X), {
                        class: "size-4",
                        "aria-hidden": "true"
                      }),
                      createTextVNode("Recusar")
                    ], 8, ["onClick"]),
                    createVNode("button", {
                      type: "button",
                      class: "btn-primary",
                      onClick: ($event) => approving.value = true
                    }, [
                      createVNode(unref(Check), {
                        class: "size-4",
                        "aria-hidden": "true"
                      }),
                      createTextVNode("Aprovar e criar rascunho")
                    ], 8, ["onClick"])
                  ])) : unref(s).job_edit_url ? (openBlock(), createBlock(unref(Link), {
                    key: 1,
                    href: unref(s).job_edit_url,
                    class: "btn-primary"
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(Pencil), {
                        class: "size-4",
                        "aria-hidden": "true"
                      }),
                      createTextVNode("Abrir a vaga")
                    ]),
                    _: 1
                  }, 8, ["href"])) : createCommentVNode("", true)
                ]),
                unref(s).status === "rejected" ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "mb-5 rounded-xl border border-danger-700/20 bg-danger-50 p-4 text-sm text-danger-700"
                }, [
                  createVNode("p", { class: "font-bold" }, "Recusada por " + toDisplayString(unref(s).reviewer) + " em " + toDisplayString(unref(formatDateTime)(unref(s).reviewed_at)), 1),
                  createVNode("p", { class: "mt-1" }, "Motivo: " + toDisplayString(unref(s).rejection_reason), 1)
                ])) : createCommentVNode("", true),
                unref(s).status === "approved" ? (openBlock(), createBlock("div", {
                  key: 1,
                  class: "mb-5 rounded-xl border border-success-700/20 bg-success-50 p-4 text-sm text-success-700"
                }, [
                  createVNode("p", { class: "font-bold" }, "Aprovada por " + toDisplayString(unref(s).reviewer) + " em " + toDisplayString(unref(formatDateTime)(unref(s).reviewed_at)), 1)
                ])) : createCommentVNode("", true),
                createVNode("div", { class: "grid gap-6 lg:grid-cols-[1fr_20rem] lg:items-start" }, [
                  createVNode("div", { class: "space-y-4" }, [
                    createVNode("section", {
                      class: "card p-5",
                      "aria-labelledby": "d-resumo"
                    }, [
                      createVNode("h2", {
                        id: "d-resumo",
                        class: "mb-3 text-lg font-extrabold text-ink"
                      }, "Resumo"),
                      createVNode("dl", { class: "grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2" }, [
                        createVNode("div", null, [
                          createVNode("dt", { class: "text-muted" }, "Categoria"),
                          createVNode("dd", { class: "font-semibold text-ink" }, toDisplayString(unref(s).category), 1)
                        ]),
                        createVNode("div", null, [
                          createVNode("dt", { class: "text-muted" }, "Modalidade"),
                          createVNode("dd", { class: "font-semibold text-ink" }, toDisplayString(unref(s).work_mode), 1)
                        ]),
                        createVNode("div", null, [
                          createVNode("dt", { class: "text-muted" }, "Contratação"),
                          createVNode("dd", { class: "font-semibold text-ink" }, toDisplayString(unref(s).employment_type), 1)
                        ]),
                        createVNode("div", null, [
                          createVNode("dt", { class: "text-muted" }, "Nível"),
                          createVNode("dd", { class: "font-semibold text-ink" }, toDisplayString(unref(s).experience_level ?? "Não informado"), 1)
                        ]),
                        createVNode("div", null, [
                          createVNode("dt", { class: "text-muted" }, "Local"),
                          createVNode("dd", { class: "font-semibold text-ink" }, toDisplayString(unref(s).location ?? "Remoto / não informado"), 1)
                        ]),
                        createVNode("div", null, [
                          createVNode("dt", { class: "text-muted" }, "Salário"),
                          createVNode("dd", { class: "font-semibold text-ink" }, toDisplayString(unref(s).salary ?? "Não informado"), 1)
                        ])
                      ])
                    ]),
                    (openBlock(true), createBlock(Fragment, null, renderList(unref(sections), (x) => {
                      return openBlock(), createBlock("section", {
                        key: x.t,
                        class: "card p-5"
                      }, [
                        createVNode("h2", { class: "mb-3 text-lg font-extrabold text-ink" }, toDisplayString(x.t), 1),
                        createVNode("div", {
                          class: "prose-job",
                          innerHTML: x.v
                        }, null, 8, ["innerHTML"])
                      ]);
                    }), 128))
                  ]),
                  createVNode("aside", { class: "space-y-4" }, [
                    createVNode("section", {
                      class: "card space-y-3 p-5",
                      "aria-labelledby": "d-cand"
                    }, [
                      createVNode("h2", {
                        id: "d-cand",
                        class: "text-lg font-extrabold text-ink"
                      }, "Candidatura"),
                      createVNode("div", { class: "flex items-center gap-2.5 text-sm font-semibold text-ink" }, [
                        unref(s).platform.logo ? (openBlock(), createBlock("img", {
                          key: 0,
                          src: unref(s).platform.logo,
                          alt: "",
                          class: "h-6 w-auto max-w-[4rem] rounded object-contain"
                        }, null, 8, ["src"])) : createCommentVNode("", true),
                        createTextVNode(toDisplayString(unref(s).platform.label), 1)
                      ]),
                      unref(s).apply_url ? (openBlock(), createBlock("a", {
                        key: 0,
                        href: unref(s).apply_url,
                        target: "_blank",
                        rel: "noopener noreferrer nofollow",
                        class: "flex items-start gap-1.5 text-sm break-all text-action-700 hover:underline"
                      }, [
                        createVNode(unref(ExternalLink), {
                          class: "mt-0.5 size-4 shrink-0",
                          "aria-hidden": "true"
                        }),
                        createTextVNode(toDisplayString(unref(s).apply_url), 1)
                      ], 8, ["href"])) : createCommentVNode("", true),
                      unref(s).apply_email ? (openBlock(), createBlock("a", {
                        key: 1,
                        href: `mailto:${unref(s).apply_email}`,
                        class: "flex items-center gap-1.5 text-sm break-all text-action-700 hover:underline"
                      }, [
                        createVNode(unref(Mail), {
                          class: "size-4 shrink-0",
                          "aria-hidden": "true"
                        }),
                        createTextVNode(toDisplayString(unref(s).apply_email), 1)
                      ], 8, ["href"])) : createCommentVNode("", true),
                      createVNode("p", { class: "text-xs text-muted" }, "Abra o link e confirme que a vaga existe e está aberta antes de aprovar.")
                    ]),
                    createVNode("section", {
                      class: "card space-y-2 p-5",
                      "aria-labelledby": "d-envio"
                    }, [
                      createVNode("h2", {
                        id: "d-envio",
                        class: "text-lg font-extrabold text-ink"
                      }, "Quem enviou"),
                      createVNode("p", { class: "text-sm font-semibold text-ink" }, toDisplayString(unref(s).submitter.name), 1),
                      createVNode("a", {
                        href: `mailto:${unref(s).submitter.email}`,
                        class: "flex items-center gap-1.5 text-sm break-all text-action-700 hover:underline"
                      }, [
                        createVNode(unref(Mail), {
                          class: "size-4 shrink-0",
                          "aria-hidden": "true"
                        }),
                        createTextVNode(toDisplayString(unref(s).submitter.email), 1)
                      ], 8, ["href"]),
                      unref(s).submitter.phone ? (openBlock(), createBlock("p", {
                        key: 0,
                        class: "flex items-center gap-1.5 text-sm text-ink"
                      }, [
                        createVNode(unref(Phone), {
                          class: "size-4 shrink-0 text-subtle",
                          "aria-hidden": "true"
                        }),
                        createTextVNode(toDisplayString(unref(s).submitter.phone), 1)
                      ])) : createCommentVNode("", true),
                      createVNode("p", { class: "text-xs text-muted" }, [
                        createTextVNode("Enviada em " + toDisplayString(unref(formatDateTime)(unref(s).created_at)), 1),
                        unref(s).submitter.ip ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                          createTextVNode(" · IP " + toDisplayString(unref(s).submitter.ip), 1)
                        ], 64)) : createCommentVNode("", true)
                      ]),
                      unref(s).company.website_url ? (openBlock(), createBlock("a", {
                        key: 1,
                        href: unref(s).company.website_url,
                        target: "_blank",
                        rel: "noopener noreferrer nofollow",
                        class: "flex items-center gap-1.5 text-sm break-all text-action-700 hover:underline"
                      }, [
                        createVNode(unref(ExternalLink), {
                          class: "size-4 shrink-0",
                          "aria-hidden": "true"
                        }),
                        createTextVNode(toDisplayString(unref(s).company.website_url), 1)
                      ], 8, ["href"])) : createCommentVNode("", true)
                    ])
                  ])
                ])
              ]),
              createVNode(_sfc_main$3, {
                open: approving.value,
                "confirm-label": "Aprovar",
                title: "Aprovar esta solicitação?",
                message: "A vaga será criada como rascunho (a empresa é cadastrada se ainda não existir). Nada vai ao ar até você publicar.",
                processing: busy.value,
                onCancel: ($event) => approving.value = false,
                onConfirm: approve
              }, null, 8, ["open", "processing", "onCancel"]),
              createVNode(_sfc_main$3, {
                open: rejecting.value,
                danger: "",
                "confirm-label": "Recusar",
                title: "Recusar esta solicitação?",
                message: "Explique o motivo para o registro interno. O logotipo enviado será apagado.",
                processing: unref(reject).processing,
                onCancel: ($event) => rejecting.value = false,
                onConfirm: doReject
              }, {
                default: withCtx(() => [
                  createVNode("label", {
                    for: "reason",
                    class: "label"
                  }, "Motivo"),
                  withDirectives(createVNode("textarea", {
                    id: "reason",
                    "onUpdate:modelValue": ($event) => unref(reject).reason = $event,
                    rows: "3",
                    maxlength: "500",
                    class: "field",
                    "aria-invalid": !!unref(reject).errors.reason
                  }, null, 8, ["onUpdate:modelValue", "aria-invalid"]), [
                    [vModelText, unref(reject).reason]
                  ]),
                  unref(reject).errors.reason ? (openBlock(), createBlock("p", {
                    key: 0,
                    class: "error-text",
                    role: "alert"
                  }, toDisplayString(unref(reject).errors.reason), 1)) : createCommentVNode("", true)
                ]),
                _: 1
              }, 8, ["open", "processing", "onCancel"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/pages/Admin/Submissions/Show.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=Show-B3Ar5iDq.js.map
