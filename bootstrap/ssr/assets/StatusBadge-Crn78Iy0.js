import { defineComponent, computed, watch, mergeProps, unref, withCtx, createVNode, openBlock, createBlock, Fragment, renderList, toDisplayString, withDirectives, vModelText, createCommentVNode, vModelCheckbox, createTextVNode, useSSRContext, resolveDynamicComponent } from "vue";
import { ssrRenderComponent, ssrRenderList, ssrRenderClass, ssrRenderAttr, ssrInterpolate, ssrIncludeBooleanAttr, ssrLooseContain, ssrRenderAttrs, ssrRenderVNode } from "vue/server-renderer";
import { useForm } from "@inertiajs/vue3";
import { _ as _sfc_main$2 } from "./ConfirmDialog-CgAQ1lem.js";
import { Archive, TimerOff, FilePen, CalendarClock, CircleCheck } from "lucide-vue-next";
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "RenewDialog",
  __ssrInlineRender: true,
  props: {
    open: { type: Boolean },
    jobId: {},
    title: {},
    expired: { type: Boolean },
    presets: {}
  },
  emits: ["close"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const form = useForm({ validity_days: 30, expires_at: "", confirm: false });
    const days = computed(() => props.presets ?? [7, 15, 30, 60]);
    const statusError = computed(() => form.errors.status);
    watch(
      () => props.open,
      (open) => open && form.reset().clearErrors()
    );
    function pick(d) {
      form.validity_days = d;
      form.expires_at = "";
    }
    function submit() {
      form.post(`/admin/vagas/${props.jobId}/renovar`, { preserveScroll: true, onSuccess: () => emit("close") });
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$2, mergeProps({
        open: __props.open,
        title: __props.expired ? "Renovar vaga expirada" : "Renovar validade",
        message: `“${__props.title}” — defina por quanto tempo a vaga continuará no ar a partir de agora.`,
        "confirm-label": "Renovar vaga",
        processing: unref(form).processing,
        onConfirm: submit,
        onCancel: ($event) => emit("close")
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<fieldset${_scopeId}><legend class="label"${_scopeId}>Nova validade</legend><div class="flex flex-wrap gap-2"${_scopeId}><!--[-->`);
            ssrRenderList(days.value, (d) => {
              _push2(`<button type="button" class="${ssrRenderClass([unref(form).validity_days === d && !unref(form).expires_at ? "border-action-600 bg-action-50 text-action-700" : "border-line-strong bg-white text-ink", "btn-sm btn rounded-full border"])}"${ssrRenderAttr("aria-pressed", unref(form).validity_days === d && !unref(form).expires_at)}${_scopeId}>${ssrInterpolate(d)} dias</button>`);
            });
            _push2(`<!--]--></div><label for="renew-custom" class="label mt-3"${_scopeId}>Ou escolha uma data</label><input id="renew-custom"${ssrRenderAttr("value", unref(form).expires_at)} type="datetime-local" class="field"${_scopeId}>`);
            if (unref(form).errors.expires_at) {
              _push2(`<p class="error-text" role="alert"${_scopeId}>${ssrInterpolate(unref(form).errors.expires_at)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</fieldset>`);
            if (__props.expired) {
              _push2(`<label class="mt-4 flex items-start gap-2 rounded-lg bg-warning-50 p-3 text-sm text-warning-700"${_scopeId}><input${ssrIncludeBooleanAttr(Array.isArray(unref(form).confirm) ? ssrLooseContain(unref(form).confirm, null) : unref(form).confirm) ? " checked" : ""} type="checkbox" class="mt-0.5 size-4 rounded border-line-strong text-action-600"${_scopeId}><span${_scopeId}>Confirmo que a oportunidade <strong${_scopeId}>continua aberta</strong> e pode voltar a ser exibida publicamente.</span></label>`);
            } else {
              _push2(`<!---->`);
            }
            if (unref(form).errors.confirm) {
              _push2(`<p class="error-text" role="alert"${_scopeId}>${ssrInterpolate(unref(form).errors.confirm)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            if (statusError.value) {
              _push2(`<p class="error-text" role="alert"${_scopeId}>${ssrInterpolate(statusError.value)}</p>`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              createVNode("fieldset", null, [
                createVNode("legend", { class: "label" }, "Nova validade"),
                createVNode("div", { class: "flex flex-wrap gap-2" }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(days.value, (d) => {
                    return openBlock(), createBlock("button", {
                      key: d,
                      type: "button",
                      class: ["btn-sm btn rounded-full border", unref(form).validity_days === d && !unref(form).expires_at ? "border-action-600 bg-action-50 text-action-700" : "border-line-strong bg-white text-ink"],
                      "aria-pressed": unref(form).validity_days === d && !unref(form).expires_at,
                      onClick: ($event) => pick(d)
                    }, toDisplayString(d) + " dias", 11, ["aria-pressed", "onClick"]);
                  }), 128))
                ]),
                createVNode("label", {
                  for: "renew-custom",
                  class: "label mt-3"
                }, "Ou escolha uma data"),
                withDirectives(createVNode("input", {
                  id: "renew-custom",
                  "onUpdate:modelValue": ($event) => unref(form).expires_at = $event,
                  type: "datetime-local",
                  class: "field",
                  onInput: ($event) => unref(form).validity_days = null
                }, null, 40, ["onUpdate:modelValue", "onInput"]), [
                  [vModelText, unref(form).expires_at]
                ]),
                unref(form).errors.expires_at ? (openBlock(), createBlock("p", {
                  key: 0,
                  class: "error-text",
                  role: "alert"
                }, toDisplayString(unref(form).errors.expires_at), 1)) : createCommentVNode("", true)
              ]),
              __props.expired ? (openBlock(), createBlock("label", {
                key: 0,
                class: "mt-4 flex items-start gap-2 rounded-lg bg-warning-50 p-3 text-sm text-warning-700"
              }, [
                withDirectives(createVNode("input", {
                  "onUpdate:modelValue": ($event) => unref(form).confirm = $event,
                  type: "checkbox",
                  class: "mt-0.5 size-4 rounded border-line-strong text-action-600"
                }, null, 8, ["onUpdate:modelValue"]), [
                  [vModelCheckbox, unref(form).confirm]
                ]),
                createVNode("span", null, [
                  createTextVNode("Confirmo que a oportunidade "),
                  createVNode("strong", null, "continua aberta"),
                  createTextVNode(" e pode voltar a ser exibida publicamente.")
                ])
              ])) : createCommentVNode("", true),
              unref(form).errors.confirm ? (openBlock(), createBlock("p", {
                key: 1,
                class: "error-text",
                role: "alert"
              }, toDisplayString(unref(form).errors.confirm), 1)) : createCommentVNode("", true),
              statusError.value ? (openBlock(), createBlock("p", {
                key: 2,
                class: "error-text",
                role: "alert"
              }, toDisplayString(statusError.value), 1)) : createCommentVNode("", true)
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/RenewDialog.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "StatusBadge",
  __ssrInlineRender: true,
  props: {
    status: {},
    label: {}
  },
  setup(__props) {
    const props = __props;
    const style = computed(
      () => ({
        published: { cls: "bg-success-50 text-success-700", icon: CircleCheck },
        scheduled: { cls: "bg-info-50 text-info-700", icon: CalendarClock },
        draft: { cls: "bg-navy-50 text-navy-800", icon: FilePen },
        expired: { cls: "bg-warning-50 text-warning-700", icon: TimerOff },
        archived: { cls: "bg-line text-muted", icon: Archive }
      })[props.status] ?? { cls: "bg-line text-muted", icon: FilePen }
    );
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<span${ssrRenderAttrs(mergeProps({
        class: ["inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold whitespace-nowrap", style.value.cls]
      }, _attrs))}>`);
      ssrRenderVNode(_push, createVNode(resolveDynamicComponent(style.value.icon), {
        class: "size-3.5",
        "aria-hidden": "true"
      }, null), _parent);
      _push(`${ssrInterpolate(__props.label)}</span>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/StatusBadge.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as _,
  _sfc_main$1 as a
};
//# sourceMappingURL=StatusBadge-Crn78Iy0.js.map
