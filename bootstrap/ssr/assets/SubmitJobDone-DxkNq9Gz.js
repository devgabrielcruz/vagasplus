import { defineComponent, mergeProps, withCtx, unref, createTextVNode, createVNode, useSSRContext } from "vue";
import { ssrRenderComponent } from "vue/server-renderer";
import { Link } from "@inertiajs/vue3";
import { CheckCircle2 } from "lucide-vue-next";
import { _ as _sfc_main$1 } from "./PublicLayout-DWxlUL7J.js";
import "./FlashMessages-mTMlubKC.js";
import "./SeoHead-BMQcIEwx.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "SubmitJobDone",
  __ssrInlineRender: true,
  props: {
    seo: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$1, mergeProps({ seo: __props.seo }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="container-page grid place-items-center py-16 sm:py-24"${_scopeId}><div class="card max-w-lg p-8 text-center sm:p-10"${_scopeId}><span class="mx-auto grid size-16 place-items-center rounded-full bg-success-50 text-success-700"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(CheckCircle2), {
              class: "size-9",
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
            _push2(`</span><h1 class="t-h1 mt-5 text-ink"${_scopeId}>Vaga enviada!</h1><p class="mt-3 text-muted"${_scopeId}>Recebemos sua solicitação e nossa equipe vai analisá-la. Se tudo estiver certo, a vaga será publicada no site. Caso precisemos de algum ajuste, entraremos em contato pelo e-mail informado.</p><div class="mt-7 flex flex-wrap justify-center gap-2"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: "/vagas",
              class: "btn-primary"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Ver vagas abertas`);
                } else {
                  return [
                    createTextVNode("Ver vagas abertas")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(Link), {
              href: "/publicar-vaga",
              class: "btn-secondary"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Enviar outra vaga`);
                } else {
                  return [
                    createTextVNode("Enviar outra vaga")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></div></div>`);
          } else {
            return [
              createVNode("div", { class: "container-page grid place-items-center py-16 sm:py-24" }, [
                createVNode("div", { class: "card max-w-lg p-8 text-center sm:p-10" }, [
                  createVNode("span", { class: "mx-auto grid size-16 place-items-center rounded-full bg-success-50 text-success-700" }, [
                    createVNode(unref(CheckCircle2), {
                      class: "size-9",
                      "aria-hidden": "true"
                    })
                  ]),
                  createVNode("h1", { class: "t-h1 mt-5 text-ink" }, "Vaga enviada!"),
                  createVNode("p", { class: "mt-3 text-muted" }, "Recebemos sua solicitação e nossa equipe vai analisá-la. Se tudo estiver certo, a vaga será publicada no site. Caso precisemos de algum ajuste, entraremos em contato pelo e-mail informado."),
                  createVNode("div", { class: "mt-7 flex flex-wrap justify-center gap-2" }, [
                    createVNode(unref(Link), {
                      href: "/vagas",
                      class: "btn-primary"
                    }, {
                      default: withCtx(() => [
                        createTextVNode("Ver vagas abertas")
                      ]),
                      _: 1
                    }),
                    createVNode(unref(Link), {
                      href: "/publicar-vaga",
                      class: "btn-secondary"
                    }, {
                      default: withCtx(() => [
                        createTextVNode("Enviar outra vaga")
                      ]),
                      _: 1
                    })
                  ])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/pages/Public/SubmitJobDone.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=SubmitJobDone-DxkNq9Gz.js.map
