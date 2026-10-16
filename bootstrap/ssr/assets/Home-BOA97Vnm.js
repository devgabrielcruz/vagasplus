import { defineComponent, mergeProps, unref, withCtx, createVNode, toDisplayString, openBlock, createBlock, createTextVNode, createCommentVNode, useSSRContext, reactive, Fragment, renderList } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderStyle, ssrInterpolate, ssrRenderAttr } from "vue/server-renderer";
import { Link } from "@inertiajs/vue3";
import { Sparkles, MapPin, Wallet, BadgeCheck, Search, ArrowRight, Briefcase, ExternalLink } from "lucide-vue-next";
import { _ as _sfc_main$6 } from "./AdSlot-4pkaOtdy.js";
import { _ as _sfc_main$9 } from "./CategoryIcon-Cd_HT9vu.js";
import { _ as _sfc_main$a } from "./EmptyState-QtkKSWjC.js";
import { _ as _sfc_main$3 } from "./CompanyLogo-meQRdREr.js";
import { _ as _sfc_main$8 } from "./JobCard-CV-JBXgW.js";
import { _ as _sfc_main$7 } from "./PlatformFilterStrip-B5fltA3-.js";
import { _ as _sfc_main$4 } from "./Autocomplete-BKL9ffcG.js";
import { _ as _sfc_main$5 } from "./PublicLayout-DWxlUL7J.js";
import "./FlashMessages-mTMlubKC.js";
import "./SeoHead-BMQcIEwx.js";
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "HeroPreview",
  __ssrInlineRender: true,
  props: {
    jobs: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "relative mx-auto w-full max-w-md",
        "aria-label": "Prévia de vagas abertas"
      }, _attrs))}><div class="pointer-events-none absolute -inset-6 rounded-[2.5rem] bg-action-500/20 blur-3xl" aria-hidden="true"></div><div class="relative rounded-[1.75rem] border border-white/15 bg-white/[0.08] p-3 shadow-[0_30px_80px_-20px_rgb(0_0_0/0.6)] backdrop-blur-xl"><div class="flex items-center justify-between px-2 pt-1 pb-3"><p class="flex items-center gap-2 text-sm font-bold text-white">`);
      _push(ssrRenderComponent(unref(Sparkles), {
        class: "size-4 text-action-200",
        "aria-hidden": "true"
      }, null, _parent));
      _push(`Vagas para você</p><span class="flex items-center gap-1.5 rounded-full bg-emerald-400/15 px-2.5 py-1 text-[11px] font-bold text-emerald-300"><span class="size-1.5 animate-pulse rounded-full bg-emerald-300" aria-hidden="true"></span>ao vivo</span></div><ul class="space-y-2.5"><!--[-->`);
      ssrRenderList(__props.jobs, (job, i) => {
        _push(`<li style="${ssrRenderStyle({ marginLeft: `${i % 2 ? 14 : 0}px`, marginRight: `${i % 2 ? 0 : 14}px` })}">`);
        _push(ssrRenderComponent(unref(Link), {
          href: job.url,
          class: "group flex items-center gap-3 rounded-2xl bg-white p-3 shadow-lg transition hover:-translate-y-0.5"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_sfc_main$3, {
                name: job.company.name,
                url: job.company.logo_url,
                size: "sm"
              }, null, _parent2, _scopeId));
              _push2(`<div class="min-w-0 flex-1"${_scopeId}><p class="truncate text-sm font-bold text-ink group-hover:text-action-700"${_scopeId}>${ssrInterpolate(job.title)}</p><p class="truncate text-xs text-muted"${_scopeId}>${ssrInterpolate(job.company.name)}</p><div class="mt-1.5 flex items-center gap-2 text-[11px] text-muted"${_scopeId}><span class="inline-flex items-center gap-1 rounded-full bg-action-50 px-1.5 py-0.5 font-semibold text-action-700"${_scopeId}>${ssrInterpolate(job.work_mode.label)}</span>`);
              if (job.location) {
                _push2(`<span class="inline-flex items-center gap-0.5 truncate"${_scopeId}>`);
                _push2(ssrRenderComponent(unref(MapPin), {
                  class: "size-3",
                  "aria-hidden": "true"
                }, null, _parent2, _scopeId));
                _push2(`${ssrInterpolate(job.location)}</span>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div></div>`);
              if (job.platform.logo) {
                _push2(`<img${ssrRenderAttr("src", job.platform.logo)}${ssrRenderAttr("alt", `via ${job.platform.label}`)} class="h-7 w-auto max-w-[4.5rem] shrink-0 rounded-lg object-contain"${_scopeId}>`);
              } else {
                _push2(`<!---->`);
              }
            } else {
              return [
                createVNode(_sfc_main$3, {
                  name: job.company.name,
                  url: job.company.logo_url,
                  size: "sm"
                }, null, 8, ["name", "url"]),
                createVNode("div", { class: "min-w-0 flex-1" }, [
                  createVNode("p", { class: "truncate text-sm font-bold text-ink group-hover:text-action-700" }, toDisplayString(job.title), 1),
                  createVNode("p", { class: "truncate text-xs text-muted" }, toDisplayString(job.company.name), 1),
                  createVNode("div", { class: "mt-1.5 flex items-center gap-2 text-[11px] text-muted" }, [
                    createVNode("span", { class: "inline-flex items-center gap-1 rounded-full bg-action-50 px-1.5 py-0.5 font-semibold text-action-700" }, toDisplayString(job.work_mode.label), 1),
                    job.location ? (openBlock(), createBlock("span", {
                      key: 0,
                      class: "inline-flex items-center gap-0.5 truncate"
                    }, [
                      createVNode(unref(MapPin), {
                        class: "size-3",
                        "aria-hidden": "true"
                      }),
                      createTextVNode(toDisplayString(job.location), 1)
                    ])) : createCommentVNode("", true)
                  ])
                ]),
                job.platform.logo ? (openBlock(), createBlock("img", {
                  key: 0,
                  src: job.platform.logo,
                  alt: `via ${job.platform.label}`,
                  class: "h-7 w-auto max-w-[4.5rem] shrink-0 rounded-lg object-contain"
                }, null, 8, ["src", "alt"])) : createCommentVNode("", true)
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`</li>`);
      });
      _push(`<!--]--></ul><p class="px-2 pt-3 pb-1 text-center text-xs text-navy-100/70">Candidate-se direto na fonte oficial</p></div>`);
      if (__props.jobs[0]?.salary) {
        _push(`<div class="animate-float absolute -top-4 -right-2 hidden items-center gap-2 rounded-2xl bg-white px-3 py-2 text-xs font-bold text-ink shadow-xl sm:flex"><span class="grid size-7 place-items-center rounded-lg bg-success-50 text-success-700">`);
        _push(ssrRenderComponent(unref(Wallet), {
          class: "size-4",
          "aria-hidden": "true"
        }, null, _parent));
        _push(`</span>${ssrInterpolate(__props.jobs[0].salary)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="animate-float absolute -bottom-4 -left-3 hidden items-center gap-2 rounded-2xl bg-white px-3 py-2 text-xs font-bold text-ink shadow-xl [animation-delay:-3s] sm:flex"><span class="grid size-7 place-items-center rounded-lg bg-action-50 text-action-700">`);
      _push(ssrRenderComponent(unref(BadgeCheck), {
        class: "size-4",
        "aria-hidden": "true"
      }, null, _parent));
      _push(`</span>Sem cadastro </div></div>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/HeroPreview.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "SearchForm",
  __ssrInlineRender: true,
  props: {
    q: { default: "" },
    local: { default: "" }
  },
  setup(__props) {
    const props = __props;
    const form = reactive({ q: props.q, local: props.local });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<form${ssrRenderAttrs(mergeProps({
        method: "get",
        action: "/vagas",
        role: "search",
        class: "flex flex-col gap-2 rounded-[1.4rem] bg-white p-2.5 shadow-[0_20px_50px_-15px_rgb(0_0_0/0.5)] sm:flex-row sm:items-center"
      }, _attrs))}><div class="flex-1">`);
      _push(ssrRenderComponent(_sfc_main$4, {
        id: "hero-q",
        modelValue: form.q,
        "onUpdate:modelValue": ($event) => form.q = $event,
        name: "q",
        label: "Cargo, habilidade ou palavra-chave",
        endpoint: "/sugestoes",
        params: { field: "q" },
        placeholder: "Cargo, habilidade ou empresa",
        "input-class": "field border-transparent pl-10 focus:border-action-600 sm:min-h-12"
      }, {
        icon: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Search), {
              class: "pointer-events-none absolute top-1/2 left-3.5 size-4.5 -translate-y-1/2 text-subtle",
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(Search), {
                class: "pointer-events-none absolute top-1/2 left-3.5 size-4.5 -translate-y-1/2 text-subtle",
                "aria-hidden": "true"
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="hidden h-7 w-px bg-line sm:block" aria-hidden="true"></div><div class="flex-1">`);
      _push(ssrRenderComponent(_sfc_main$4, {
        id: "hero-local",
        modelValue: form.local,
        "onUpdate:modelValue": ($event) => form.local = $event,
        name: "local",
        label: "Cidade ou estado",
        endpoint: "/sugestoes",
        params: { field: "local" },
        placeholder: "Cidade ou estado (ex.: Curitiba ou PR)",
        "input-class": "field border-transparent pl-10 focus:border-action-600 sm:min-h-12"
      }, {
        icon: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(MapPin), {
              class: "pointer-events-none absolute top-1/2 left-3.5 size-4.5 -translate-y-1/2 text-subtle",
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(MapPin), {
                class: "pointer-events-none absolute top-1/2 left-3.5 size-4.5 -translate-y-1/2 text-subtle",
                "aria-hidden": "true"
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><button type="submit" class="btn-primary btn-lg w-full sm:w-auto">`);
      _push(ssrRenderComponent(unref(Search), {
        class: "size-4.5",
        "aria-hidden": "true"
      }, null, _parent));
      _push(`Buscar vagas</button></form>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/SearchForm.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Home",
  __ssrInlineRender: true,
  props: {
    featured: {},
    recent: {},
    categories: {},
    platforms: {},
    stats: {},
    heroJobs: {},
    options: {},
    seo: {}
  },
  setup(__props) {
    const quick = [
      { label: "Remoto", href: "/vagas?modalidade=remote" },
      { label: "Híbrido", href: "/vagas?modalidade=hybrid" },
      { label: "Estágio", href: "/vagas?tipo=internship" },
      { label: "Júnior", href: "/vagas?nivel=junior" },
      { label: "CLT", href: "/vagas?tipo=clt" }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$5, mergeProps({ seo: __props.seo }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<section class="hero-app text-white"${_scopeId}><div class="container-page grid items-center gap-12 pt-12 pb-20 sm:pt-16 sm:pb-24 lg:grid-cols-[1.15fr_0.85fr] lg:gap-8"${_scopeId}><div${_scopeId}>`);
            if (__props.stats.jobs) {
              _push2(`<p class="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] py-1 pr-3.5 pl-2.5 text-xs font-semibold text-navy-100 backdrop-blur"${_scopeId}><span class="size-2 animate-pulse rounded-full bg-emerald-400" aria-hidden="true"${_scopeId}></span>${ssrInterpolate(__props.stats.jobs)} ${ssrInterpolate(__props.stats.jobs === 1 ? "vaga aberta" : "vagas abertas")} agora</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<h1 class="t-display mt-5 max-w-2xl !leading-[1.05] sm:!text-[3.6rem]"${_scopeId}>Sua próxima oportunidade <span class="text-gradient"${_scopeId}>começa aqui.</span></h1><p class="mt-5 max-w-xl text-base text-navy-100/85 sm:text-lg"${_scopeId}>Encontre vagas, descubra novas possibilidades e vá direto para a candidatura.</p><div class="mt-8 max-w-3xl"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$1, null, null, _parent2, _scopeId));
            _push2(`</div><div class="mt-5 flex flex-wrap items-center gap-2 text-sm"${_scopeId}><span class="text-navy-100/70"${_scopeId}>Em alta:</span><!--[-->`);
            ssrRenderList(quick, (q) => {
              _push2(ssrRenderComponent(unref(Link), {
                key: q.href,
                href: q.href,
                class: "rounded-full border border-white/15 bg-white/[0.06] px-3.5 py-1.5 font-medium text-white/90 transition hover:border-white/30 hover:bg-white/15"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${ssrInterpolate(q.label)}`);
                  } else {
                    return [
                      createTextVNode(toDisplayString(q.label), 1)
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            });
            _push2(`<!--]--></div>`);
            if (__props.platforms.length) {
              _push2(`<div class="mt-9 flex flex-wrap items-center gap-x-5 gap-y-3"${_scopeId}><span class="text-xs font-semibold tracking-widest text-navy-100/60 uppercase"${_scopeId}>Vagas de</span><!--[-->`);
              ssrRenderList(__props.platforms.slice(0, 6), (p) => {
                _push2(ssrRenderComponent(unref(Link), {
                  key: p.value,
                  href: `/vagas?plataforma=${p.value}`,
                  class: "flex items-center gap-2 text-sm font-semibold text-white/85 transition hover:text-white",
                  title: `Ver vagas via ${p.label}`
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      if (p.logo) {
                        _push3(`<img${ssrRenderAttr("src", p.logo)}${ssrRenderAttr("alt", p.label)} class="h-6 w-auto max-w-[5rem] rounded-md object-contain"${_scopeId2}>`);
                      } else {
                        _push3(`<!---->`);
                      }
                      _push3(`${ssrInterpolate(p.label)}`);
                    } else {
                      return [
                        p.logo ? (openBlock(), createBlock("img", {
                          key: 0,
                          src: p.logo,
                          alt: p.label,
                          class: "h-6 w-auto max-w-[5rem] rounded-md object-contain"
                        }, null, 8, ["src", "alt"])) : createCommentVNode("", true),
                        createTextVNode(toDisplayString(p.label), 1)
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
              });
              _push2(`<!--]--></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
            if (__props.heroJobs.length) {
              _push2(ssrRenderComponent(_sfc_main$2, {
                jobs: __props.heroJobs,
                class: "hidden sm:block"
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></section>`);
            if (__props.stats.jobs) {
              _push2(`<div class="container-page relative z-10 -mt-9"${_scopeId}><dl class="grid grid-cols-3 divide-x divide-line overflow-hidden rounded-(--radius-card) border border-line bg-white shadow-(--shadow-pop)"${_scopeId}><!--[-->`);
              ssrRenderList([{ n: __props.stats.jobs, l: __props.stats.jobs === 1 ? "vaga aberta" : "vagas abertas" }, { n: __props.stats.companies, l: __props.stats.companies === 1 ? "empresa contratando" : "empresas contratando" }, { n: __props.stats.platforms, l: __props.stats.platforms === 1 ? "plataforma" : "plataformas" }], (s) => {
                _push2(`<div class="px-3 py-4 text-center sm:py-5"${_scopeId}><dd class="text-2xl font-extrabold tracking-tight text-navy-900 tabular-nums sm:text-3xl"${_scopeId}>${ssrInterpolate(s.n)}</dd><dt class="mt-0.5 text-xs font-medium text-muted sm:text-sm"${_scopeId}>${ssrInterpolate(s.l)}</dt></div>`);
              });
              _push2(`<!--]--></dl></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="container-page pt-8 pb-2"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$6, {
              placement: "home-top",
              format: "leaderboard"
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="container-page"${_scopeId}>`);
            if (__props.platforms.length) {
              _push2(`<section aria-labelledby="plataformas" class="pb-2"${_scopeId}><h2 id="plataformas" class="t-eyebrow mb-3 text-muted"${_scopeId}>Vagas por plataforma de contratação</h2>`);
              _push2(ssrRenderComponent(_sfc_main$7, { platforms: __props.platforms }, null, _parent2, _scopeId));
              _push2(`</section>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.featured.length) {
              _push2(`<section class="pt-10" aria-labelledby="destaques"${_scopeId}><div class="mb-5 flex items-center gap-2"${_scopeId}>`);
              _push2(ssrRenderComponent(unref(Sparkles), {
                class: "size-5 text-action-600",
                "aria-hidden": "true"
              }, null, _parent2, _scopeId));
              _push2(`<h2 id="destaques" class="t-h2 text-ink"${_scopeId}>Vagas em destaque</h2></div><div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3"${_scopeId}><!--[-->`);
              ssrRenderList(__props.featured, (job) => {
                _push2(ssrRenderComponent(_sfc_main$8, {
                  key: job.id,
                  job
                }, null, _parent2, _scopeId));
              });
              _push2(`<!--]--></div></section>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.categories.length) {
              _push2(`<section id="categorias" class="scroll-mt-20 pt-14" aria-labelledby="categorias-titulo"${_scopeId}><div class="mb-5 flex items-end justify-between gap-3"${_scopeId}><h2 id="categorias-titulo" class="t-h2 text-ink"${_scopeId}>Navegue por categoria</h2>`);
              _push2(ssrRenderComponent(unref(Link), {
                href: "/categorias",
                class: "btn-secondary btn-sm"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`Ver todas`);
                    _push3(ssrRenderComponent(unref(ArrowRight), {
                      class: "size-4",
                      "aria-hidden": "true"
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      createTextVNode("Ver todas"),
                      createVNode(unref(ArrowRight), {
                        class: "size-4",
                        "aria-hidden": "true"
                      })
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div><ul class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"${_scopeId}><!--[-->`);
              ssrRenderList(__props.categories.slice(0, 8), (c) => {
                _push2(`<li${_scopeId}>`);
                _push2(ssrRenderComponent(unref(Link), {
                  href: c.url,
                  class: "card flex h-full items-center gap-3 p-3.5 transition hover:border-action-500 hover:shadow-(--shadow-lift)"
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`<span class="grid size-11 shrink-0 place-items-center rounded-xl bg-action-50 text-action-700"${_scopeId2}>`);
                      _push3(ssrRenderComponent(_sfc_main$9, {
                        name: c.icon,
                        class: "size-5"
                      }, null, _parent3, _scopeId2));
                      _push3(`</span><span class="min-w-0"${_scopeId2}><span class="block truncate text-sm font-bold text-ink"${_scopeId2}>${ssrInterpolate(c.name)}</span><span class="text-xs text-muted"${_scopeId2}>${ssrInterpolate(c.count)} ${ssrInterpolate(c.count === 1 ? "vaga" : "vagas")}</span></span>`);
                    } else {
                      return [
                        createVNode("span", { class: "grid size-11 shrink-0 place-items-center rounded-xl bg-action-50 text-action-700" }, [
                          createVNode(_sfc_main$9, {
                            name: c.icon,
                            class: "size-5"
                          }, null, 8, ["name"])
                        ]),
                        createVNode("span", { class: "min-w-0" }, [
                          createVNode("span", { class: "block truncate text-sm font-bold text-ink" }, toDisplayString(c.name), 1),
                          createVNode("span", { class: "text-xs text-muted" }, toDisplayString(c.count) + " " + toDisplayString(c.count === 1 ? "vaga" : "vagas"), 1)
                        ])
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
                _push2(`</li>`);
              });
              _push2(`<!--]--></ul></section>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="py-10"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$6, {
              placement: "home-mid",
              format: "leaderboard"
            }, null, _parent2, _scopeId));
            _push2(`</div><section aria-labelledby="recentes"${_scopeId}><div class="mb-5 flex items-end justify-between gap-3"${_scopeId}><h2 id="recentes" class="t-h2 text-ink"${_scopeId}>Vagas recentes</h2>`);
            if (__props.recent.length) {
              _push2(ssrRenderComponent(unref(Link), {
                href: "/vagas",
                class: "inline-flex items-center gap-1 text-sm font-bold text-action-700 hover:underline"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`Ver todas`);
                    _push3(ssrRenderComponent(unref(ArrowRight), {
                      class: "size-4",
                      "aria-hidden": "true"
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      createTextVNode("Ver todas"),
                      createVNode(unref(ArrowRight), {
                        class: "size-4",
                        "aria-hidden": "true"
                      })
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
            if (__props.recent.length) {
              _push2(`<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3"${_scopeId}><!--[-->`);
              ssrRenderList(__props.recent, (job) => {
                _push2(ssrRenderComponent(_sfc_main$8, {
                  key: job.id,
                  job
                }, null, _parent2, _scopeId));
              });
              _push2(`<!--]--></div>`);
            } else {
              _push2(ssrRenderComponent(_sfc_main$a, {
                icon: unref(Briefcase),
                title: "Ainda não há vagas abertas",
                description: "Novas oportunidades são publicadas com frequência. Volte em breve."
              }, null, _parent2, _scopeId));
            }
            if (__props.recent.length) {
              _push2(`<div class="mt-7 text-center"${_scopeId}>`);
              _push2(ssrRenderComponent(unref(Link), {
                href: "/vagas",
                class: "btn-primary btn-lg"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(unref(Search), {
                      class: "size-4.5",
                      "aria-hidden": "true"
                    }, null, _parent3, _scopeId2));
                    _push3(`Explorar todas as vagas`);
                  } else {
                    return [
                      createVNode(unref(Search), {
                        class: "size-4.5",
                        "aria-hidden": "true"
                      }),
                      createTextVNode("Explorar todas as vagas")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</section><section class="panel mt-16 grid gap-6 p-6 sm:grid-cols-3 sm:p-9" aria-label="Como funciona"${_scopeId}><!--[-->`);
            ssrRenderList([
              { t: "Busque", d: "Pesquise por cargo, cidade, modalidade, nível e plataforma, sem criar conta." },
              { t: "Confira os detalhes", d: "Veja requisitos, benefícios e salário quando divulgado pela empresa." },
              { t: "Candidate-se na fonte", d: "Você vai direto ao site, plataforma ou e-mail oficial da empresa." }
            ], (step, i) => {
              _push2(`<div${_scopeId}><span class="grid size-9 place-items-center rounded-full bg-navy-900 text-sm font-bold text-white"${_scopeId}>${ssrInterpolate(i + 1)}</span><h3 class="t-h3 mt-4 text-ink"${_scopeId}>${ssrInterpolate(step.t)}</h3><p class="mt-1.5 text-sm text-muted"${_scopeId}>${ssrInterpolate(step.d)}</p></div>`);
            });
            _push2(`<!--]--></section><p class="mt-4 flex items-center gap-1.5 text-xs text-subtle"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(ExternalLink), {
              class: "size-3.5",
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
            _push2(`Ao clicar em candidatar-se, você sai do VagasPlus e segue para o site da empresa ou plataforma de recrutamento.</p></div>`);
          } else {
            return [
              createVNode("section", { class: "hero-app text-white" }, [
                createVNode("div", { class: "container-page grid items-center gap-12 pt-12 pb-20 sm:pt-16 sm:pb-24 lg:grid-cols-[1.15fr_0.85fr] lg:gap-8" }, [
                  createVNode("div", null, [
                    __props.stats.jobs ? (openBlock(), createBlock("p", {
                      key: 0,
                      class: "inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] py-1 pr-3.5 pl-2.5 text-xs font-semibold text-navy-100 backdrop-blur"
                    }, [
                      createVNode("span", {
                        class: "size-2 animate-pulse rounded-full bg-emerald-400",
                        "aria-hidden": "true"
                      }),
                      createTextVNode(toDisplayString(__props.stats.jobs) + " " + toDisplayString(__props.stats.jobs === 1 ? "vaga aberta" : "vagas abertas") + " agora", 1)
                    ])) : createCommentVNode("", true),
                    createVNode("h1", { class: "t-display mt-5 max-w-2xl !leading-[1.05] sm:!text-[3.6rem]" }, [
                      createTextVNode("Sua próxima oportunidade "),
                      createVNode("span", { class: "text-gradient" }, "começa aqui.")
                    ]),
                    createVNode("p", { class: "mt-5 max-w-xl text-base text-navy-100/85 sm:text-lg" }, "Encontre vagas, descubra novas possibilidades e vá direto para a candidatura."),
                    createVNode("div", { class: "mt-8 max-w-3xl" }, [
                      createVNode(_sfc_main$1)
                    ]),
                    createVNode("div", { class: "mt-5 flex flex-wrap items-center gap-2 text-sm" }, [
                      createVNode("span", { class: "text-navy-100/70" }, "Em alta:"),
                      (openBlock(), createBlock(Fragment, null, renderList(quick, (q) => {
                        return createVNode(unref(Link), {
                          key: q.href,
                          href: q.href,
                          class: "rounded-full border border-white/15 bg-white/[0.06] px-3.5 py-1.5 font-medium text-white/90 transition hover:border-white/30 hover:bg-white/15"
                        }, {
                          default: withCtx(() => [
                            createTextVNode(toDisplayString(q.label), 1)
                          ]),
                          _: 2
                        }, 1032, ["href"]);
                      }), 64))
                    ]),
                    __props.platforms.length ? (openBlock(), createBlock("div", {
                      key: 1,
                      class: "mt-9 flex flex-wrap items-center gap-x-5 gap-y-3"
                    }, [
                      createVNode("span", { class: "text-xs font-semibold tracking-widest text-navy-100/60 uppercase" }, "Vagas de"),
                      (openBlock(true), createBlock(Fragment, null, renderList(__props.platforms.slice(0, 6), (p) => {
                        return openBlock(), createBlock(unref(Link), {
                          key: p.value,
                          href: `/vagas?plataforma=${p.value}`,
                          class: "flex items-center gap-2 text-sm font-semibold text-white/85 transition hover:text-white",
                          title: `Ver vagas via ${p.label}`
                        }, {
                          default: withCtx(() => [
                            p.logo ? (openBlock(), createBlock("img", {
                              key: 0,
                              src: p.logo,
                              alt: p.label,
                              class: "h-6 w-auto max-w-[5rem] rounded-md object-contain"
                            }, null, 8, ["src", "alt"])) : createCommentVNode("", true),
                            createTextVNode(toDisplayString(p.label), 1)
                          ]),
                          _: 2
                        }, 1032, ["href", "title"]);
                      }), 128))
                    ])) : createCommentVNode("", true)
                  ]),
                  __props.heroJobs.length ? (openBlock(), createBlock(_sfc_main$2, {
                    key: 0,
                    jobs: __props.heroJobs,
                    class: "hidden sm:block"
                  }, null, 8, ["jobs"])) : createCommentVNode("", true)
                ])
              ]),
              __props.stats.jobs ? (openBlock(), createBlock("div", {
                key: 0,
                class: "container-page relative z-10 -mt-9"
              }, [
                createVNode("dl", { class: "grid grid-cols-3 divide-x divide-line overflow-hidden rounded-(--radius-card) border border-line bg-white shadow-(--shadow-pop)" }, [
                  (openBlock(true), createBlock(Fragment, null, renderList([{ n: __props.stats.jobs, l: __props.stats.jobs === 1 ? "vaga aberta" : "vagas abertas" }, { n: __props.stats.companies, l: __props.stats.companies === 1 ? "empresa contratando" : "empresas contratando" }, { n: __props.stats.platforms, l: __props.stats.platforms === 1 ? "plataforma" : "plataformas" }], (s) => {
                    return openBlock(), createBlock("div", {
                      key: s.l,
                      class: "px-3 py-4 text-center sm:py-5"
                    }, [
                      createVNode("dd", { class: "text-2xl font-extrabold tracking-tight text-navy-900 tabular-nums sm:text-3xl" }, toDisplayString(s.n), 1),
                      createVNode("dt", { class: "mt-0.5 text-xs font-medium text-muted sm:text-sm" }, toDisplayString(s.l), 1)
                    ]);
                  }), 128))
                ])
              ])) : createCommentVNode("", true),
              createVNode("div", { class: "container-page pt-8 pb-2" }, [
                createVNode(_sfc_main$6, {
                  placement: "home-top",
                  format: "leaderboard"
                })
              ]),
              createVNode("div", { class: "container-page" }, [
                __props.platforms.length ? (openBlock(), createBlock("section", {
                  key: 0,
                  "aria-labelledby": "plataformas",
                  class: "pb-2"
                }, [
                  createVNode("h2", {
                    id: "plataformas",
                    class: "t-eyebrow mb-3 text-muted"
                  }, "Vagas por plataforma de contratação"),
                  createVNode(_sfc_main$7, { platforms: __props.platforms }, null, 8, ["platforms"])
                ])) : createCommentVNode("", true),
                __props.featured.length ? (openBlock(), createBlock("section", {
                  key: 1,
                  class: "pt-10",
                  "aria-labelledby": "destaques"
                }, [
                  createVNode("div", { class: "mb-5 flex items-center gap-2" }, [
                    createVNode(unref(Sparkles), {
                      class: "size-5 text-action-600",
                      "aria-hidden": "true"
                    }),
                    createVNode("h2", {
                      id: "destaques",
                      class: "t-h2 text-ink"
                    }, "Vagas em destaque")
                  ]),
                  createVNode("div", { class: "grid gap-4 md:grid-cols-2 lg:grid-cols-3" }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(__props.featured, (job) => {
                      return openBlock(), createBlock(_sfc_main$8, {
                        key: job.id,
                        job
                      }, null, 8, ["job"]);
                    }), 128))
                  ])
                ])) : createCommentVNode("", true),
                __props.categories.length ? (openBlock(), createBlock("section", {
                  key: 2,
                  id: "categorias",
                  class: "scroll-mt-20 pt-14",
                  "aria-labelledby": "categorias-titulo"
                }, [
                  createVNode("div", { class: "mb-5 flex items-end justify-between gap-3" }, [
                    createVNode("h2", {
                      id: "categorias-titulo",
                      class: "t-h2 text-ink"
                    }, "Navegue por categoria"),
                    createVNode(unref(Link), {
                      href: "/categorias",
                      class: "btn-secondary btn-sm"
                    }, {
                      default: withCtx(() => [
                        createTextVNode("Ver todas"),
                        createVNode(unref(ArrowRight), {
                          class: "size-4",
                          "aria-hidden": "true"
                        })
                      ]),
                      _: 1
                    })
                  ]),
                  createVNode("ul", { class: "grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4" }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(__props.categories.slice(0, 8), (c) => {
                      return openBlock(), createBlock("li", {
                        key: c.slug
                      }, [
                        createVNode(unref(Link), {
                          href: c.url,
                          class: "card flex h-full items-center gap-3 p-3.5 transition hover:border-action-500 hover:shadow-(--shadow-lift)"
                        }, {
                          default: withCtx(() => [
                            createVNode("span", { class: "grid size-11 shrink-0 place-items-center rounded-xl bg-action-50 text-action-700" }, [
                              createVNode(_sfc_main$9, {
                                name: c.icon,
                                class: "size-5"
                              }, null, 8, ["name"])
                            ]),
                            createVNode("span", { class: "min-w-0" }, [
                              createVNode("span", { class: "block truncate text-sm font-bold text-ink" }, toDisplayString(c.name), 1),
                              createVNode("span", { class: "text-xs text-muted" }, toDisplayString(c.count) + " " + toDisplayString(c.count === 1 ? "vaga" : "vagas"), 1)
                            ])
                          ]),
                          _: 2
                        }, 1032, ["href"])
                      ]);
                    }), 128))
                  ])
                ])) : createCommentVNode("", true),
                createVNode("div", { class: "py-10" }, [
                  createVNode(_sfc_main$6, {
                    placement: "home-mid",
                    format: "leaderboard"
                  })
                ]),
                createVNode("section", { "aria-labelledby": "recentes" }, [
                  createVNode("div", { class: "mb-5 flex items-end justify-between gap-3" }, [
                    createVNode("h2", {
                      id: "recentes",
                      class: "t-h2 text-ink"
                    }, "Vagas recentes"),
                    __props.recent.length ? (openBlock(), createBlock(unref(Link), {
                      key: 0,
                      href: "/vagas",
                      class: "inline-flex items-center gap-1 text-sm font-bold text-action-700 hover:underline"
                    }, {
                      default: withCtx(() => [
                        createTextVNode("Ver todas"),
                        createVNode(unref(ArrowRight), {
                          class: "size-4",
                          "aria-hidden": "true"
                        })
                      ]),
                      _: 1
                    })) : createCommentVNode("", true)
                  ]),
                  __props.recent.length ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "grid gap-4 md:grid-cols-2 lg:grid-cols-3"
                  }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(__props.recent, (job) => {
                      return openBlock(), createBlock(_sfc_main$8, {
                        key: job.id,
                        job
                      }, null, 8, ["job"]);
                    }), 128))
                  ])) : (openBlock(), createBlock(_sfc_main$a, {
                    key: 1,
                    icon: unref(Briefcase),
                    title: "Ainda não há vagas abertas",
                    description: "Novas oportunidades são publicadas com frequência. Volte em breve."
                  }, null, 8, ["icon"])),
                  __props.recent.length ? (openBlock(), createBlock("div", {
                    key: 2,
                    class: "mt-7 text-center"
                  }, [
                    createVNode(unref(Link), {
                      href: "/vagas",
                      class: "btn-primary btn-lg"
                    }, {
                      default: withCtx(() => [
                        createVNode(unref(Search), {
                          class: "size-4.5",
                          "aria-hidden": "true"
                        }),
                        createTextVNode("Explorar todas as vagas")
                      ]),
                      _: 1
                    })
                  ])) : createCommentVNode("", true)
                ]),
                createVNode("section", {
                  class: "panel mt-16 grid gap-6 p-6 sm:grid-cols-3 sm:p-9",
                  "aria-label": "Como funciona"
                }, [
                  (openBlock(), createBlock(Fragment, null, renderList([
                    { t: "Busque", d: "Pesquise por cargo, cidade, modalidade, nível e plataforma, sem criar conta." },
                    { t: "Confira os detalhes", d: "Veja requisitos, benefícios e salário quando divulgado pela empresa." },
                    { t: "Candidate-se na fonte", d: "Você vai direto ao site, plataforma ou e-mail oficial da empresa." }
                  ], (step, i) => {
                    return createVNode("div", { key: i }, [
                      createVNode("span", { class: "grid size-9 place-items-center rounded-full bg-navy-900 text-sm font-bold text-white" }, toDisplayString(i + 1), 1),
                      createVNode("h3", { class: "t-h3 mt-4 text-ink" }, toDisplayString(step.t), 1),
                      createVNode("p", { class: "mt-1.5 text-sm text-muted" }, toDisplayString(step.d), 1)
                    ]);
                  }), 64))
                ]),
                createVNode("p", { class: "mt-4 flex items-center gap-1.5 text-xs text-subtle" }, [
                  createVNode(unref(ExternalLink), {
                    class: "size-3.5",
                    "aria-hidden": "true"
                  }),
                  createTextVNode("Ao clicar em candidatar-se, você sai do VagasPlus e segue para o site da empresa ou plataforma de recrutamento.")
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/pages/Public/Home.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=Home-BOA97Vnm.js.map
