import { onMounted, computed, ref, defineComponent, unref, withCtx, createVNode, createTextVNode, toDisplayString, openBlock, createBlock, createCommentVNode, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderAttr, ssrRenderStyle, ssrRenderSlot } from "vue/server-renderer";
import { usePage, Link } from "@inertiajs/vue3";
import { Bookmark, PenLine, X, Menu, Mail } from "lucide-vue-next";
import { _ as _sfc_main$1 } from "./FlashMessages-mTMlubKC.js";
import { S as SeoHead, _ as _sfc_main$2 } from "./SeoHead-BMQcIEwx.js";
const KEY = "vagasplus:saved:v1";
const MAX_SAVED = 50;
const items = ref([]);
const message = ref(null);
let started = false;
let timer;
const isValid = (v) => typeof v === "object" && v !== null && typeof v.slug === "string" && typeof v.title === "string" && typeof v.url === "string";
function read() {
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed.filter(isValid).slice(0, MAX_SAVED) : [];
  } catch {
    return [];
  }
}
function notify(text) {
  message.value = text;
  clearTimeout(timer);
  timer = setTimeout(() => message.value = null, 3e3);
}
function persist() {
  try {
    localStorage.setItem(KEY, JSON.stringify(items.value));
    return true;
  } catch {
    notify("Não foi possível salvar: o armazenamento do navegador está bloqueado ou cheio.");
    return false;
  }
}
function start() {
  if (started || typeof window === "undefined") return;
  started = true;
  items.value = read();
  window.addEventListener("storage", (e) => {
    if (e.key === KEY || e.key === null) items.value = read();
  });
}
function useSavedJobs() {
  onMounted(start);
  const isSaved = (slug) => items.value.some((j) => j.slug === slug);
  function toggle(job) {
    if (isSaved(job.slug)) {
      remove(job.slug);
      return;
    }
    if (items.value.length >= MAX_SAVED) {
      notify(`Você já salvou ${MAX_SAVED} vagas. Remova alguma para salvar outra.`);
      return;
    }
    const before = items.value;
    items.value = [
      {
        slug: job.slug,
        url: job.url,
        title: job.title,
        company: job.company.name,
        logo: job.company.logo_url,
        location: job.location,
        work_mode: job.work_mode.label,
        salary: job.salary,
        platform: job.platform?.label ?? null,
        saved_at: Date.now()
      },
      ...before
    ];
    if (persist()) notify("Vaga salva em Minhas vagas.");
    else items.value = before;
  }
  function remove(slug) {
    const before = items.value;
    items.value = before.filter((j) => j.slug !== slug);
    if (persist()) notify("Vaga removida de Minhas vagas.");
    else items.value = before;
  }
  function clear() {
    items.value = [];
    persist();
  }
  return { items, count: computed(() => items.value.length), message, isSaved, toggle, remove, clear };
}
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "PublicLayout",
  __ssrInlineRender: true,
  props: {
    seo: {}
  },
  setup(__props) {
    const page = usePage();
    const open = ref(false);
    const { count: savedCount, message: savedMessage } = useSavedJobs();
    const links = [
      { label: "Buscar vagas", href: "/vagas" },
      { label: "Categorias", href: "/categorias" },
      { label: "Vagas remotas", href: "/vagas?modalidade=remote" }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(SeoHead), { seo: __props.seo }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, null, null, _parent));
      _push(`<div class="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex justify-center px-4" role="status" aria-live="polite">`);
      if (unref(savedMessage)) {
        _push(`<p class="pointer-events-auto rounded-xl bg-navy-900 px-4 py-2.5 text-sm font-semibold text-white shadow-(--shadow-pop)">${ssrInterpolate(unref(savedMessage))}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><a href="#conteudo" class="sr-only z-50 rounded-md bg-white px-4 py-2 font-semibold text-navy-900 focus:not-sr-only focus:fixed focus:top-2 focus:left-2">Pular para o conteúdo</a><div class="flex min-h-screen flex-col"><header class="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85"><div class="container-page flex h-16 items-center justify-between gap-4">`);
      _push(ssrRenderComponent(unref(Link), {
        href: "/",
        "aria-label": "VagasPlus — página inicial"
      }, {
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
      _push(`<nav aria-label="Principal" class="hidden items-center gap-1 md:flex"><!--[-->`);
      ssrRenderList(links, (l) => {
        _push(ssrRenderComponent(unref(Link), {
          key: l.href,
          href: l.href,
          class: "rounded-lg px-3 py-2 text-sm font-semibold text-muted hover:bg-navy-50 hover:text-ink"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(l.label)}`);
            } else {
              return [
                createTextVNode(toDisplayString(l.label), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></nav><div class="flex items-center gap-2">`);
      _push(ssrRenderComponent(unref(Link), {
        href: "/minhas-vagas",
        class: "btn-ghost btn-sm relative hidden sm:inline-flex",
        "aria-label": unref(savedCount) ? `Minhas vagas (${unref(savedCount)} salvas)` : "Minhas vagas"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Bookmark), {
              class: "size-4",
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
            _push2(`Minhas vagas`);
            if (unref(savedCount)) {
              _push2(`<span class="grid min-w-5 place-items-center rounded-full bg-action-600 px-1.5 text-[11px] font-bold text-white" aria-hidden="true"${_scopeId}>${ssrInterpolate(unref(savedCount))}</span>`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              createVNode(unref(Bookmark), {
                class: "size-4",
                "aria-hidden": "true"
              }),
              createTextVNode("Minhas vagas"),
              unref(savedCount) ? (openBlock(), createBlock("span", {
                key: 0,
                class: "grid min-w-5 place-items-center rounded-full bg-action-600 px-1.5 text-[11px] font-bold text-white",
                "aria-hidden": "true"
              }, toDisplayString(unref(savedCount)), 1)) : createCommentVNode("", true)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(Link), {
        href: "/publicar-vaga",
        class: "btn-primary btn-sm hidden sm:inline-flex"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(PenLine), {
              class: "size-4",
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
            _push2(`Publicar uma vaga`);
          } else {
            return [
              createVNode(unref(PenLine), {
                class: "size-4",
                "aria-hidden": "true"
              }),
              createTextVNode("Publicar uma vaga")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<button type="button" class="btn-ghost size-11 p-0 md:hidden"${ssrRenderAttr("aria-expanded", open.value)} aria-controls="menu-mobile"${ssrRenderAttr("aria-label", open.value ? "Fechar menu" : "Abrir menu")}>`);
      if (open.value) {
        _push(ssrRenderComponent(unref(X), { class: "size-5" }, null, _parent));
      } else {
        _push(ssrRenderComponent(unref(Menu), { class: "size-5" }, null, _parent));
      }
      _push(`</button></div></div><nav id="menu-mobile" aria-label="Menu móvel" class="border-t border-line bg-white md:hidden" style="${ssrRenderStyle(open.value ? null : { display: "none" })}"><div class="container-page flex flex-col py-2"><!--[-->`);
      ssrRenderList(links, (l) => {
        _push(ssrRenderComponent(unref(Link), {
          key: l.href,
          href: l.href,
          class: "rounded-lg px-2 py-3 text-[15px] font-semibold text-ink hover:bg-navy-50",
          onClick: ($event) => open.value = false
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(l.label)}`);
            } else {
              return [
                createTextVNode(toDisplayString(l.label), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]-->`);
      _push(ssrRenderComponent(unref(Link), {
        href: "/minhas-vagas",
        class: "flex items-center gap-2 rounded-lg px-2 py-3 text-[15px] font-semibold text-ink hover:bg-navy-50",
        onClick: ($event) => open.value = false
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Bookmark), {
              class: "size-4.5",
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
            _push2(`Minhas vagas`);
            if (unref(savedCount)) {
              _push2(`<span class="ml-1 grid min-w-5 place-items-center rounded-full bg-action-600 px-1.5 text-[11px] font-bold text-white"${_scopeId}>${ssrInterpolate(unref(savedCount))}</span>`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              createVNode(unref(Bookmark), {
                class: "size-4.5",
                "aria-hidden": "true"
              }),
              createTextVNode("Minhas vagas"),
              unref(savedCount) ? (openBlock(), createBlock("span", {
                key: 0,
                class: "ml-1 grid min-w-5 place-items-center rounded-full bg-action-600 px-1.5 text-[11px] font-bold text-white"
              }, toDisplayString(unref(savedCount)), 1)) : createCommentVNode("", true)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(Link), {
        href: "/publicar-vaga",
        class: "btn-primary my-2",
        onClick: ($event) => open.value = false
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(PenLine), {
              class: "size-4",
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
            _push2(`Publicar uma vaga`);
          } else {
            return [
              createVNode(unref(PenLine), {
                class: "size-4",
                "aria-hidden": "true"
              }),
              createTextVNode("Publicar uma vaga")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></nav></header><main id="conteudo" class="flex-1" tabindex="-1">`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</main><footer class="mt-16 bg-navy-950 text-navy-100"><div class="container-page grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]"><div>`);
      _push(ssrRenderComponent(_sfc_main$2, { light: "" }, null, _parent));
      _push(`<p class="mt-4 max-w-xs text-sm leading-relaxed text-navy-100/75">Facilitamos a descoberta de oportunidades. A candidatura é feita no site da empresa ou na plataforma de origem da vaga.</p></div><nav aria-label="Navegação do rodapé"><h2 class="text-xs font-bold tracking-widest text-white/60 uppercase">Vagas</h2><ul class="mt-4 space-y-2.5 text-sm"><li>`);
      _push(ssrRenderComponent(unref(Link), {
        href: "/vagas",
        class: "hover:text-white"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Todas as vagas`);
          } else {
            return [
              createTextVNode("Todas as vagas")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li><li>`);
      _push(ssrRenderComponent(unref(Link), {
        href: "/vagas?modalidade=remote",
        class: "hover:text-white"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Vagas remotas`);
          } else {
            return [
              createTextVNode("Vagas remotas")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li><li>`);
      _push(ssrRenderComponent(unref(Link), {
        href: "/categorias",
        class: "hover:text-white"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Categorias`);
          } else {
            return [
              createTextVNode("Categorias")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li><li>`);
      _push(ssrRenderComponent(unref(Link), {
        href: "/publicar-vaga",
        class: "hover:text-white"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Publicar uma vaga`);
          } else {
            return [
              createTextVNode("Publicar uma vaga")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li></ul></nav><nav aria-label="Institucional"><h2 class="text-xs font-bold tracking-widest text-white/60 uppercase">Institucional</h2><ul class="mt-4 space-y-2.5 text-sm"><li>`);
      _push(ssrRenderComponent(unref(Link), {
        href: "/sobre",
        class: "hover:text-white"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Sobre o VagasPlus`);
          } else {
            return [
              createTextVNode("Sobre o VagasPlus")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li><li>`);
      _push(ssrRenderComponent(unref(Link), {
        href: "/privacidade",
        class: "hover:text-white"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Política de privacidade`);
          } else {
            return [
              createTextVNode("Política de privacidade")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li><li>`);
      _push(ssrRenderComponent(unref(Link), {
        href: "/termos",
        class: "hover:text-white"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Termos de uso`);
          } else {
            return [
              createTextVNode("Termos de uso")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li></ul></nav><div><h2 class="text-xs font-bold tracking-widest text-white/60 uppercase">Contato</h2><a${ssrRenderAttr("href", `mailto:${unref(page).props.app?.contactEmail}`)} class="mt-4 inline-flex items-center gap-2 text-sm hover:text-white">`);
      _push(ssrRenderComponent(unref(Mail), {
        class: "size-4",
        "aria-hidden": "true"
      }, null, _parent));
      _push(`${ssrInterpolate(unref(page).props.app?.contactEmail)}</a></div></div><div class="border-t border-white/10"><p class="container-page py-5 text-xs text-navy-100/60">© ${ssrInterpolate((/* @__PURE__ */ new Date()).getFullYear())} VagasPlus. Todos os direitos reservados. As vagas são de responsabilidade das empresas anunciantes.</p></div></footer></div><!--]-->`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/layouts/PublicLayout.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as _,
  useSavedJobs as u
};
//# sourceMappingURL=PublicLayout-DWxlUL7J.js.map
