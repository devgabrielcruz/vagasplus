import { defineComponent, ref, watch, mergeProps, unref, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderClass, ssrRenderComponent, ssrInterpolate } from "vue/server-renderer";
import { usePage } from "@inertiajs/vue3";
import { CheckCircle2, AlertCircle, X } from "lucide-vue-next";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "FlashMessages",
  __ssrInlineRender: true,
  setup(__props) {
    const page = usePage();
    const message = ref(null);
    let timer;
    watch(
      () => page.props.flash,
      (flash) => {
        const next = flash?.error ? { type: "error", text: flash.error } : flash?.success ? { type: "success", text: flash.success } : null;
        message.value = next;
        clearTimeout(timer);
        if (next?.type === "success") timer = setTimeout(() => message.value = null, 6e3);
      },
      { immediate: true, deep: true }
    );
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4",
        "aria-live": "polite",
        role: "status"
      }, _attrs))}>`);
      if (message.value) {
        _push(`<div class="${ssrRenderClass([message.value.type === "success" ? "border-success-700/20 bg-success-50 text-success-700" : "border-danger-700/20 bg-danger-50 text-danger-700", "pointer-events-auto flex max-w-lg items-start gap-2.5 rounded-xl border px-4 py-3 text-sm font-medium shadow-(--shadow-pop)"])}">`);
        if (message.value.type === "success") {
          _push(ssrRenderComponent(unref(CheckCircle2), {
            class: "mt-0.5 size-4 shrink-0",
            "aria-hidden": "true"
          }, null, _parent));
        } else {
          _push(ssrRenderComponent(unref(AlertCircle), {
            class: "mt-0.5 size-4 shrink-0",
            "aria-hidden": "true"
          }, null, _parent));
        }
        _push(`<p>${ssrInterpolate(message.value.text)}</p><button type="button" class="-mr-1 ml-2 rounded p-0.5 opacity-70 hover:opacity-100" aria-label="Fechar aviso">`);
        _push(ssrRenderComponent(unref(X), { class: "size-4" }, null, _parent));
        _push(`</button></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/FlashMessages.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as _
};
//# sourceMappingURL=FlashMessages-mTMlubKC.js.map
