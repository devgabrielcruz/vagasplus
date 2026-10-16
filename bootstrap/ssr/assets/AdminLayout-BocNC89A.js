import { defineComponent, ref, computed, unref, withCtx, createVNode, createTextVNode, resolveDynamicComponent, openBlock, createBlock, toDisplayString, createCommentVNode, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderAttr, ssrRenderClass, ssrRenderList, ssrRenderVNode, ssrInterpolate, ssrRenderSlot } from "vue/server-renderer";
import { usePage, Link } from "@inertiajs/vue3";
import { X, Menu, Plus, LayoutDashboard, Briefcase, Inbox, Building2, Plug, Tags, Settings, ExternalLink, LogOut } from "lucide-vue-next";
import { _ as _sfc_main$1 } from "./FlashMessages-mTMlubKC.js";
import { S as SeoHead, _ as _sfc_main$2 } from "./SeoHead-BMQcIEwx.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "AdminLayout",
  __ssrInlineRender: true,
  props: {
    title: {}
  },
  setup(__props) {
    const page = usePage();
    const open = ref(false);
    const path = computed(() => page.url.split("?")[0]);
    const nav = [
      { label: "Dashboard", href: "/admin", icon: LayoutDashboard, exact: true },
      { label: "Vagas", href: "/admin/vagas", icon: Briefcase },
      { label: "Solicitações", href: "/admin/solicitacoes", icon: Inbox, badge: true },
      { label: "Empresas", href: "/admin/empresas", icon: Building2 },
      { label: "Plataformas", href: "/admin/plataformas", icon: Plug },
      { label: "Categorias", href: "/admin/categorias", icon: Tags },
      { label: "Configurações", href: "/admin/configuracoes", icon: Settings }
    ];
    const isActive = (item) => item.exact ? path.value === item.href : path.value.startsWith(item.href);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(SeoHead), {
        seo: { title: `${__props.title} | Painel VagasPlus`, robots: "noindex,nofollow" }
      }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, null, null, _parent));
      _push(`<div class="min-h-screen bg-surface lg:grid lg:grid-cols-[16rem_1fr]"><div class="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-line bg-white px-4 lg:hidden">`);
      _push(ssrRenderComponent(unref(Link), { href: "/admin" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_sfc_main$2, null, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_sfc_main$2)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<button type="button" class="btn-ghost size-11 p-0"${ssrRenderAttr("aria-expanded", open.value)} aria-controls="admin-nav" aria-label="Abrir menu">`);
      if (open.value) {
        _push(ssrRenderComponent(unref(X), { class: "size-5" }, null, _parent));
      } else {
        _push(ssrRenderComponent(unref(Menu), { class: "size-5" }, null, _parent));
      }
      _push(`</button></div><aside id="admin-nav" class="${ssrRenderClass([open.value ? "block" : "hidden", "border-line bg-navy-950 text-navy-100 lg:sticky lg:top-0 lg:block lg:h-screen lg:border-r"])}"><div class="flex h-full flex-col p-4">`);
      _push(ssrRenderComponent(unref(Link), {
        href: "/admin",
        class: "mb-6 hidden px-2 py-1 lg:block",
        "aria-label": "Painel VagasPlus"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_sfc_main$2, { light: "" }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_sfc_main$2, { light: "" })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(Link), {
        href: "/admin/vagas/criar",
        class: "btn-primary mb-4 w-full",
        onClick: ($event) => open.value = false
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Plus), {
              class: "size-4",
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
            _push2(`Nova vaga`);
          } else {
            return [
              createVNode(unref(Plus), {
                class: "size-4",
                "aria-hidden": "true"
              }),
              createTextVNode("Nova vaga")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<nav aria-label="Painel administrativo" class="space-y-1"><!--[-->`);
      ssrRenderList(nav, (item) => {
        _push(ssrRenderComponent(unref(Link), {
          key: item.href,
          href: item.href,
          "aria-current": isActive(item) ? "page" : void 0,
          class: ["flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-semibold transition-colors", isActive(item) ? "bg-white/10 text-white" : "text-navy-100/75 hover:bg-white/5 hover:text-white"],
          onClick: ($event) => open.value = false
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderVNode(_push2, createVNode(resolveDynamicComponent(item.icon), {
                class: "size-4.5",
                "aria-hidden": "true"
              }, null), _parent2, _scopeId);
              _push2(`${ssrInterpolate(item.label)} `);
              if ("badge" in item && unref(page).props.pendingSubmissions) {
                _push2(`<span class="ml-auto grid min-w-5 place-items-center rounded-full bg-action-500 px-1.5 text-[11px] font-bold text-white"${ssrRenderAttr("aria-label", `${unref(page).props.pendingSubmissions} em análise`)}${_scopeId}>${ssrInterpolate(unref(page).props.pendingSubmissions)}</span>`);
              } else {
                _push2(`<!---->`);
              }
            } else {
              return [
                (openBlock(), createBlock(resolveDynamicComponent(item.icon), {
                  class: "size-4.5",
                  "aria-hidden": "true"
                })),
                createTextVNode(toDisplayString(item.label) + " ", 1),
                "badge" in item && unref(page).props.pendingSubmissions ? (openBlock(), createBlock("span", {
                  key: 0,
                  class: "ml-auto grid min-w-5 place-items-center rounded-full bg-action-500 px-1.5 text-[11px] font-bold text-white",
                  "aria-label": `${unref(page).props.pendingSubmissions} em análise`
                }, toDisplayString(unref(page).props.pendingSubmissions), 9, ["aria-label"])) : createCommentVNode("", true)
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></nav><div class="mt-auto space-y-1 border-t border-white/10 pt-4"><a href="/" target="_blank" rel="noopener" class="flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-semibold text-navy-100/75 hover:bg-white/5 hover:text-white">`);
      _push(ssrRenderComponent(unref(ExternalLink), {
        class: "size-4.5",
        "aria-hidden": "true"
      }, null, _parent));
      _push(`Ver site</a><div class="px-3 py-2 text-xs"><p class="truncate font-semibold text-white">${ssrInterpolate(unref(page).props.auth.user?.name)}</p><p class="truncate text-navy-100/60">${ssrInterpolate(unref(page).props.auth.user?.email)}</p></div><button type="button" class="flex min-h-11 w-full items-center gap-3 rounded-lg px-3 text-sm font-semibold text-navy-100/75 hover:bg-white/5 hover:text-white">`);
      _push(ssrRenderComponent(unref(LogOut), {
        class: "size-4.5",
        "aria-hidden": "true"
      }, null, _parent));
      _push(`Sair</button></div></div></aside><main class="min-w-0 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</main></div><!--]-->`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/layouts/AdminLayout.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as _
};
//# sourceMappingURL=AdminLayout-BocNC89A.js.map
