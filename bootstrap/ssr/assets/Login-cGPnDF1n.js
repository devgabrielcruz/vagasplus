import { defineComponent, unref, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderAttr, ssrInterpolate, ssrIncludeBooleanAttr, ssrLooseContain } from "vue/server-renderer";
import { useForm } from "@inertiajs/vue3";
import { Loader2, LogIn } from "lucide-vue-next";
import { S as SeoHead, _ as _sfc_main$1 } from "./SeoHead-BMQcIEwx.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Login",
  __ssrInlineRender: true,
  props: {
    seo: {}
  },
  setup(__props) {
    const form = useForm({ email: "", password: "", remember: false });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(SeoHead), {
        seo: { ...__props.seo, robots: "noindex,nofollow" }
      }, null, _parent));
      _push(`<div class="grid min-h-screen place-items-center bg-surface px-4 py-10"><div class="w-full max-w-sm"><div class="mb-6 flex justify-center">`);
      _push(ssrRenderComponent(_sfc_main$1, null, null, _parent));
      _push(`</div><form class="card p-6 sm:p-7" novalidate><h1 class="text-xl font-extrabold text-ink">Acesso ao painel</h1><p class="mt-1 text-sm text-muted">Área restrita à equipe do VagasPlus.</p><div class="mt-5"><label for="email" class="label">E-mail</label><input id="email"${ssrRenderAttr("value", unref(form).email)} type="email" autocomplete="username" required autofocus class="field"${ssrRenderAttr("aria-invalid", !!unref(form).errors.email)}${ssrRenderAttr("aria-describedby", unref(form).errors.email ? "email-erro" : void 0)}>`);
      if (unref(form).errors.email) {
        _push(`<p id="email-erro" class="error-text" role="alert">${ssrInterpolate(unref(form).errors.email)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="mt-4"><label for="password" class="label">Senha</label><input id="password"${ssrRenderAttr("value", unref(form).password)} type="password" autocomplete="current-password" required class="field"${ssrRenderAttr("aria-invalid", !!unref(form).errors.password)}>`);
      if (unref(form).errors.password) {
        _push(`<p class="error-text" role="alert">${ssrInterpolate(unref(form).errors.password)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><label class="mt-4 flex items-center gap-2 text-sm text-muted"><input${ssrIncludeBooleanAttr(Array.isArray(unref(form).remember) ? ssrLooseContain(unref(form).remember, null) : unref(form).remember) ? " checked" : ""} type="checkbox" class="size-4 rounded border-line-strong text-action-600">Manter conectado</label><button type="submit" class="btn-primary mt-5 w-full"${ssrIncludeBooleanAttr(unref(form).processing) ? " disabled" : ""}>`);
      if (unref(form).processing) {
        _push(ssrRenderComponent(unref(Loader2), {
          class: "size-4 animate-spin",
          "aria-hidden": "true"
        }, null, _parent));
      } else {
        _push(ssrRenderComponent(unref(LogIn), {
          class: "size-4",
          "aria-hidden": "true"
        }, null, _parent));
      }
      _push(`${ssrInterpolate(unref(form).processing ? "Entrando…" : "Entrar")}</button></form></div></div><!--]-->`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/pages/Admin/Login.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=Login-cGPnDF1n.js.map
