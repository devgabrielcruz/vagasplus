import { defineComponent, reactive, ref, computed, mergeProps, withCtx, unref, createVNode, useSSRContext, createTextVNode, toDisplayString, openBlock, createBlock, createCommentVNode, Fragment, renderList } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrRenderStyle, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList, ssrInterpolate } from "vue/server-renderer";
import { usePage, Link } from "@inertiajs/vue3";
import { Search, SlidersHorizontal, X, SearchX } from "lucide-vue-next";
import { _ as _sfc_main$6 } from "./AdSlot-4pkaOtdy.js";
import { _ as _sfc_main$4 } from "./Breadcrumbs-C8MHcfb-.js";
import { _ as _sfc_main$8 } from "./EmptyState-QtkKSWjC.js";
import { _ as _sfc_main$2 } from "./Autocomplete-BKL9ffcG.js";
import { _ as _sfc_main$7 } from "./JobCard-CV-JBXgW.js";
import { _ as _sfc_main$9 } from "./Pagination-CQ9B5UeT.js";
import { _ as _sfc_main$5 } from "./PlatformFilterStrip-B5fltA3-.js";
import { _ as _sfc_main$3 } from "./PublicLayout-DWxlUL7J.js";
import "./CompanyLogo-meQRdREr.js";
import "./FlashMessages-mTMlubKC.js";
import "./SeoHead-BMQcIEwx.js";
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "FilterBar",
  __ssrInlineRender: true,
  props: {
    action: {},
    filters: {},
    options: {},
    lockedCategory: {},
    hideLocation: { type: Boolean }
  },
  setup(__props) {
    const props = __props;
    const form = reactive({
      q: props.filters.q ?? "",
      local: props.filters.local ?? "",
      categoria: props.filters.categoria ?? "",
      modalidade: props.filters.modalidade ?? "",
      tipo: props.filters.tipo ?? "",
      nivel: props.filters.nivel ?? "",
      plataforma: props.filters.plataforma ?? ""
    });
    const advancedOpen = ref(!!(form.categoria || form.modalidade || form.tipo || form.nivel || form.plataforma));
    const activeCount = computed(() => Object.entries(form).filter(([k, v]) => v && !(k === "categoria" && props.lockedCategory)).length);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<form${ssrRenderAttrs(mergeProps({
        method: "get",
        action: __props.action,
        role: "search",
        "aria-label": "Filtrar vagas",
        class: "card p-3 sm:p-4"
      }, _attrs))}><div class="flex flex-col gap-2 md:flex-row"><div class="relative flex-1">`);
      _push(ssrRenderComponent(_sfc_main$2, {
        id: "f-q",
        modelValue: form.q,
        "onUpdate:modelValue": ($event) => form.q = $event,
        name: "q",
        label: "Cargo, habilidade ou empresa",
        endpoint: "/sugestoes",
        params: { field: "q" },
        placeholder: "Cargo, habilidade ou empresa",
        "input-class": "field pl-9"
      }, {
        icon: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Search), {
              class: "pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-subtle",
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(Search), {
                class: "pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-subtle",
                "aria-hidden": "true"
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      if (!__props.hideLocation) {
        _push(`<div class="flex-1 md:max-w-xs">`);
        _push(ssrRenderComponent(_sfc_main$2, {
          id: "f-local",
          modelValue: form.local,
          "onUpdate:modelValue": ($event) => form.local = $event,
          name: "local",
          label: "Cidade ou estado",
          endpoint: "/sugestoes",
          params: { field: "local" },
          placeholder: "Cidade ou estado"
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="flex gap-2"><button type="button" class="btn-secondary flex-1 md:flex-none"${ssrRenderAttr("aria-expanded", advancedOpen.value)} aria-controls="filtros-avancados">`);
      _push(ssrRenderComponent(unref(SlidersHorizontal), {
        class: "size-4",
        "aria-hidden": "true"
      }, null, _parent));
      _push(`Filtros </button><button type="submit" class="btn-primary flex-1 md:flex-none">Buscar</button></div></div><div id="filtros-avancados" class="mt-3 grid gap-3 border-t border-line pt-3 sm:grid-cols-2 lg:grid-cols-3" style="${ssrRenderStyle(advancedOpen.value ? null : { display: "none" })}">`);
      if (!__props.lockedCategory) {
        _push(`<div><label for="f-cat" class="label">Categoria</label><select id="f-cat" class="field"><option value=""${ssrIncludeBooleanAttr(Array.isArray(form.categoria) ? ssrLooseContain(form.categoria, "") : ssrLooseEqual(form.categoria, "")) ? " selected" : ""}>Todas</option><!--[-->`);
        ssrRenderList(__props.options.categories, (o) => {
          _push(`<option${ssrRenderAttr("value", o.value)}${ssrIncludeBooleanAttr(Array.isArray(form.categoria) ? ssrLooseContain(form.categoria, o.value) : ssrLooseEqual(form.categoria, o.value)) ? " selected" : ""}>${ssrInterpolate(o.label)}</option>`);
        });
        _push(`<!--]--></select></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div><label for="f-mod" class="label">Modalidade</label><select id="f-mod" class="field"><option value=""${ssrIncludeBooleanAttr(Array.isArray(form.modalidade) ? ssrLooseContain(form.modalidade, "") : ssrLooseEqual(form.modalidade, "")) ? " selected" : ""}>Todas</option><!--[-->`);
      ssrRenderList(__props.options.work_modes, (o) => {
        _push(`<option${ssrRenderAttr("value", o.value)}${ssrIncludeBooleanAttr(Array.isArray(form.modalidade) ? ssrLooseContain(form.modalidade, o.value) : ssrLooseEqual(form.modalidade, o.value)) ? " selected" : ""}>${ssrInterpolate(o.label)}</option>`);
      });
      _push(`<!--]--></select></div><div><label for="f-tipo" class="label">Tipo de contratação</label><select id="f-tipo" class="field"><option value=""${ssrIncludeBooleanAttr(Array.isArray(form.tipo) ? ssrLooseContain(form.tipo, "") : ssrLooseEqual(form.tipo, "")) ? " selected" : ""}>Todos</option><!--[-->`);
      ssrRenderList(__props.options.employment_types, (o) => {
        _push(`<option${ssrRenderAttr("value", o.value)}${ssrIncludeBooleanAttr(Array.isArray(form.tipo) ? ssrLooseContain(form.tipo, o.value) : ssrLooseEqual(form.tipo, o.value)) ? " selected" : ""}>${ssrInterpolate(o.label)}</option>`);
      });
      _push(`<!--]--></select></div><div><label for="f-plat" class="label">Plataforma de contratação</label><select id="f-plat" class="field"><option value=""${ssrIncludeBooleanAttr(Array.isArray(form.plataforma) ? ssrLooseContain(form.plataforma, "") : ssrLooseEqual(form.plataforma, "")) ? " selected" : ""}>Todas</option><!--[-->`);
      ssrRenderList(__props.options.platforms, (o) => {
        _push(`<option${ssrRenderAttr("value", o.value)}${ssrIncludeBooleanAttr(Array.isArray(form.plataforma) ? ssrLooseContain(form.plataforma, o.value) : ssrLooseEqual(form.plataforma, o.value)) ? " selected" : ""}>${ssrInterpolate(o.label)} (${ssrInterpolate(o.count)})</option>`);
      });
      _push(`<!--]--></select></div><div><label for="f-nivel" class="label">Nível de experiência</label><select id="f-nivel" class="field"><option value=""${ssrIncludeBooleanAttr(Array.isArray(form.nivel) ? ssrLooseContain(form.nivel, "") : ssrLooseEqual(form.nivel, "")) ? " selected" : ""}>Todos</option><!--[-->`);
      ssrRenderList(__props.options.experience_levels, (o) => {
        _push(`<option${ssrRenderAttr("value", o.value)}${ssrIncludeBooleanAttr(Array.isArray(form.nivel) ? ssrLooseContain(form.nivel, o.value) : ssrLooseEqual(form.nivel, o.value)) ? " selected" : ""}>${ssrInterpolate(o.label)}</option>`);
      });
      _push(`<!--]--></select></div></div>`);
      if (activeCount.value) {
        _push(`<div class="mt-3 flex items-center justify-between text-sm"><span class="text-muted">${ssrInterpolate(activeCount.value)} ${ssrInterpolate(activeCount.value === 1 ? "filtro ativo" : "filtros ativos")}</span><button type="button" class="inline-flex items-center gap-1 font-semibold text-action-700 hover:underline">`);
        _push(ssrRenderComponent(unref(X), {
          class: "size-4",
          "aria-hidden": "true"
        }, null, _parent));
        _push(`Limpar filtros</button></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</form>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/FilterBar.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "JobList",
  __ssrInlineRender: true,
  props: {
    heading: {},
    intro: {},
    jobs: {},
    filters: {},
    options: {},
    breadcrumbs: {},
    seo: {},
    lockedCategory: {},
    hideLocationFilter: { type: Boolean }
  },
  setup(__props) {
    const props = __props;
    const action = usePage().url.split("?")[0];
    const hasFilters = () => Object.keys(props.filters ?? {}).length > 0;
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$3, mergeProps({ seo: __props.seo }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="container-page py-6 sm:py-8"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$4, { items: __props.breadcrumbs }, null, _parent2, _scopeId));
            _push2(`<header class="mt-4"${_scopeId}><h1 class="t-h1 text-ink"${_scopeId}>${ssrInterpolate(__props.heading)}</h1>`);
            if (__props.intro) {
              _push2(`<p class="mt-2 max-w-2xl text-muted"${_scopeId}>${ssrInterpolate(__props.intro)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<p class="mt-1.5 text-sm text-muted" aria-live="polite"${_scopeId}>`);
            if (__props.jobs.total) {
              _push2(`<!--[-->${ssrInterpolate(__props.jobs.total)} ${ssrInterpolate(__props.jobs.total === 1 ? "vaga encontrada" : "vagas encontradas")}`);
              if (__props.jobs.last_page > 1) {
                _push2(`<!--[--> · mostrando ${ssrInterpolate(__props.jobs.from)}–${ssrInterpolate(__props.jobs.to)}<!--]-->`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`<!--]-->`);
            } else {
              _push2(`<!--[-->Nenhuma vaga encontrada<!--]-->`);
            }
            _push2(`</p></header><div class="mt-5"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$1, {
              action: unref(action),
              filters: __props.filters,
              options: __props.options,
              "locked-category": __props.lockedCategory,
              "hide-location": __props.hideLocationFilter
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
            if (__props.options.platforms.length) {
              _push2(`<div class="mt-4"${_scopeId}>`);
              _push2(ssrRenderComponent(_sfc_main$5, {
                platforms: __props.options.platforms,
                active: __props.filters.plataforma
              }, null, _parent2, _scopeId));
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.jobs.data.length) {
              _push2(`<div class="mt-6"${_scopeId}>`);
              _push2(ssrRenderComponent(_sfc_main$6, {
                placement: "list-top",
                format: "leaderboard"
              }, null, _parent2, _scopeId));
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.jobs.data.length) {
              _push2(`<div class="mt-4 grid gap-4 md:grid-cols-2"${_scopeId}><!--[-->`);
              ssrRenderList(__props.jobs.data, (job, i) => {
                _push2(`<!--[-->`);
                if (i === 3) {
                  _push2(ssrRenderComponent(_sfc_main$6, {
                    placement: "list-card",
                    format: "card"
                  }, null, _parent2, _scopeId));
                } else {
                  _push2(`<!---->`);
                }
                if (i === 9) {
                  _push2(ssrRenderComponent(_sfc_main$6, {
                    placement: "list-card-2",
                    format: "card"
                  }, null, _parent2, _scopeId));
                } else {
                  _push2(`<!---->`);
                }
                _push2(ssrRenderComponent(_sfc_main$7, { job }, null, _parent2, _scopeId));
                _push2(`<!--]-->`);
              });
              _push2(`<!--]-->`);
              if (__props.jobs.data.length <= 3) {
                _push2(ssrRenderComponent(_sfc_main$6, {
                  placement: "list-card",
                  format: "card"
                }, null, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
            } else {
              _push2(`<div class="mt-6"${_scopeId}>`);
              _push2(ssrRenderComponent(_sfc_main$8, {
                icon: unref(SearchX),
                title: hasFilters() ? "Nenhuma vaga com esses filtros" : "Nenhuma vaga aberta por aqui",
                description: hasFilters() ? "Tente remover algum filtro ou buscar por um termo mais amplo." : "Novas oportunidades são publicadas com frequência. Volte em breve."
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(unref(Link), {
                      href: "/vagas",
                      class: "btn-primary"
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`Ver todas as vagas`);
                        } else {
                          return [
                            createTextVNode("Ver todas as vagas")
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
                          createTextVNode("Ver todas as vagas")
                        ]),
                        _: 1
                      })
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div>`);
            }
            _push2(`<div class="mt-8"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$9, { meta: __props.jobs }, null, _parent2, _scopeId));
            _push2(`</div></div>`);
          } else {
            return [
              createVNode("div", { class: "container-page py-6 sm:py-8" }, [
                createVNode(_sfc_main$4, { items: __props.breadcrumbs }, null, 8, ["items"]),
                createVNode("header", { class: "mt-4" }, [
                  createVNode("h1", { class: "t-h1 text-ink" }, toDisplayString(__props.heading), 1),
                  __props.intro ? (openBlock(), createBlock("p", {
                    key: 0,
                    class: "mt-2 max-w-2xl text-muted"
                  }, toDisplayString(__props.intro), 1)) : createCommentVNode("", true),
                  createVNode("p", {
                    class: "mt-1.5 text-sm text-muted",
                    "aria-live": "polite"
                  }, [
                    __props.jobs.total ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                      createTextVNode(toDisplayString(__props.jobs.total) + " " + toDisplayString(__props.jobs.total === 1 ? "vaga encontrada" : "vagas encontradas"), 1),
                      __props.jobs.last_page > 1 ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                        createTextVNode(" · mostrando " + toDisplayString(__props.jobs.from) + "–" + toDisplayString(__props.jobs.to), 1)
                      ], 64)) : createCommentVNode("", true)
                    ], 64)) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                      createTextVNode("Nenhuma vaga encontrada")
                    ], 64))
                  ])
                ]),
                createVNode("div", { class: "mt-5" }, [
                  createVNode(_sfc_main$1, {
                    action: unref(action),
                    filters: __props.filters,
                    options: __props.options,
                    "locked-category": __props.lockedCategory,
                    "hide-location": __props.hideLocationFilter
                  }, null, 8, ["action", "filters", "options", "locked-category", "hide-location"])
                ]),
                __props.options.platforms.length ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "mt-4"
                }, [
                  createVNode(_sfc_main$5, {
                    platforms: __props.options.platforms,
                    active: __props.filters.plataforma
                  }, null, 8, ["platforms", "active"])
                ])) : createCommentVNode("", true),
                __props.jobs.data.length ? (openBlock(), createBlock("div", {
                  key: 1,
                  class: "mt-6"
                }, [
                  createVNode(_sfc_main$6, {
                    placement: "list-top",
                    format: "leaderboard"
                  })
                ])) : createCommentVNode("", true),
                __props.jobs.data.length ? (openBlock(), createBlock("div", {
                  key: 2,
                  class: "mt-4 grid gap-4 md:grid-cols-2"
                }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(__props.jobs.data, (job, i) => {
                    return openBlock(), createBlock(Fragment, {
                      key: job.id
                    }, [
                      i === 3 ? (openBlock(), createBlock(_sfc_main$6, {
                        key: 0,
                        placement: "list-card",
                        format: "card"
                      })) : createCommentVNode("", true),
                      i === 9 ? (openBlock(), createBlock(_sfc_main$6, {
                        key: 1,
                        placement: "list-card-2",
                        format: "card"
                      })) : createCommentVNode("", true),
                      createVNode(_sfc_main$7, { job }, null, 8, ["job"])
                    ], 64);
                  }), 128)),
                  __props.jobs.data.length <= 3 ? (openBlock(), createBlock(_sfc_main$6, {
                    key: 0,
                    placement: "list-card",
                    format: "card"
                  })) : createCommentVNode("", true)
                ])) : (openBlock(), createBlock("div", {
                  key: 3,
                  class: "mt-6"
                }, [
                  createVNode(_sfc_main$8, {
                    icon: unref(SearchX),
                    title: hasFilters() ? "Nenhuma vaga com esses filtros" : "Nenhuma vaga aberta por aqui",
                    description: hasFilters() ? "Tente remover algum filtro ou buscar por um termo mais amplo." : "Novas oportunidades são publicadas com frequência. Volte em breve."
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(Link), {
                        href: "/vagas",
                        class: "btn-primary"
                      }, {
                        default: withCtx(() => [
                          createTextVNode("Ver todas as vagas")
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }, 8, ["icon", "title", "description"])
                ])),
                createVNode("div", { class: "mt-8" }, [
                  createVNode(_sfc_main$9, { meta: __props.jobs }, null, 8, ["meta"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/pages/Public/JobList.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=JobList-BZ_5lEbA.js.map
