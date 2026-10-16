import { defineComponent, ref, onMounted, onBeforeUnmount, watch, nextTick, mergeProps, unref, useSSRContext, computed, withCtx, createVNode, createTextVNode, toDisplayString, openBlock, createBlock, createCommentVNode, Fragment, renderList } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderAttr, ssrRenderClass, ssrInterpolate, ssrRenderStyle } from "vue/server-renderer";
import { Link } from "@inertiajs/vue3";
import { ListTree, Mail, Share2, Check, Copy, Eye, Pencil, ShieldAlert, SearchX, MapPin, Wifi, Banknote, CalendarDays, ExternalLink, Lock, ArrowLeft } from "lucide-vue-next";
import { _ as _sfc_main$8 } from "./AdSlot-4pkaOtdy.js";
import { _ as _sfc_main$4 } from "./Breadcrumbs-C8MHcfb-.js";
import { _ as _sfc_main$5 } from "./CompanyLogo-meQRdREr.js";
import { a as _sfc_main$6, b as _sfc_main$7, _ as _sfc_main$9 } from "./JobCard-CV-JBXgW.js";
import { siWhatsapp, siFacebook, siX, siTelegram } from "simple-icons";
import { _ as _sfc_main$3 } from "./PublicLayout-DWxlUL7J.js";
import "./FlashMessages-mTMlubKC.js";
import "./SeoHead-BMQcIEwx.js";
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "JobSectionNav",
  __ssrInlineRender: true,
  props: {
    items: {},
    variant: {}
  },
  setup(__props) {
    const props = __props;
    const active = ref(props.items[0]?.id ?? "");
    const chipsRef = ref(null);
    let observer;
    const inView = /* @__PURE__ */ new Set();
    function pickActive() {
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 6) {
        active.value = props.items[props.items.length - 1]?.id ?? active.value;
        return;
      }
      const first = props.items.find((i) => inView.has(i.id));
      if (first) active.value = first.id;
    }
    onMounted(() => {
      observer = new IntersectionObserver(
        (entries) => {
          for (const e of entries) e.isIntersecting ? inView.add(e.target.id) : inView.delete(e.target.id);
          pickActive();
        },
        // Faixa de leitura: da parte de cima (abaixo do menu fixo) até ~45% da tela.
        { rootMargin: "-110px 0px -55% 0px", threshold: 0 }
      );
      props.items.forEach((i) => {
        const el = document.getElementById(i.id);
        if (el) observer.observe(el);
      });
      window.addEventListener("scroll", pickActive, { passive: true });
    });
    onBeforeUnmount(() => {
      observer?.disconnect();
      window.removeEventListener("scroll", pickActive);
    });
    watch(active, async (id) => {
      if (props.variant !== "chips") return;
      await nextTick();
      const bar = chipsRef.value;
      const chip = bar?.querySelector(`[data-id="${id}"]`);
      if (bar && chip) bar.scrollTo({ left: chip.offsetLeft - bar.clientWidth / 2 + chip.clientWidth / 2, behavior: "smooth" });
    });
    return (_ctx, _push, _parent, _attrs) => {
      if (__props.variant === "card") {
        _push(`<nav${ssrRenderAttrs(mergeProps({
          "aria-label": "Seções desta vaga",
          class: "card hidden p-4 xl:block"
        }, _attrs))}><p class="mb-2 flex items-center gap-2 px-2 text-xs font-bold tracking-widest text-muted uppercase">`);
        _push(ssrRenderComponent(unref(ListTree), {
          class: "size-3.5",
          "aria-hidden": "true"
        }, null, _parent));
        _push(`Nesta vaga</p><ol class="space-y-0.5"><!--[-->`);
        ssrRenderList(__props.items, (item) => {
          _push(`<li><a${ssrRenderAttr("href", `#${item.id}`)}${ssrRenderAttr("aria-current", active.value === item.id ? "location" : void 0)} class="${ssrRenderClass([active.value === item.id ? "border-action-600 bg-action-50 text-action-700" : "border-transparent text-muted hover:bg-surface hover:text-ink", "block rounded-lg border-l-2 px-3 py-2 text-sm font-semibold transition-colors"])}">${ssrInterpolate(item.title)}</a></li>`);
        });
        _push(`<!--]--></ol></nav>`);
      } else {
        _push(`<nav${ssrRenderAttrs(mergeProps({
          "aria-label": "Seções desta vaga",
          class: "sticky top-16 z-30 -mx-4 mb-4 border-b border-line bg-surface/95 backdrop-blur sm:-mx-6 lg:-mx-8 xl:hidden"
        }, _attrs))}><ol class="flex gap-2 overflow-x-auto px-4 py-2.5 sm:px-6 [scrollbar-width:none]"><!--[-->`);
        ssrRenderList(__props.items, (item) => {
          _push(`<li class="shrink-0"><a${ssrRenderAttr("href", `#${item.id}`)}${ssrRenderAttr("data-id", item.id)}${ssrRenderAttr("aria-current", active.value === item.id ? "location" : void 0)} class="${ssrRenderClass([active.value === item.id ? "border-action-600 bg-action-600 text-white" : "border-line-strong bg-white text-muted", "inline-flex min-h-9 items-center rounded-full border px-3.5 text-[13px] font-semibold whitespace-nowrap transition-colors"])}">${ssrInterpolate(item.title)}</a></li>`);
        });
        _push(`<!--]--></ol></nav>`);
      }
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/JobSectionNav.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const LINKEDIN = "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z";
const btn = "grid size-9 place-items-center rounded-full border border-line bg-white text-muted transition-colors duration-150 hover:border-transparent hover:text-white";
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "ShareButtons",
  __ssrInlineRender: true,
  props: {
    url: {},
    title: {}
  },
  setup(__props) {
    const props = __props;
    const enc = (s) => encodeURIComponent(s);
    const networks = computed(() => [
      { name: "WhatsApp", path: siWhatsapp.path, color: "#25D366", href: `https://wa.me/?text=${enc(`${props.title} ${props.url}`)}` },
      { name: "Facebook", path: siFacebook.path, color: "#1877F2", href: `https://www.facebook.com/sharer/sharer.php?u=${enc(props.url)}` },
      { name: "X", path: siX.path, color: "#000000", href: `https://twitter.com/intent/tweet?text=${enc(props.title)}&url=${enc(props.url)}` },
      { name: "LinkedIn", path: LINKEDIN, color: "#0A66C2", href: `https://www.linkedin.com/sharing/share-offsite/?url=${enc(props.url)}` },
      { name: "Telegram", path: siTelegram.path, color: "#26A5E4", href: `https://t.me/share/url?url=${enc(props.url)}&text=${enc(props.title)}` }
    ]);
    const mail = computed(() => `mailto:?subject=${enc(props.title)}&body=${enc(`Olha essa vaga: ${props.url}`)}`);
    const shown = computed(() => props.url.replace(/^https?:\/\//, ""));
    const canShare = ref(false);
    const copied = ref(false);
    const failed = ref(false);
    let timer;
    onMounted(() => {
      canShare.value = typeof navigator !== "undefined" && typeof navigator.share === "function";
    });
    onBeforeUnmount(() => clearTimeout(timer));
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)}><p class="mb-2 text-[11px] font-bold tracking-widest text-muted uppercase">Compartilhar vaga</p><ul class="flex flex-wrap gap-1.5"><!--[-->`);
      ssrRenderList(networks.value, (n) => {
        _push(`<li><a${ssrRenderAttr("href", n.href)} target="_blank" rel="noopener noreferrer" class="${ssrRenderClass([btn, "hover:bg-(--brand)"])}" style="${ssrRenderStyle({ "--brand": n.color })}"${ssrRenderAttr("aria-label", `Compartilhar no ${n.name}`)}${ssrRenderAttr("title", n.name)}><svg viewBox="0 0 24 24" class="size-[17px] fill-current" aria-hidden="true"><path${ssrRenderAttr("d", n.path)}></path></svg></a></li>`);
      });
      _push(`<!--]--><li><a${ssrRenderAttr("href", mail.value)} class="${ssrRenderClass([btn, "hover:bg-navy-700"])}" aria-label="Compartilhar por e-mail" title="E-mail">`);
      _push(ssrRenderComponent(unref(Mail), {
        class: "size-[17px]",
        "aria-hidden": "true"
      }, null, _parent));
      _push(`</a></li>`);
      if (canShare.value) {
        _push(`<li><button type="button" class="${ssrRenderClass([btn, "hover:bg-action-600"])}" aria-label="Mais opções de compartilhamento" title="Mais">`);
        _push(ssrRenderComponent(unref(Share2), {
          class: "size-[17px]",
          "aria-hidden": "true"
        }, null, _parent));
        _push(`</button></li>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</ul><div class="${ssrRenderClass([copied.value ? "border-success-700/40 bg-success-50" : failed.value ? "border-danger-700/40 bg-danger-50" : "border-line-strong", "mt-2.5 flex items-center gap-1 rounded-xl border bg-surface py-0.5 pr-0.5 pl-3 transition-colors"])}"><span class="${ssrRenderClass([copied.value ? "font-semibold text-success-700" : failed.value ? "font-semibold text-danger-700" : "text-muted", "min-w-0 flex-1 truncate text-xs"])}"${ssrRenderAttr("title", __props.url)}>${ssrInterpolate(copied.value ? "Link copiado!" : failed.value ? "Não foi possível copiar" : shown.value)}</span><button type="button" class="${ssrRenderClass([copied.value ? "text-success-700" : "text-ink", "grid size-8 shrink-0 place-items-center rounded-lg transition-colors hover:bg-white"])}" aria-label="Copiar link da vaga" title="Copiar link">`);
      if (copied.value) {
        _push(ssrRenderComponent(unref(Check), {
          class: "size-4",
          "aria-hidden": "true"
        }, null, _parent));
      } else {
        _push(ssrRenderComponent(unref(Copy), {
          class: "size-4",
          "aria-hidden": "true"
        }, null, _parent));
      }
      _push(`</button></div><p class="sr-only" role="status" aria-live="polite">${ssrInterpolate(copied.value ? "Link copiado" : failed.value ? "Não foi possível copiar o link" : "")}</p></div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ShareButtons.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "JobShow",
  __ssrInlineRender: true,
  props: {
    job: {},
    closed: { type: Boolean },
    preview: { type: Boolean },
    previewStatus: {},
    editUrl: {},
    related: {},
    breadcrumbs: {},
    seo: {}
  },
  setup(__props) {
    const props = __props;
    const shareUrl = computed(() => props.seo.canonical ?? "");
    const sections = [
      { key: "description", title: "Sobre a oportunidade" },
      { key: "responsibilities", title: "Responsabilidades" },
      { key: "requirements", title: "Requisitos" },
      { key: "nice_to_have", title: "Diferenciais" },
      { key: "benefits", title: "Benefícios" },
      { key: "additional_info", title: "Informações adicionais" }
    ];
    const visible = computed(() => sections.filter((s) => props.job.sections[s.key]));
    const navItems = computed(() => [
      ...visible.value.map((s) => ({ id: `sec-${s.key}`, title: s.title })),
      ...props.job.company_about ? [{ id: "sec-company", title: `Sobre a ${props.job.company.name}` }] : []
    ]);
    const byEmail = computed(() => !!props.job.apply_email);
    const canApply = computed(() => !props.closed && (!!props.job.apply_url || byEmail.value));
    const mailHref = computed(() => `mailto:${props.job.apply_email}?subject=${encodeURIComponent(`Candidatura: ${props.job.title}`)}`);
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$3, mergeProps({ seo: __props.seo }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (__props.preview) {
              _push2(`<div class="border-b border-warning-700/20 bg-warning-50"${_scopeId}><div class="container-page flex flex-wrap items-center justify-between gap-2 py-2.5 text-sm text-warning-700"${_scopeId}><p class="inline-flex items-center gap-2 font-semibold"${_scopeId}>`);
              _push2(ssrRenderComponent(unref(Eye), {
                class: "size-4",
                "aria-hidden": "true"
              }, null, _parent2, _scopeId));
              _push2(`Pré-visualização administrativa · status: ${ssrInterpolate(__props.previewStatus)} · não indexável</p>`);
              if (__props.editUrl) {
                _push2(ssrRenderComponent(unref(Link), {
                  href: __props.editUrl,
                  class: "inline-flex items-center gap-1.5 font-bold hover:underline"
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(ssrRenderComponent(unref(Pencil), {
                        class: "size-4",
                        "aria-hidden": "true"
                      }, null, _parent3, _scopeId2));
                      _push3(`Voltar para a edição`);
                    } else {
                      return [
                        createVNode(unref(Pencil), {
                          class: "size-4",
                          "aria-hidden": "true"
                        }),
                        createTextVNode("Voltar para a edição")
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="container-page py-6 sm:py-8 xl:max-w-[1360px]"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$4, { items: __props.breadcrumbs }, null, _parent2, _scopeId));
            if (__props.closed) {
              _push2(`<section class="panel mt-5 p-6 sm:p-9" aria-labelledby="encerrada"${_scopeId}><div class="flex flex-col gap-5 sm:flex-row sm:items-start"${_scopeId}>`);
              _push2(ssrRenderComponent(_sfc_main$5, {
                name: __props.job.company.name,
                url: __props.job.company.logo_url,
                size: "lg"
              }, null, _parent2, _scopeId));
              _push2(`<div${_scopeId}><p class="t-eyebrow inline-flex items-center gap-1.5 text-warning-700"${_scopeId}>`);
              _push2(ssrRenderComponent(unref(ShieldAlert), {
                class: "size-4",
                "aria-hidden": "true"
              }, null, _parent2, _scopeId));
              _push2(`Oportunidade encerrada</p><h1 id="encerrada" class="t-h1 mt-1.5 text-ink"${_scopeId}>${ssrInterpolate(__props.job.title)}</h1><p class="mt-1 text-muted"${_scopeId}>${ssrInterpolate(__props.job.company.name)}</p><p class="mt-4 max-w-2xl text-[15px] text-ink/85"${_scopeId}>Esta vaga não está mais disponível no VagasPlus e as candidaturas por aqui foram encerradas. Confira abaixo oportunidades semelhantes que continuam abertas.</p><div class="mt-5 flex flex-wrap gap-2"${_scopeId}>`);
              if (__props.job.category) {
                _push2(ssrRenderComponent(unref(Link), {
                  href: `/categorias/${__props.job.category.slug}`,
                  class: "btn-primary"
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`Mais vagas de ${ssrInterpolate(__props.job.category.name)}`);
                    } else {
                      return [
                        createTextVNode("Mais vagas de " + toDisplayString(__props.job.category.name), 1)
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              _push2(ssrRenderComponent(unref(Link), {
                href: "/vagas",
                class: "btn-secondary"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(unref(SearchX), {
                      class: "size-4",
                      "aria-hidden": "true"
                    }, null, _parent3, _scopeId2));
                    _push3(`Buscar outras vagas`);
                  } else {
                    return [
                      createVNode(unref(SearchX), {
                        class: "size-4",
                        "aria-hidden": "true"
                      }),
                      createTextVNode("Buscar outras vagas")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div></div></div></section>`);
            } else {
              _push2(`<div class="mt-5 grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] xl:grid-cols-[13.5rem_minmax(0,1fr)_20rem]"${_scopeId}>`);
              if (navItems.value.length >= 2) {
                _push2(`<div class="hidden xl:block"${_scopeId}><div class="sticky top-24"${_scopeId}>`);
                _push2(ssrRenderComponent(_sfc_main$2, {
                  variant: "card",
                  items: navItems.value
                }, null, _parent2, _scopeId));
                _push2(`</div></div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`<article${_scopeId}>`);
              if (navItems.value.length >= 2) {
                _push2(ssrRenderComponent(_sfc_main$2, {
                  variant: "chips",
                  items: navItems.value
                }, null, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              _push2(`<header class="card p-5 sm:p-7"${_scopeId}><div class="flex items-start gap-4"${_scopeId}>`);
              _push2(ssrRenderComponent(_sfc_main$5, {
                name: __props.job.company.name,
                url: __props.job.company.logo_url,
                size: "lg"
              }, null, _parent2, _scopeId));
              _push2(`<div class="min-w-0 flex-1"${_scopeId}><h1 class="text-2xl leading-tight font-extrabold tracking-tight text-balance text-ink sm:text-3xl"${_scopeId}>${ssrInterpolate(__props.job.title)}</h1><p class="mt-1 text-[15px] font-medium text-muted"${_scopeId}>`);
              if (__props.job.company_website) {
                _push2(`<a${ssrRenderAttr("href", __props.job.company_website)} target="_blank" rel="noopener noreferrer nofollow" class="hover:text-action-700 hover:underline"${_scopeId}>${ssrInterpolate(__props.job.company.name)}</a>`);
              } else {
                _push2(`<!--[-->${ssrInterpolate(__props.job.company.name)}<!--]-->`);
              }
              _push2(`</p>`);
              _push2(ssrRenderComponent(_sfc_main$6, {
                platform: __props.job.platform,
                class: "mt-2"
              }, null, _parent2, _scopeId));
              _push2(`</div>`);
              _push2(ssrRenderComponent(_sfc_main$7, {
                job: __props.job,
                variant: "corner",
                class: "shrink-0"
              }, null, _parent2, _scopeId));
              _push2(`</div><dl class="mt-5 grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2"${_scopeId}>`);
              if (__props.job.location) {
                _push2(`<div class="flex items-center gap-2.5"${_scopeId}>`);
                _push2(ssrRenderComponent(unref(MapPin), {
                  class: "size-4 text-subtle",
                  "aria-hidden": "true"
                }, null, _parent2, _scopeId));
                _push2(`<dt class="sr-only"${_scopeId}>Localização</dt><dd class="font-medium text-ink"${_scopeId}>${ssrInterpolate(__props.job.location)}</dd></div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`<div class="flex items-center gap-2.5"${_scopeId}>`);
              _push2(ssrRenderComponent(unref(Wifi), {
                class: "size-4 text-subtle",
                "aria-hidden": "true"
              }, null, _parent2, _scopeId));
              _push2(`<dt class="sr-only"${_scopeId}>Modalidade</dt><dd class="font-medium text-ink"${_scopeId}>${ssrInterpolate(__props.job.work_mode.label)} · ${ssrInterpolate(__props.job.employment_type)}`);
              if (__props.job.experience_level) {
                _push2(`<!--[--> · ${ssrInterpolate(__props.job.experience_level)}<!--]-->`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</dd></div><div class="flex items-center gap-2.5"${_scopeId}>`);
              _push2(ssrRenderComponent(unref(Banknote), {
                class: "size-4 text-subtle",
                "aria-hidden": "true"
              }, null, _parent2, _scopeId));
              _push2(`<dt class="sr-only"${_scopeId}>Salário</dt><dd class="${ssrRenderClass(__props.job.salary ? "font-semibold text-ink" : "text-subtle")}"${_scopeId}>${ssrInterpolate(__props.job.salary ?? "Salário não informado")}</dd></div><div class="flex items-center gap-2.5"${_scopeId}>`);
              _push2(ssrRenderComponent(unref(CalendarDays), {
                class: "size-4 text-subtle",
                "aria-hidden": "true"
              }, null, _parent2, _scopeId));
              _push2(`<dt class="sr-only"${_scopeId}>Publicação</dt><dd class="text-ink"${_scopeId}>Publicada em ${ssrInterpolate(__props.job.published_date_label)}</dd></div></dl><div class="mt-5 flex flex-wrap items-center gap-3 border-t border-line pt-5"${_scopeId}><span class="inline-flex items-center gap-1.5 rounded-full bg-success-50 px-3 py-1 text-xs font-bold text-success-700"${_scopeId}><span class="size-1.5 rounded-full bg-success-700" aria-hidden="true"${_scopeId}></span>Vaga aberta</span>`);
              if (__props.job.expires_label) {
                _push2(`<span class="text-xs text-muted"${_scopeId}>Anunciada até ${ssrInterpolate(__props.job.expires_label)}. A empresa pode encerrar antes.</span>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
              if (canApply.value) {
                _push2(`<div class="mt-5 space-y-2 lg:hidden"${_scopeId}>`);
                if (byEmail.value) {
                  _push2(`<a${ssrRenderAttr("href", mailHref.value)} class="btn-primary btn-lg w-full"${_scopeId}>Candidatar-se por e-mail`);
                  _push2(ssrRenderComponent(unref(Mail), {
                    class: "size-4.5",
                    "aria-hidden": "true"
                  }, null, _parent2, _scopeId));
                  _push2(`</a>`);
                } else {
                  _push2(`<a${ssrRenderAttr("href", __props.job.apply_url)} target="_blank" rel="noopener noreferrer nofollow" class="btn-primary btn-lg w-full"${_scopeId}>Candidatar-se à vaga`);
                  _push2(ssrRenderComponent(unref(ExternalLink), {
                    class: "size-4.5",
                    "aria-hidden": "true"
                  }, null, _parent2, _scopeId));
                  _push2(`</a>`);
                }
                _push2(`</div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</header><div class="mt-4"${_scopeId}>`);
              _push2(ssrRenderComponent(_sfc_main$8, {
                placement: "job-top",
                format: "leaderboard"
              }, null, _parent2, _scopeId));
              _push2(`</div><div class="mt-4 space-y-4"${_scopeId}><!--[-->`);
              ssrRenderList(visible.value, (s, i) => {
                _push2(`<!--[--><section${ssrRenderAttr("id", `sec-${s.key}`)} class="card scroll-mt-36 p-5 sm:p-7 lg:scroll-mt-28"${ssrRenderAttr("aria-labelledby", `sec-${s.key}-t`)}${_scopeId}><h2${ssrRenderAttr("id", `sec-${s.key}-t`)} tabindex="-1" class="t-h2 mb-3 text-ink outline-none"${_scopeId}>${ssrInterpolate(s.title)}</h2><div class="prose-job"${_scopeId}>${__props.job.sections[s.key] ?? ""}</div></section>`);
                if (i === 1) {
                  _push2(ssrRenderComponent(_sfc_main$8, {
                    placement: "job-mid",
                    format: "leaderboard"
                  }, null, _parent2, _scopeId));
                } else {
                  _push2(`<!---->`);
                }
                _push2(`<!--]-->`);
              });
              _push2(`<!--]-->`);
              if (__props.job.company_about) {
                _push2(`<section id="sec-company" class="card scroll-mt-36 p-5 sm:p-7 lg:scroll-mt-28" aria-labelledby="sec-company-t"${_scopeId}><h2 id="sec-company-t" tabindex="-1" class="t-h2 mb-3 text-ink outline-none"${_scopeId}>Sobre a ${ssrInterpolate(__props.job.company.name)}</h2><div class="prose-job"${_scopeId}>${__props.job.company_about ?? ""}</div></section>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div><div class="mt-8"${_scopeId}>`);
              _push2(ssrRenderComponent(_sfc_main$8, {
                placement: "job-bottom",
                format: "leaderboard"
              }, null, _parent2, _scopeId));
              _push2(`</div></article><aside aria-label="Candidatura e compartilhamento"${_scopeId}><div class="space-y-4 lg:sticky lg:top-20 lg:-m-1 lg:max-h-[calc(100vh-5.5rem)] lg:overflow-y-auto lg:overscroll-contain lg:p-1"${_scopeId}><div class="panel p-5"${_scopeId}>`);
              if (canApply.value) {
                _push2(`<!--[-->`);
                if (byEmail.value) {
                  _push2(`<a${ssrRenderAttr("href", mailHref.value)} class="btn-primary btn-lg w-full"${_scopeId}>Candidatar-se por e-mail`);
                  _push2(ssrRenderComponent(unref(Mail), {
                    class: "size-4.5",
                    "aria-hidden": "true"
                  }, null, _parent2, _scopeId));
                  _push2(`</a>`);
                } else {
                  _push2(`<a${ssrRenderAttr("href", __props.job.apply_url)} target="_blank" rel="noopener noreferrer nofollow" class="btn-primary btn-lg w-full"${_scopeId}>Candidatar-se à vaga`);
                  _push2(ssrRenderComponent(unref(ExternalLink), {
                    class: "size-4.5",
                    "aria-hidden": "true"
                  }, null, _parent2, _scopeId));
                  _push2(`</a>`);
                }
                if (byEmail.value) {
                  _push2(`<p class="mt-3 flex items-start gap-2 text-xs leading-relaxed text-muted"${_scopeId}>`);
                  _push2(ssrRenderComponent(unref(Mail), {
                    class: "mt-0.5 size-3.5 shrink-0",
                    "aria-hidden": "true"
                  }, null, _parent2, _scopeId));
                  _push2(`<span${_scopeId}>Candidatura por e-mail para <strong class="break-words text-ink"${_scopeId}>${ssrInterpolate(__props.job.apply_email)}</strong>, sem link de inscrição.</span></p>`);
                } else {
                  _push2(`<p class="mt-3 flex items-start gap-2 text-xs leading-relaxed text-muted"${_scopeId}>`);
                  _push2(ssrRenderComponent(unref(Lock), {
                    class: "mt-0.5 size-3.5 shrink-0",
                    "aria-hidden": "true"
                  }, null, _parent2, _scopeId));
                  _push2(`<span${ssrRenderAttr("title", `Destino: ${__props.job.apply_host}`)}${_scopeId}>Você será direcionado à página de candidatura, fora do VagasPlus.</span></p>`);
                }
                _push2(`<!--]-->`);
              } else {
                _push2(`<p class="rounded-lg bg-surface p-3 text-center text-sm text-muted"${_scopeId}>Candidatura indisponível.</p>`);
              }
              _push2(`</div><div class="card p-3.5"${_scopeId}>`);
              _push2(ssrRenderComponent(_sfc_main$1, {
                url: shareUrl.value,
                title: `${__props.job.title} - ${__props.job.company.name}`
              }, null, _parent2, _scopeId));
              _push2(`</div>`);
              _push2(ssrRenderComponent(_sfc_main$8, {
                placement: "job-side",
                format: "square"
              }, null, _parent2, _scopeId));
              _push2(`</div></aside></div>`);
            }
            if (__props.related.length) {
              _push2(`<section class="mt-12" aria-labelledby="relacionadas"${_scopeId}><h2 id="relacionadas" class="t-h2 mb-5 text-ink"${_scopeId}>${ssrInterpolate(__props.closed ? "Vagas semelhantes ainda abertas" : "Vagas relacionadas")}</h2><div class="grid gap-4 md:grid-cols-2"${_scopeId}><!--[-->`);
              ssrRenderList(__props.related, (r) => {
                _push2(ssrRenderComponent(_sfc_main$9, {
                  key: r.id,
                  job: r
                }, null, _parent2, _scopeId));
              });
              _push2(`<!--]--></div></section>`);
            } else {
              _push2(`<!---->`);
            }
            if (!__props.closed && !__props.preview) {
              _push2(`<div class="mt-8"${_scopeId}>`);
              _push2(ssrRenderComponent(unref(Link), {
                href: "/vagas",
                class: "inline-flex items-center gap-1.5 text-sm font-bold text-action-700 hover:underline"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(unref(ArrowLeft), {
                      class: "size-4",
                      "aria-hidden": "true"
                    }, null, _parent3, _scopeId2));
                    _push3(`Voltar para todas as vagas`);
                  } else {
                    return [
                      createVNode(unref(ArrowLeft), {
                        class: "size-4",
                        "aria-hidden": "true"
                      }),
                      createTextVNode("Voltar para todas as vagas")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
          } else {
            return [
              __props.preview ? (openBlock(), createBlock("div", {
                key: 0,
                class: "border-b border-warning-700/20 bg-warning-50"
              }, [
                createVNode("div", { class: "container-page flex flex-wrap items-center justify-between gap-2 py-2.5 text-sm text-warning-700" }, [
                  createVNode("p", { class: "inline-flex items-center gap-2 font-semibold" }, [
                    createVNode(unref(Eye), {
                      class: "size-4",
                      "aria-hidden": "true"
                    }),
                    createTextVNode("Pré-visualização administrativa · status: " + toDisplayString(__props.previewStatus) + " · não indexável", 1)
                  ]),
                  __props.editUrl ? (openBlock(), createBlock(unref(Link), {
                    key: 0,
                    href: __props.editUrl,
                    class: "inline-flex items-center gap-1.5 font-bold hover:underline"
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(Pencil), {
                        class: "size-4",
                        "aria-hidden": "true"
                      }),
                      createTextVNode("Voltar para a edição")
                    ]),
                    _: 1
                  }, 8, ["href"])) : createCommentVNode("", true)
                ])
              ])) : createCommentVNode("", true),
              createVNode("div", { class: "container-page py-6 sm:py-8 xl:max-w-[1360px]" }, [
                createVNode(_sfc_main$4, { items: __props.breadcrumbs }, null, 8, ["items"]),
                __props.closed ? (openBlock(), createBlock("section", {
                  key: 0,
                  class: "panel mt-5 p-6 sm:p-9",
                  "aria-labelledby": "encerrada"
                }, [
                  createVNode("div", { class: "flex flex-col gap-5 sm:flex-row sm:items-start" }, [
                    createVNode(_sfc_main$5, {
                      name: __props.job.company.name,
                      url: __props.job.company.logo_url,
                      size: "lg"
                    }, null, 8, ["name", "url"]),
                    createVNode("div", null, [
                      createVNode("p", { class: "t-eyebrow inline-flex items-center gap-1.5 text-warning-700" }, [
                        createVNode(unref(ShieldAlert), {
                          class: "size-4",
                          "aria-hidden": "true"
                        }),
                        createTextVNode("Oportunidade encerrada")
                      ]),
                      createVNode("h1", {
                        id: "encerrada",
                        class: "t-h1 mt-1.5 text-ink"
                      }, toDisplayString(__props.job.title), 1),
                      createVNode("p", { class: "mt-1 text-muted" }, toDisplayString(__props.job.company.name), 1),
                      createVNode("p", { class: "mt-4 max-w-2xl text-[15px] text-ink/85" }, "Esta vaga não está mais disponível no VagasPlus e as candidaturas por aqui foram encerradas. Confira abaixo oportunidades semelhantes que continuam abertas."),
                      createVNode("div", { class: "mt-5 flex flex-wrap gap-2" }, [
                        __props.job.category ? (openBlock(), createBlock(unref(Link), {
                          key: 0,
                          href: `/categorias/${__props.job.category.slug}`,
                          class: "btn-primary"
                        }, {
                          default: withCtx(() => [
                            createTextVNode("Mais vagas de " + toDisplayString(__props.job.category.name), 1)
                          ]),
                          _: 1
                        }, 8, ["href"])) : createCommentVNode("", true),
                        createVNode(unref(Link), {
                          href: "/vagas",
                          class: "btn-secondary"
                        }, {
                          default: withCtx(() => [
                            createVNode(unref(SearchX), {
                              class: "size-4",
                              "aria-hidden": "true"
                            }),
                            createTextVNode("Buscar outras vagas")
                          ]),
                          _: 1
                        })
                      ])
                    ])
                  ])
                ])) : (openBlock(), createBlock("div", {
                  key: 1,
                  class: "mt-5 grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] xl:grid-cols-[13.5rem_minmax(0,1fr)_20rem]"
                }, [
                  navItems.value.length >= 2 ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "hidden xl:block"
                  }, [
                    createVNode("div", { class: "sticky top-24" }, [
                      createVNode(_sfc_main$2, {
                        variant: "card",
                        items: navItems.value
                      }, null, 8, ["items"])
                    ])
                  ])) : createCommentVNode("", true),
                  createVNode("article", null, [
                    navItems.value.length >= 2 ? (openBlock(), createBlock(_sfc_main$2, {
                      key: 0,
                      variant: "chips",
                      items: navItems.value
                    }, null, 8, ["items"])) : createCommentVNode("", true),
                    createVNode("header", { class: "card p-5 sm:p-7" }, [
                      createVNode("div", { class: "flex items-start gap-4" }, [
                        createVNode(_sfc_main$5, {
                          name: __props.job.company.name,
                          url: __props.job.company.logo_url,
                          size: "lg"
                        }, null, 8, ["name", "url"]),
                        createVNode("div", { class: "min-w-0 flex-1" }, [
                          createVNode("h1", { class: "text-2xl leading-tight font-extrabold tracking-tight text-balance text-ink sm:text-3xl" }, toDisplayString(__props.job.title), 1),
                          createVNode("p", { class: "mt-1 text-[15px] font-medium text-muted" }, [
                            __props.job.company_website ? (openBlock(), createBlock("a", {
                              key: 0,
                              href: __props.job.company_website,
                              target: "_blank",
                              rel: "noopener noreferrer nofollow",
                              class: "hover:text-action-700 hover:underline"
                            }, toDisplayString(__props.job.company.name), 9, ["href"])) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                              createTextVNode(toDisplayString(__props.job.company.name), 1)
                            ], 64))
                          ]),
                          createVNode(_sfc_main$6, {
                            platform: __props.job.platform,
                            class: "mt-2"
                          }, null, 8, ["platform"])
                        ]),
                        createVNode(_sfc_main$7, {
                          job: __props.job,
                          variant: "corner",
                          class: "shrink-0"
                        }, null, 8, ["job"])
                      ]),
                      createVNode("dl", { class: "mt-5 grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2" }, [
                        __props.job.location ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "flex items-center gap-2.5"
                        }, [
                          createVNode(unref(MapPin), {
                            class: "size-4 text-subtle",
                            "aria-hidden": "true"
                          }),
                          createVNode("dt", { class: "sr-only" }, "Localização"),
                          createVNode("dd", { class: "font-medium text-ink" }, toDisplayString(__props.job.location), 1)
                        ])) : createCommentVNode("", true),
                        createVNode("div", { class: "flex items-center gap-2.5" }, [
                          createVNode(unref(Wifi), {
                            class: "size-4 text-subtle",
                            "aria-hidden": "true"
                          }),
                          createVNode("dt", { class: "sr-only" }, "Modalidade"),
                          createVNode("dd", { class: "font-medium text-ink" }, [
                            createTextVNode(toDisplayString(__props.job.work_mode.label) + " · " + toDisplayString(__props.job.employment_type), 1),
                            __props.job.experience_level ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                              createTextVNode(" · " + toDisplayString(__props.job.experience_level), 1)
                            ], 64)) : createCommentVNode("", true)
                          ])
                        ]),
                        createVNode("div", { class: "flex items-center gap-2.5" }, [
                          createVNode(unref(Banknote), {
                            class: "size-4 text-subtle",
                            "aria-hidden": "true"
                          }),
                          createVNode("dt", { class: "sr-only" }, "Salário"),
                          createVNode("dd", {
                            class: __props.job.salary ? "font-semibold text-ink" : "text-subtle"
                          }, toDisplayString(__props.job.salary ?? "Salário não informado"), 3)
                        ]),
                        createVNode("div", { class: "flex items-center gap-2.5" }, [
                          createVNode(unref(CalendarDays), {
                            class: "size-4 text-subtle",
                            "aria-hidden": "true"
                          }),
                          createVNode("dt", { class: "sr-only" }, "Publicação"),
                          createVNode("dd", { class: "text-ink" }, "Publicada em " + toDisplayString(__props.job.published_date_label), 1)
                        ])
                      ]),
                      createVNode("div", { class: "mt-5 flex flex-wrap items-center gap-3 border-t border-line pt-5" }, [
                        createVNode("span", { class: "inline-flex items-center gap-1.5 rounded-full bg-success-50 px-3 py-1 text-xs font-bold text-success-700" }, [
                          createVNode("span", {
                            class: "size-1.5 rounded-full bg-success-700",
                            "aria-hidden": "true"
                          }),
                          createTextVNode("Vaga aberta")
                        ]),
                        __props.job.expires_label ? (openBlock(), createBlock("span", {
                          key: 0,
                          class: "text-xs text-muted"
                        }, "Anunciada até " + toDisplayString(__props.job.expires_label) + ". A empresa pode encerrar antes.", 1)) : createCommentVNode("", true)
                      ]),
                      canApply.value ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "mt-5 space-y-2 lg:hidden"
                      }, [
                        byEmail.value ? (openBlock(), createBlock("a", {
                          key: 0,
                          href: mailHref.value,
                          class: "btn-primary btn-lg w-full"
                        }, [
                          createTextVNode("Candidatar-se por e-mail"),
                          createVNode(unref(Mail), {
                            class: "size-4.5",
                            "aria-hidden": "true"
                          })
                        ], 8, ["href"])) : (openBlock(), createBlock("a", {
                          key: 1,
                          href: __props.job.apply_url,
                          target: "_blank",
                          rel: "noopener noreferrer nofollow",
                          class: "btn-primary btn-lg w-full"
                        }, [
                          createTextVNode("Candidatar-se à vaga"),
                          createVNode(unref(ExternalLink), {
                            class: "size-4.5",
                            "aria-hidden": "true"
                          })
                        ], 8, ["href"]))
                      ])) : createCommentVNode("", true)
                    ]),
                    createVNode("div", { class: "mt-4" }, [
                      createVNode(_sfc_main$8, {
                        placement: "job-top",
                        format: "leaderboard"
                      })
                    ]),
                    createVNode("div", { class: "mt-4 space-y-4" }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(visible.value, (s, i) => {
                        return openBlock(), createBlock(Fragment, {
                          key: s.key
                        }, [
                          createVNode("section", {
                            id: `sec-${s.key}`,
                            class: "card scroll-mt-36 p-5 sm:p-7 lg:scroll-mt-28",
                            "aria-labelledby": `sec-${s.key}-t`
                          }, [
                            createVNode("h2", {
                              id: `sec-${s.key}-t`,
                              tabindex: "-1",
                              class: "t-h2 mb-3 text-ink outline-none"
                            }, toDisplayString(s.title), 9, ["id"]),
                            createVNode("div", {
                              class: "prose-job",
                              innerHTML: __props.job.sections[s.key]
                            }, null, 8, ["innerHTML"])
                          ], 8, ["id", "aria-labelledby"]),
                          i === 1 ? (openBlock(), createBlock(_sfc_main$8, {
                            key: 0,
                            placement: "job-mid",
                            format: "leaderboard"
                          })) : createCommentVNode("", true)
                        ], 64);
                      }), 128)),
                      __props.job.company_about ? (openBlock(), createBlock("section", {
                        key: 0,
                        id: "sec-company",
                        class: "card scroll-mt-36 p-5 sm:p-7 lg:scroll-mt-28",
                        "aria-labelledby": "sec-company-t"
                      }, [
                        createVNode("h2", {
                          id: "sec-company-t",
                          tabindex: "-1",
                          class: "t-h2 mb-3 text-ink outline-none"
                        }, "Sobre a " + toDisplayString(__props.job.company.name), 1),
                        createVNode("div", {
                          class: "prose-job",
                          innerHTML: __props.job.company_about
                        }, null, 8, ["innerHTML"])
                      ])) : createCommentVNode("", true)
                    ]),
                    createVNode("div", { class: "mt-8" }, [
                      createVNode(_sfc_main$8, {
                        placement: "job-bottom",
                        format: "leaderboard"
                      })
                    ])
                  ]),
                  createVNode("aside", { "aria-label": "Candidatura e compartilhamento" }, [
                    createVNode("div", { class: "space-y-4 lg:sticky lg:top-20 lg:-m-1 lg:max-h-[calc(100vh-5.5rem)] lg:overflow-y-auto lg:overscroll-contain lg:p-1" }, [
                      createVNode("div", { class: "panel p-5" }, [
                        canApply.value ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                          byEmail.value ? (openBlock(), createBlock("a", {
                            key: 0,
                            href: mailHref.value,
                            class: "btn-primary btn-lg w-full"
                          }, [
                            createTextVNode("Candidatar-se por e-mail"),
                            createVNode(unref(Mail), {
                              class: "size-4.5",
                              "aria-hidden": "true"
                            })
                          ], 8, ["href"])) : (openBlock(), createBlock("a", {
                            key: 1,
                            href: __props.job.apply_url,
                            target: "_blank",
                            rel: "noopener noreferrer nofollow",
                            class: "btn-primary btn-lg w-full"
                          }, [
                            createTextVNode("Candidatar-se à vaga"),
                            createVNode(unref(ExternalLink), {
                              class: "size-4.5",
                              "aria-hidden": "true"
                            })
                          ], 8, ["href"])),
                          byEmail.value ? (openBlock(), createBlock("p", {
                            key: 2,
                            class: "mt-3 flex items-start gap-2 text-xs leading-relaxed text-muted"
                          }, [
                            createVNode(unref(Mail), {
                              class: "mt-0.5 size-3.5 shrink-0",
                              "aria-hidden": "true"
                            }),
                            createVNode("span", null, [
                              createTextVNode("Candidatura por e-mail para "),
                              createVNode("strong", { class: "break-words text-ink" }, toDisplayString(__props.job.apply_email), 1),
                              createTextVNode(", sem link de inscrição.")
                            ])
                          ])) : (openBlock(), createBlock("p", {
                            key: 3,
                            class: "mt-3 flex items-start gap-2 text-xs leading-relaxed text-muted"
                          }, [
                            createVNode(unref(Lock), {
                              class: "mt-0.5 size-3.5 shrink-0",
                              "aria-hidden": "true"
                            }),
                            createVNode("span", {
                              title: `Destino: ${__props.job.apply_host}`
                            }, "Você será direcionado à página de candidatura, fora do VagasPlus.", 8, ["title"])
                          ]))
                        ], 64)) : (openBlock(), createBlock("p", {
                          key: 1,
                          class: "rounded-lg bg-surface p-3 text-center text-sm text-muted"
                        }, "Candidatura indisponível."))
                      ]),
                      createVNode("div", { class: "card p-3.5" }, [
                        createVNode(_sfc_main$1, {
                          url: shareUrl.value,
                          title: `${__props.job.title} - ${__props.job.company.name}`
                        }, null, 8, ["url", "title"])
                      ]),
                      createVNode(_sfc_main$8, {
                        placement: "job-side",
                        format: "square"
                      })
                    ])
                  ])
                ])),
                __props.related.length ? (openBlock(), createBlock("section", {
                  key: 2,
                  class: "mt-12",
                  "aria-labelledby": "relacionadas"
                }, [
                  createVNode("h2", {
                    id: "relacionadas",
                    class: "t-h2 mb-5 text-ink"
                  }, toDisplayString(__props.closed ? "Vagas semelhantes ainda abertas" : "Vagas relacionadas"), 1),
                  createVNode("div", { class: "grid gap-4 md:grid-cols-2" }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(__props.related, (r) => {
                      return openBlock(), createBlock(_sfc_main$9, {
                        key: r.id,
                        job: r
                      }, null, 8, ["job"]);
                    }), 128))
                  ])
                ])) : createCommentVNode("", true),
                !__props.closed && !__props.preview ? (openBlock(), createBlock("div", {
                  key: 3,
                  class: "mt-8"
                }, [
                  createVNode(unref(Link), {
                    href: "/vagas",
                    class: "inline-flex items-center gap-1.5 text-sm font-bold text-action-700 hover:underline"
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(ArrowLeft), {
                        class: "size-4",
                        "aria-hidden": "true"
                      }),
                      createTextVNode("Voltar para todas as vagas")
                    ]),
                    _: 1
                  })
                ])) : createCommentVNode("", true)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/pages/Public/JobShow.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=JobShow-CC6D0qqA.js.map
