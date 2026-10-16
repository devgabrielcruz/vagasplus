import { defineComponent, ref, watch, nextTick, mergeProps, unref, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderClass, ssrRenderComponent, ssrInterpolate, ssrRenderSlot, ssrIncludeBooleanAttr } from "vue/server-renderer";
import { AlertTriangle } from "lucide-vue-next";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "ConfirmDialog",
  __ssrInlineRender: true,
  props: {
    open: { type: Boolean },
    title: {},
    message: {},
    confirmLabel: { default: "Confirmar" },
    danger: { type: Boolean, default: false },
    processing: { type: Boolean, default: false }
  },
  emits: ["confirm", "cancel"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const dialog = ref(null);
    watch(
      () => props.open,
      async (open) => {
        await nextTick();
        if (!dialog.value) return;
        if (open && !dialog.value.open) dialog.value.showModal();
        if (!open && dialog.value.open) dialog.value.close();
      },
      { immediate: true }
    );
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<dialog${ssrRenderAttrs(mergeProps({
        ref_key: "dialog",
        ref: dialog,
        class: "m-auto w-[calc(100%-2rem)] max-w-md rounded-2xl border border-line bg-white p-0 shadow-(--shadow-pop) backdrop:bg-navy-950/50"
      }, _attrs))}><form class="p-6"><div class="flex items-start gap-3"><div class="${ssrRenderClass([__props.danger ? "bg-danger-50 text-danger-700" : "bg-action-50 text-action-700", "grid size-10 shrink-0 place-items-center rounded-full"])}">`);
      _push(ssrRenderComponent(unref(AlertTriangle), {
        class: "size-5",
        "aria-hidden": "true"
      }, null, _parent));
      _push(`</div><div class="min-w-0 flex-1"><h2 class="text-lg font-extrabold text-ink">${ssrInterpolate(__props.title)}</h2>`);
      if (__props.message) {
        _push(`<p class="mt-1.5 text-sm text-muted">${ssrInterpolate(__props.message)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="mt-4 empty:hidden">`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div></div></div><div class="mt-6 flex justify-end gap-2"><button type="button" class="btn-secondary">Cancelar</button><button type="submit" class="${ssrRenderClass(__props.danger ? "btn-danger" : "btn-primary")}"${ssrIncludeBooleanAttr(__props.processing) ? " disabled" : ""}>${ssrInterpolate(__props.processing ? "Aguarde…" : __props.confirmLabel)}</button></div></form></dialog>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ConfirmDialog.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as _
};
//# sourceMappingURL=ConfirmDialog-CgAQ1lem.js.map
