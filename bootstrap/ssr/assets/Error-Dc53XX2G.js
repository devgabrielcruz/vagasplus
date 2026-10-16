import { defineComponent, computed, mergeProps, withCtx, unref, createTextVNode, createVNode, toDisplayString, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate } from "vue/server-renderer";
import { Link } from "@inertiajs/vue3";
import { _ as _sfc_main$1 } from "./PublicLayout-DWxlUL7J.js";
import "lucide-vue-next";
import "./FlashMessages-mTMlubKC.js";
import "./SeoHead-BMQcIEwx.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Error",
  __ssrInlineRender: true,
  props: {
    status: {}
  },
  setup(__props) {
    const props = __props;
    const copy = computed(
      () => ({
        403: { title: "Acesso negado", text: "Você não tem permissão para acessar esta página." },
        404: { title: "Página não encontrada", text: "O endereço pode estar incorreto ou a vaga já não está disponível." },
        410: { title: "Conteúdo removido", text: "Este conteúdo foi removido e não está mais disponível." },
        500: { title: "Algo deu errado", text: "Tivemos um problema inesperado. Tente novamente em instantes." },
        503: { title: "Em manutenção", text: "Voltamos já. Obrigado pela paciência." }
      })[props.status] ?? { title: "Erro", text: "Ocorreu um erro." }
    );
    const seo = computed(() => ({ title: `${copy.value.title} | VagasPlus`, robots: "noindex,nofollow" }));
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$1, mergeProps({ seo: seo.value }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="container-page grid place-items-center py-20 text-center"${_scopeId}><p class="text-6xl font-extrabold text-action-600"${_scopeId}>${ssrInterpolate(__props.status)}</p><h1 class="mt-3 text-2xl font-extrabold text-ink"${_scopeId}>${ssrInterpolate(copy.value.title)}</h1><p class="mt-2 max-w-md text-muted"${_scopeId}>${ssrInterpolate(copy.value.text)}</p><div class="mt-6 flex gap-2"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: "/",
              class: "btn-primary"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Ir para a página inicial`);
                } else {
                  return [
                    createTextVNode("Ir para a página inicial")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(Link), {
              href: "/vagas",
              class: "btn-secondary"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Buscar vagas`);
                } else {
                  return [
                    createTextVNode("Buscar vagas")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></div>`);
          } else {
            return [
              createVNode("div", { class: "container-page grid place-items-center py-20 text-center" }, [
                createVNode("p", { class: "text-6xl font-extrabold text-action-600" }, toDisplayString(__props.status), 1),
                createVNode("h1", { class: "mt-3 text-2xl font-extrabold text-ink" }, toDisplayString(copy.value.title), 1),
                createVNode("p", { class: "mt-2 max-w-md text-muted" }, toDisplayString(copy.value.text), 1),
                createVNode("div", { class: "mt-6 flex gap-2" }, [
                  createVNode(unref(Link), {
                    href: "/",
                    class: "btn-primary"
                  }, {
                    default: withCtx(() => [
                      createTextVNode("Ir para a página inicial")
                    ]),
                    _: 1
                  }),
                  createVNode(unref(Link), {
                    href: "/vagas",
                    class: "btn-secondary"
                  }, {
                    default: withCtx(() => [
                      createTextVNode("Buscar vagas")
                    ]),
                    _: 1
                  })
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/pages/Error.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=Error-Dc53XX2G.js.map
