import { defineComponent, computed, mergeProps, withCtx, createVNode, resolveDynamicComponent, unref, withDirectives, vModelText, openBlock, createBlock, Fragment, renderList, toDisplayString, vModelSelect, withModifiers, createCommentVNode, createTextVNode, vModelCheckbox, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderList, ssrRenderVNode, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual } from "vue/server-renderer";
import { useForm } from "@inertiajs/vue3";
import { PenLine, ClipboardCheck, CheckCircle2, Loader2, Send, ShieldCheck } from "lucide-vue-next";
import { _ as _sfc_main$2 } from "./Breadcrumbs-C8MHcfb-.js";
import { _ as _sfc_main$3 } from "./Field-CI53GIau.js";
import { _ as _sfc_main$4 } from "./LogoField-D88DZ2aT.js";
import { _ as _sfc_main$1 } from "./PublicLayout-DWxlUL7J.js";
import "./FlashMessages-mTMlubKC.js";
import "./SeoHead-BMQcIEwx.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "SubmitJob",
  __ssrInlineRender: true,
  props: {
    categories: {},
    platforms: {},
    options: {},
    seo: {}
  },
  setup(__props) {
    const props = __props;
    const form = useForm({
      submitter_name: "",
      submitter_email: "",
      submitter_phone: "",
      company_name: "",
      company_website_url: "",
      company_logo: null,
      title: "",
      category_id: "",
      work_mode: "onsite",
      employment_type: "clt",
      experience_level: "",
      city: "",
      state: "",
      description: "",
      requirements: "",
      benefits: "",
      salary_min: "",
      salary_max: "",
      salary_period: "",
      platform_id: props.platforms[0]?.value ?? "",
      apply_url: "",
      apply_email: "",
      authorized: false,
      website_confirm: ""
      // armadilha para robôs
    });
    const isRemote = computed(() => form.work_mode === "remote");
    const hasSalary = computed(() => form.salary_min !== "" || form.salary_max !== "");
    const byEmail = computed(() => !!props.platforms.find((p) => p.value === form.platform_id)?.uses_email);
    const errorCount = computed(() => Object.keys(form.errors).length);
    const submit = () => form.post("/publicar-vaga", {
      forceFormData: true,
      preserveScroll: true,
      onError: () => document.getElementById("resumo-erros")?.focus()
    });
    const steps = [
      { icon: PenLine, t: "Você envia", d: "Preencha os dados da vaga. Não precisa de cadastro." },
      { icon: ClipboardCheck, t: "Nós analisamos", d: "Nossa equipe confere as informações e o link de candidatura." },
      { icon: CheckCircle2, t: "Publicamos", d: "Aprovada, a vaga entra no ar com página própria e link para compartilhar." }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$1, mergeProps({ seo: __props.seo }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="container-page py-6 sm:py-10"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$2, { items: [{ label: "Início", url: "/" }, { label: "Publicar uma vaga", url: null }] }, null, _parent2, _scopeId));
            _push2(`<header class="mt-5 max-w-3xl"${_scopeId}><h1 class="t-h1 text-ink"${_scopeId}>Publicar uma vaga</h1><p class="mt-2 text-muted"${_scopeId}>Divulgue sua oportunidade para quem busca emprego todos os dias. A divulgação é gratuita e passa por uma análise antes de ir ao ar.</p></header><ol class="mt-6 grid gap-3 sm:grid-cols-3" aria-label="Como funciona"${_scopeId}><!--[-->`);
            ssrRenderList(steps, (s, i) => {
              _push2(`<li class="card flex items-start gap-3 p-4"${_scopeId}><span class="grid size-9 shrink-0 place-items-center rounded-xl bg-action-50 text-action-700"${_scopeId}>`);
              ssrRenderVNode(_push2, createVNode(resolveDynamicComponent(s.icon), {
                class: "size-5",
                "aria-hidden": "true"
              }, null), _parent2, _scopeId);
              _push2(`</span><span${_scopeId}><span class="block text-sm font-bold text-ink"${_scopeId}>${ssrInterpolate(i + 1)}. ${ssrInterpolate(s.t)}</span><span class="text-xs text-muted"${_scopeId}>${ssrInterpolate(s.d)}</span></span></li>`);
            });
            _push2(`<!--]--></ol><form class="mt-8 max-w-3xl space-y-6"${_scopeId}>`);
            if (errorCount.value) {
              _push2(`<div id="resumo-erros" tabindex="-1" role="alert" class="rounded-xl border border-danger-700/25 bg-danger-50 p-4 text-sm text-danger-700"${_scopeId}><p class="font-bold"${_scopeId}>Corrija ${ssrInterpolate(errorCount.value)} ${ssrInterpolate(errorCount.value === 1 ? "campo" : "campos")} para enviar:</p><ul class="mt-1 list-disc pl-5"${_scopeId}><!--[-->`);
              ssrRenderList(unref(form).errors, (msg, key) => {
                _push2(`<li${_scopeId}>${ssrInterpolate(msg)}</li>`);
              });
              _push2(`<!--]--></ul></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true"${_scopeId}><label for="website_confirm"${_scopeId}>Não preencha este campo</label><input id="website_confirm"${ssrRenderAttr("value", unref(form).website_confirm)} type="text" tabindex="-1" autocomplete="off"${_scopeId}></div><section class="card space-y-4 p-5 sm:p-6" aria-labelledby="s-you"${_scopeId}><div${_scopeId}><h2 id="s-you" class="t-h2 text-ink"${_scopeId}>Seus dados</h2><p class="text-sm text-muted"${_scopeId}>Usados só para a nossa equipe falar com você sobre a vaga. Não são exibidos no site.</p></div><div class="grid gap-4 sm:grid-cols-2"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$3, {
              id: "submitter_name",
              label: "Seu nome",
              error: unref(form).errors.submitter_name,
              required: ""
            }, {
              default: withCtx(({ describedBy, invalid }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<input id="submitter_name"${ssrRenderAttr("value", unref(form).submitter_name)} required maxlength="120" autocomplete="name" class="field"${ssrRenderAttr("aria-invalid", invalid)}${ssrRenderAttr("aria-describedby", describedBy)}${_scopeId2}>`);
                } else {
                  return [
                    withDirectives(createVNode("input", {
                      id: "submitter_name",
                      "onUpdate:modelValue": ($event) => unref(form).submitter_name = $event,
                      required: "",
                      maxlength: "120",
                      autocomplete: "name",
                      class: "field",
                      "aria-invalid": invalid,
                      "aria-describedby": describedBy
                    }, null, 8, ["onUpdate:modelValue", "aria-invalid", "aria-describedby"]), [
                      [vModelText, unref(form).submitter_name]
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$3, {
              id: "submitter_email",
              label: "Seu e-mail",
              error: unref(form).errors.submitter_email,
              required: ""
            }, {
              default: withCtx(({ describedBy, invalid }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<input id="submitter_email"${ssrRenderAttr("value", unref(form).submitter_email)} type="email" required maxlength="190" autocomplete="email" class="field"${ssrRenderAttr("aria-invalid", invalid)}${ssrRenderAttr("aria-describedby", describedBy)}${_scopeId2}>`);
                } else {
                  return [
                    withDirectives(createVNode("input", {
                      id: "submitter_email",
                      "onUpdate:modelValue": ($event) => unref(form).submitter_email = $event,
                      type: "email",
                      required: "",
                      maxlength: "190",
                      autocomplete: "email",
                      class: "field",
                      "aria-invalid": invalid,
                      "aria-describedby": describedBy
                    }, null, 8, ["onUpdate:modelValue", "aria-invalid", "aria-describedby"]), [
                      [vModelText, unref(form).submitter_email]
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$3, {
              id: "submitter_phone",
              label: "Telefone / WhatsApp",
              error: unref(form).errors.submitter_phone,
              hint: "Opcional"
            }, {
              default: withCtx(({ describedBy, invalid }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<input id="submitter_phone"${ssrRenderAttr("value", unref(form).submitter_phone)} type="tel" maxlength="30" autocomplete="tel" class="field"${ssrRenderAttr("aria-invalid", invalid)}${ssrRenderAttr("aria-describedby", describedBy)}${_scopeId2}>`);
                } else {
                  return [
                    withDirectives(createVNode("input", {
                      id: "submitter_phone",
                      "onUpdate:modelValue": ($event) => unref(form).submitter_phone = $event,
                      type: "tel",
                      maxlength: "30",
                      autocomplete: "tel",
                      class: "field",
                      "aria-invalid": invalid,
                      "aria-describedby": describedBy
                    }, null, 8, ["onUpdate:modelValue", "aria-invalid", "aria-describedby"]), [
                      [vModelText, unref(form).submitter_phone]
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></section><section class="card space-y-4 p-5 sm:p-6" aria-labelledby="s-company"${_scopeId}><h2 id="s-company" class="t-h2 text-ink"${_scopeId}>Empresa</h2><div class="grid gap-4 sm:grid-cols-2"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$3, {
              id: "company_name",
              label: "Nome da empresa",
              error: unref(form).errors.company_name,
              required: ""
            }, {
              default: withCtx(({ describedBy, invalid }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<input id="company_name"${ssrRenderAttr("value", unref(form).company_name)} required maxlength="160" autocomplete="organization" class="field"${ssrRenderAttr("aria-invalid", invalid)}${ssrRenderAttr("aria-describedby", describedBy)}${_scopeId2}>`);
                } else {
                  return [
                    withDirectives(createVNode("input", {
                      id: "company_name",
                      "onUpdate:modelValue": ($event) => unref(form).company_name = $event,
                      required: "",
                      maxlength: "160",
                      autocomplete: "organization",
                      class: "field",
                      "aria-invalid": invalid,
                      "aria-describedby": describedBy
                    }, null, 8, ["onUpdate:modelValue", "aria-invalid", "aria-describedby"]), [
                      [vModelText, unref(form).company_name]
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$3, {
              id: "company_website_url",
              label: "Site da empresa",
              error: unref(form).errors.company_website_url,
              hint: "Opcional. Comece com https://"
            }, {
              default: withCtx(({ describedBy, invalid }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<input id="company_website_url"${ssrRenderAttr("value", unref(form).company_website_url)} type="url" class="field" placeholder="https://"${ssrRenderAttr("aria-invalid", invalid)}${ssrRenderAttr("aria-describedby", describedBy)}${_scopeId2}>`);
                } else {
                  return [
                    withDirectives(createVNode("input", {
                      id: "company_website_url",
                      "onUpdate:modelValue": ($event) => unref(form).company_website_url = $event,
                      type: "url",
                      class: "field",
                      placeholder: "https://",
                      "aria-invalid": invalid,
                      "aria-describedby": describedBy
                    }, null, 8, ["onUpdate:modelValue", "aria-invalid", "aria-describedby"]), [
                      [vModelText, unref(form).company_website_url]
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
            _push2(ssrRenderComponent(_sfc_main$4, {
              id: "company_logo",
              url: "",
              file: unref(form).company_logo,
              "onUpdate:file": ($event) => unref(form).company_logo = $event,
              remove: false,
              "hide-url": "",
              error: unref(form).errors.company_logo,
              name: unref(form).company_name
            }, null, _parent2, _scopeId));
            _push2(`</section><section class="card space-y-4 p-5 sm:p-6" aria-labelledby="s-job"${_scopeId}><h2 id="s-job" class="t-h2 text-ink"${_scopeId}>A vaga</h2>`);
            _push2(ssrRenderComponent(_sfc_main$3, {
              id: "title",
              label: "Título da vaga",
              error: unref(form).errors.title,
              required: ""
            }, {
              default: withCtx(({ describedBy, invalid }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<input id="title"${ssrRenderAttr("value", unref(form).title)} required minlength="3" maxlength="180" class="field" placeholder="Ex.: Analista de Suporte"${ssrRenderAttr("aria-invalid", invalid)}${ssrRenderAttr("aria-describedby", describedBy)}${_scopeId2}>`);
                } else {
                  return [
                    withDirectives(createVNode("input", {
                      id: "title",
                      "onUpdate:modelValue": ($event) => unref(form).title = $event,
                      required: "",
                      minlength: "3",
                      maxlength: "180",
                      class: "field",
                      placeholder: "Ex.: Analista de Suporte",
                      "aria-invalid": invalid,
                      "aria-describedby": describedBy
                    }, null, 8, ["onUpdate:modelValue", "aria-invalid", "aria-describedby"]), [
                      [vModelText, unref(form).title]
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`<div class="grid gap-4 sm:grid-cols-2"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$3, {
              id: "category_id",
              label: "Categoria",
              error: unref(form).errors.category_id,
              required: ""
            }, {
              default: withCtx(({ describedBy, invalid }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<select id="category_id" required class="field"${ssrRenderAttr("aria-invalid", invalid)}${ssrRenderAttr("aria-describedby", describedBy)}${_scopeId2}><option value="" disabled${ssrIncludeBooleanAttr(Array.isArray(unref(form).category_id) ? ssrLooseContain(unref(form).category_id, "") : ssrLooseEqual(unref(form).category_id, "")) ? " selected" : ""}${_scopeId2}>Selecione…</option><!--[-->`);
                  ssrRenderList(__props.categories, (c) => {
                    _push3(`<option${ssrRenderAttr("value", c.id)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).category_id) ? ssrLooseContain(unref(form).category_id, c.id) : ssrLooseEqual(unref(form).category_id, c.id)) ? " selected" : ""}${_scopeId2}>${ssrInterpolate(c.name)}</option>`);
                  });
                  _push3(`<!--]--></select>`);
                } else {
                  return [
                    withDirectives(createVNode("select", {
                      id: "category_id",
                      "onUpdate:modelValue": ($event) => unref(form).category_id = $event,
                      required: "",
                      class: "field",
                      "aria-invalid": invalid,
                      "aria-describedby": describedBy
                    }, [
                      createVNode("option", {
                        value: "",
                        disabled: ""
                      }, "Selecione…"),
                      (openBlock(true), createBlock(Fragment, null, renderList(__props.categories, (c) => {
                        return openBlock(), createBlock("option", {
                          key: c.id,
                          value: c.id
                        }, toDisplayString(c.name), 9, ["value"]);
                      }), 128))
                    ], 8, ["onUpdate:modelValue", "aria-invalid", "aria-describedby"]), [
                      [vModelSelect, unref(form).category_id]
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$3, {
              id: "work_mode",
              label: "Modalidade",
              error: unref(form).errors.work_mode,
              required: ""
            }, {
              default: withCtx(({ describedBy, invalid }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<select id="work_mode" class="field"${ssrRenderAttr("aria-invalid", invalid)}${ssrRenderAttr("aria-describedby", describedBy)}${_scopeId2}><!--[-->`);
                  ssrRenderList(__props.options.work_modes, (o) => {
                    _push3(`<option${ssrRenderAttr("value", o.value)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).work_mode) ? ssrLooseContain(unref(form).work_mode, o.value) : ssrLooseEqual(unref(form).work_mode, o.value)) ? " selected" : ""}${_scopeId2}>${ssrInterpolate(o.label)}</option>`);
                  });
                  _push3(`<!--]--></select>`);
                } else {
                  return [
                    withDirectives(createVNode("select", {
                      id: "work_mode",
                      "onUpdate:modelValue": ($event) => unref(form).work_mode = $event,
                      class: "field",
                      "aria-invalid": invalid,
                      "aria-describedby": describedBy
                    }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(__props.options.work_modes, (o) => {
                        return openBlock(), createBlock("option", {
                          key: o.value,
                          value: o.value
                        }, toDisplayString(o.label), 9, ["value"]);
                      }), 128))
                    ], 8, ["onUpdate:modelValue", "aria-invalid", "aria-describedby"]), [
                      [vModelSelect, unref(form).work_mode]
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$3, {
              id: "employment_type",
              label: "Tipo de contratação",
              error: unref(form).errors.employment_type,
              required: ""
            }, {
              default: withCtx(({ describedBy, invalid }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<select id="employment_type" class="field"${ssrRenderAttr("aria-invalid", invalid)}${ssrRenderAttr("aria-describedby", describedBy)}${_scopeId2}><!--[-->`);
                  ssrRenderList(__props.options.employment_types, (o) => {
                    _push3(`<option${ssrRenderAttr("value", o.value)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).employment_type) ? ssrLooseContain(unref(form).employment_type, o.value) : ssrLooseEqual(unref(form).employment_type, o.value)) ? " selected" : ""}${_scopeId2}>${ssrInterpolate(o.label)}</option>`);
                  });
                  _push3(`<!--]--></select>`);
                } else {
                  return [
                    withDirectives(createVNode("select", {
                      id: "employment_type",
                      "onUpdate:modelValue": ($event) => unref(form).employment_type = $event,
                      class: "field",
                      "aria-invalid": invalid,
                      "aria-describedby": describedBy
                    }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(__props.options.employment_types, (o) => {
                        return openBlock(), createBlock("option", {
                          key: o.value,
                          value: o.value
                        }, toDisplayString(o.label), 9, ["value"]);
                      }), 128))
                    ], 8, ["onUpdate:modelValue", "aria-invalid", "aria-describedby"]), [
                      [vModelSelect, unref(form).employment_type]
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$3, {
              id: "experience_level",
              label: "Nível de experiência",
              error: unref(form).errors.experience_level
            }, {
              default: withCtx(({ describedBy, invalid }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<select id="experience_level" class="field"${ssrRenderAttr("aria-invalid", invalid)}${ssrRenderAttr("aria-describedby", describedBy)}${_scopeId2}><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(form).experience_level) ? ssrLooseContain(unref(form).experience_level, "") : ssrLooseEqual(unref(form).experience_level, "")) ? " selected" : ""}${_scopeId2}>Não informado</option><!--[-->`);
                  ssrRenderList(__props.options.experience_levels, (o) => {
                    _push3(`<option${ssrRenderAttr("value", o.value)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).experience_level) ? ssrLooseContain(unref(form).experience_level, o.value) : ssrLooseEqual(unref(form).experience_level, o.value)) ? " selected" : ""}${_scopeId2}>${ssrInterpolate(o.label)}</option>`);
                  });
                  _push3(`<!--]--></select>`);
                } else {
                  return [
                    withDirectives(createVNode("select", {
                      id: "experience_level",
                      "onUpdate:modelValue": ($event) => unref(form).experience_level = $event,
                      class: "field",
                      "aria-invalid": invalid,
                      "aria-describedby": describedBy
                    }, [
                      createVNode("option", { value: "" }, "Não informado"),
                      (openBlock(true), createBlock(Fragment, null, renderList(__props.options.experience_levels, (o) => {
                        return openBlock(), createBlock("option", {
                          key: o.value,
                          value: o.value
                        }, toDisplayString(o.label), 9, ["value"]);
                      }), 128))
                    ], 8, ["onUpdate:modelValue", "aria-invalid", "aria-describedby"]), [
                      [vModelSelect, unref(form).experience_level]
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$3, {
              id: "city",
              label: "Cidade",
              error: unref(form).errors.city,
              required: !isRemote.value,
              hint: isRemote.value ? "Opcional para vagas remotas." : void 0
            }, {
              default: withCtx(({ describedBy, invalid }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<input id="city"${ssrRenderAttr("value", unref(form).city)} maxlength="120"${ssrIncludeBooleanAttr(!isRemote.value) ? " required" : ""} class="field"${ssrRenderAttr("aria-invalid", invalid)}${ssrRenderAttr("aria-describedby", describedBy)}${_scopeId2}>`);
                } else {
                  return [
                    withDirectives(createVNode("input", {
                      id: "city",
                      "onUpdate:modelValue": ($event) => unref(form).city = $event,
                      maxlength: "120",
                      required: !isRemote.value,
                      class: "field",
                      "aria-invalid": invalid,
                      "aria-describedby": describedBy
                    }, null, 8, ["onUpdate:modelValue", "required", "aria-invalid", "aria-describedby"]), [
                      [vModelText, unref(form).city]
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$3, {
              id: "state",
              label: "Estado (UF)",
              error: unref(form).errors.state,
              required: !isRemote.value
            }, {
              default: withCtx(({ describedBy, invalid }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<input id="state"${ssrRenderAttr("value", unref(form).state)} maxlength="2"${ssrIncludeBooleanAttr(!isRemote.value) ? " required" : ""} class="field uppercase" placeholder="SP"${ssrRenderAttr("aria-invalid", invalid)}${ssrRenderAttr("aria-describedby", describedBy)}${_scopeId2}>`);
                } else {
                  return [
                    withDirectives(createVNode("input", {
                      id: "state",
                      "onUpdate:modelValue": ($event) => unref(form).state = $event,
                      maxlength: "2",
                      required: !isRemote.value,
                      class: "field uppercase",
                      placeholder: "SP",
                      "aria-invalid": invalid,
                      "aria-describedby": describedBy
                    }, null, 8, ["onUpdate:modelValue", "required", "aria-invalid", "aria-describedby"]), [
                      [vModelText, unref(form).state]
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
            _push2(ssrRenderComponent(_sfc_main$3, {
              id: "description",
              label: "Descrição da vaga",
              error: unref(form).errors.description,
              hint: "Atividades do dia a dia, contexto da equipe e o que a pessoa vai fazer.",
              required: ""
            }, {
              default: withCtx(({ describedBy, invalid }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<textarea id="description" required rows="6" minlength="30" maxlength="20000" class="field"${ssrRenderAttr("aria-invalid", invalid)}${ssrRenderAttr("aria-describedby", describedBy)}${_scopeId2}>${ssrInterpolate(unref(form).description)}</textarea>`);
                } else {
                  return [
                    withDirectives(createVNode("textarea", {
                      id: "description",
                      "onUpdate:modelValue": ($event) => unref(form).description = $event,
                      required: "",
                      rows: "6",
                      minlength: "30",
                      maxlength: "20000",
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
            _push2(ssrRenderComponent(_sfc_main$3, {
              id: "requirements",
              label: "Requisitos",
              error: unref(form).errors.requirements,
              hint: "Opcional. Um por linha."
            }, {
              default: withCtx(({ describedBy, invalid }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<textarea id="requirements" rows="4" maxlength="20000" class="field"${ssrRenderAttr("aria-invalid", invalid)}${ssrRenderAttr("aria-describedby", describedBy)}${_scopeId2}>${ssrInterpolate(unref(form).requirements)}</textarea>`);
                } else {
                  return [
                    withDirectives(createVNode("textarea", {
                      id: "requirements",
                      "onUpdate:modelValue": ($event) => unref(form).requirements = $event,
                      rows: "4",
                      maxlength: "20000",
                      class: "field",
                      "aria-invalid": invalid,
                      "aria-describedby": describedBy
                    }, null, 8, ["onUpdate:modelValue", "aria-invalid", "aria-describedby"]), [
                      [vModelText, unref(form).requirements]
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$3, {
              id: "benefits",
              label: "Benefícios",
              error: unref(form).errors.benefits,
              hint: "Opcional."
            }, {
              default: withCtx(({ describedBy, invalid }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<textarea id="benefits" rows="3" maxlength="20000" class="field"${ssrRenderAttr("aria-invalid", invalid)}${ssrRenderAttr("aria-describedby", describedBy)}${_scopeId2}>${ssrInterpolate(unref(form).benefits)}</textarea>`);
                } else {
                  return [
                    withDirectives(createVNode("textarea", {
                      id: "benefits",
                      "onUpdate:modelValue": ($event) => unref(form).benefits = $event,
                      rows: "3",
                      maxlength: "20000",
                      class: "field",
                      "aria-invalid": invalid,
                      "aria-describedby": describedBy
                    }, null, 8, ["onUpdate:modelValue", "aria-invalid", "aria-describedby"]), [
                      [vModelText, unref(form).benefits]
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`<fieldset${_scopeId}><legend class="label"${_scopeId}>Salário <span class="font-normal text-muted"${_scopeId}>(opcional — informe só se for divulgar)</span></legend><div class="grid gap-4 sm:grid-cols-3"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$3, {
              id: "salary_min",
              label: "Mínimo (R$)",
              error: unref(form).errors.salary_min
            }, {
              default: withCtx(({ describedBy, invalid }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<input id="salary_min"${ssrRenderAttr("value", unref(form).salary_min)} type="number" min="0" step="0.01" inputmode="decimal" class="field"${ssrRenderAttr("aria-invalid", invalid)}${ssrRenderAttr("aria-describedby", describedBy)}${_scopeId2}>`);
                } else {
                  return [
                    withDirectives(createVNode("input", {
                      id: "salary_min",
                      "onUpdate:modelValue": ($event) => unref(form).salary_min = $event,
                      type: "number",
                      min: "0",
                      step: "0.01",
                      inputmode: "decimal",
                      class: "field",
                      "aria-invalid": invalid,
                      "aria-describedby": describedBy
                    }, null, 8, ["onUpdate:modelValue", "aria-invalid", "aria-describedby"]), [
                      [vModelText, unref(form).salary_min]
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$3, {
              id: "salary_max",
              label: "Máximo (R$)",
              error: unref(form).errors.salary_max
            }, {
              default: withCtx(({ describedBy, invalid }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<input id="salary_max"${ssrRenderAttr("value", unref(form).salary_max)} type="number" min="0" step="0.01" inputmode="decimal" class="field"${ssrRenderAttr("aria-invalid", invalid)}${ssrRenderAttr("aria-describedby", describedBy)}${_scopeId2}>`);
                } else {
                  return [
                    withDirectives(createVNode("input", {
                      id: "salary_max",
                      "onUpdate:modelValue": ($event) => unref(form).salary_max = $event,
                      type: "number",
                      min: "0",
                      step: "0.01",
                      inputmode: "decimal",
                      class: "field",
                      "aria-invalid": invalid,
                      "aria-describedby": describedBy
                    }, null, 8, ["onUpdate:modelValue", "aria-invalid", "aria-describedby"]), [
                      [vModelText, unref(form).salary_max]
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$3, {
              id: "salary_period",
              label: "Periodicidade",
              error: unref(form).errors.salary_period,
              required: hasSalary.value
            }, {
              default: withCtx(({ describedBy, invalid }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<select id="salary_period"${ssrIncludeBooleanAttr(hasSalary.value) ? " required" : ""} class="field"${ssrRenderAttr("aria-invalid", invalid)}${ssrRenderAttr("aria-describedby", describedBy)}${_scopeId2}><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(form).salary_period) ? ssrLooseContain(unref(form).salary_period, "") : ssrLooseEqual(unref(form).salary_period, "")) ? " selected" : ""}${_scopeId2}>—</option><!--[-->`);
                  ssrRenderList(__props.options.salary_periods, (o) => {
                    _push3(`<option${ssrRenderAttr("value", o.value)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).salary_period) ? ssrLooseContain(unref(form).salary_period, o.value) : ssrLooseEqual(unref(form).salary_period, o.value)) ? " selected" : ""}${_scopeId2}>${ssrInterpolate(o.label)}</option>`);
                  });
                  _push3(`<!--]--></select>`);
                } else {
                  return [
                    withDirectives(createVNode("select", {
                      id: "salary_period",
                      "onUpdate:modelValue": ($event) => unref(form).salary_period = $event,
                      required: hasSalary.value,
                      class: "field",
                      "aria-invalid": invalid,
                      "aria-describedby": describedBy
                    }, [
                      createVNode("option", { value: "" }, "—"),
                      (openBlock(true), createBlock(Fragment, null, renderList(__props.options.salary_periods, (o) => {
                        return openBlock(), createBlock("option", {
                          key: o.value,
                          value: o.value
                        }, toDisplayString(o.label), 9, ["value"]);
                      }), 128))
                    ], 8, ["onUpdate:modelValue", "required", "aria-invalid", "aria-describedby"]), [
                      [vModelSelect, unref(form).salary_period]
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></fieldset></section><section class="card space-y-4 p-5 sm:p-6" aria-labelledby="s-apply"${_scopeId}><div${_scopeId}><h2 id="s-apply" class="t-h2 text-ink"${_scopeId}>Como se candidatar</h2><p class="text-sm text-muted"${_scopeId}>O candidato será levado diretamente ao canal que você indicar.</p></div>`);
            _push2(ssrRenderComponent(_sfc_main$3, {
              id: "platform_id",
              label: "Plataforma de contratação",
              error: unref(form).errors.platform_id,
              required: ""
            }, {
              default: withCtx(({ describedBy, invalid }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<select id="platform_id" required class="field"${ssrRenderAttr("aria-invalid", invalid)}${ssrRenderAttr("aria-describedby", describedBy)}${_scopeId2}><!--[-->`);
                  ssrRenderList(__props.platforms, (o) => {
                    _push3(`<option${ssrRenderAttr("value", o.value)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).platform_id) ? ssrLooseContain(unref(form).platform_id, o.value) : ssrLooseEqual(unref(form).platform_id, o.value)) ? " selected" : ""}${_scopeId2}>${ssrInterpolate(o.label)}</option>`);
                  });
                  _push3(`<!--]--></select>`);
                } else {
                  return [
                    withDirectives(createVNode("select", {
                      id: "platform_id",
                      "onUpdate:modelValue": ($event) => unref(form).platform_id = $event,
                      required: "",
                      class: "field",
                      "aria-invalid": invalid,
                      "aria-describedby": describedBy
                    }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(__props.platforms, (o) => {
                        return openBlock(), createBlock("option", {
                          key: o.value,
                          value: o.value
                        }, toDisplayString(o.label), 9, ["value"]);
                      }), 128))
                    ], 8, ["onUpdate:modelValue", "aria-invalid", "aria-describedby"]), [
                      [vModelSelect, unref(form).platform_id]
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            if (byEmail.value) {
              _push2(ssrRenderComponent(_sfc_main$3, {
                id: "apply_email",
                label: "E-mail para candidaturas",
                error: unref(form).errors.apply_email,
                required: ""
              }, {
                default: withCtx(({ describedBy, invalid }, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<input id="apply_email"${ssrRenderAttr("value", unref(form).apply_email)} type="email" required maxlength="190" class="field" placeholder="rh@empresa.com.br"${ssrRenderAttr("aria-invalid", invalid)}${ssrRenderAttr("aria-describedby", describedBy)}${_scopeId2}>`);
                  } else {
                    return [
                      withDirectives(createVNode("input", {
                        id: "apply_email",
                        "onUpdate:modelValue": ($event) => unref(form).apply_email = $event,
                        type: "email",
                        required: "",
                        maxlength: "190",
                        class: "field",
                        placeholder: "rh@empresa.com.br",
                        "aria-invalid": invalid,
                        "aria-describedby": describedBy
                      }, null, 8, ["onUpdate:modelValue", "aria-invalid", "aria-describedby"]), [
                        [vModelText, unref(form).apply_email]
                      ])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2(ssrRenderComponent(_sfc_main$3, {
                id: "apply_url",
                label: "Link de candidatura",
                error: unref(form).errors.apply_url,
                hint: "Endereço da vaga na plataforma ou no site da empresa. Comece com https://",
                required: ""
              }, {
                default: withCtx(({ describedBy, invalid }, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<input id="apply_url"${ssrRenderAttr("value", unref(form).apply_url)} type="url" required maxlength="1000" class="field" placeholder="https://"${ssrRenderAttr("aria-invalid", invalid)}${ssrRenderAttr("aria-describedby", describedBy)}${_scopeId2}>`);
                  } else {
                    return [
                      withDirectives(createVNode("input", {
                        id: "apply_url",
                        "onUpdate:modelValue": ($event) => unref(form).apply_url = $event,
                        type: "url",
                        required: "",
                        maxlength: "1000",
                        class: "field",
                        placeholder: "https://",
                        "aria-invalid": invalid,
                        "aria-describedby": describedBy
                      }, null, 8, ["onUpdate:modelValue", "aria-invalid", "aria-describedby"]), [
                        [vModelText, unref(form).apply_url]
                      ])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            }
            _push2(`</section><div class="card space-y-4 p-5 sm:p-6"${_scopeId}><label class="flex items-start gap-3 text-sm"${_scopeId}><input${ssrIncludeBooleanAttr(Array.isArray(unref(form).authorized) ? ssrLooseContain(unref(form).authorized, null) : unref(form).authorized) ? " checked" : ""} type="checkbox" class="mt-0.5 size-4 shrink-0 rounded border-line-strong text-action-600"${ssrRenderAttr("aria-invalid", !!unref(form).errors.authorized)}${_scopeId}><span class="text-ink"${_scopeId}>Declaro que tenho autorização para divulgar esta vaga e que as informações são verdadeiras. Concordo com os <a href="/termos" target="_blank" class="font-semibold text-action-700 underline"${_scopeId}>Termos de uso</a> e a <a href="/privacidade" target="_blank" class="font-semibold text-action-700 underline"${_scopeId}>Política de privacidade</a>.</span></label>`);
            if (unref(form).errors.authorized) {
              _push2(`<p class="error-text" role="alert"${_scopeId}>${ssrInterpolate(unref(form).errors.authorized)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<button type="submit" class="btn-primary btn-lg w-full sm:w-auto"${ssrIncludeBooleanAttr(unref(form).processing) ? " disabled" : ""}${_scopeId}>`);
            if (unref(form).processing) {
              _push2(ssrRenderComponent(unref(Loader2), {
                class: "size-4.5 animate-spin",
                "aria-hidden": "true"
              }, null, _parent2, _scopeId));
            } else {
              _push2(ssrRenderComponent(unref(Send), {
                class: "size-4.5",
                "aria-hidden": "true"
              }, null, _parent2, _scopeId));
            }
            _push2(`${ssrInterpolate(unref(form).processing ? "Enviando…" : "Enviar para análise")}</button><p class="flex items-start gap-2 text-xs text-muted"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(ShieldCheck), {
              class: "mt-0.5 size-4 shrink-0",
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
            _push2(`A vaga só aparece no site depois de aprovada pela nossa equipe. Não cobramos nada para analisar.</p></div></form></div>`);
          } else {
            return [
              createVNode("div", { class: "container-page py-6 sm:py-10" }, [
                createVNode(_sfc_main$2, { items: [{ label: "Início", url: "/" }, { label: "Publicar uma vaga", url: null }] }),
                createVNode("header", { class: "mt-5 max-w-3xl" }, [
                  createVNode("h1", { class: "t-h1 text-ink" }, "Publicar uma vaga"),
                  createVNode("p", { class: "mt-2 text-muted" }, "Divulgue sua oportunidade para quem busca emprego todos os dias. A divulgação é gratuita e passa por uma análise antes de ir ao ar.")
                ]),
                createVNode("ol", {
                  class: "mt-6 grid gap-3 sm:grid-cols-3",
                  "aria-label": "Como funciona"
                }, [
                  (openBlock(), createBlock(Fragment, null, renderList(steps, (s, i) => {
                    return createVNode("li", {
                      key: i,
                      class: "card flex items-start gap-3 p-4"
                    }, [
                      createVNode("span", { class: "grid size-9 shrink-0 place-items-center rounded-xl bg-action-50 text-action-700" }, [
                        (openBlock(), createBlock(resolveDynamicComponent(s.icon), {
                          class: "size-5",
                          "aria-hidden": "true"
                        }))
                      ]),
                      createVNode("span", null, [
                        createVNode("span", { class: "block text-sm font-bold text-ink" }, toDisplayString(i + 1) + ". " + toDisplayString(s.t), 1),
                        createVNode("span", { class: "text-xs text-muted" }, toDisplayString(s.d), 1)
                      ])
                    ]);
                  }), 64))
                ]),
                createVNode("form", {
                  class: "mt-8 max-w-3xl space-y-6",
                  onSubmit: withModifiers(submit, ["prevent"])
                }, [
                  errorCount.value ? (openBlock(), createBlock("div", {
                    key: 0,
                    id: "resumo-erros",
                    tabindex: "-1",
                    role: "alert",
                    class: "rounded-xl border border-danger-700/25 bg-danger-50 p-4 text-sm text-danger-700"
                  }, [
                    createVNode("p", { class: "font-bold" }, "Corrija " + toDisplayString(errorCount.value) + " " + toDisplayString(errorCount.value === 1 ? "campo" : "campos") + " para enviar:", 1),
                    createVNode("ul", { class: "mt-1 list-disc pl-5" }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(unref(form).errors, (msg, key) => {
                        return openBlock(), createBlock("li", { key }, toDisplayString(msg), 1);
                      }), 128))
                    ])
                  ])) : createCommentVNode("", true),
                  createVNode("div", {
                    class: "absolute -left-[9999px] h-0 w-0 overflow-hidden",
                    "aria-hidden": "true"
                  }, [
                    createVNode("label", { for: "website_confirm" }, "Não preencha este campo"),
                    withDirectives(createVNode("input", {
                      id: "website_confirm",
                      "onUpdate:modelValue": ($event) => unref(form).website_confirm = $event,
                      type: "text",
                      tabindex: "-1",
                      autocomplete: "off"
                    }, null, 8, ["onUpdate:modelValue"]), [
                      [vModelText, unref(form).website_confirm]
                    ])
                  ]),
                  createVNode("section", {
                    class: "card space-y-4 p-5 sm:p-6",
                    "aria-labelledby": "s-you"
                  }, [
                    createVNode("div", null, [
                      createVNode("h2", {
                        id: "s-you",
                        class: "t-h2 text-ink"
                      }, "Seus dados"),
                      createVNode("p", { class: "text-sm text-muted" }, "Usados só para a nossa equipe falar com você sobre a vaga. Não são exibidos no site.")
                    ]),
                    createVNode("div", { class: "grid gap-4 sm:grid-cols-2" }, [
                      createVNode(_sfc_main$3, {
                        id: "submitter_name",
                        label: "Seu nome",
                        error: unref(form).errors.submitter_name,
                        required: ""
                      }, {
                        default: withCtx(({ describedBy, invalid }) => [
                          withDirectives(createVNode("input", {
                            id: "submitter_name",
                            "onUpdate:modelValue": ($event) => unref(form).submitter_name = $event,
                            required: "",
                            maxlength: "120",
                            autocomplete: "name",
                            class: "field",
                            "aria-invalid": invalid,
                            "aria-describedby": describedBy
                          }, null, 8, ["onUpdate:modelValue", "aria-invalid", "aria-describedby"]), [
                            [vModelText, unref(form).submitter_name]
                          ])
                        ]),
                        _: 1
                      }, 8, ["error"]),
                      createVNode(_sfc_main$3, {
                        id: "submitter_email",
                        label: "Seu e-mail",
                        error: unref(form).errors.submitter_email,
                        required: ""
                      }, {
                        default: withCtx(({ describedBy, invalid }) => [
                          withDirectives(createVNode("input", {
                            id: "submitter_email",
                            "onUpdate:modelValue": ($event) => unref(form).submitter_email = $event,
                            type: "email",
                            required: "",
                            maxlength: "190",
                            autocomplete: "email",
                            class: "field",
                            "aria-invalid": invalid,
                            "aria-describedby": describedBy
                          }, null, 8, ["onUpdate:modelValue", "aria-invalid", "aria-describedby"]), [
                            [vModelText, unref(form).submitter_email]
                          ])
                        ]),
                        _: 1
                      }, 8, ["error"]),
                      createVNode(_sfc_main$3, {
                        id: "submitter_phone",
                        label: "Telefone / WhatsApp",
                        error: unref(form).errors.submitter_phone,
                        hint: "Opcional"
                      }, {
                        default: withCtx(({ describedBy, invalid }) => [
                          withDirectives(createVNode("input", {
                            id: "submitter_phone",
                            "onUpdate:modelValue": ($event) => unref(form).submitter_phone = $event,
                            type: "tel",
                            maxlength: "30",
                            autocomplete: "tel",
                            class: "field",
                            "aria-invalid": invalid,
                            "aria-describedby": describedBy
                          }, null, 8, ["onUpdate:modelValue", "aria-invalid", "aria-describedby"]), [
                            [vModelText, unref(form).submitter_phone]
                          ])
                        ]),
                        _: 1
                      }, 8, ["error"])
                    ])
                  ]),
                  createVNode("section", {
                    class: "card space-y-4 p-5 sm:p-6",
                    "aria-labelledby": "s-company"
                  }, [
                    createVNode("h2", {
                      id: "s-company",
                      class: "t-h2 text-ink"
                    }, "Empresa"),
                    createVNode("div", { class: "grid gap-4 sm:grid-cols-2" }, [
                      createVNode(_sfc_main$3, {
                        id: "company_name",
                        label: "Nome da empresa",
                        error: unref(form).errors.company_name,
                        required: ""
                      }, {
                        default: withCtx(({ describedBy, invalid }) => [
                          withDirectives(createVNode("input", {
                            id: "company_name",
                            "onUpdate:modelValue": ($event) => unref(form).company_name = $event,
                            required: "",
                            maxlength: "160",
                            autocomplete: "organization",
                            class: "field",
                            "aria-invalid": invalid,
                            "aria-describedby": describedBy
                          }, null, 8, ["onUpdate:modelValue", "aria-invalid", "aria-describedby"]), [
                            [vModelText, unref(form).company_name]
                          ])
                        ]),
                        _: 1
                      }, 8, ["error"]),
                      createVNode(_sfc_main$3, {
                        id: "company_website_url",
                        label: "Site da empresa",
                        error: unref(form).errors.company_website_url,
                        hint: "Opcional. Comece com https://"
                      }, {
                        default: withCtx(({ describedBy, invalid }) => [
                          withDirectives(createVNode("input", {
                            id: "company_website_url",
                            "onUpdate:modelValue": ($event) => unref(form).company_website_url = $event,
                            type: "url",
                            class: "field",
                            placeholder: "https://",
                            "aria-invalid": invalid,
                            "aria-describedby": describedBy
                          }, null, 8, ["onUpdate:modelValue", "aria-invalid", "aria-describedby"]), [
                            [vModelText, unref(form).company_website_url]
                          ])
                        ]),
                        _: 1
                      }, 8, ["error"])
                    ]),
                    createVNode(_sfc_main$4, {
                      id: "company_logo",
                      url: "",
                      file: unref(form).company_logo,
                      "onUpdate:file": ($event) => unref(form).company_logo = $event,
                      remove: false,
                      "hide-url": "",
                      error: unref(form).errors.company_logo,
                      name: unref(form).company_name
                    }, null, 8, ["file", "onUpdate:file", "error", "name"])
                  ]),
                  createVNode("section", {
                    class: "card space-y-4 p-5 sm:p-6",
                    "aria-labelledby": "s-job"
                  }, [
                    createVNode("h2", {
                      id: "s-job",
                      class: "t-h2 text-ink"
                    }, "A vaga"),
                    createVNode(_sfc_main$3, {
                      id: "title",
                      label: "Título da vaga",
                      error: unref(form).errors.title,
                      required: ""
                    }, {
                      default: withCtx(({ describedBy, invalid }) => [
                        withDirectives(createVNode("input", {
                          id: "title",
                          "onUpdate:modelValue": ($event) => unref(form).title = $event,
                          required: "",
                          minlength: "3",
                          maxlength: "180",
                          class: "field",
                          placeholder: "Ex.: Analista de Suporte",
                          "aria-invalid": invalid,
                          "aria-describedby": describedBy
                        }, null, 8, ["onUpdate:modelValue", "aria-invalid", "aria-describedby"]), [
                          [vModelText, unref(form).title]
                        ])
                      ]),
                      _: 1
                    }, 8, ["error"]),
                    createVNode("div", { class: "grid gap-4 sm:grid-cols-2" }, [
                      createVNode(_sfc_main$3, {
                        id: "category_id",
                        label: "Categoria",
                        error: unref(form).errors.category_id,
                        required: ""
                      }, {
                        default: withCtx(({ describedBy, invalid }) => [
                          withDirectives(createVNode("select", {
                            id: "category_id",
                            "onUpdate:modelValue": ($event) => unref(form).category_id = $event,
                            required: "",
                            class: "field",
                            "aria-invalid": invalid,
                            "aria-describedby": describedBy
                          }, [
                            createVNode("option", {
                              value: "",
                              disabled: ""
                            }, "Selecione…"),
                            (openBlock(true), createBlock(Fragment, null, renderList(__props.categories, (c) => {
                              return openBlock(), createBlock("option", {
                                key: c.id,
                                value: c.id
                              }, toDisplayString(c.name), 9, ["value"]);
                            }), 128))
                          ], 8, ["onUpdate:modelValue", "aria-invalid", "aria-describedby"]), [
                            [vModelSelect, unref(form).category_id]
                          ])
                        ]),
                        _: 1
                      }, 8, ["error"]),
                      createVNode(_sfc_main$3, {
                        id: "work_mode",
                        label: "Modalidade",
                        error: unref(form).errors.work_mode,
                        required: ""
                      }, {
                        default: withCtx(({ describedBy, invalid }) => [
                          withDirectives(createVNode("select", {
                            id: "work_mode",
                            "onUpdate:modelValue": ($event) => unref(form).work_mode = $event,
                            class: "field",
                            "aria-invalid": invalid,
                            "aria-describedby": describedBy
                          }, [
                            (openBlock(true), createBlock(Fragment, null, renderList(__props.options.work_modes, (o) => {
                              return openBlock(), createBlock("option", {
                                key: o.value,
                                value: o.value
                              }, toDisplayString(o.label), 9, ["value"]);
                            }), 128))
                          ], 8, ["onUpdate:modelValue", "aria-invalid", "aria-describedby"]), [
                            [vModelSelect, unref(form).work_mode]
                          ])
                        ]),
                        _: 1
                      }, 8, ["error"]),
                      createVNode(_sfc_main$3, {
                        id: "employment_type",
                        label: "Tipo de contratação",
                        error: unref(form).errors.employment_type,
                        required: ""
                      }, {
                        default: withCtx(({ describedBy, invalid }) => [
                          withDirectives(createVNode("select", {
                            id: "employment_type",
                            "onUpdate:modelValue": ($event) => unref(form).employment_type = $event,
                            class: "field",
                            "aria-invalid": invalid,
                            "aria-describedby": describedBy
                          }, [
                            (openBlock(true), createBlock(Fragment, null, renderList(__props.options.employment_types, (o) => {
                              return openBlock(), createBlock("option", {
                                key: o.value,
                                value: o.value
                              }, toDisplayString(o.label), 9, ["value"]);
                            }), 128))
                          ], 8, ["onUpdate:modelValue", "aria-invalid", "aria-describedby"]), [
                            [vModelSelect, unref(form).employment_type]
                          ])
                        ]),
                        _: 1
                      }, 8, ["error"]),
                      createVNode(_sfc_main$3, {
                        id: "experience_level",
                        label: "Nível de experiência",
                        error: unref(form).errors.experience_level
                      }, {
                        default: withCtx(({ describedBy, invalid }) => [
                          withDirectives(createVNode("select", {
                            id: "experience_level",
                            "onUpdate:modelValue": ($event) => unref(form).experience_level = $event,
                            class: "field",
                            "aria-invalid": invalid,
                            "aria-describedby": describedBy
                          }, [
                            createVNode("option", { value: "" }, "Não informado"),
                            (openBlock(true), createBlock(Fragment, null, renderList(__props.options.experience_levels, (o) => {
                              return openBlock(), createBlock("option", {
                                key: o.value,
                                value: o.value
                              }, toDisplayString(o.label), 9, ["value"]);
                            }), 128))
                          ], 8, ["onUpdate:modelValue", "aria-invalid", "aria-describedby"]), [
                            [vModelSelect, unref(form).experience_level]
                          ])
                        ]),
                        _: 1
                      }, 8, ["error"]),
                      createVNode(_sfc_main$3, {
                        id: "city",
                        label: "Cidade",
                        error: unref(form).errors.city,
                        required: !isRemote.value,
                        hint: isRemote.value ? "Opcional para vagas remotas." : void 0
                      }, {
                        default: withCtx(({ describedBy, invalid }) => [
                          withDirectives(createVNode("input", {
                            id: "city",
                            "onUpdate:modelValue": ($event) => unref(form).city = $event,
                            maxlength: "120",
                            required: !isRemote.value,
                            class: "field",
                            "aria-invalid": invalid,
                            "aria-describedby": describedBy
                          }, null, 8, ["onUpdate:modelValue", "required", "aria-invalid", "aria-describedby"]), [
                            [vModelText, unref(form).city]
                          ])
                        ]),
                        _: 1
                      }, 8, ["error", "required", "hint"]),
                      createVNode(_sfc_main$3, {
                        id: "state",
                        label: "Estado (UF)",
                        error: unref(form).errors.state,
                        required: !isRemote.value
                      }, {
                        default: withCtx(({ describedBy, invalid }) => [
                          withDirectives(createVNode("input", {
                            id: "state",
                            "onUpdate:modelValue": ($event) => unref(form).state = $event,
                            maxlength: "2",
                            required: !isRemote.value,
                            class: "field uppercase",
                            placeholder: "SP",
                            "aria-invalid": invalid,
                            "aria-describedby": describedBy
                          }, null, 8, ["onUpdate:modelValue", "required", "aria-invalid", "aria-describedby"]), [
                            [vModelText, unref(form).state]
                          ])
                        ]),
                        _: 1
                      }, 8, ["error", "required"])
                    ]),
                    createVNode(_sfc_main$3, {
                      id: "description",
                      label: "Descrição da vaga",
                      error: unref(form).errors.description,
                      hint: "Atividades do dia a dia, contexto da equipe e o que a pessoa vai fazer.",
                      required: ""
                    }, {
                      default: withCtx(({ describedBy, invalid }) => [
                        withDirectives(createVNode("textarea", {
                          id: "description",
                          "onUpdate:modelValue": ($event) => unref(form).description = $event,
                          required: "",
                          rows: "6",
                          minlength: "30",
                          maxlength: "20000",
                          class: "field",
                          "aria-invalid": invalid,
                          "aria-describedby": describedBy
                        }, null, 8, ["onUpdate:modelValue", "aria-invalid", "aria-describedby"]), [
                          [vModelText, unref(form).description]
                        ])
                      ]),
                      _: 1
                    }, 8, ["error"]),
                    createVNode(_sfc_main$3, {
                      id: "requirements",
                      label: "Requisitos",
                      error: unref(form).errors.requirements,
                      hint: "Opcional. Um por linha."
                    }, {
                      default: withCtx(({ describedBy, invalid }) => [
                        withDirectives(createVNode("textarea", {
                          id: "requirements",
                          "onUpdate:modelValue": ($event) => unref(form).requirements = $event,
                          rows: "4",
                          maxlength: "20000",
                          class: "field",
                          "aria-invalid": invalid,
                          "aria-describedby": describedBy
                        }, null, 8, ["onUpdate:modelValue", "aria-invalid", "aria-describedby"]), [
                          [vModelText, unref(form).requirements]
                        ])
                      ]),
                      _: 1
                    }, 8, ["error"]),
                    createVNode(_sfc_main$3, {
                      id: "benefits",
                      label: "Benefícios",
                      error: unref(form).errors.benefits,
                      hint: "Opcional."
                    }, {
                      default: withCtx(({ describedBy, invalid }) => [
                        withDirectives(createVNode("textarea", {
                          id: "benefits",
                          "onUpdate:modelValue": ($event) => unref(form).benefits = $event,
                          rows: "3",
                          maxlength: "20000",
                          class: "field",
                          "aria-invalid": invalid,
                          "aria-describedby": describedBy
                        }, null, 8, ["onUpdate:modelValue", "aria-invalid", "aria-describedby"]), [
                          [vModelText, unref(form).benefits]
                        ])
                      ]),
                      _: 1
                    }, 8, ["error"]),
                    createVNode("fieldset", null, [
                      createVNode("legend", { class: "label" }, [
                        createTextVNode("Salário "),
                        createVNode("span", { class: "font-normal text-muted" }, "(opcional — informe só se for divulgar)")
                      ]),
                      createVNode("div", { class: "grid gap-4 sm:grid-cols-3" }, [
                        createVNode(_sfc_main$3, {
                          id: "salary_min",
                          label: "Mínimo (R$)",
                          error: unref(form).errors.salary_min
                        }, {
                          default: withCtx(({ describedBy, invalid }) => [
                            withDirectives(createVNode("input", {
                              id: "salary_min",
                              "onUpdate:modelValue": ($event) => unref(form).salary_min = $event,
                              type: "number",
                              min: "0",
                              step: "0.01",
                              inputmode: "decimal",
                              class: "field",
                              "aria-invalid": invalid,
                              "aria-describedby": describedBy
                            }, null, 8, ["onUpdate:modelValue", "aria-invalid", "aria-describedby"]), [
                              [vModelText, unref(form).salary_min]
                            ])
                          ]),
                          _: 1
                        }, 8, ["error"]),
                        createVNode(_sfc_main$3, {
                          id: "salary_max",
                          label: "Máximo (R$)",
                          error: unref(form).errors.salary_max
                        }, {
                          default: withCtx(({ describedBy, invalid }) => [
                            withDirectives(createVNode("input", {
                              id: "salary_max",
                              "onUpdate:modelValue": ($event) => unref(form).salary_max = $event,
                              type: "number",
                              min: "0",
                              step: "0.01",
                              inputmode: "decimal",
                              class: "field",
                              "aria-invalid": invalid,
                              "aria-describedby": describedBy
                            }, null, 8, ["onUpdate:modelValue", "aria-invalid", "aria-describedby"]), [
                              [vModelText, unref(form).salary_max]
                            ])
                          ]),
                          _: 1
                        }, 8, ["error"]),
                        createVNode(_sfc_main$3, {
                          id: "salary_period",
                          label: "Periodicidade",
                          error: unref(form).errors.salary_period,
                          required: hasSalary.value
                        }, {
                          default: withCtx(({ describedBy, invalid }) => [
                            withDirectives(createVNode("select", {
                              id: "salary_period",
                              "onUpdate:modelValue": ($event) => unref(form).salary_period = $event,
                              required: hasSalary.value,
                              class: "field",
                              "aria-invalid": invalid,
                              "aria-describedby": describedBy
                            }, [
                              createVNode("option", { value: "" }, "—"),
                              (openBlock(true), createBlock(Fragment, null, renderList(__props.options.salary_periods, (o) => {
                                return openBlock(), createBlock("option", {
                                  key: o.value,
                                  value: o.value
                                }, toDisplayString(o.label), 9, ["value"]);
                              }), 128))
                            ], 8, ["onUpdate:modelValue", "required", "aria-invalid", "aria-describedby"]), [
                              [vModelSelect, unref(form).salary_period]
                            ])
                          ]),
                          _: 1
                        }, 8, ["error", "required"])
                      ])
                    ])
                  ]),
                  createVNode("section", {
                    class: "card space-y-4 p-5 sm:p-6",
                    "aria-labelledby": "s-apply"
                  }, [
                    createVNode("div", null, [
                      createVNode("h2", {
                        id: "s-apply",
                        class: "t-h2 text-ink"
                      }, "Como se candidatar"),
                      createVNode("p", { class: "text-sm text-muted" }, "O candidato será levado diretamente ao canal que você indicar.")
                    ]),
                    createVNode(_sfc_main$3, {
                      id: "platform_id",
                      label: "Plataforma de contratação",
                      error: unref(form).errors.platform_id,
                      required: ""
                    }, {
                      default: withCtx(({ describedBy, invalid }) => [
                        withDirectives(createVNode("select", {
                          id: "platform_id",
                          "onUpdate:modelValue": ($event) => unref(form).platform_id = $event,
                          required: "",
                          class: "field",
                          "aria-invalid": invalid,
                          "aria-describedby": describedBy
                        }, [
                          (openBlock(true), createBlock(Fragment, null, renderList(__props.platforms, (o) => {
                            return openBlock(), createBlock("option", {
                              key: o.value,
                              value: o.value
                            }, toDisplayString(o.label), 9, ["value"]);
                          }), 128))
                        ], 8, ["onUpdate:modelValue", "aria-invalid", "aria-describedby"]), [
                          [vModelSelect, unref(form).platform_id]
                        ])
                      ]),
                      _: 1
                    }, 8, ["error"]),
                    byEmail.value ? (openBlock(), createBlock(_sfc_main$3, {
                      key: 0,
                      id: "apply_email",
                      label: "E-mail para candidaturas",
                      error: unref(form).errors.apply_email,
                      required: ""
                    }, {
                      default: withCtx(({ describedBy, invalid }) => [
                        withDirectives(createVNode("input", {
                          id: "apply_email",
                          "onUpdate:modelValue": ($event) => unref(form).apply_email = $event,
                          type: "email",
                          required: "",
                          maxlength: "190",
                          class: "field",
                          placeholder: "rh@empresa.com.br",
                          "aria-invalid": invalid,
                          "aria-describedby": describedBy
                        }, null, 8, ["onUpdate:modelValue", "aria-invalid", "aria-describedby"]), [
                          [vModelText, unref(form).apply_email]
                        ])
                      ]),
                      _: 1
                    }, 8, ["error"])) : (openBlock(), createBlock(_sfc_main$3, {
                      key: 1,
                      id: "apply_url",
                      label: "Link de candidatura",
                      error: unref(form).errors.apply_url,
                      hint: "Endereço da vaga na plataforma ou no site da empresa. Comece com https://",
                      required: ""
                    }, {
                      default: withCtx(({ describedBy, invalid }) => [
                        withDirectives(createVNode("input", {
                          id: "apply_url",
                          "onUpdate:modelValue": ($event) => unref(form).apply_url = $event,
                          type: "url",
                          required: "",
                          maxlength: "1000",
                          class: "field",
                          placeholder: "https://",
                          "aria-invalid": invalid,
                          "aria-describedby": describedBy
                        }, null, 8, ["onUpdate:modelValue", "aria-invalid", "aria-describedby"]), [
                          [vModelText, unref(form).apply_url]
                        ])
                      ]),
                      _: 1
                    }, 8, ["error"]))
                  ]),
                  createVNode("div", { class: "card space-y-4 p-5 sm:p-6" }, [
                    createVNode("label", { class: "flex items-start gap-3 text-sm" }, [
                      withDirectives(createVNode("input", {
                        "onUpdate:modelValue": ($event) => unref(form).authorized = $event,
                        type: "checkbox",
                        class: "mt-0.5 size-4 shrink-0 rounded border-line-strong text-action-600",
                        "aria-invalid": !!unref(form).errors.authorized
                      }, null, 8, ["onUpdate:modelValue", "aria-invalid"]), [
                        [vModelCheckbox, unref(form).authorized]
                      ]),
                      createVNode("span", { class: "text-ink" }, [
                        createTextVNode("Declaro que tenho autorização para divulgar esta vaga e que as informações são verdadeiras. Concordo com os "),
                        createVNode("a", {
                          href: "/termos",
                          target: "_blank",
                          class: "font-semibold text-action-700 underline"
                        }, "Termos de uso"),
                        createTextVNode(" e a "),
                        createVNode("a", {
                          href: "/privacidade",
                          target: "_blank",
                          class: "font-semibold text-action-700 underline"
                        }, "Política de privacidade"),
                        createTextVNode(".")
                      ])
                    ]),
                    unref(form).errors.authorized ? (openBlock(), createBlock("p", {
                      key: 0,
                      class: "error-text",
                      role: "alert"
                    }, toDisplayString(unref(form).errors.authorized), 1)) : createCommentVNode("", true),
                    createVNode("button", {
                      type: "submit",
                      class: "btn-primary btn-lg w-full sm:w-auto",
                      disabled: unref(form).processing
                    }, [
                      unref(form).processing ? (openBlock(), createBlock(unref(Loader2), {
                        key: 0,
                        class: "size-4.5 animate-spin",
                        "aria-hidden": "true"
                      })) : (openBlock(), createBlock(unref(Send), {
                        key: 1,
                        class: "size-4.5",
                        "aria-hidden": "true"
                      })),
                      createTextVNode(toDisplayString(unref(form).processing ? "Enviando…" : "Enviar para análise"), 1)
                    ], 8, ["disabled"]),
                    createVNode("p", { class: "flex items-start gap-2 text-xs text-muted" }, [
                      createVNode(unref(ShieldCheck), {
                        class: "mt-0.5 size-4 shrink-0",
                        "aria-hidden": "true"
                      }),
                      createTextVNode("A vaga só aparece no site depois de aprovada pela nossa equipe. Não cobramos nada para analisar.")
                    ])
                  ])
                ], 32)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/pages/Public/SubmitJob.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=SubmitJob-CjqQYV5I.js.map
