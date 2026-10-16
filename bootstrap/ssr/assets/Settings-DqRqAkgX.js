import { defineComponent, ref, mergeProps, withCtx, unref, withDirectives, createVNode, vModelText, openBlock, createBlock, Fragment, renderList, withModifiers, createTextVNode, toDisplayString, createCommentVNode, vModelCheckbox, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderAttr, ssrRenderClass, ssrInterpolate, ssrRenderList, ssrIncludeBooleanAttr, ssrLooseContain } from "vue/server-renderer";
import { useForm } from "@inertiajs/vue3";
import { ExternalLink, CheckCircle2, XCircle, Loader2, Save } from "lucide-vue-next";
import { _ as _sfc_main$2 } from "./Field-CI53GIau.js";
import { _ as _sfc_main$1 } from "./AdminLayout-BocNC89A.js";
import "./FlashMessages-mTMlubKC.js";
import "./SeoHead-BMQcIEwx.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Settings",
  __ssrInlineRender: true,
  props: {
    settings: {},
    placements: {},
    gemini: {}
  },
  setup(__props) {
    const props = __props;
    const form = useForm({
      default_validity_days: props.settings.default_validity_days,
      max_validity_days: props.settings.max_validity_days,
      contact_email: props.settings.contact_email,
      adsense_enabled: props.settings.adsense_enabled,
      adsense_client: props.settings.adsense_client,
      gemini_api_key: "",
      remove_gemini_key: false,
      gemini_model: props.gemini.model,
      adsense_slots: Object.fromEntries(props.placements.map((p) => [p.key, props.settings.adsense_slots?.[p.key] ?? ""]))
    });
    const save = () => form.put("/admin/configuracoes", { preserveScroll: true, onSuccess: () => {
      form.gemini_api_key = "";
      form.remove_gemini_key = false;
    } });
    const testing = ref(false);
    const testResult = ref(null);
    function csrf() {
      const m = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]+)/);
      return m ? decodeURIComponent(m[1]) : "";
    }
    async function testGemini() {
      testing.value = true;
      testResult.value = null;
      try {
        const res = await fetch("/admin/configuracoes/testar-gemini", {
          method: "POST",
          credentials: "same-origin",
          headers: { "Content-Type": "application/json", Accept: "application/json", "X-XSRF-TOKEN": csrf(), "X-Requested-With": "XMLHttpRequest" },
          body: JSON.stringify({ key: form.gemini_api_key || null, model: form.gemini_model || null })
        });
        const json = await res.json().catch(() => ({}));
        testResult.value = { ok: res.ok && json.ok === true, message: json.message ?? Object.values(json.errors ?? {}).flat()[0] ?? "Falha no teste.", received: json.received ?? null };
      } catch {
        testResult.value = { ok: false, message: "Falha de conexão." };
      } finally {
        testing.value = false;
      }
    }
    const slotError = (key) => form.errors[`adsense_slots.${key}`];
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$1, mergeProps({ title: "Configurações" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="mx-auto max-w-3xl"${_scopeId}><header class="mb-5"${_scopeId}><h1 class="text-2xl font-extrabold text-ink"${_scopeId}>Configurações</h1><p class="text-sm text-muted"${_scopeId}>Regras operacionais e publicidade do portal.</p></header><form class="space-y-6"${_scopeId}><section class="card space-y-5 p-5 sm:p-6" aria-labelledby="cfg-validade"${_scopeId}><h2 id="cfg-validade" class="text-lg font-extrabold text-ink"${_scopeId}>Validade das vagas</h2><div class="grid gap-4 sm:grid-cols-2"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$2, {
              id: "default_validity_days",
              label: "Validade padrão (dias)",
              error: unref(form).errors.default_validity_days,
              hint: "Sugerida ao publicar uma vaga.",
              required: ""
            }, {
              default: withCtx(({ describedBy, invalid }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<input id="default_validity_days"${ssrRenderAttr("value", unref(form).default_validity_days)} type="number" min="1" max="365" required class="field"${ssrRenderAttr("aria-invalid", invalid)}${ssrRenderAttr("aria-describedby", describedBy)}${_scopeId2}>`);
                } else {
                  return [
                    withDirectives(createVNode("input", {
                      id: "default_validity_days",
                      "onUpdate:modelValue": ($event) => unref(form).default_validity_days = $event,
                      type: "number",
                      min: "1",
                      max: "365",
                      required: "",
                      class: "field",
                      "aria-invalid": invalid,
                      "aria-describedby": describedBy
                    }, null, 8, ["onUpdate:modelValue", "aria-invalid", "aria-describedby"]), [
                      [
                        vModelText,
                        unref(form).default_validity_days,
                        void 0,
                        { number: true }
                      ]
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$2, {
              id: "max_validity_days",
              label: "Validade máxima (dias)",
              error: unref(form).errors.max_validity_days,
              hint: "Nenhuma vaga pode ser publicada ou renovada além deste prazo.",
              required: ""
            }, {
              default: withCtx(({ describedBy, invalid }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<input id="max_validity_days"${ssrRenderAttr("value", unref(form).max_validity_days)} type="number" min="1" max="365" required class="field"${ssrRenderAttr("aria-invalid", invalid)}${ssrRenderAttr("aria-describedby", describedBy)}${_scopeId2}>`);
                } else {
                  return [
                    withDirectives(createVNode("input", {
                      id: "max_validity_days",
                      "onUpdate:modelValue": ($event) => unref(form).max_validity_days = $event,
                      type: "number",
                      min: "1",
                      max: "365",
                      required: "",
                      class: "field",
                      "aria-invalid": invalid,
                      "aria-describedby": describedBy
                    }, null, 8, ["onUpdate:modelValue", "aria-invalid", "aria-describedby"]), [
                      [
                        vModelText,
                        unref(form).max_validity_days,
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
              id: "contact_email",
              label: "E-mail de contato público",
              error: unref(form).errors.contact_email,
              hint: "Exibido no rodapé, nas páginas institucionais e nos espaços “Anuncie aqui”.",
              required: ""
            }, {
              default: withCtx(({ describedBy, invalid }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<input id="contact_email"${ssrRenderAttr("value", unref(form).contact_email)} type="email" required class="field"${ssrRenderAttr("aria-invalid", invalid)}${ssrRenderAttr("aria-describedby", describedBy)}${_scopeId2}>`);
                } else {
                  return [
                    withDirectives(createVNode("input", {
                      id: "contact_email",
                      "onUpdate:modelValue": ($event) => unref(form).contact_email = $event,
                      type: "email",
                      required: "",
                      class: "field",
                      "aria-invalid": invalid,
                      "aria-describedby": describedBy
                    }, null, 8, ["onUpdate:modelValue", "aria-invalid", "aria-describedby"]), [
                      [vModelText, unref(form).contact_email]
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</section><section class="card space-y-5 p-5 sm:p-6" aria-labelledby="cfg-ia"${_scopeId}><div${_scopeId}><h2 id="cfg-ia" class="text-lg font-extrabold text-ink"${_scopeId}>IA para importar vagas (Google Gemini)</h2><p class="mt-1 text-sm text-muted"${_scopeId}>Lê links e textos de qualquer site e preenche o formulário da vaga. A chave é gratuita em <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1 font-semibold text-action-700 hover:underline"${_scopeId}>Google AI Studio`);
            _push2(ssrRenderComponent(unref(ExternalLink), {
              class: "size-3",
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
            _push2(`</a>. Só é usada quando você importa uma vaga; o site público nunca chama a IA.</p></div><p class="${ssrRenderClass([__props.gemini.has_key ? "text-success-700" : "text-warning-700", "flex items-center gap-2 text-sm font-semibold"])}"${_scopeId}>`);
            if (__props.gemini.has_key) {
              _push2(ssrRenderComponent(unref(CheckCircle2), {
                class: "size-4",
                "aria-hidden": "true"
              }, null, _parent2, _scopeId));
            } else {
              _push2(ssrRenderComponent(unref(XCircle), {
                class: "size-4",
                "aria-hidden": "true"
              }, null, _parent2, _scopeId));
            }
            if (__props.gemini.has_key) {
              _push2(`<!--[-->Chave configurada (${ssrInterpolate(__props.gemini.masked)}) · origem: ${ssrInterpolate(__props.gemini.source === "painel" ? "este painel" : "arquivo .env")}<!--]-->`);
            } else {
              _push2(`<!--[-->Nenhuma chave configurada. Sem ela, só páginas com dados estruturados e o texto colado (regras simples) são lidos.<!--]-->`);
            }
            _push2(`</p>`);
            _push2(ssrRenderComponent(_sfc_main$2, {
              id: "gemini_api_key",
              label: "Chave de API do Gemini",
              error: unref(form).errors.gemini_api_key,
              hint: __props.gemini.has_key ? "Deixe em branco para manter a chave atual. Digite uma nova para substituir." : "Cole a chave inteira, sem aspas nem espaços. Fica guardada criptografada."
            }, {
              default: withCtx(({ describedBy, invalid }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<input id="gemini_api_key"${ssrRenderAttr("value", unref(form).gemini_api_key)} type="text" name="gemini-key-field" class="field font-mono text-[13px] [-webkit-text-security:disc]" placeholder="Cole a chave aqui" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" data-1p-ignore data-lpignore="true"${ssrRenderAttr("aria-invalid", invalid)}${ssrRenderAttr("aria-describedby", describedBy)}${_scopeId2}>`);
                } else {
                  return [
                    withDirectives(createVNode("input", {
                      id: "gemini_api_key",
                      "onUpdate:modelValue": ($event) => unref(form).gemini_api_key = $event,
                      type: "text",
                      name: "gemini-key-field",
                      class: "field font-mono text-[13px] [-webkit-text-security:disc]",
                      placeholder: "Cole a chave aqui",
                      autocomplete: "off",
                      autocapitalize: "off",
                      autocorrect: "off",
                      spellcheck: "false",
                      "data-1p-ignore": "",
                      "data-lpignore": "true",
                      "aria-invalid": invalid,
                      "aria-describedby": describedBy
                    }, null, 8, ["onUpdate:modelValue", "aria-invalid", "aria-describedby"]), [
                      [vModelText, unref(form).gemini_api_key]
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$2, {
              id: "gemini_model",
              label: "Modelo",
              error: unref(form).errors.gemini_model,
              hint: "Padrão: gemini-3.5-flash-lite (rápido e com camada gratuita). O Google desativa modelos antigos: se der erro de modelo, troque por outro da lista."
            }, {
              default: withCtx(({ describedBy, invalid }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<input id="gemini_model"${ssrRenderAttr("value", unref(form).gemini_model)} list="gemini-models" class="field font-mono text-[13px]" autocomplete="off"${ssrRenderAttr("aria-invalid", invalid)}${ssrRenderAttr("aria-describedby", describedBy)}${_scopeId2}><datalist id="gemini-models"${_scopeId2}><!--[-->`);
                  ssrRenderList(__props.gemini.models, (m) => {
                    _push3(`<option${ssrRenderAttr("value", m)}${_scopeId2}></option>`);
                  });
                  _push3(`<!--]--></datalist>`);
                } else {
                  return [
                    withDirectives(createVNode("input", {
                      id: "gemini_model",
                      "onUpdate:modelValue": ($event) => unref(form).gemini_model = $event,
                      list: "gemini-models",
                      class: "field font-mono text-[13px]",
                      autocomplete: "off",
                      "aria-invalid": invalid,
                      "aria-describedby": describedBy
                    }, null, 8, ["onUpdate:modelValue", "aria-invalid", "aria-describedby"]), [
                      [vModelText, unref(form).gemini_model]
                    ]),
                    createVNode("datalist", { id: "gemini-models" }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(__props.gemini.models, (m) => {
                        return openBlock(), createBlock("option", {
                          key: m,
                          value: m
                        }, null, 8, ["value"]);
                      }), 128))
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`<div class="flex flex-wrap items-center gap-3"${_scopeId}><button type="button" class="btn-secondary"${ssrIncludeBooleanAttr(testing.value || !__props.gemini.has_key && !unref(form).gemini_api_key) ? " disabled" : ""}${_scopeId}>`);
            if (testing.value) {
              _push2(ssrRenderComponent(unref(Loader2), {
                class: "size-4 animate-spin",
                "aria-hidden": "true"
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(`${ssrInterpolate(testing.value ? "Testando…" : "Testar conexão")}</button>`);
            if (__props.gemini.source === "painel") {
              _push2(`<label class="flex items-center gap-2 text-sm text-muted"${_scopeId}><input${ssrIncludeBooleanAttr(Array.isArray(unref(form).remove_gemini_key) ? ssrLooseContain(unref(form).remove_gemini_key, null) : unref(form).remove_gemini_key) ? " checked" : ""} type="checkbox" class="size-4 rounded border-line-strong text-action-600"${_scopeId}>Remover a chave salva</label>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
            if (testResult.value) {
              _push2(`<p class="${ssrRenderClass([testResult.value.ok ? "bg-success-50 text-success-700" : "bg-danger-50 text-danger-700", "flex items-start gap-2 rounded-lg p-3 text-sm font-medium"])}" role="status"${_scopeId}>`);
              if (testResult.value.ok) {
                _push2(ssrRenderComponent(unref(CheckCircle2), {
                  class: "mt-0.5 size-4 shrink-0",
                  "aria-hidden": "true"
                }, null, _parent2, _scopeId));
              } else {
                _push2(ssrRenderComponent(unref(XCircle), {
                  class: "mt-0.5 size-4 shrink-0",
                  "aria-hidden": "true"
                }, null, _parent2, _scopeId));
              }
              _push2(`${ssrInterpolate(testResult.value.message)} `);
              if (testResult.value.received) {
                _push2(`<span class="mt-1 block text-xs font-normal"${_scopeId}>Chave recebida pelo sistema: ${ssrInterpolate(testResult.value.received)}. Compare com a que você copiou.</span>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<p class="text-xs text-muted"${_scopeId}>Privacidade: no plano gratuito o Google pode usar o conteúdo enviado para melhorar os produtos dele. Só enviamos o texto público da vaga, nunca dados de candidatos ou de quem enviou a vaga.</p></section><section class="card space-y-5 p-5 sm:p-6" aria-labelledby="cfg-ads"${_scopeId}><div${_scopeId}><h2 id="cfg-ads" class="text-lg font-extrabold text-ink"${_scopeId}>Google AdSense</h2><p class="mt-1 text-sm text-muted"${_scopeId}>Cole o ID do editor e o ID de cada unidade de anúncio criada no <a href="https://adsense.google.com" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1 font-semibold text-action-700 hover:underline"${_scopeId}>painel do AdSense`);
            _push2(ssrRenderComponent(unref(ExternalLink), {
              class: "size-3",
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
            _push2(`</a>. Posições sem ID continuam mostrando “Anuncie aqui” (venda direta).</p></div><label class="flex items-start gap-2 text-sm"${_scopeId}><input${ssrIncludeBooleanAttr(Array.isArray(unref(form).adsense_enabled) ? ssrLooseContain(unref(form).adsense_enabled, null) : unref(form).adsense_enabled) ? " checked" : ""} type="checkbox" class="mt-0.5 size-4 rounded border-line-strong text-action-600"${_scopeId}><span${_scopeId}><span class="font-semibold text-ink"${_scopeId}>Ativar AdSense no site</span><span class="block text-xs text-muted"${_scopeId}>Carrega o script do Google e exibe as unidades configuradas abaixo.</span></span></label>`);
            _push2(ssrRenderComponent(_sfc_main$2, {
              id: "adsense_client",
              label: "ID do editor",
              error: unref(form).errors.adsense_client,
              hint: "Formato: ca-pub-0000000000000000. O arquivo /ads.txt é gerado automaticamente a partir dele."
            }, {
              default: withCtx(({ describedBy, invalid }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<input id="adsense_client"${ssrRenderAttr("value", unref(form).adsense_client)} class="field font-mono text-[13px]" placeholder="ca-pub-0000000000000000" autocomplete="off" spellcheck="false"${ssrRenderAttr("aria-invalid", invalid)}${ssrRenderAttr("aria-describedby", describedBy)}${_scopeId2}>`);
                } else {
                  return [
                    withDirectives(createVNode("input", {
                      id: "adsense_client",
                      "onUpdate:modelValue": ($event) => unref(form).adsense_client = $event,
                      class: "field font-mono text-[13px]",
                      placeholder: "ca-pub-0000000000000000",
                      autocomplete: "off",
                      spellcheck: "false",
                      "aria-invalid": invalid,
                      "aria-describedby": describedBy
                    }, null, 8, ["onUpdate:modelValue", "aria-invalid", "aria-describedby"]), [
                      [vModelText, unref(form).adsense_client]
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`<fieldset${_scopeId}><legend class="label"${_scopeId}>ID da unidade de anúncio por posição</legend><div class="divide-y divide-line rounded-xl border border-line"${_scopeId}><!--[-->`);
            ssrRenderList(__props.placements, (p) => {
              _push2(`<div class="grid items-center gap-2 px-4 py-3 sm:grid-cols-[1fr_12rem]"${_scopeId}><label${ssrRenderAttr("for", `slot-${p.key}`)} class="text-sm font-medium text-ink"${_scopeId}>${ssrInterpolate(p.label)}</label><div${_scopeId}><input${ssrRenderAttr("id", `slot-${p.key}`)}${ssrRenderAttr("value", unref(form).adsense_slots[p.key])} inputmode="numeric" class="field font-mono text-[13px]" placeholder="1234567890" autocomplete="off"${ssrRenderAttr("aria-invalid", !!slotError(p.key))}${_scopeId}>`);
              if (slotError(p.key)) {
                _push2(`<p class="error-text" role="alert"${_scopeId}>${ssrInterpolate(slotError(p.key))}</p>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div></div>`);
            });
            _push2(`<!--]--></div></fieldset></section><button type="submit" class="btn-primary"${ssrIncludeBooleanAttr(unref(form).processing) ? " disabled" : ""}${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Save), {
              class: "size-4",
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
            _push2(`Salvar configurações</button></form></div>`);
          } else {
            return [
              createVNode("div", { class: "mx-auto max-w-3xl" }, [
                createVNode("header", { class: "mb-5" }, [
                  createVNode("h1", { class: "text-2xl font-extrabold text-ink" }, "Configurações"),
                  createVNode("p", { class: "text-sm text-muted" }, "Regras operacionais e publicidade do portal.")
                ]),
                createVNode("form", {
                  class: "space-y-6",
                  onSubmit: withModifiers(save, ["prevent"])
                }, [
                  createVNode("section", {
                    class: "card space-y-5 p-5 sm:p-6",
                    "aria-labelledby": "cfg-validade"
                  }, [
                    createVNode("h2", {
                      id: "cfg-validade",
                      class: "text-lg font-extrabold text-ink"
                    }, "Validade das vagas"),
                    createVNode("div", { class: "grid gap-4 sm:grid-cols-2" }, [
                      createVNode(_sfc_main$2, {
                        id: "default_validity_days",
                        label: "Validade padrão (dias)",
                        error: unref(form).errors.default_validity_days,
                        hint: "Sugerida ao publicar uma vaga.",
                        required: ""
                      }, {
                        default: withCtx(({ describedBy, invalid }) => [
                          withDirectives(createVNode("input", {
                            id: "default_validity_days",
                            "onUpdate:modelValue": ($event) => unref(form).default_validity_days = $event,
                            type: "number",
                            min: "1",
                            max: "365",
                            required: "",
                            class: "field",
                            "aria-invalid": invalid,
                            "aria-describedby": describedBy
                          }, null, 8, ["onUpdate:modelValue", "aria-invalid", "aria-describedby"]), [
                            [
                              vModelText,
                              unref(form).default_validity_days,
                              void 0,
                              { number: true }
                            ]
                          ])
                        ]),
                        _: 1
                      }, 8, ["error"]),
                      createVNode(_sfc_main$2, {
                        id: "max_validity_days",
                        label: "Validade máxima (dias)",
                        error: unref(form).errors.max_validity_days,
                        hint: "Nenhuma vaga pode ser publicada ou renovada além deste prazo.",
                        required: ""
                      }, {
                        default: withCtx(({ describedBy, invalid }) => [
                          withDirectives(createVNode("input", {
                            id: "max_validity_days",
                            "onUpdate:modelValue": ($event) => unref(form).max_validity_days = $event,
                            type: "number",
                            min: "1",
                            max: "365",
                            required: "",
                            class: "field",
                            "aria-invalid": invalid,
                            "aria-describedby": describedBy
                          }, null, 8, ["onUpdate:modelValue", "aria-invalid", "aria-describedby"]), [
                            [
                              vModelText,
                              unref(form).max_validity_days,
                              void 0,
                              { number: true }
                            ]
                          ])
                        ]),
                        _: 1
                      }, 8, ["error"])
                    ]),
                    createVNode(_sfc_main$2, {
                      id: "contact_email",
                      label: "E-mail de contato público",
                      error: unref(form).errors.contact_email,
                      hint: "Exibido no rodapé, nas páginas institucionais e nos espaços “Anuncie aqui”.",
                      required: ""
                    }, {
                      default: withCtx(({ describedBy, invalid }) => [
                        withDirectives(createVNode("input", {
                          id: "contact_email",
                          "onUpdate:modelValue": ($event) => unref(form).contact_email = $event,
                          type: "email",
                          required: "",
                          class: "field",
                          "aria-invalid": invalid,
                          "aria-describedby": describedBy
                        }, null, 8, ["onUpdate:modelValue", "aria-invalid", "aria-describedby"]), [
                          [vModelText, unref(form).contact_email]
                        ])
                      ]),
                      _: 1
                    }, 8, ["error"])
                  ]),
                  createVNode("section", {
                    class: "card space-y-5 p-5 sm:p-6",
                    "aria-labelledby": "cfg-ia"
                  }, [
                    createVNode("div", null, [
                      createVNode("h2", {
                        id: "cfg-ia",
                        class: "text-lg font-extrabold text-ink"
                      }, "IA para importar vagas (Google Gemini)"),
                      createVNode("p", { class: "mt-1 text-sm text-muted" }, [
                        createTextVNode("Lê links e textos de qualquer site e preenche o formulário da vaga. A chave é gratuita em "),
                        createVNode("a", {
                          href: "https://aistudio.google.com/apikey",
                          target: "_blank",
                          rel: "noopener noreferrer",
                          class: "inline-flex items-center gap-1 font-semibold text-action-700 hover:underline"
                        }, [
                          createTextVNode("Google AI Studio"),
                          createVNode(unref(ExternalLink), {
                            class: "size-3",
                            "aria-hidden": "true"
                          })
                        ]),
                        createTextVNode(". Só é usada quando você importa uma vaga; o site público nunca chama a IA.")
                      ])
                    ]),
                    createVNode("p", {
                      class: ["flex items-center gap-2 text-sm font-semibold", __props.gemini.has_key ? "text-success-700" : "text-warning-700"]
                    }, [
                      __props.gemini.has_key ? (openBlock(), createBlock(unref(CheckCircle2), {
                        key: 0,
                        class: "size-4",
                        "aria-hidden": "true"
                      })) : (openBlock(), createBlock(unref(XCircle), {
                        key: 1,
                        class: "size-4",
                        "aria-hidden": "true"
                      })),
                      __props.gemini.has_key ? (openBlock(), createBlock(Fragment, { key: 2 }, [
                        createTextVNode("Chave configurada (" + toDisplayString(__props.gemini.masked) + ") · origem: " + toDisplayString(__props.gemini.source === "painel" ? "este painel" : "arquivo .env"), 1)
                      ], 64)) : (openBlock(), createBlock(Fragment, { key: 3 }, [
                        createTextVNode("Nenhuma chave configurada. Sem ela, só páginas com dados estruturados e o texto colado (regras simples) são lidos.")
                      ], 64))
                    ], 2),
                    createVNode(_sfc_main$2, {
                      id: "gemini_api_key",
                      label: "Chave de API do Gemini",
                      error: unref(form).errors.gemini_api_key,
                      hint: __props.gemini.has_key ? "Deixe em branco para manter a chave atual. Digite uma nova para substituir." : "Cole a chave inteira, sem aspas nem espaços. Fica guardada criptografada."
                    }, {
                      default: withCtx(({ describedBy, invalid }) => [
                        withDirectives(createVNode("input", {
                          id: "gemini_api_key",
                          "onUpdate:modelValue": ($event) => unref(form).gemini_api_key = $event,
                          type: "text",
                          name: "gemini-key-field",
                          class: "field font-mono text-[13px] [-webkit-text-security:disc]",
                          placeholder: "Cole a chave aqui",
                          autocomplete: "off",
                          autocapitalize: "off",
                          autocorrect: "off",
                          spellcheck: "false",
                          "data-1p-ignore": "",
                          "data-lpignore": "true",
                          "aria-invalid": invalid,
                          "aria-describedby": describedBy
                        }, null, 8, ["onUpdate:modelValue", "aria-invalid", "aria-describedby"]), [
                          [vModelText, unref(form).gemini_api_key]
                        ])
                      ]),
                      _: 1
                    }, 8, ["error", "hint"]),
                    createVNode(_sfc_main$2, {
                      id: "gemini_model",
                      label: "Modelo",
                      error: unref(form).errors.gemini_model,
                      hint: "Padrão: gemini-3.5-flash-lite (rápido e com camada gratuita). O Google desativa modelos antigos: se der erro de modelo, troque por outro da lista."
                    }, {
                      default: withCtx(({ describedBy, invalid }) => [
                        withDirectives(createVNode("input", {
                          id: "gemini_model",
                          "onUpdate:modelValue": ($event) => unref(form).gemini_model = $event,
                          list: "gemini-models",
                          class: "field font-mono text-[13px]",
                          autocomplete: "off",
                          "aria-invalid": invalid,
                          "aria-describedby": describedBy
                        }, null, 8, ["onUpdate:modelValue", "aria-invalid", "aria-describedby"]), [
                          [vModelText, unref(form).gemini_model]
                        ]),
                        createVNode("datalist", { id: "gemini-models" }, [
                          (openBlock(true), createBlock(Fragment, null, renderList(__props.gemini.models, (m) => {
                            return openBlock(), createBlock("option", {
                              key: m,
                              value: m
                            }, null, 8, ["value"]);
                          }), 128))
                        ])
                      ]),
                      _: 1
                    }, 8, ["error"]),
                    createVNode("div", { class: "flex flex-wrap items-center gap-3" }, [
                      createVNode("button", {
                        type: "button",
                        class: "btn-secondary",
                        disabled: testing.value || !__props.gemini.has_key && !unref(form).gemini_api_key,
                        onClick: testGemini
                      }, [
                        testing.value ? (openBlock(), createBlock(unref(Loader2), {
                          key: 0,
                          class: "size-4 animate-spin",
                          "aria-hidden": "true"
                        })) : createCommentVNode("", true),
                        createTextVNode(toDisplayString(testing.value ? "Testando…" : "Testar conexão"), 1)
                      ], 8, ["disabled"]),
                      __props.gemini.source === "painel" ? (openBlock(), createBlock("label", {
                        key: 0,
                        class: "flex items-center gap-2 text-sm text-muted"
                      }, [
                        withDirectives(createVNode("input", {
                          "onUpdate:modelValue": ($event) => unref(form).remove_gemini_key = $event,
                          type: "checkbox",
                          class: "size-4 rounded border-line-strong text-action-600"
                        }, null, 8, ["onUpdate:modelValue"]), [
                          [vModelCheckbox, unref(form).remove_gemini_key]
                        ]),
                        createTextVNode("Remover a chave salva")
                      ])) : createCommentVNode("", true)
                    ]),
                    testResult.value ? (openBlock(), createBlock("p", {
                      key: 0,
                      class: ["flex items-start gap-2 rounded-lg p-3 text-sm font-medium", testResult.value.ok ? "bg-success-50 text-success-700" : "bg-danger-50 text-danger-700"],
                      role: "status"
                    }, [
                      testResult.value.ok ? (openBlock(), createBlock(unref(CheckCircle2), {
                        key: 0,
                        class: "mt-0.5 size-4 shrink-0",
                        "aria-hidden": "true"
                      })) : (openBlock(), createBlock(unref(XCircle), {
                        key: 1,
                        class: "mt-0.5 size-4 shrink-0",
                        "aria-hidden": "true"
                      })),
                      createTextVNode(toDisplayString(testResult.value.message) + " ", 1),
                      testResult.value.received ? (openBlock(), createBlock("span", {
                        key: 2,
                        class: "mt-1 block text-xs font-normal"
                      }, "Chave recebida pelo sistema: " + toDisplayString(testResult.value.received) + ". Compare com a que você copiou.", 1)) : createCommentVNode("", true)
                    ], 2)) : createCommentVNode("", true),
                    createVNode("p", { class: "text-xs text-muted" }, "Privacidade: no plano gratuito o Google pode usar o conteúdo enviado para melhorar os produtos dele. Só enviamos o texto público da vaga, nunca dados de candidatos ou de quem enviou a vaga.")
                  ]),
                  createVNode("section", {
                    class: "card space-y-5 p-5 sm:p-6",
                    "aria-labelledby": "cfg-ads"
                  }, [
                    createVNode("div", null, [
                      createVNode("h2", {
                        id: "cfg-ads",
                        class: "text-lg font-extrabold text-ink"
                      }, "Google AdSense"),
                      createVNode("p", { class: "mt-1 text-sm text-muted" }, [
                        createTextVNode("Cole o ID do editor e o ID de cada unidade de anúncio criada no "),
                        createVNode("a", {
                          href: "https://adsense.google.com",
                          target: "_blank",
                          rel: "noopener noreferrer",
                          class: "inline-flex items-center gap-1 font-semibold text-action-700 hover:underline"
                        }, [
                          createTextVNode("painel do AdSense"),
                          createVNode(unref(ExternalLink), {
                            class: "size-3",
                            "aria-hidden": "true"
                          })
                        ]),
                        createTextVNode(". Posições sem ID continuam mostrando “Anuncie aqui” (venda direta).")
                      ])
                    ]),
                    createVNode("label", { class: "flex items-start gap-2 text-sm" }, [
                      withDirectives(createVNode("input", {
                        "onUpdate:modelValue": ($event) => unref(form).adsense_enabled = $event,
                        type: "checkbox",
                        class: "mt-0.5 size-4 rounded border-line-strong text-action-600"
                      }, null, 8, ["onUpdate:modelValue"]), [
                        [vModelCheckbox, unref(form).adsense_enabled]
                      ]),
                      createVNode("span", null, [
                        createVNode("span", { class: "font-semibold text-ink" }, "Ativar AdSense no site"),
                        createVNode("span", { class: "block text-xs text-muted" }, "Carrega o script do Google e exibe as unidades configuradas abaixo.")
                      ])
                    ]),
                    createVNode(_sfc_main$2, {
                      id: "adsense_client",
                      label: "ID do editor",
                      error: unref(form).errors.adsense_client,
                      hint: "Formato: ca-pub-0000000000000000. O arquivo /ads.txt é gerado automaticamente a partir dele."
                    }, {
                      default: withCtx(({ describedBy, invalid }) => [
                        withDirectives(createVNode("input", {
                          id: "adsense_client",
                          "onUpdate:modelValue": ($event) => unref(form).adsense_client = $event,
                          class: "field font-mono text-[13px]",
                          placeholder: "ca-pub-0000000000000000",
                          autocomplete: "off",
                          spellcheck: "false",
                          "aria-invalid": invalid,
                          "aria-describedby": describedBy
                        }, null, 8, ["onUpdate:modelValue", "aria-invalid", "aria-describedby"]), [
                          [vModelText, unref(form).adsense_client]
                        ])
                      ]),
                      _: 1
                    }, 8, ["error"]),
                    createVNode("fieldset", null, [
                      createVNode("legend", { class: "label" }, "ID da unidade de anúncio por posição"),
                      createVNode("div", { class: "divide-y divide-line rounded-xl border border-line" }, [
                        (openBlock(true), createBlock(Fragment, null, renderList(__props.placements, (p) => {
                          return openBlock(), createBlock("div", {
                            key: p.key,
                            class: "grid items-center gap-2 px-4 py-3 sm:grid-cols-[1fr_12rem]"
                          }, [
                            createVNode("label", {
                              for: `slot-${p.key}`,
                              class: "text-sm font-medium text-ink"
                            }, toDisplayString(p.label), 9, ["for"]),
                            createVNode("div", null, [
                              withDirectives(createVNode("input", {
                                id: `slot-${p.key}`,
                                "onUpdate:modelValue": ($event) => unref(form).adsense_slots[p.key] = $event,
                                inputmode: "numeric",
                                class: "field font-mono text-[13px]",
                                placeholder: "1234567890",
                                autocomplete: "off",
                                "aria-invalid": !!slotError(p.key)
                              }, null, 8, ["id", "onUpdate:modelValue", "aria-invalid"]), [
                                [vModelText, unref(form).adsense_slots[p.key]]
                              ]),
                              slotError(p.key) ? (openBlock(), createBlock("p", {
                                key: 0,
                                class: "error-text",
                                role: "alert"
                              }, toDisplayString(slotError(p.key)), 1)) : createCommentVNode("", true)
                            ])
                          ]);
                        }), 128))
                      ])
                    ])
                  ]),
                  createVNode("button", {
                    type: "submit",
                    class: "btn-primary",
                    disabled: unref(form).processing
                  }, [
                    createVNode(unref(Save), {
                      class: "size-4",
                      "aria-hidden": "true"
                    }),
                    createTextVNode("Salvar configurações")
                  ], 8, ["disabled"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/pages/Admin/Settings.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=Settings-DqRqAkgX.js.map
