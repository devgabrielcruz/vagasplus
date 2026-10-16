import { defineComponent, ref, watch, onBeforeUnmount, mergeProps, unref, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderAttr, ssrRenderComponent, ssrInterpolate, ssrIncludeBooleanAttr } from "vue/server-renderer";
import { ImagePlus } from "lucide-vue-next";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "LogoField",
  __ssrInlineRender: true,
  props: {
    id: {},
    current: {},
    url: {},
    file: {},
    remove: { type: Boolean },
    error: {},
    urlError: {},
    name: {},
    hideUrl: { type: Boolean }
  },
  emits: ["update:url", "update:file", "update:remove"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const preview = ref(null);
    function revoke() {
      if (preview.value) URL.revokeObjectURL(preview.value);
      preview.value = null;
    }
    watch(
      () => props.file,
      (f) => {
        if (!f) revoke();
      }
    );
    onBeforeUnmount(revoke);
    const shown = () => props.remove ? null : preview.value ?? (props.url && /^https:/.test(props.url) ? props.url : props.current);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex items-start gap-4" }, _attrs))}><div class="grid size-16 shrink-0 place-items-center overflow-hidden rounded-xl border border-line bg-surface text-subtle">`);
      if (shown()) {
        _push(`<img${ssrRenderAttr("src", shown())} alt="Prévia do logotipo" class="size-full object-contain p-1">`);
      } else {
        _push(ssrRenderComponent(unref(ImagePlus), {
          class: "size-6",
          "aria-hidden": "true"
        }, null, _parent));
      }
      _push(`</div><div class="min-w-0 flex-1 space-y-2"><div><label${ssrRenderAttr("for", __props.id)} class="label">Logotipo${ssrInterpolate(__props.name ? ` de ${__props.name}` : "")}</label><input${ssrRenderAttr("id", __props.id)} type="file" accept="image/png,image/jpeg,image/webp" class="block w-full text-sm text-muted file:mr-3 file:min-h-9 file:cursor-pointer file:rounded-lg file:border-0 file:bg-navy-50 file:px-3 file:text-[13px] file:font-semibold file:text-navy-800 hover:file:bg-navy-100"><p class="hint">PNG, JPG ou WEBP, até 1 MB. Imagens quadradas ficam melhores. Use somente logotipos que você tem autorização para exibir.</p>`);
      if (__props.error) {
        _push(`<p class="error-text" role="alert">${ssrInterpolate(__props.error)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (!__props.hideUrl) {
        _push(`<div><label${ssrRenderAttr("for", `${__props.id}-url`)} class="label">ou endereço (URL) do logotipo</label><input${ssrRenderAttr("id", `${__props.id}-url`)}${ssrRenderAttr("value", __props.url)} type="url" maxlength="500" placeholder="https://" class="field"${ssrRenderAttr("aria-invalid", !!__props.urlError)}>`);
        if (__props.urlError) {
          _push(`<p class="error-text" role="alert">${ssrInterpolate(__props.urlError)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.current) {
        _push(`<label class="flex items-center gap-2 text-sm text-muted"><input${ssrIncludeBooleanAttr(__props.remove) ? " checked" : ""} type="checkbox" class="size-4 rounded border-line-strong text-action-600">Remover o logotipo atual</label>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/LogoField.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as _
};
//# sourceMappingURL=LogoField-D88DZ2aT.js.map
