import { defineComponent, mergeProps, withCtx, createVNode, toDisplayString, openBlock, createBlock, createTextVNode, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate, ssrRenderAttr } from "vue/server-renderer";
import { _ as _sfc_main$1 } from "./PublicLayout-DWxlUL7J.js";
import "@inertiajs/vue3";
import "lucide-vue-next";
import "./FlashMessages-mTMlubKC.js";
import "./SeoHead-BMQcIEwx.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Page",
  __ssrInlineRender: true,
  props: {
    page: {},
    title: {},
    contactEmail: {},
    seo: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$1, mergeProps({ seo: __props.seo }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="container-page py-8 sm:py-12"${_scopeId}><article class="card mx-auto max-w-3xl p-6 sm:p-10"${_scopeId}><h1 class="text-3xl font-extrabold tracking-tight text-ink"${_scopeId}>${ssrInterpolate(__props.title)}</h1>`);
            if (__props.page === "about") {
              _push2(`<div class="prose-job mt-6"${_scopeId}><p${_scopeId}>O VagasPlus é um portal que reúne oportunidades profissionais para facilitar a descoberta de vagas. Nosso objetivo é reduzir a distância entre encontrar uma vaga e se candidatar.</p><h3${_scopeId}>Como funciona</h3><ul${_scopeId}><li${_scopeId}>Você pesquisa e consulta as vagas sem precisar criar conta.</li><li${_scopeId}>Cada vaga possui uma página própria e um link permanente para compartilhar.</li><li${_scopeId}>Ao clicar em <strong${_scopeId}>Candidatar-se à vaga</strong>, você é levado ao site da empresa ou da plataforma de recrutamento (como Gupy ou LinkedIn), onde a candidatura de fato acontece.</li></ul><h3${_scopeId}>Validade das vagas</h3><p${_scopeId}>Toda vaga tem um prazo de validade no portal. Quando o prazo termina, a vaga sai das listagens e da busca automaticamente. O prazo é uma regra operacional do VagasPlus: a empresa pode encerrar o processo seletivo antes dele.</p><h3${_scopeId}>O que não fazemos</h3><p${_scopeId}>O VagasPlus não é uma plataforma de recrutamento, não participa dos processos seletivos e não cobra candidatos. Nunca pague para se candidatar a uma vaga.</p><p${_scopeId}>Dúvidas, correções ou pedidos de remoção: <a${ssrRenderAttr("href", `mailto:${__props.contactEmail}`)}${_scopeId}>${ssrInterpolate(__props.contactEmail)}</a>.</p></div>`);
            } else if (__props.page === "privacy") {
              _push2(`<div class="prose-job mt-6"${_scopeId}><p${_scopeId}>Esta política descreve como o VagasPlus trata informações pessoais, em conformidade com a Lei Geral de Proteção de Dados (LGPD – Lei nº 13.709/2018).</p><h3${_scopeId}>Dados que coletamos</h3><p${_scopeId}>Candidatos não precisam de cadastro e não fornecem dados pessoais ao navegar pelo portal. Podem ser registrados dados técnicos de acesso (como endereço IP, navegador e páginas acessadas) para segurança e estatísticas agregadas.</p><h3${_scopeId}>Candidaturas</h3><p${_scopeId}>A candidatura acontece em sites de terceiros. Os dados que você informar lá são tratados pela empresa ou plataforma responsável, segundo as políticas deles.</p><h3${_scopeId}>Cookies e publicidade</h3><p${_scopeId}>Usamos cookies essenciais para o funcionamento do portal. Futuramente poderemos exibir anúncios de redes de publicidade, que podem usar cookies próprios; quando isso ocorrer, esta página será atualizada e o consentimento exigido será solicitado.</p><h3${_scopeId}>Seus direitos</h3><p${_scopeId}>Você pode solicitar acesso, correção ou eliminação de dados pessoais pelo e-mail <a${ssrRenderAttr("href", `mailto:${__props.contactEmail}`)}${_scopeId}>${ssrInterpolate(__props.contactEmail)}</a>.</p></div>`);
            } else {
              _push2(`<div class="prose-job mt-6"${_scopeId}><p${_scopeId}>Ao utilizar o VagasPlus, você concorda com os termos abaixo.</p><h3${_scopeId}>Uso do portal</h3><p${_scopeId}>O portal é de uso gratuito e destinado a quem busca oportunidades profissionais. É proibido utilizar mecanismos automatizados para copiar o conteúdo em massa ou prejudicar o funcionamento do serviço.</p><h3${_scopeId}>Conteúdo das vagas</h3><p${_scopeId}>As vagas são divulgadas com base em informações das empresas e fontes indicadas. O VagasPlus não garante a disponibilidade, o salário ou o resultado de qualquer processo seletivo, e não é parte na relação entre candidato e empresa.</p><h3${_scopeId}>Links externos</h3><p${_scopeId}>O botão de candidatura leva a sites de terceiros, sobre os quais o VagasPlus não tem controle. Confira sempre o endereço do site antes de informar dados pessoais.</p><h3${_scopeId}>Contato</h3><p${_scopeId}>Para solicitar a correção ou a remoção de uma vaga, escreva para <a${ssrRenderAttr("href", `mailto:${__props.contactEmail}`)}${_scopeId}>${ssrInterpolate(__props.contactEmail)}</a>.</p></div>`);
            }
            _push2(`</article></div>`);
          } else {
            return [
              createVNode("div", { class: "container-page py-8 sm:py-12" }, [
                createVNode("article", { class: "card mx-auto max-w-3xl p-6 sm:p-10" }, [
                  createVNode("h1", { class: "text-3xl font-extrabold tracking-tight text-ink" }, toDisplayString(__props.title), 1),
                  __props.page === "about" ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "prose-job mt-6"
                  }, [
                    createVNode("p", null, "O VagasPlus é um portal que reúne oportunidades profissionais para facilitar a descoberta de vagas. Nosso objetivo é reduzir a distância entre encontrar uma vaga e se candidatar."),
                    createVNode("h3", null, "Como funciona"),
                    createVNode("ul", null, [
                      createVNode("li", null, "Você pesquisa e consulta as vagas sem precisar criar conta."),
                      createVNode("li", null, "Cada vaga possui uma página própria e um link permanente para compartilhar."),
                      createVNode("li", null, [
                        createTextVNode("Ao clicar em "),
                        createVNode("strong", null, "Candidatar-se à vaga"),
                        createTextVNode(", você é levado ao site da empresa ou da plataforma de recrutamento (como Gupy ou LinkedIn), onde a candidatura de fato acontece.")
                      ])
                    ]),
                    createVNode("h3", null, "Validade das vagas"),
                    createVNode("p", null, "Toda vaga tem um prazo de validade no portal. Quando o prazo termina, a vaga sai das listagens e da busca automaticamente. O prazo é uma regra operacional do VagasPlus: a empresa pode encerrar o processo seletivo antes dele."),
                    createVNode("h3", null, "O que não fazemos"),
                    createVNode("p", null, "O VagasPlus não é uma plataforma de recrutamento, não participa dos processos seletivos e não cobra candidatos. Nunca pague para se candidatar a uma vaga."),
                    createVNode("p", null, [
                      createTextVNode("Dúvidas, correções ou pedidos de remoção: "),
                      createVNode("a", {
                        href: `mailto:${__props.contactEmail}`
                      }, toDisplayString(__props.contactEmail), 9, ["href"]),
                      createTextVNode(".")
                    ])
                  ])) : __props.page === "privacy" ? (openBlock(), createBlock("div", {
                    key: 1,
                    class: "prose-job mt-6"
                  }, [
                    createVNode("p", null, "Esta política descreve como o VagasPlus trata informações pessoais, em conformidade com a Lei Geral de Proteção de Dados (LGPD – Lei nº 13.709/2018)."),
                    createVNode("h3", null, "Dados que coletamos"),
                    createVNode("p", null, "Candidatos não precisam de cadastro e não fornecem dados pessoais ao navegar pelo portal. Podem ser registrados dados técnicos de acesso (como endereço IP, navegador e páginas acessadas) para segurança e estatísticas agregadas."),
                    createVNode("h3", null, "Candidaturas"),
                    createVNode("p", null, "A candidatura acontece em sites de terceiros. Os dados que você informar lá são tratados pela empresa ou plataforma responsável, segundo as políticas deles."),
                    createVNode("h3", null, "Cookies e publicidade"),
                    createVNode("p", null, "Usamos cookies essenciais para o funcionamento do portal. Futuramente poderemos exibir anúncios de redes de publicidade, que podem usar cookies próprios; quando isso ocorrer, esta página será atualizada e o consentimento exigido será solicitado."),
                    createVNode("h3", null, "Seus direitos"),
                    createVNode("p", null, [
                      createTextVNode("Você pode solicitar acesso, correção ou eliminação de dados pessoais pelo e-mail "),
                      createVNode("a", {
                        href: `mailto:${__props.contactEmail}`
                      }, toDisplayString(__props.contactEmail), 9, ["href"]),
                      createTextVNode(".")
                    ])
                  ])) : (openBlock(), createBlock("div", {
                    key: 2,
                    class: "prose-job mt-6"
                  }, [
                    createVNode("p", null, "Ao utilizar o VagasPlus, você concorda com os termos abaixo."),
                    createVNode("h3", null, "Uso do portal"),
                    createVNode("p", null, "O portal é de uso gratuito e destinado a quem busca oportunidades profissionais. É proibido utilizar mecanismos automatizados para copiar o conteúdo em massa ou prejudicar o funcionamento do serviço."),
                    createVNode("h3", null, "Conteúdo das vagas"),
                    createVNode("p", null, "As vagas são divulgadas com base em informações das empresas e fontes indicadas. O VagasPlus não garante a disponibilidade, o salário ou o resultado de qualquer processo seletivo, e não é parte na relação entre candidato e empresa."),
                    createVNode("h3", null, "Links externos"),
                    createVNode("p", null, "O botão de candidatura leva a sites de terceiros, sobre os quais o VagasPlus não tem controle. Confira sempre o endereço do site antes de informar dados pessoais."),
                    createVNode("h3", null, "Contato"),
                    createVNode("p", null, [
                      createTextVNode("Para solicitar a correção ou a remoção de uma vaga, escreva para "),
                      createVNode("a", {
                        href: `mailto:${__props.contactEmail}`
                      }, toDisplayString(__props.contactEmail), 9, ["href"]),
                      createTextVNode(".")
                    ])
                  ]))
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/pages/Public/Page.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=Page-Bmk8oUcF.js.map
