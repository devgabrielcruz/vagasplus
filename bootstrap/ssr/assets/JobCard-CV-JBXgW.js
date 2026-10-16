import { defineComponent, computed, mergeProps, useSSRContext, unref, withCtx, createTextVNode, toDisplayString } from "vue";
import { ssrRenderAttrs, ssrRenderAttr, ssrRenderClass, ssrRenderStyle, ssrInterpolate, ssrRenderComponent } from "vue/server-renderer";
import { Link } from "@inertiajs/vue3";
import { BookmarkCheck, Bookmark, MapPin, Wifi, Wallet, Clock } from "lucide-vue-next";
import { _ as _sfc_main$3 } from "./CompanyLogo-meQRdREr.js";
import { u as useSavedJobs } from "./PublicLayout-DWxlUL7J.js";
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "PlatformBadge",
  __ssrInlineRender: true,
  props: {
    platform: {},
    variant: { default: "chip" }
  },
  setup(__props) {
    const props = __props;
    const text = computed(() => props.platform.value === "email" ? "Candidatura por e-mail" : props.platform.value === "company_site" ? "Site da empresa" : `via ${props.platform.label}`);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<span${ssrRenderAttrs(mergeProps({
        class: ["inline-flex items-center font-semibold whitespace-nowrap", {
          "gap-1.5 rounded-full border border-line bg-white py-0.5 pr-2.5 pl-0.5 text-xs text-ink": __props.variant === "chip",
          "gap-1.5 text-xs text-muted": __props.variant === "plain",
          "gap-2.5 text-sm text-ink": __props.variant === "large"
        }]
      }, _attrs))}>`);
      if (__props.platform.logo) {
        _push(`<img${ssrRenderAttr("src", __props.platform.logo)}${ssrRenderAttr("alt", __props.platform.label)} loading="lazy" decoding="async" class="${ssrRenderClass([__props.variant === "large" ? "h-9 max-w-[6rem]" : "h-5 max-w-[3.5rem]", "w-auto shrink-0 rounded-md object-contain"])}">`);
      } else {
        _push(`<span class="${ssrRenderClass([__props.variant === "large" ? "size-9 text-sm" : "size-5 text-[11px]", "grid shrink-0 place-items-center rounded-md font-extrabold text-white"])}" style="${ssrRenderStyle({ backgroundColor: __props.platform.color })}" aria-hidden="true">${ssrInterpolate(__props.platform.label[0])}</span>`);
      }
      _push(` ${ssrInterpolate(text.value)}</span>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/PlatformBadge.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "SaveJobButton",
  __ssrInlineRender: true,
  props: {
    job: {},
    variant: { default: "icon" }
  },
  setup(__props) {
    const { isSaved } = useSavedJobs();
    return (_ctx, _push, _parent, _attrs) => {
      if (__props.variant === "icon") {
        _push(`<button${ssrRenderAttrs(mergeProps({
          type: "button",
          class: ["relative z-10 grid size-9 place-items-center rounded-lg transition-colors hover:bg-action-50", unref(isSaved)(__props.job.slug) ? "text-action-700" : "text-subtle hover:text-action-700"],
          "aria-pressed": unref(isSaved)(__props.job.slug),
          "aria-label": unref(isSaved)(__props.job.slug) ? `Remover ${__props.job.title} de Minhas vagas` : `Salvar ${__props.job.title} em Minhas vagas`,
          title: unref(isSaved)(__props.job.slug) ? "Remover de Minhas vagas" : "Salvar para ver depois"
        }, _attrs))}>`);
        if (unref(isSaved)(__props.job.slug)) {
          _push(ssrRenderComponent(unref(BookmarkCheck), {
            class: "size-5 fill-action-100",
            "aria-hidden": "true"
          }, null, _parent));
        } else {
          _push(ssrRenderComponent(unref(Bookmark), {
            class: "size-5",
            "aria-hidden": "true"
          }, null, _parent));
        }
        _push(`</button>`);
      } else if (__props.variant === "corner") {
        _push(`<button${ssrRenderAttrs(mergeProps({
          type: "button",
          class: ["grid size-11 place-items-center rounded-xl border transition-colors", unref(isSaved)(__props.job.slug) ? "border-action-600 bg-action-50 text-action-700" : "border-line-strong bg-white text-muted hover:border-action-600 hover:text-action-700"],
          "aria-pressed": unref(isSaved)(__props.job.slug),
          "aria-label": unref(isSaved)(__props.job.slug) ? "Remover vaga de Minhas vagas" : "Salvar vaga em Minhas vagas",
          title: unref(isSaved)(__props.job.slug) ? "Salva — clique para remover" : "Salvar para ver depois"
        }, _attrs))}>`);
        if (unref(isSaved)(__props.job.slug)) {
          _push(ssrRenderComponent(unref(BookmarkCheck), {
            class: "size-5 fill-action-100",
            "aria-hidden": "true"
          }, null, _parent));
        } else {
          _push(ssrRenderComponent(unref(Bookmark), {
            class: "size-5",
            "aria-hidden": "true"
          }, null, _parent));
        }
        _push(`</button>`);
      } else {
        _push(`<button${ssrRenderAttrs(mergeProps({
          type: "button",
          class: "btn-secondary w-full",
          "aria-pressed": unref(isSaved)(__props.job.slug)
        }, _attrs))}>`);
        if (unref(isSaved)(__props.job.slug)) {
          _push(ssrRenderComponent(unref(BookmarkCheck), {
            class: "size-4.5 fill-action-100 text-action-700",
            "aria-hidden": "true"
          }, null, _parent));
        } else {
          _push(ssrRenderComponent(unref(Bookmark), {
            class: "size-4.5",
            "aria-hidden": "true"
          }, null, _parent));
        }
        _push(` ${ssrInterpolate(unref(isSaved)(__props.job.slug) ? "Vaga salva" : "Salvar para ver depois")}</button>`);
      }
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/SaveJobButton.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "JobCard",
  __ssrInlineRender: true,
  props: {
    job: {}
  },
  setup(__props) {
    const modeStyle = {
      remote: "bg-action-50 text-action-700 ring-action-100",
      hybrid: "bg-warning-50 text-warning-700 ring-warning-50",
      onsite: "bg-navy-50 text-navy-800 ring-navy-100"
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<article${ssrRenderAttrs(mergeProps({ class: "group card relative p-4 transition duration-150 hover:-translate-y-0.5 hover:border-line-strong hover:shadow-(--shadow-lift) sm:p-5" }, _attrs))}><div class="flex gap-3.5">`);
      _push(ssrRenderComponent(_sfc_main$3, {
        name: __props.job.company.name,
        url: __props.job.company.logo_url,
        size: "md"
      }, null, _parent));
      _push(`<div class="min-w-0 flex-1"><div class="flex items-start justify-between gap-3"><h3 class="text-base leading-snug font-bold text-ink">`);
      _push(ssrRenderComponent(unref(Link), {
        href: __props.job.url,
        class: "after:absolute after:inset-0 after:content-[''] hover:text-action-700 focus-visible:outline-offset-4"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(__props.job.title)}`);
          } else {
            return [
              createTextVNode(toDisplayString(__props.job.title), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</h3><div class="-mt-1.5 -mr-2 flex shrink-0 items-center gap-1">`);
      if (__props.job.is_new) {
        _push(`<span class="rounded-full bg-success-50 px-2 py-0.5 text-[11px] font-bold tracking-wide text-success-700 uppercase">Nova</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(_sfc_main$1, { job: __props.job }, null, _parent));
      _push(`</div></div><p class="mt-0.5 text-sm text-muted">${ssrInterpolate(__props.job.company.name)}</p><ul class="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[13px] text-muted">`);
      if (__props.job.location) {
        _push(`<li class="inline-flex items-center gap-1.5">`);
        _push(ssrRenderComponent(unref(MapPin), {
          class: "size-3.5 text-subtle",
          "aria-hidden": "true"
        }, null, _parent));
        _push(`${ssrInterpolate(__props.job.location)}</li>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<li><span class="${ssrRenderClass([modeStyle[__props.job.work_mode.value], "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ring-inset"])}">`);
      if (__props.job.work_mode.value === "remote") {
        _push(ssrRenderComponent(unref(Wifi), {
          class: "size-3",
          "aria-hidden": "true"
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`${ssrInterpolate(__props.job.work_mode.label)}</span></li><li>${ssrInterpolate(__props.job.employment_type)}</li>`);
      if (__props.job.experience_level) {
        _push(`<li>${ssrInterpolate(__props.job.experience_level)}</li>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</ul><div class="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-line pt-3 text-[13px]"><span class="${ssrRenderClass([__props.job.salary ? "text-ink" : "font-normal text-subtle", "inline-flex items-center gap-1.5 font-semibold"])}">`);
      _push(ssrRenderComponent(unref(Wallet), {
        class: "size-3.5 text-subtle",
        "aria-hidden": "true"
      }, null, _parent));
      _push(`${ssrInterpolate(__props.job.salary ?? "Salário não informado")}</span><span class="flex flex-wrap items-center gap-x-3 gap-y-1">`);
      _push(ssrRenderComponent(_sfc_main$2, {
        platform: __props.job.platform
      }, null, _parent));
      if (__props.job.published_label) {
        _push(`<span class="inline-flex items-center gap-1.5 text-subtle">`);
        _push(ssrRenderComponent(unref(Clock), {
          class: "size-3.5",
          "aria-hidden": "true"
        }, null, _parent));
        _push(`${ssrInterpolate(__props.job.published_label)}</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</span></div></div></div></article>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/JobCard.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as _,
  _sfc_main$2 as a,
  _sfc_main$1 as b
};
//# sourceMappingURL=JobCard-CV-JBXgW.js.map
