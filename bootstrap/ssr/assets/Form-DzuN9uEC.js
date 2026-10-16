import { defineComponent, ref, mergeProps, unref, useSSRContext, onMounted, watch, createVNode, resolveDynamicComponent, computed, withCtx, createTextVNode, withDirectives, vModelText, openBlock, createBlock, createCommentVNode, Fragment, renderList, toDisplayString, vModelSelect, withModifiers, vModelCheckbox, useAttrs } from "vue";
import { ssrRenderAttrs, ssrRenderAttr, ssrRenderComponent, ssrRenderStyle, ssrIncludeBooleanAttr, ssrInterpolate, ssrRenderList, ssrRenderVNode, ssrLooseContain, ssrLooseEqual, ssrRenderClass } from "vue/server-renderer";
import { useForm, Link, router } from "@inertiajs/vue3";
import { Sparkles, ChevronDown, Loader2, AlertCircle, CheckCircle2, Bold, Italic, List, ListOrdered, Link2, RemoveFormatting, Send, CalendarClock, Save, Eye, ExternalLink, RefreshCw, Undo2, ArchiveRestore, Archive } from "lucide-vue-next";
import { _ as _sfc_main$7 } from "./Autocomplete-BKL9ffcG.js";
import { _ as _sfc_main$9 } from "./ConfirmDialog-CgAQ1lem.js";
import { _ as _sfc_main$6 } from "./Field-CI53GIau.js";
import { _ as _sfc_main$8 } from "./LogoField-D88DZ2aT.js";
import { _ as _sfc_main$5, a as _sfc_main$a } from "./StatusBadge-Crn78Iy0.js";
import { _ as _sfc_main$4 } from "./AdminLayout-BocNC89A.js";
import { f as formatDateTime } from "./format-D8ppHDIy.js";
import "./FlashMessages-mTMlubKC.js";
import "./SeoHead-BMQcIEwx.js";
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "ImportPanel",
  __ssrInlineRender: true,
  props: {
    aiConfigured: { type: Boolean }
  },
  emits: ["imported"],
  setup(__props, { emit: __emit }) {
    const open = ref(true);
    const url = ref("");
    const text = ref("");
    const loading = ref(false);
    const error = ref("");
    const result = ref(null);
    ref(null);
    const viaLabel = { structured: "dados estruturados da página, sem IA", rules: "regras simples, sem IA", ai: "IA com regras simples" };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({
        class: "card mb-6 overflow-hidden",
        "aria-labelledby": "imp-title"
      }, _attrs))}><button type="button" class="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"${ssrRenderAttr("aria-expanded", open.value)} aria-controls="imp-body"><span class="flex items-center gap-3"><span class="grid size-9 place-items-center rounded-xl bg-action-50 text-action-700">`);
      _push(ssrRenderComponent(unref(Sparkles), {
        class: "size-5",
        "aria-hidden": "true"
      }, null, _parent));
      _push(`</span><span><span id="imp-title" class="block text-base font-extrabold text-ink">Importar de link ou texto</span><span class="block text-xs text-muted">Preenche o formulário para você revisar. Primeiro sem IA; a IA só entra como reserva.</span></span></span>`);
      _push(ssrRenderComponent(unref(ChevronDown), {
        class: ["size-5 shrink-0 text-muted transition", open.value ? "rotate-180" : ""],
        "aria-hidden": "true"
      }, null, _parent));
      _push(`</button><div id="imp-body" class="space-y-4 border-t border-line px-5 py-4" style="${ssrRenderStyle(open.value ? null : { display: "none" })}"><div><label for="imp-url" class="label">Link da vaga</label><input id="imp-url"${ssrRenderAttr("value", url.value)} type="url" maxlength="1000" class="field" placeholder="https://empresa.gupy.io/jobs/123"${ssrIncludeBooleanAttr(loading.value) ? " disabled" : ""}><p class="hint">Páginas com dados estruturados (Gupy, Greenhouse, Lever…) e a InHire são lidas direto, sem IA; as demais vão para o Gemini.</p></div><div><label for="imp-text" class="label">Ou cole o texto do anúncio <span class="font-normal text-muted">(para páginas que não carregam sozinhas, como a InHire, LinkedIn e Indeed)</span></label><textarea id="imp-text" rows="5" maxlength="60000" class="field" placeholder="Copie todo o conteúdo da página da vaga e cole aqui. O link acima, se informado, identifica a plataforma e vira o link de candidatura."${ssrIncludeBooleanAttr(loading.value) ? " disabled" : ""}>${ssrInterpolate(text.value)}</textarea><p class="hint">`);
      if (__props.aiConfigured) {
        _push(`<!--[-->Gemini ativo: ele lê links e textos de qualquer site e o resultado é conferido por você antes de salvar.<!--]-->`);
      } else {
        _push(`<!--[-->Sem a IA, usamos regras simples (cargo, seções, local, modalidade, salário explícito). Para ler qualquer site com qualidade, cadastre a chave do Gemini em Configurações.<!--]-->`);
      }
      _push(`</p></div><div class="flex flex-wrap items-center gap-3"><button type="button" class="btn-primary"${ssrIncludeBooleanAttr(loading.value) ? " disabled" : ""}>`);
      if (loading.value) {
        _push(ssrRenderComponent(unref(Loader2), {
          class: "size-4 animate-spin",
          "aria-hidden": "true"
        }, null, _parent));
      } else {
        _push(ssrRenderComponent(unref(Sparkles), {
          class: "size-4",
          "aria-hidden": "true"
        }, null, _parent));
      }
      _push(`${ssrInterpolate(loading.value ? "Lendo a vaga…" : "Importar e preencher")}</button>`);
      if (loading.value) {
        _push(`<span class="text-xs text-muted" role="status">Pode levar alguns segundos.</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (error.value) {
        _push(`<p class="flex items-start gap-2 rounded-lg bg-danger-50 p-3 text-sm font-medium text-danger-700" role="alert">`);
        _push(ssrRenderComponent(unref(AlertCircle), {
          class: "mt-0.5 size-4 shrink-0",
          "aria-hidden": "true"
        }, null, _parent));
        _push(`${ssrInterpolate(error.value)}</p>`);
      } else {
        _push(`<!---->`);
      }
      if (result.value) {
        _push(`<div class="rounded-lg bg-success-50 p-3 text-sm text-success-700" role="status"><p class="flex items-center gap-2 font-bold">`);
        _push(ssrRenderComponent(unref(CheckCircle2), {
          class: "size-4",
          "aria-hidden": "true"
        }, null, _parent));
        _push(`Formulário preenchido (${ssrInterpolate(viaLabel[result.value.via])}). Revise tudo antes de salvar.</p><ul class="mt-1.5 list-disc space-y-0.5 pl-6 text-xs"><!--[-->`);
        ssrRenderList(result.value.notes, (n) => {
          _push(`<li>${ssrInterpolate(n)}</li>`);
        });
        _push(`<!--]--></ul></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></section>`);
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ImportPanel.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "RichEditor",
  __ssrInlineRender: true,
  props: {
    modelValue: {},
    id: {},
    label: {},
    invalid: { type: Boolean },
    minHeight: {}
  },
  emits: ["update:modelValue"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const el = ref(null);
    const mounted = ref(false);
    onMounted(() => {
      if (el.value) el.value.innerHTML = props.modelValue ?? "";
      mounted.value = true;
    });
    watch(
      () => props.modelValue,
      (v) => {
        if (el.value && (v ?? "") !== el.value.innerHTML && document.activeElement !== el.value) el.value.innerHTML = v ?? "";
      }
    );
    function sync() {
      const html = el.value?.innerHTML ?? "";
      emit("update:modelValue", html === "<br>" ? "" : html);
    }
    function run(command, value) {
      el.value?.focus();
      document.execCommand(command, false, value);
      sync();
    }
    function link() {
      const url = window.prompt("Endereço do link (https://...)");
      if (!url) return;
      if (!/^https?:\/\//i.test(url) && !/^mailto:/i.test(url)) {
        window.alert("Use um endereço que comece com https://");
        return;
      }
      run("createLink", url);
    }
    const tools = [
      { label: "Negrito", icon: Bold, action: () => run("bold") },
      { label: "Itálico", icon: Italic, action: () => run("italic") },
      { label: "Lista com marcadores", icon: List, action: () => run("insertUnorderedList") },
      { label: "Lista numerada", icon: ListOrdered, action: () => run("insertOrderedList") },
      { label: "Inserir link", icon: Link2, action: link },
      { label: "Limpar formatação", icon: RemoveFormatting, action: () => run("removeFormat") }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ["overflow-hidden rounded-(--radius-control) border bg-white focus-within:border-action-600 focus-within:ring-2 focus-within:ring-action-100", __props.invalid ? "border-danger-700" : "border-line-strong"]
      }, _attrs))}><div class="flex flex-wrap gap-0.5 border-b border-line bg-surface p-1" role="toolbar"${ssrRenderAttr("aria-label", `Formatação de ${__props.label}`)}><!--[-->`);
      ssrRenderList(tools, (t) => {
        _push(`<button type="button" class="grid size-9 place-items-center rounded-md text-muted hover:bg-white hover:text-ink"${ssrRenderAttr("title", t.label)}${ssrRenderAttr("aria-label", t.label)}>`);
        ssrRenderVNode(_push, createVNode(resolveDynamicComponent(t.icon), { class: "size-4" }, null), _parent);
        _push(`</button>`);
      });
      _push(`<!--]--></div><div${ssrRenderAttr("id", __props.id)} contenteditable="true" role="textbox" aria-multiline="true"${ssrRenderAttr("aria-label", __props.label)}${ssrRenderAttr("aria-invalid", __props.invalid)} class="prose-job px-3 py-2.5 text-sm outline-none" style="${ssrRenderStyle({ minHeight: __props.minHeight ?? "9rem" })}"></div></div>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/RichEditor.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "JobForm",
  __ssrInlineRender: true,
  props: {
    job: {},
    aiConfigured: { type: Boolean },
    categories: {},
    options: {},
    validity: {}
  },
  setup(__props) {
    const props = __props;
    const editing = computed(() => props.job !== null);
    const status = computed(() => props.job?.status ?? "new");
    const lifecycleEditable = computed(() => !editing.value || ["draft", "scheduled"].includes(status.value));
    const j = props.job;
    const form = useForm({
      _method: j ? "put" : "post",
      action: "save",
      title: j?.title ?? "",
      slug: j?.slug ?? "",
      company_name: j?.company_name ?? "",
      company_website_url: j?.company_website_url ?? "",
      company_logo_url: j?.company_logo_url ?? "",
      company_logo: null,
      remove_company_logo: false,
      company_about: j?.company_about ?? "",
      category_id: j?.category_id ?? "",
      work_mode: j?.work_mode ?? "onsite",
      city: j?.city ?? "",
      state: j?.state ?? "",
      employment_type: j?.employment_type ?? "clt",
      experience_level: j?.experience_level ?? "",
      description: j?.description ?? "",
      responsibilities: j?.responsibilities ?? "",
      requirements: j?.requirements ?? "",
      nice_to_have: j?.nice_to_have ?? "",
      benefits: j?.benefits ?? "",
      additional_info: j?.additional_info ?? "",
      salary_min: j?.salary_min ?? "",
      salary_max: j?.salary_max ?? "",
      salary_currency: j?.salary_currency ?? "BRL",
      salary_period: j?.salary_period ?? "",
      platform_id: j?.platform_id ?? props.options.platforms[0]?.value ?? "",
      apply_url: j?.apply_url ?? "",
      apply_email: j?.apply_email ?? "",
      source_url: j?.source_url ?? "",
      source_name: j?.source_name ?? "",
      source_published_at: j?.source_published_at ?? "",
      is_featured: j?.is_featured ?? false,
      publish_at: j?.publish_at ?? "",
      validity_days: j?.expires_at ? null : props.validity.default,
      expires_at: j?.expires_at ?? ""
    });
    const pickedCompany = ref(j ? { label: j.company_name, logo: j.company_logo_src, data: { website_url: j.company_website_url, about: j.company_about } } : null);
    const isNewCompany = computed(() => form.company_name.trim() !== "" && pickedCompany.value?.label.toLowerCase() !== form.company_name.trim().toLowerCase());
    function onCompanyInput() {
      if (pickedCompany.value && pickedCompany.value.label.toLowerCase() !== form.company_name.trim().toLowerCase()) pickedCompany.value = null;
    }
    function onCompanySelect(s) {
      pickedCompany.value = s;
      form.company_name = s.label;
      form.company_website_url = s.data?.website_url ?? "";
      form.company_about = "";
      form.company_logo = null;
    }
    function applyImport(r) {
      const target = form;
      for (const [key, value] of Object.entries(r.fields)) {
        if (key in target) target[key] = value;
      }
      form.company_logo = null;
      pickedCompany.value = r.company_match ? { label: r.company_match.label, logo: r.company_match.logo, data: r.company_match.data } : null;
      if (r.company_match) form.company_website_url = r.company_match.data.website_url ?? "";
      form.clearErrors();
    }
    const customValidity = ref(!!j?.expires_at);
    const slugEdit = ref(false);
    const byEmail = computed(() => !!props.options.platforms.find((p) => p.value === form.platform_id)?.uses_email);
    const isRemote = computed(() => form.work_mode === "remote");
    const hasSalary = computed(() => form.salary_min !== "" || form.salary_max !== "");
    const errorCount = computed(() => Object.keys(form.errors).length);
    function pickValidity(days) {
      if (days === null) {
        customValidity.value = true;
        form.validity_days = null;
        return;
      }
      customValidity.value = false;
      form.validity_days = days;
      form.expires_at = "";
    }
    function submit(action) {
      form.action = action;
      if (!customValidity.value) form.expires_at = "";
      form.transform((d) => action === "publish" ? { ...d, publish_at: "" } : d);
      const opts = { preserveScroll: true, onError: () => document.getElementById("resumo-erros")?.focus() };
      const multipart = { ...opts, forceFormData: true };
      if (editing.value) form.post(`/admin/vagas/${j.id}`, multipart);
      else form.post("/admin/vagas", multipart);
    }
    const confirmArchive = ref(false);
    const renewOpen = ref(false);
    const acting = ref(false);
    function post(url, done) {
      acting.value = true;
      router.post(url, {}, { preserveScroll: true, onFinish: () => {
        acting.value = false;
        done?.();
      } });
    }
    const eventLabel = {
      created: "Criada",
      updated: "Editada",
      published: "Publicada",
      scheduled: "Agendada",
      renewed: "Renovada",
      expired: "Expirada automaticamente",
      archived: "Arquivada",
      restored: "Restaurada"
    };
    const rich = [
      { key: "description", label: "Sobre a oportunidade", required: true },
      { key: "responsibilities", label: "Responsabilidades" },
      { key: "requirements", label: "Requisitos" },
      { key: "nice_to_have", label: "Diferenciais" },
      { key: "benefits", label: "Benefícios" },
      { key: "additional_info", label: "Informações adicionais" }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$4, mergeProps({
        title: editing.value ? "Editar vaga" : "Nova vaga"
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (!editing.value) {
              _push2(`<div class="mx-auto max-w-6xl"${_scopeId}>`);
              _push2(ssrRenderComponent(_sfc_main$3, {
                "ai-configured": !!__props.aiConfigured,
                onImported: applyImport
              }, null, _parent2, _scopeId));
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<form class="mx-auto max-w-6xl"${_scopeId}><header class="mb-5 flex flex-wrap items-center justify-between gap-3"${_scopeId}><div${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: "/admin/vagas",
              class: "text-sm font-semibold text-action-700 hover:underline"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`← Vagas`);
                } else {
                  return [
                    createTextVNode("← Vagas")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`<h1 class="mt-1 flex flex-wrap items-center gap-3 text-2xl font-extrabold text-ink"${_scopeId}>${ssrInterpolate(editing.value ? "Editar vaga" : "Nova vaga")}`);
            if (unref(j)) {
              _push2(ssrRenderComponent(_sfc_main$5, {
                status: unref(j).status,
                label: unref(j).status_label
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(`</h1></div></header>`);
            if (errorCount.value) {
              _push2(`<div id="resumo-erros" tabindex="-1" role="alert" class="mb-5 rounded-xl border border-danger-700/25 bg-danger-50 p-4 text-sm text-danger-700"${_scopeId}><p class="font-bold"${_scopeId}>Corrija ${ssrInterpolate(errorCount.value)} ${ssrInterpolate(errorCount.value === 1 ? "campo" : "campos")} antes de continuar:</p><ul class="mt-1 list-disc pl-5"${_scopeId}><!--[-->`);
              ssrRenderList(unref(form).errors, (msg, key) => {
                _push2(`<li${_scopeId}>${ssrInterpolate(msg)}</li>`);
              });
              _push2(`<!--]--></ul></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="grid gap-6 lg:grid-cols-[1fr_20rem] lg:items-start"${_scopeId}><div class="space-y-6"${_scopeId}><section class="card space-y-4 p-5" aria-labelledby="s-basico"${_scopeId}><h2 id="s-basico" class="text-lg font-extrabold text-ink"${_scopeId}>Informações básicas</h2>`);
            _push2(ssrRenderComponent(_sfc_main$6, {
              id: "title",
              label: "Título da vaga",
              error: unref(form).errors.title,
              required: ""
            }, {
              default: withCtx(({ describedBy, invalid }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<input id="title"${ssrRenderAttr("value", unref(form).title)} required minlength="3" maxlength="180" class="field"${ssrRenderAttr("aria-invalid", invalid)}${ssrRenderAttr("aria-describedby", describedBy)}${_scopeId2}>`);
                } else {
                  return [
                    withDirectives(createVNode("input", {
                      id: "title",
                      "onUpdate:modelValue": ($event) => unref(form).title = $event,
                      required: "",
                      minlength: "3",
                      maxlength: "180",
                      class: "field",
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
            _push2(ssrRenderComponent(_sfc_main$6, {
              id: "company_name",
              label: "Empresa contratante",
              error: unref(form).errors.company_name,
              required: ""
            }, {
              default: withCtx(({ invalid }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_sfc_main$7, {
                    id: "company_name",
                    modelValue: unref(form).company_name,
                    "onUpdate:modelValue": [($event) => unref(form).company_name = $event, onCompanyInput],
                    label: "Empresa contratante",
                    endpoint: "/admin/empresas/sugestoes",
                    "min-chars": 1,
                    maxlength: 160,
                    required: "",
                    invalid,
                    placeholder: "Digite para buscar ou cadastrar",
                    onSelect: onCompanySelect
                  }, null, _parent3, _scopeId2));
                  if (pickedCompany.value && !isNewCompany.value) {
                    _push3(`<p class="mt-1.5 flex items-center gap-2 text-xs font-semibold text-success-700"${_scopeId2}>`);
                    if (pickedCompany.value.logo) {
                      _push3(`<img${ssrRenderAttr("src", pickedCompany.value.logo)} alt="" class="size-5 rounded border border-line bg-white object-contain"${_scopeId2}>`);
                    } else {
                      _push3(`<!---->`);
                    }
                    _push3(`Empresa já cadastrada: os dados e o logotipo serão reaproveitados.</p>`);
                  } else if (isNewCompany.value) {
                    _push3(`<p class="mt-1.5 text-xs font-semibold text-info-700"${_scopeId2}>Empresa nova: será cadastrada junto com a vaga. Informe o logotipo abaixo.</p>`);
                  } else {
                    _push3(`<!---->`);
                  }
                } else {
                  return [
                    createVNode(_sfc_main$7, {
                      id: "company_name",
                      modelValue: unref(form).company_name,
                      "onUpdate:modelValue": [($event) => unref(form).company_name = $event, onCompanyInput],
                      label: "Empresa contratante",
                      endpoint: "/admin/empresas/sugestoes",
                      "min-chars": 1,
                      maxlength: 160,
                      required: "",
                      invalid,
                      placeholder: "Digite para buscar ou cadastrar",
                      onSelect: onCompanySelect
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "invalid"]),
                    pickedCompany.value && !isNewCompany.value ? (openBlock(), createBlock("p", {
                      key: 0,
                      class: "mt-1.5 flex items-center gap-2 text-xs font-semibold text-success-700"
                    }, [
                      pickedCompany.value.logo ? (openBlock(), createBlock("img", {
                        key: 0,
                        src: pickedCompany.value.logo,
                        alt: "",
                        class: "size-5 rounded border border-line bg-white object-contain"
                      }, null, 8, ["src"])) : createCommentVNode("", true),
                      createTextVNode("Empresa já cadastrada: os dados e o logotipo serão reaproveitados.")
                    ])) : isNewCompany.value ? (openBlock(), createBlock("p", {
                      key: 1,
                      class: "mt-1.5 text-xs font-semibold text-info-700"
                    }, "Empresa nova: será cadastrada junto com a vaga. Informe o logotipo abaixo.")) : createCommentVNode("", true)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$6, {
              id: "category_id",
              label: "Categoria",
              error: unref(form).errors.category_id,
              required: ""
            }, {
              default: withCtx(({ describedBy, invalid }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<select id="category_id" required class="field"${ssrRenderAttr("aria-invalid", invalid)}${ssrRenderAttr("aria-describedby", describedBy)}${_scopeId2}><option value="" disabled${ssrIncludeBooleanAttr(Array.isArray(unref(form).category_id) ? ssrLooseContain(unref(form).category_id, "") : ssrLooseEqual(unref(form).category_id, "")) ? " selected" : ""}${_scopeId2}>Selecione…</option><!--[-->`);
                  ssrRenderList(__props.categories, (c) => {
                    _push3(`<option${ssrRenderAttr("value", c.id)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).category_id) ? ssrLooseContain(unref(form).category_id, c.id) : ssrLooseEqual(unref(form).category_id, c.id)) ? " selected" : ""}${_scopeId2}>${ssrInterpolate(c.name)}${ssrInterpolate(c.is_active ? "" : " (inativa)")}</option>`);
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
                        }, toDisplayString(c.name) + toDisplayString(c.is_active ? "" : " (inativa)"), 9, ["value"]);
                      }), 128))
                    ], 8, ["onUpdate:modelValue", "aria-invalid", "aria-describedby"]), [
                      [vModelSelect, unref(form).category_id]
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$6, {
              id: "company_website_url",
              label: "Site da empresa",
              error: unref(form).errors.company_website_url,
              hint: "Opcional. Deve começar com https://"
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
            if (!pickedCompany.value || !pickedCompany.value.logo || !isNewCompany.value) {
              _push2(`<div class="rounded-xl border border-line bg-surface p-4"${_scopeId}>`);
              _push2(ssrRenderComponent(_sfc_main$8, {
                id: "company_logo",
                url: unref(form).company_logo_url,
                "onUpdate:url": ($event) => unref(form).company_logo_url = $event,
                file: unref(form).company_logo,
                "onUpdate:file": ($event) => unref(form).company_logo = $event,
                remove: unref(form).remove_company_logo,
                "onUpdate:remove": ($event) => unref(form).remove_company_logo = $event,
                current: pickedCompany.value?.logo ?? null,
                error: unref(form).errors.company_logo,
                "url-error": unref(form).errors.company_logo_url,
                name: unref(form).company_name
              }, null, _parent2, _scopeId));
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$6, {
              id: "slug",
              label: "Slug (URL da vaga)",
              error: unref(form).errors.slug,
              hint: editing.value ? "Alterar o slug muda a URL pública. Prefira manter." : "Deixe em branco para gerar automaticamente (título + empresa + código)."
            }, {
              default: withCtx(({ describedBy, invalid }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<input id="slug"${ssrRenderAttr("value", unref(form).slug)} class="field font-mono text-[13px]"${ssrIncludeBooleanAttr(editing.value && !slugEdit.value) ? " readonly" : ""}${ssrRenderAttr("placeholder", editing.value ? "" : "gerado-automaticamente")}${ssrRenderAttr("aria-invalid", invalid)}${ssrRenderAttr("aria-describedby", describedBy)}${_scopeId2}>`);
                } else {
                  return [
                    withDirectives(createVNode("input", {
                      id: "slug",
                      "onUpdate:modelValue": ($event) => unref(form).slug = $event,
                      class: "field font-mono text-[13px]",
                      readonly: editing.value && !slugEdit.value,
                      placeholder: editing.value ? "" : "gerado-automaticamente",
                      "aria-invalid": invalid,
                      "aria-describedby": describedBy
                    }, null, 8, ["onUpdate:modelValue", "readonly", "placeholder", "aria-invalid", "aria-describedby"]), [
                      [vModelText, unref(form).slug]
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            if (editing.value && !slugEdit.value) {
              _push2(`<button type="button" class="mt-1.5 text-xs font-bold text-action-700 hover:underline"${_scopeId}>Editar slug</button>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></section><section class="card space-y-4 p-5" aria-labelledby="s-local"${_scopeId}><h2 id="s-local" class="text-lg font-extrabold text-ink"${_scopeId}>Local e contratação</h2><div class="grid gap-4 sm:grid-cols-2"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$6, {
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
            _push2(ssrRenderComponent(_sfc_main$6, {
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
            _push2(ssrRenderComponent(_sfc_main$6, {
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
            _push2(ssrRenderComponent(_sfc_main$6, {
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
            _push2(ssrRenderComponent(_sfc_main$6, {
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
            _push2(`</div></section><section class="card space-y-4 p-5" aria-labelledby="s-salario"${_scopeId}><div${_scopeId}><h2 id="s-salario" class="text-lg font-extrabold text-ink"${_scopeId}>Remuneração</h2><p class="text-sm text-muted"${_scopeId}>Preencha somente se o salário foi divulgado na fonte. Nunca estime valores.</p></div><div class="grid gap-4 sm:grid-cols-4"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$6, {
              id: "salary_min",
              label: "Mínimo",
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
            _push2(ssrRenderComponent(_sfc_main$6, {
              id: "salary_max",
              label: "Máximo",
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
            _push2(ssrRenderComponent(_sfc_main$6, {
              id: "salary_currency",
              label: "Moeda"
            }, {
              default: withCtx(({ describedBy }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<select id="salary_currency" class="field"${ssrRenderAttr("aria-describedby", describedBy)}${_scopeId2}><option value="BRL"${ssrIncludeBooleanAttr(Array.isArray(unref(form).salary_currency) ? ssrLooseContain(unref(form).salary_currency, "BRL") : ssrLooseEqual(unref(form).salary_currency, "BRL")) ? " selected" : ""}${_scopeId2}>BRL (R$)</option><option value="USD"${ssrIncludeBooleanAttr(Array.isArray(unref(form).salary_currency) ? ssrLooseContain(unref(form).salary_currency, "USD") : ssrLooseEqual(unref(form).salary_currency, "USD")) ? " selected" : ""}${_scopeId2}>USD</option><option value="EUR"${ssrIncludeBooleanAttr(Array.isArray(unref(form).salary_currency) ? ssrLooseContain(unref(form).salary_currency, "EUR") : ssrLooseEqual(unref(form).salary_currency, "EUR")) ? " selected" : ""}${_scopeId2}>EUR</option></select>`);
                } else {
                  return [
                    withDirectives(createVNode("select", {
                      id: "salary_currency",
                      "onUpdate:modelValue": ($event) => unref(form).salary_currency = $event,
                      class: "field",
                      "aria-describedby": describedBy
                    }, [
                      createVNode("option", { value: "BRL" }, "BRL (R$)"),
                      createVNode("option", { value: "USD" }, "USD"),
                      createVNode("option", { value: "EUR" }, "EUR")
                    ], 8, ["onUpdate:modelValue", "aria-describedby"]), [
                      [vModelSelect, unref(form).salary_currency]
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$6, {
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
            _push2(`</div></section><section class="card space-y-5 p-5" aria-labelledby="s-conteudo"${_scopeId}><div${_scopeId}><h2 id="s-conteudo" class="text-lg font-extrabold text-ink"${_scopeId}>Conteúdo da vaga</h2><p class="text-sm text-muted"${_scopeId}>Preserve o texto da fonte. Campos vazios não são exibidos no site. O HTML é sanitizado ao salvar.</p></div><!--[-->`);
            ssrRenderList(rich, (r) => {
              _push2(ssrRenderComponent(_sfc_main$6, {
                id: r.key,
                key: r.key,
                label: r.label,
                error: unref(form).errors[r.key],
                required: "required" in r && r.required
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_sfc_main$2, {
                      id: r.key,
                      modelValue: unref(form)[r.key],
                      "onUpdate:modelValue": ($event) => unref(form)[r.key] = $event,
                      label: r.label,
                      invalid: !!unref(form).errors[r.key],
                      "min-height": r.key === "description" ? "12rem" : "8rem"
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_sfc_main$2, {
                        id: r.key,
                        modelValue: unref(form)[r.key],
                        "onUpdate:modelValue": ($event) => unref(form)[r.key] = $event,
                        label: r.label,
                        invalid: !!unref(form).errors[r.key],
                        "min-height": r.key === "description" ? "12rem" : "8rem"
                      }, null, 8, ["id", "modelValue", "onUpdate:modelValue", "label", "invalid", "min-height"])
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            });
            _push2(`<!--]-->`);
            _push2(ssrRenderComponent(_sfc_main$6, {
              id: "company_about",
              label: "Sobre a empresa",
              error: unref(form).errors.company_about,
              hint: "Somente informações verificadas."
            }, {
              default: withCtx(({ describedBy, invalid }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<textarea id="company_about" rows="3" maxlength="5000" class="field"${ssrRenderAttr("aria-invalid", invalid)}${ssrRenderAttr("aria-describedby", describedBy)}${_scopeId2}>${ssrInterpolate(unref(form).company_about)}</textarea>`);
                } else {
                  return [
                    withDirectives(createVNode("textarea", {
                      id: "company_about",
                      "onUpdate:modelValue": ($event) => unref(form).company_about = $event,
                      rows: "3",
                      maxlength: "5000",
                      class: "field",
                      "aria-invalid": invalid,
                      "aria-describedby": describedBy
                    }, null, 8, ["onUpdate:modelValue", "aria-invalid", "aria-describedby"]), [
                      [vModelText, unref(form).company_about]
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</section><section class="card space-y-4 p-5" aria-labelledby="s-fonte"${_scopeId}><h2 id="s-fonte" class="text-lg font-extrabold text-ink"${_scopeId}>Candidatura e fonte</h2>`);
            _push2(ssrRenderComponent(_sfc_main$6, {
              id: "platform",
              label: "Plataforma de contratação",
              error: unref(form).errors.platform_id,
              hint: "Por onde o candidato se inscreve. Gerencie a lista em Plataformas.",
              required: ""
            }, {
              default: withCtx(({ describedBy, invalid }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<select id="platform" required class="field"${ssrRenderAttr("aria-invalid", invalid)}${ssrRenderAttr("aria-describedby", describedBy)}${_scopeId2}><!--[-->`);
                  ssrRenderList(__props.options.platforms, (o) => {
                    _push3(`<option${ssrRenderAttr("value", o.value)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).platform_id) ? ssrLooseContain(unref(form).platform_id, o.value) : ssrLooseEqual(unref(form).platform_id, o.value)) ? " selected" : ""}${_scopeId2}>${ssrInterpolate(o.label)}</option>`);
                  });
                  _push3(`<!--]--></select>`);
                } else {
                  return [
                    withDirectives(createVNode("select", {
                      id: "platform",
                      "onUpdate:modelValue": ($event) => unref(form).platform_id = $event,
                      required: "",
                      class: "field",
                      "aria-invalid": invalid,
                      "aria-describedby": describedBy
                    }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(__props.options.platforms, (o) => {
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
              _push2(ssrRenderComponent(_sfc_main$6, {
                id: "apply_email",
                label: "E-mail para candidatura",
                error: unref(form).errors.apply_email,
                hint: "Candidatura sem link: o botão abrirá o e-mail do candidato já endereçado.",
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
              _push2(ssrRenderComponent(_sfc_main$6, {
                id: "apply_url",
                label: "URL direta de candidatura",
                error: unref(form).errors.apply_url,
                hint: "Para onde o candidato será levado. Aceita apenas http(s); prefira https.",
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
            _push2(`<div class="grid gap-4 sm:grid-cols-2"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$6, {
              id: "source_url",
              label: "URL original da vaga",
              error: unref(form).errors.source_url
            }, {
              default: withCtx(({ describedBy, invalid }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<input id="source_url"${ssrRenderAttr("value", unref(form).source_url)} type="url" maxlength="1000" class="field" placeholder="https://"${ssrRenderAttr("aria-invalid", invalid)}${ssrRenderAttr("aria-describedby", describedBy)}${_scopeId2}>`);
                } else {
                  return [
                    withDirectives(createVNode("input", {
                      id: "source_url",
                      "onUpdate:modelValue": ($event) => unref(form).source_url = $event,
                      type: "url",
                      maxlength: "1000",
                      class: "field",
                      placeholder: "https://",
                      "aria-invalid": invalid,
                      "aria-describedby": describedBy
                    }, null, 8, ["onUpdate:modelValue", "aria-invalid", "aria-describedby"]), [
                      [vModelText, unref(form).source_url]
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$6, {
              id: "source_name",
              label: "Fonte",
              error: unref(form).errors.source_name,
              hint: "Ex.: Gupy, LinkedIn, site da empresa"
            }, {
              default: withCtx(({ describedBy, invalid }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<input id="source_name"${ssrRenderAttr("value", unref(form).source_name)} maxlength="120" class="field"${ssrRenderAttr("aria-invalid", invalid)}${ssrRenderAttr("aria-describedby", describedBy)}${_scopeId2}>`);
                } else {
                  return [
                    withDirectives(createVNode("input", {
                      id: "source_name",
                      "onUpdate:modelValue": ($event) => unref(form).source_name = $event,
                      maxlength: "120",
                      class: "field",
                      "aria-invalid": invalid,
                      "aria-describedby": describedBy
                    }, null, 8, ["onUpdate:modelValue", "aria-invalid", "aria-describedby"]), [
                      [vModelText, unref(form).source_name]
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$6, {
              id: "source_published_at",
              label: "Publicada originalmente em",
              error: unref(form).errors.source_published_at,
              hint: "Data na fonte. Não altera a data de publicação no VagasPlus."
            }, {
              default: withCtx(({ describedBy, invalid }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<input id="source_published_at"${ssrRenderAttr("value", unref(form).source_published_at)} type="datetime-local" class="field"${ssrRenderAttr("aria-invalid", invalid)}${ssrRenderAttr("aria-describedby", describedBy)}${_scopeId2}>`);
                } else {
                  return [
                    withDirectives(createVNode("input", {
                      id: "source_published_at",
                      "onUpdate:modelValue": ($event) => unref(form).source_published_at = $event,
                      type: "datetime-local",
                      class: "field",
                      "aria-invalid": invalid,
                      "aria-describedby": describedBy
                    }, null, 8, ["onUpdate:modelValue", "aria-invalid", "aria-describedby"]), [
                      [vModelText, unref(form).source_published_at]
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></section></div><aside class="space-y-4 lg:sticky lg:top-6" aria-label="Publicação"${_scopeId}><section class="card space-y-4 p-5" aria-labelledby="s-pub"${_scopeId}><h2 id="s-pub" class="text-lg font-extrabold text-ink"${_scopeId}>Publicação</h2>`);
            if (lifecycleEditable.value) {
              _push2(`<!--[--><fieldset${_scopeId}><legend class="label"${_scopeId}>Validade da vaga</legend><div class="flex flex-wrap gap-1.5"${_scopeId}><!--[-->`);
              ssrRenderList(__props.validity.presets, (d) => {
                _push2(`<button type="button" class="${ssrRenderClass([!customValidity.value && unref(form).validity_days === d ? "border-action-600 bg-action-50 text-action-700" : "border-line-strong bg-white text-ink", "btn btn-sm rounded-full border"])}"${ssrRenderAttr("aria-pressed", !customValidity.value && unref(form).validity_days === d)}${_scopeId}>${ssrInterpolate(d)} dias</button>`);
              });
              _push2(`<!--]--><button type="button" class="${ssrRenderClass([customValidity.value ? "border-action-600 bg-action-50 text-action-700" : "border-line-strong bg-white text-ink", "btn btn-sm rounded-full border"])}"${ssrRenderAttr("aria-pressed", customValidity.value)}${_scopeId}>Personalizada</button></div><p class="hint"${_scopeId}>Padrão: ${ssrInterpolate(__props.validity.default)} dias · máximo: ${ssrInterpolate(__props.validity.max)} dias. É um prazo operacional do portal, não garante que a vaga siga aberta.</p></fieldset>`);
              if (customValidity.value) {
                _push2(ssrRenderComponent(_sfc_main$6, {
                  id: "expires_at",
                  label: "Expira em",
                  error: unref(form).errors.expires_at
                }, {
                  default: withCtx(({ describedBy, invalid }, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`<input id="expires_at"${ssrRenderAttr("value", unref(form).expires_at)} type="datetime-local" class="field"${ssrRenderAttr("aria-invalid", invalid)}${ssrRenderAttr("aria-describedby", describedBy)}${_scopeId2}>`);
                    } else {
                      return [
                        withDirectives(createVNode("input", {
                          id: "expires_at",
                          "onUpdate:modelValue": ($event) => unref(form).expires_at = $event,
                          type: "datetime-local",
                          class: "field",
                          "aria-invalid": invalid,
                          "aria-describedby": describedBy
                        }, null, 8, ["onUpdate:modelValue", "aria-invalid", "aria-describedby"]), [
                          [vModelText, unref(form).expires_at]
                        ])
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
              } else if (unref(form).errors.expires_at) {
                _push2(`<p class="error-text" role="alert"${_scopeId}>${ssrInterpolate(unref(form).errors.expires_at)}</p>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(ssrRenderComponent(_sfc_main$6, {
                id: "publish_at",
                label: "Publicar em",
                error: unref(form).errors.publish_at,
                hint: "Deixe vazio para publicar agora. Use data futura para agendar."
              }, {
                default: withCtx(({ describedBy, invalid }, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<input id="publish_at"${ssrRenderAttr("value", unref(form).publish_at)} type="datetime-local" class="field"${ssrRenderAttr("aria-invalid", invalid)}${ssrRenderAttr("aria-describedby", describedBy)}${_scopeId2}>`);
                  } else {
                    return [
                      withDirectives(createVNode("input", {
                        id: "publish_at",
                        "onUpdate:modelValue": ($event) => unref(form).publish_at = $event,
                        type: "datetime-local",
                        class: "field",
                        "aria-invalid": invalid,
                        "aria-describedby": describedBy
                      }, null, 8, ["onUpdate:modelValue", "aria-invalid", "aria-describedby"]), [
                        [vModelText, unref(form).publish_at]
                      ])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`<!--]-->`);
            } else if (unref(j)) {
              _push2(`<dl class="space-y-2 text-sm"${_scopeId}><div class="flex justify-between gap-3"${_scopeId}><dt class="text-muted"${_scopeId}>Publicada em</dt><dd class="font-semibold text-ink"${_scopeId}>${ssrInterpolate(unref(formatDateTime)(unref(j).publish_at))}</dd></div><div class="flex justify-between gap-3"${_scopeId}><dt class="text-muted"${_scopeId}>Expira em</dt><dd class="font-semibold text-ink"${_scopeId}>${ssrInterpolate(unref(formatDateTime)(unref(j).expires_at))}</dd></div></dl>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<label class="flex items-start gap-2 text-sm"${_scopeId}><input${ssrIncludeBooleanAttr(Array.isArray(unref(form).is_featured) ? ssrLooseContain(unref(form).is_featured, null) : unref(form).is_featured) ? " checked" : ""} type="checkbox" class="mt-0.5 size-4 rounded border-line-strong text-action-600"${_scopeId}><span${_scopeId}><span class="font-semibold text-ink"${_scopeId}>Vaga em destaque</span><span class="block text-xs text-muted"${_scopeId}>Aparece na home enquanto estiver válida.</span></span></label><div class="space-y-2 border-t border-line pt-4"${_scopeId}>`);
            if (lifecycleEditable.value) {
              _push2(`<!--[--><button type="button" class="btn-primary w-full"${ssrIncludeBooleanAttr(unref(form).processing) ? " disabled" : ""}${_scopeId}>`);
              if (unref(form).processing && unref(form).action === "publish") {
                _push2(ssrRenderComponent(unref(Loader2), { class: "size-4 animate-spin" }, null, _parent2, _scopeId));
              } else {
                _push2(ssrRenderComponent(unref(Send), {
                  class: "size-4",
                  "aria-hidden": "true"
                }, null, _parent2, _scopeId));
              }
              _push2(`Publicar agora</button><button type="button" class="btn-secondary w-full"${ssrIncludeBooleanAttr(unref(form).processing) ? " disabled" : ""}${_scopeId}>`);
              _push2(ssrRenderComponent(unref(CalendarClock), {
                class: "size-4",
                "aria-hidden": "true"
              }, null, _parent2, _scopeId));
              _push2(`Agendar publicação</button><!--]-->`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<button type="submit" class="${ssrRenderClass([lifecycleEditable.value ? "btn-ghost" : "btn-primary", "w-full"])}"${ssrIncludeBooleanAttr(unref(form).processing) ? " disabled" : ""}${_scopeId}>`);
            if (unref(form).processing && unref(form).action === "save") {
              _push2(ssrRenderComponent(unref(Loader2), { class: "size-4 animate-spin" }, null, _parent2, _scopeId));
            } else {
              _push2(ssrRenderComponent(unref(Save), {
                class: "size-4",
                "aria-hidden": "true"
              }, null, _parent2, _scopeId));
            }
            _push2(`${ssrInterpolate(lifecycleEditable.value ? "Salvar como rascunho" : "Salvar alterações")}</button></div></section>`);
            if (unref(j)) {
              _push2(`<section class="card space-y-2 p-5" aria-labelledby="s-acoes"${_scopeId}><h2 id="s-acoes" class="text-lg font-extrabold text-ink"${_scopeId}>Ações</h2><a${ssrRenderAttr("href", unref(j).preview_url)} target="_blank" rel="noopener" class="btn-secondary w-full"${_scopeId}>`);
              _push2(ssrRenderComponent(unref(Eye), {
                class: "size-4",
                "aria-hidden": "true"
              }, null, _parent2, _scopeId));
              _push2(`Pré-visualizar</a>`);
              if (unref(j).public_url) {
                _push2(`<a${ssrRenderAttr("href", unref(j).public_url)} target="_blank" rel="noopener" class="btn-secondary w-full"${_scopeId}>`);
                _push2(ssrRenderComponent(unref(ExternalLink), {
                  class: "size-4",
                  "aria-hidden": "true"
                }, null, _parent2, _scopeId));
                _push2(`Ver no site</a>`);
              } else {
                _push2(`<!---->`);
              }
              if (["published", "expired"].includes(unref(j).status)) {
                _push2(`<button type="button" class="btn-secondary w-full"${_scopeId}>`);
                _push2(ssrRenderComponent(unref(RefreshCw), {
                  class: "size-4",
                  "aria-hidden": "true"
                }, null, _parent2, _scopeId));
                _push2(`Renovar validade</button>`);
              } else {
                _push2(`<!---->`);
              }
              if (unref(j).status === "scheduled") {
                _push2(`<button type="button" class="btn-secondary w-full"${ssrIncludeBooleanAttr(acting.value) ? " disabled" : ""}${_scopeId}>`);
                _push2(ssrRenderComponent(unref(Undo2), {
                  class: "size-4",
                  "aria-hidden": "true"
                }, null, _parent2, _scopeId));
                _push2(`Cancelar agendamento</button>`);
              } else {
                _push2(`<!---->`);
              }
              if (unref(j).status === "archived") {
                _push2(`<button type="button" class="btn-secondary w-full"${ssrIncludeBooleanAttr(acting.value) ? " disabled" : ""}${_scopeId}>`);
                _push2(ssrRenderComponent(unref(ArchiveRestore), {
                  class: "size-4",
                  "aria-hidden": "true"
                }, null, _parent2, _scopeId));
                _push2(`Restaurar como rascunho</button>`);
              } else {
                _push2(`<button type="button" class="btn-secondary w-full text-danger-700 hover:border-danger-700 hover:bg-danger-50"${_scopeId}>`);
                _push2(ssrRenderComponent(unref(Archive), {
                  class: "size-4",
                  "aria-hidden": "true"
                }, null, _parent2, _scopeId));
                _push2(`Arquivar</button>`);
              }
              _push2(`</section>`);
            } else {
              _push2(`<!---->`);
            }
            if (unref(j) && unref(j).history.length) {
              _push2(`<section class="card p-5" aria-labelledby="s-hist"${_scopeId}><h2 id="s-hist" class="mb-3 text-lg font-extrabold text-ink"${_scopeId}>Histórico</h2><ol class="space-y-3 border-l border-line pl-4"${_scopeId}><!--[-->`);
              ssrRenderList(unref(j).history, (h) => {
                _push2(`<li class="relative text-sm"${_scopeId}><span class="absolute top-1.5 -left-[1.3rem] size-2 rounded-full bg-action-600 ring-4 ring-white" aria-hidden="true"${_scopeId}></span><p class="font-semibold text-ink"${_scopeId}>${ssrInterpolate(eventLabel[h.event] ?? h.event)}</p><p class="text-xs text-muted"${_scopeId}>${ssrInterpolate(h.user)} · ${ssrInterpolate(unref(formatDateTime)(h.at))}</p>`);
                if (h.event === "renewed" && h.meta?.expires_at) {
                  _push2(`<p class="text-xs text-muted"${_scopeId}>Nova expiração: ${ssrInterpolate(unref(formatDateTime)(h.meta.expires_at))}</p>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</li>`);
              });
              _push2(`<!--]--></ol></section>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</aside></div></form>`);
            if (unref(j)) {
              _push2(`<!--[-->`);
              _push2(ssrRenderComponent(_sfc_main$9, {
                open: confirmArchive.value,
                danger: "",
                "confirm-label": "Arquivar vaga",
                title: "Arquivar esta vaga?",
                message: status.value === "published" ? "A vaga está no ar e será retirada do site imediatamente." : "A vaga será arquivada e não aparecerá publicamente.",
                processing: acting.value,
                onCancel: ($event) => confirmArchive.value = false,
                onConfirm: ($event) => post(`/admin/vagas/${unref(j).id}/arquivar`, () => confirmArchive.value = false)
              }, null, _parent2, _scopeId));
              _push2(ssrRenderComponent(_sfc_main$a, {
                open: renewOpen.value,
                "job-id": unref(j).id,
                title: unref(j).title,
                expired: unref(j).status === "expired",
                presets: __props.validity.presets,
                onClose: ($event) => renewOpen.value = false
              }, null, _parent2, _scopeId));
              _push2(`<!--]-->`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              !editing.value ? (openBlock(), createBlock("div", {
                key: 0,
                class: "mx-auto max-w-6xl"
              }, [
                createVNode(_sfc_main$3, {
                  "ai-configured": !!__props.aiConfigured,
                  onImported: applyImport
                }, null, 8, ["ai-configured"])
              ])) : createCommentVNode("", true),
              createVNode("form", {
                class: "mx-auto max-w-6xl",
                onSubmit: withModifiers(($event) => submit("save"), ["prevent"])
              }, [
                createVNode("header", { class: "mb-5 flex flex-wrap items-center justify-between gap-3" }, [
                  createVNode("div", null, [
                    createVNode(unref(Link), {
                      href: "/admin/vagas",
                      class: "text-sm font-semibold text-action-700 hover:underline"
                    }, {
                      default: withCtx(() => [
                        createTextVNode("← Vagas")
                      ]),
                      _: 1
                    }),
                    createVNode("h1", { class: "mt-1 flex flex-wrap items-center gap-3 text-2xl font-extrabold text-ink" }, [
                      createTextVNode(toDisplayString(editing.value ? "Editar vaga" : "Nova vaga"), 1),
                      unref(j) ? (openBlock(), createBlock(_sfc_main$5, {
                        key: 0,
                        status: unref(j).status,
                        label: unref(j).status_label
                      }, null, 8, ["status", "label"])) : createCommentVNode("", true)
                    ])
                  ])
                ]),
                errorCount.value ? (openBlock(), createBlock("div", {
                  key: 0,
                  id: "resumo-erros",
                  tabindex: "-1",
                  role: "alert",
                  class: "mb-5 rounded-xl border border-danger-700/25 bg-danger-50 p-4 text-sm text-danger-700"
                }, [
                  createVNode("p", { class: "font-bold" }, "Corrija " + toDisplayString(errorCount.value) + " " + toDisplayString(errorCount.value === 1 ? "campo" : "campos") + " antes de continuar:", 1),
                  createVNode("ul", { class: "mt-1 list-disc pl-5" }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(unref(form).errors, (msg, key) => {
                      return openBlock(), createBlock("li", { key }, toDisplayString(msg), 1);
                    }), 128))
                  ])
                ])) : createCommentVNode("", true),
                createVNode("div", { class: "grid gap-6 lg:grid-cols-[1fr_20rem] lg:items-start" }, [
                  createVNode("div", { class: "space-y-6" }, [
                    createVNode("section", {
                      class: "card space-y-4 p-5",
                      "aria-labelledby": "s-basico"
                    }, [
                      createVNode("h2", {
                        id: "s-basico",
                        class: "text-lg font-extrabold text-ink"
                      }, "Informações básicas"),
                      createVNode(_sfc_main$6, {
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
                            "aria-invalid": invalid,
                            "aria-describedby": describedBy
                          }, null, 8, ["onUpdate:modelValue", "aria-invalid", "aria-describedby"]), [
                            [vModelText, unref(form).title]
                          ])
                        ]),
                        _: 1
                      }, 8, ["error"]),
                      createVNode("div", { class: "grid gap-4 sm:grid-cols-2" }, [
                        createVNode(_sfc_main$6, {
                          id: "company_name",
                          label: "Empresa contratante",
                          error: unref(form).errors.company_name,
                          required: ""
                        }, {
                          default: withCtx(({ invalid }) => [
                            createVNode(_sfc_main$7, {
                              id: "company_name",
                              modelValue: unref(form).company_name,
                              "onUpdate:modelValue": [($event) => unref(form).company_name = $event, onCompanyInput],
                              label: "Empresa contratante",
                              endpoint: "/admin/empresas/sugestoes",
                              "min-chars": 1,
                              maxlength: 160,
                              required: "",
                              invalid,
                              placeholder: "Digite para buscar ou cadastrar",
                              onSelect: onCompanySelect
                            }, null, 8, ["modelValue", "onUpdate:modelValue", "invalid"]),
                            pickedCompany.value && !isNewCompany.value ? (openBlock(), createBlock("p", {
                              key: 0,
                              class: "mt-1.5 flex items-center gap-2 text-xs font-semibold text-success-700"
                            }, [
                              pickedCompany.value.logo ? (openBlock(), createBlock("img", {
                                key: 0,
                                src: pickedCompany.value.logo,
                                alt: "",
                                class: "size-5 rounded border border-line bg-white object-contain"
                              }, null, 8, ["src"])) : createCommentVNode("", true),
                              createTextVNode("Empresa já cadastrada: os dados e o logotipo serão reaproveitados.")
                            ])) : isNewCompany.value ? (openBlock(), createBlock("p", {
                              key: 1,
                              class: "mt-1.5 text-xs font-semibold text-info-700"
                            }, "Empresa nova: será cadastrada junto com a vaga. Informe o logotipo abaixo.")) : createCommentVNode("", true)
                          ]),
                          _: 1
                        }, 8, ["error"]),
                        createVNode(_sfc_main$6, {
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
                                }, toDisplayString(c.name) + toDisplayString(c.is_active ? "" : " (inativa)"), 9, ["value"]);
                              }), 128))
                            ], 8, ["onUpdate:modelValue", "aria-invalid", "aria-describedby"]), [
                              [vModelSelect, unref(form).category_id]
                            ])
                          ]),
                          _: 1
                        }, 8, ["error"]),
                        createVNode(_sfc_main$6, {
                          id: "company_website_url",
                          label: "Site da empresa",
                          error: unref(form).errors.company_website_url,
                          hint: "Opcional. Deve começar com https://"
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
                      !pickedCompany.value || !pickedCompany.value.logo || !isNewCompany.value ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "rounded-xl border border-line bg-surface p-4"
                      }, [
                        createVNode(_sfc_main$8, {
                          id: "company_logo",
                          url: unref(form).company_logo_url,
                          "onUpdate:url": ($event) => unref(form).company_logo_url = $event,
                          file: unref(form).company_logo,
                          "onUpdate:file": ($event) => unref(form).company_logo = $event,
                          remove: unref(form).remove_company_logo,
                          "onUpdate:remove": ($event) => unref(form).remove_company_logo = $event,
                          current: pickedCompany.value?.logo ?? null,
                          error: unref(form).errors.company_logo,
                          "url-error": unref(form).errors.company_logo_url,
                          name: unref(form).company_name
                        }, null, 8, ["url", "onUpdate:url", "file", "onUpdate:file", "remove", "onUpdate:remove", "current", "error", "url-error", "name"])
                      ])) : createCommentVNode("", true),
                      createVNode("div", null, [
                        createVNode(_sfc_main$6, {
                          id: "slug",
                          label: "Slug (URL da vaga)",
                          error: unref(form).errors.slug,
                          hint: editing.value ? "Alterar o slug muda a URL pública. Prefira manter." : "Deixe em branco para gerar automaticamente (título + empresa + código)."
                        }, {
                          default: withCtx(({ describedBy, invalid }) => [
                            withDirectives(createVNode("input", {
                              id: "slug",
                              "onUpdate:modelValue": ($event) => unref(form).slug = $event,
                              class: "field font-mono text-[13px]",
                              readonly: editing.value && !slugEdit.value,
                              placeholder: editing.value ? "" : "gerado-automaticamente",
                              "aria-invalid": invalid,
                              "aria-describedby": describedBy
                            }, null, 8, ["onUpdate:modelValue", "readonly", "placeholder", "aria-invalid", "aria-describedby"]), [
                              [vModelText, unref(form).slug]
                            ])
                          ]),
                          _: 1
                        }, 8, ["error", "hint"]),
                        editing.value && !slugEdit.value ? (openBlock(), createBlock("button", {
                          key: 0,
                          type: "button",
                          class: "mt-1.5 text-xs font-bold text-action-700 hover:underline",
                          onClick: ($event) => slugEdit.value = true
                        }, "Editar slug", 8, ["onClick"])) : createCommentVNode("", true)
                      ])
                    ]),
                    createVNode("section", {
                      class: "card space-y-4 p-5",
                      "aria-labelledby": "s-local"
                    }, [
                      createVNode("h2", {
                        id: "s-local",
                        class: "text-lg font-extrabold text-ink"
                      }, "Local e contratação"),
                      createVNode("div", { class: "grid gap-4 sm:grid-cols-2" }, [
                        createVNode(_sfc_main$6, {
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
                        createVNode(_sfc_main$6, {
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
                        createVNode(_sfc_main$6, {
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
                        createVNode(_sfc_main$6, {
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
                        }, 8, ["error", "required"]),
                        createVNode(_sfc_main$6, {
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
                        }, 8, ["error"])
                      ])
                    ]),
                    createVNode("section", {
                      class: "card space-y-4 p-5",
                      "aria-labelledby": "s-salario"
                    }, [
                      createVNode("div", null, [
                        createVNode("h2", {
                          id: "s-salario",
                          class: "text-lg font-extrabold text-ink"
                        }, "Remuneração"),
                        createVNode("p", { class: "text-sm text-muted" }, "Preencha somente se o salário foi divulgado na fonte. Nunca estime valores.")
                      ]),
                      createVNode("div", { class: "grid gap-4 sm:grid-cols-4" }, [
                        createVNode(_sfc_main$6, {
                          id: "salary_min",
                          label: "Mínimo",
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
                        createVNode(_sfc_main$6, {
                          id: "salary_max",
                          label: "Máximo",
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
                        createVNode(_sfc_main$6, {
                          id: "salary_currency",
                          label: "Moeda"
                        }, {
                          default: withCtx(({ describedBy }) => [
                            withDirectives(createVNode("select", {
                              id: "salary_currency",
                              "onUpdate:modelValue": ($event) => unref(form).salary_currency = $event,
                              class: "field",
                              "aria-describedby": describedBy
                            }, [
                              createVNode("option", { value: "BRL" }, "BRL (R$)"),
                              createVNode("option", { value: "USD" }, "USD"),
                              createVNode("option", { value: "EUR" }, "EUR")
                            ], 8, ["onUpdate:modelValue", "aria-describedby"]), [
                              [vModelSelect, unref(form).salary_currency]
                            ])
                          ]),
                          _: 1
                        }),
                        createVNode(_sfc_main$6, {
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
                    ]),
                    createVNode("section", {
                      class: "card space-y-5 p-5",
                      "aria-labelledby": "s-conteudo"
                    }, [
                      createVNode("div", null, [
                        createVNode("h2", {
                          id: "s-conteudo",
                          class: "text-lg font-extrabold text-ink"
                        }, "Conteúdo da vaga"),
                        createVNode("p", { class: "text-sm text-muted" }, "Preserve o texto da fonte. Campos vazios não são exibidos no site. O HTML é sanitizado ao salvar.")
                      ]),
                      (openBlock(), createBlock(Fragment, null, renderList(rich, (r) => {
                        return createVNode(_sfc_main$6, {
                          id: r.key,
                          key: r.key,
                          label: r.label,
                          error: unref(form).errors[r.key],
                          required: "required" in r && r.required
                        }, {
                          default: withCtx(() => [
                            createVNode(_sfc_main$2, {
                              id: r.key,
                              modelValue: unref(form)[r.key],
                              "onUpdate:modelValue": ($event) => unref(form)[r.key] = $event,
                              label: r.label,
                              invalid: !!unref(form).errors[r.key],
                              "min-height": r.key === "description" ? "12rem" : "8rem"
                            }, null, 8, ["id", "modelValue", "onUpdate:modelValue", "label", "invalid", "min-height"])
                          ]),
                          _: 2
                        }, 1032, ["id", "label", "error", "required"]);
                      }), 64)),
                      createVNode(_sfc_main$6, {
                        id: "company_about",
                        label: "Sobre a empresa",
                        error: unref(form).errors.company_about,
                        hint: "Somente informações verificadas."
                      }, {
                        default: withCtx(({ describedBy, invalid }) => [
                          withDirectives(createVNode("textarea", {
                            id: "company_about",
                            "onUpdate:modelValue": ($event) => unref(form).company_about = $event,
                            rows: "3",
                            maxlength: "5000",
                            class: "field",
                            "aria-invalid": invalid,
                            "aria-describedby": describedBy
                          }, null, 8, ["onUpdate:modelValue", "aria-invalid", "aria-describedby"]), [
                            [vModelText, unref(form).company_about]
                          ])
                        ]),
                        _: 1
                      }, 8, ["error"])
                    ]),
                    createVNode("section", {
                      class: "card space-y-4 p-5",
                      "aria-labelledby": "s-fonte"
                    }, [
                      createVNode("h2", {
                        id: "s-fonte",
                        class: "text-lg font-extrabold text-ink"
                      }, "Candidatura e fonte"),
                      createVNode(_sfc_main$6, {
                        id: "platform",
                        label: "Plataforma de contratação",
                        error: unref(form).errors.platform_id,
                        hint: "Por onde o candidato se inscreve. Gerencie a lista em Plataformas.",
                        required: ""
                      }, {
                        default: withCtx(({ describedBy, invalid }) => [
                          withDirectives(createVNode("select", {
                            id: "platform",
                            "onUpdate:modelValue": ($event) => unref(form).platform_id = $event,
                            required: "",
                            class: "field",
                            "aria-invalid": invalid,
                            "aria-describedby": describedBy
                          }, [
                            (openBlock(true), createBlock(Fragment, null, renderList(__props.options.platforms, (o) => {
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
                      byEmail.value ? (openBlock(), createBlock(_sfc_main$6, {
                        key: 0,
                        id: "apply_email",
                        label: "E-mail para candidatura",
                        error: unref(form).errors.apply_email,
                        hint: "Candidatura sem link: o botão abrirá o e-mail do candidato já endereçado.",
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
                      }, 8, ["error"])) : (openBlock(), createBlock(_sfc_main$6, {
                        key: 1,
                        id: "apply_url",
                        label: "URL direta de candidatura",
                        error: unref(form).errors.apply_url,
                        hint: "Para onde o candidato será levado. Aceita apenas http(s); prefira https.",
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
                      }, 8, ["error"])),
                      createVNode("div", { class: "grid gap-4 sm:grid-cols-2" }, [
                        createVNode(_sfc_main$6, {
                          id: "source_url",
                          label: "URL original da vaga",
                          error: unref(form).errors.source_url
                        }, {
                          default: withCtx(({ describedBy, invalid }) => [
                            withDirectives(createVNode("input", {
                              id: "source_url",
                              "onUpdate:modelValue": ($event) => unref(form).source_url = $event,
                              type: "url",
                              maxlength: "1000",
                              class: "field",
                              placeholder: "https://",
                              "aria-invalid": invalid,
                              "aria-describedby": describedBy
                            }, null, 8, ["onUpdate:modelValue", "aria-invalid", "aria-describedby"]), [
                              [vModelText, unref(form).source_url]
                            ])
                          ]),
                          _: 1
                        }, 8, ["error"]),
                        createVNode(_sfc_main$6, {
                          id: "source_name",
                          label: "Fonte",
                          error: unref(form).errors.source_name,
                          hint: "Ex.: Gupy, LinkedIn, site da empresa"
                        }, {
                          default: withCtx(({ describedBy, invalid }) => [
                            withDirectives(createVNode("input", {
                              id: "source_name",
                              "onUpdate:modelValue": ($event) => unref(form).source_name = $event,
                              maxlength: "120",
                              class: "field",
                              "aria-invalid": invalid,
                              "aria-describedby": describedBy
                            }, null, 8, ["onUpdate:modelValue", "aria-invalid", "aria-describedby"]), [
                              [vModelText, unref(form).source_name]
                            ])
                          ]),
                          _: 1
                        }, 8, ["error"]),
                        createVNode(_sfc_main$6, {
                          id: "source_published_at",
                          label: "Publicada originalmente em",
                          error: unref(form).errors.source_published_at,
                          hint: "Data na fonte. Não altera a data de publicação no VagasPlus."
                        }, {
                          default: withCtx(({ describedBy, invalid }) => [
                            withDirectives(createVNode("input", {
                              id: "source_published_at",
                              "onUpdate:modelValue": ($event) => unref(form).source_published_at = $event,
                              type: "datetime-local",
                              class: "field",
                              "aria-invalid": invalid,
                              "aria-describedby": describedBy
                            }, null, 8, ["onUpdate:modelValue", "aria-invalid", "aria-describedby"]), [
                              [vModelText, unref(form).source_published_at]
                            ])
                          ]),
                          _: 1
                        }, 8, ["error"])
                      ])
                    ])
                  ]),
                  createVNode("aside", {
                    class: "space-y-4 lg:sticky lg:top-6",
                    "aria-label": "Publicação"
                  }, [
                    createVNode("section", {
                      class: "card space-y-4 p-5",
                      "aria-labelledby": "s-pub"
                    }, [
                      createVNode("h2", {
                        id: "s-pub",
                        class: "text-lg font-extrabold text-ink"
                      }, "Publicação"),
                      lifecycleEditable.value ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                        createVNode("fieldset", null, [
                          createVNode("legend", { class: "label" }, "Validade da vaga"),
                          createVNode("div", { class: "flex flex-wrap gap-1.5" }, [
                            (openBlock(true), createBlock(Fragment, null, renderList(__props.validity.presets, (d) => {
                              return openBlock(), createBlock("button", {
                                key: d,
                                type: "button",
                                class: ["btn btn-sm rounded-full border", !customValidity.value && unref(form).validity_days === d ? "border-action-600 bg-action-50 text-action-700" : "border-line-strong bg-white text-ink"],
                                "aria-pressed": !customValidity.value && unref(form).validity_days === d,
                                onClick: ($event) => pickValidity(d)
                              }, toDisplayString(d) + " dias", 11, ["aria-pressed", "onClick"]);
                            }), 128)),
                            createVNode("button", {
                              type: "button",
                              class: ["btn btn-sm rounded-full border", customValidity.value ? "border-action-600 bg-action-50 text-action-700" : "border-line-strong bg-white text-ink"],
                              "aria-pressed": customValidity.value,
                              onClick: ($event) => pickValidity(null)
                            }, "Personalizada", 10, ["aria-pressed", "onClick"])
                          ]),
                          createVNode("p", { class: "hint" }, "Padrão: " + toDisplayString(__props.validity.default) + " dias · máximo: " + toDisplayString(__props.validity.max) + " dias. É um prazo operacional do portal, não garante que a vaga siga aberta.", 1)
                        ]),
                        customValidity.value ? (openBlock(), createBlock(_sfc_main$6, {
                          key: 0,
                          id: "expires_at",
                          label: "Expira em",
                          error: unref(form).errors.expires_at
                        }, {
                          default: withCtx(({ describedBy, invalid }) => [
                            withDirectives(createVNode("input", {
                              id: "expires_at",
                              "onUpdate:modelValue": ($event) => unref(form).expires_at = $event,
                              type: "datetime-local",
                              class: "field",
                              "aria-invalid": invalid,
                              "aria-describedby": describedBy
                            }, null, 8, ["onUpdate:modelValue", "aria-invalid", "aria-describedby"]), [
                              [vModelText, unref(form).expires_at]
                            ])
                          ]),
                          _: 1
                        }, 8, ["error"])) : unref(form).errors.expires_at ? (openBlock(), createBlock("p", {
                          key: 1,
                          class: "error-text",
                          role: "alert"
                        }, toDisplayString(unref(form).errors.expires_at), 1)) : createCommentVNode("", true),
                        createVNode(_sfc_main$6, {
                          id: "publish_at",
                          label: "Publicar em",
                          error: unref(form).errors.publish_at,
                          hint: "Deixe vazio para publicar agora. Use data futura para agendar."
                        }, {
                          default: withCtx(({ describedBy, invalid }) => [
                            withDirectives(createVNode("input", {
                              id: "publish_at",
                              "onUpdate:modelValue": ($event) => unref(form).publish_at = $event,
                              type: "datetime-local",
                              class: "field",
                              "aria-invalid": invalid,
                              "aria-describedby": describedBy
                            }, null, 8, ["onUpdate:modelValue", "aria-invalid", "aria-describedby"]), [
                              [vModelText, unref(form).publish_at]
                            ])
                          ]),
                          _: 1
                        }, 8, ["error"])
                      ], 64)) : unref(j) ? (openBlock(), createBlock("dl", {
                        key: 1,
                        class: "space-y-2 text-sm"
                      }, [
                        createVNode("div", { class: "flex justify-between gap-3" }, [
                          createVNode("dt", { class: "text-muted" }, "Publicada em"),
                          createVNode("dd", { class: "font-semibold text-ink" }, toDisplayString(unref(formatDateTime)(unref(j).publish_at)), 1)
                        ]),
                        createVNode("div", { class: "flex justify-between gap-3" }, [
                          createVNode("dt", { class: "text-muted" }, "Expira em"),
                          createVNode("dd", { class: "font-semibold text-ink" }, toDisplayString(unref(formatDateTime)(unref(j).expires_at)), 1)
                        ])
                      ])) : createCommentVNode("", true),
                      createVNode("label", { class: "flex items-start gap-2 text-sm" }, [
                        withDirectives(createVNode("input", {
                          "onUpdate:modelValue": ($event) => unref(form).is_featured = $event,
                          type: "checkbox",
                          class: "mt-0.5 size-4 rounded border-line-strong text-action-600"
                        }, null, 8, ["onUpdate:modelValue"]), [
                          [vModelCheckbox, unref(form).is_featured]
                        ]),
                        createVNode("span", null, [
                          createVNode("span", { class: "font-semibold text-ink" }, "Vaga em destaque"),
                          createVNode("span", { class: "block text-xs text-muted" }, "Aparece na home enquanto estiver válida.")
                        ])
                      ]),
                      createVNode("div", { class: "space-y-2 border-t border-line pt-4" }, [
                        lifecycleEditable.value ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                          createVNode("button", {
                            type: "button",
                            class: "btn-primary w-full",
                            disabled: unref(form).processing,
                            onClick: ($event) => submit("publish")
                          }, [
                            unref(form).processing && unref(form).action === "publish" ? (openBlock(), createBlock(unref(Loader2), {
                              key: 0,
                              class: "size-4 animate-spin"
                            })) : (openBlock(), createBlock(unref(Send), {
                              key: 1,
                              class: "size-4",
                              "aria-hidden": "true"
                            })),
                            createTextVNode("Publicar agora")
                          ], 8, ["disabled", "onClick"]),
                          createVNode("button", {
                            type: "button",
                            class: "btn-secondary w-full",
                            disabled: unref(form).processing,
                            onClick: ($event) => submit("schedule")
                          }, [
                            createVNode(unref(CalendarClock), {
                              class: "size-4",
                              "aria-hidden": "true"
                            }),
                            createTextVNode("Agendar publicação")
                          ], 8, ["disabled", "onClick"])
                        ], 64)) : createCommentVNode("", true),
                        createVNode("button", {
                          type: "submit",
                          class: ["w-full", lifecycleEditable.value ? "btn-ghost" : "btn-primary"],
                          disabled: unref(form).processing
                        }, [
                          unref(form).processing && unref(form).action === "save" ? (openBlock(), createBlock(unref(Loader2), {
                            key: 0,
                            class: "size-4 animate-spin"
                          })) : (openBlock(), createBlock(unref(Save), {
                            key: 1,
                            class: "size-4",
                            "aria-hidden": "true"
                          })),
                          createTextVNode(toDisplayString(lifecycleEditable.value ? "Salvar como rascunho" : "Salvar alterações"), 1)
                        ], 10, ["disabled"])
                      ])
                    ]),
                    unref(j) ? (openBlock(), createBlock("section", {
                      key: 0,
                      class: "card space-y-2 p-5",
                      "aria-labelledby": "s-acoes"
                    }, [
                      createVNode("h2", {
                        id: "s-acoes",
                        class: "text-lg font-extrabold text-ink"
                      }, "Ações"),
                      createVNode("a", {
                        href: unref(j).preview_url,
                        target: "_blank",
                        rel: "noopener",
                        class: "btn-secondary w-full"
                      }, [
                        createVNode(unref(Eye), {
                          class: "size-4",
                          "aria-hidden": "true"
                        }),
                        createTextVNode("Pré-visualizar")
                      ], 8, ["href"]),
                      unref(j).public_url ? (openBlock(), createBlock("a", {
                        key: 0,
                        href: unref(j).public_url,
                        target: "_blank",
                        rel: "noopener",
                        class: "btn-secondary w-full"
                      }, [
                        createVNode(unref(ExternalLink), {
                          class: "size-4",
                          "aria-hidden": "true"
                        }),
                        createTextVNode("Ver no site")
                      ], 8, ["href"])) : createCommentVNode("", true),
                      ["published", "expired"].includes(unref(j).status) ? (openBlock(), createBlock("button", {
                        key: 1,
                        type: "button",
                        class: "btn-secondary w-full",
                        onClick: ($event) => renewOpen.value = true
                      }, [
                        createVNode(unref(RefreshCw), {
                          class: "size-4",
                          "aria-hidden": "true"
                        }),
                        createTextVNode("Renovar validade")
                      ], 8, ["onClick"])) : createCommentVNode("", true),
                      unref(j).status === "scheduled" ? (openBlock(), createBlock("button", {
                        key: 2,
                        type: "button",
                        class: "btn-secondary w-full",
                        disabled: acting.value,
                        onClick: ($event) => post(`/admin/vagas/${unref(j).id}/cancelar-agendamento`)
                      }, [
                        createVNode(unref(Undo2), {
                          class: "size-4",
                          "aria-hidden": "true"
                        }),
                        createTextVNode("Cancelar agendamento")
                      ], 8, ["disabled", "onClick"])) : createCommentVNode("", true),
                      unref(j).status === "archived" ? (openBlock(), createBlock("button", {
                        key: 3,
                        type: "button",
                        class: "btn-secondary w-full",
                        disabled: acting.value,
                        onClick: ($event) => post(`/admin/vagas/${unref(j).id}/restaurar`)
                      }, [
                        createVNode(unref(ArchiveRestore), {
                          class: "size-4",
                          "aria-hidden": "true"
                        }),
                        createTextVNode("Restaurar como rascunho")
                      ], 8, ["disabled", "onClick"])) : (openBlock(), createBlock("button", {
                        key: 4,
                        type: "button",
                        class: "btn-secondary w-full text-danger-700 hover:border-danger-700 hover:bg-danger-50",
                        onClick: ($event) => confirmArchive.value = true
                      }, [
                        createVNode(unref(Archive), {
                          class: "size-4",
                          "aria-hidden": "true"
                        }),
                        createTextVNode("Arquivar")
                      ], 8, ["onClick"]))
                    ])) : createCommentVNode("", true),
                    unref(j) && unref(j).history.length ? (openBlock(), createBlock("section", {
                      key: 1,
                      class: "card p-5",
                      "aria-labelledby": "s-hist"
                    }, [
                      createVNode("h2", {
                        id: "s-hist",
                        class: "mb-3 text-lg font-extrabold text-ink"
                      }, "Histórico"),
                      createVNode("ol", { class: "space-y-3 border-l border-line pl-4" }, [
                        (openBlock(true), createBlock(Fragment, null, renderList(unref(j).history, (h) => {
                          return openBlock(), createBlock("li", {
                            key: h.id,
                            class: "relative text-sm"
                          }, [
                            createVNode("span", {
                              class: "absolute top-1.5 -left-[1.3rem] size-2 rounded-full bg-action-600 ring-4 ring-white",
                              "aria-hidden": "true"
                            }),
                            createVNode("p", { class: "font-semibold text-ink" }, toDisplayString(eventLabel[h.event] ?? h.event), 1),
                            createVNode("p", { class: "text-xs text-muted" }, toDisplayString(h.user) + " · " + toDisplayString(unref(formatDateTime)(h.at)), 1),
                            h.event === "renewed" && h.meta?.expires_at ? (openBlock(), createBlock("p", {
                              key: 0,
                              class: "text-xs text-muted"
                            }, "Nova expiração: " + toDisplayString(unref(formatDateTime)(h.meta.expires_at)), 1)) : createCommentVNode("", true)
                          ]);
                        }), 128))
                      ])
                    ])) : createCommentVNode("", true)
                  ])
                ])
              ], 40, ["onSubmit"]),
              unref(j) ? (openBlock(), createBlock(Fragment, { key: 1 }, [
                createVNode(_sfc_main$9, {
                  open: confirmArchive.value,
                  danger: "",
                  "confirm-label": "Arquivar vaga",
                  title: "Arquivar esta vaga?",
                  message: status.value === "published" ? "A vaga está no ar e será retirada do site imediatamente." : "A vaga será arquivada e não aparecerá publicamente.",
                  processing: acting.value,
                  onCancel: ($event) => confirmArchive.value = false,
                  onConfirm: ($event) => post(`/admin/vagas/${unref(j).id}/arquivar`, () => confirmArchive.value = false)
                }, null, 8, ["open", "message", "processing", "onCancel", "onConfirm"]),
                createVNode(_sfc_main$a, {
                  open: renewOpen.value,
                  "job-id": unref(j).id,
                  title: unref(j).title,
                  expired: unref(j).status === "expired",
                  presets: __props.validity.presets,
                  onClose: ($event) => renewOpen.value = false
                }, null, 8, ["open", "job-id", "title", "expired", "presets", "onClose"])
              ], 64)) : createCommentVNode("", true)
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/JobForm.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ inheritAttrs: false },
  __name: "Form",
  __ssrInlineRender: true,
  setup(__props) {
    const attrs = useAttrs();
    const formKey = computed(() => attrs.job?.id ?? "nova");
    const forward = computed(() => ({ job: attrs.job, aiConfigured: attrs.aiConfigured, categories: attrs.categories, options: attrs.options, validity: attrs.validity }));
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$1, mergeProps({ key: formKey.value }, forward.value, _attrs), null, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/pages/Admin/Jobs/Form.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=Form-DzuN9uEC.js.map
