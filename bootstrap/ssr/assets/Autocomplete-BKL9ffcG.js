import { defineComponent, ref, computed, onBeforeUnmount, mergeProps, createVNode, resolveDynamicComponent, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderAttr, ssrInterpolate, ssrRenderSlot, ssrIncludeBooleanAttr, ssrRenderClass, ssrRenderStyle, ssrRenderList, ssrRenderVNode } from "vue/server-renderer";
import "@inertiajs/vue3";
import { MapPin, Tag, Building2, Briefcase } from "lucide-vue-next";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Autocomplete",
  __ssrInlineRender: true,
  props: {
    id: {},
    modelValue: {},
    label: {},
    endpoint: {},
    params: { default: () => ({}) },
    placeholder: { default: "" },
    minChars: { default: 2 },
    maxlength: { default: 100 },
    name: {},
    required: { type: Boolean },
    invalid: { type: Boolean },
    inputClass: { default: "field" }
  },
  emits: ["update:modelValue", "select"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const items = ref([]);
    const open = ref(false);
    const active = ref(-1);
    ref(false);
    let timer;
    const listId = computed(() => `${props.id}-lista`);
    const optionId = (i) => `${props.id}-opt-${i}`;
    const icons = { briefcase: Briefcase, building: Building2, tag: Tag, pin: MapPin };
    function parts(label) {
      const term = props.modelValue.trim();
      if (!term) return [{ text: label, hit: false }];
      const idx = label.toLocaleLowerCase().indexOf(term.toLocaleLowerCase());
      if (idx < 0) return [{ text: label, hit: false }];
      return [
        { text: label.slice(0, idx), hit: false },
        { text: label.slice(idx, idx + term.length), hit: true },
        { text: label.slice(idx + term.length), hit: false }
      ].filter((p) => p.text);
    }
    const showGroup = (i) => !!items.value[i].group && items.value[i].group !== items.value[i - 1]?.group;
    onBeforeUnmount(() => {
      clearTimeout(timer);
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "relative" }, _attrs))}><label${ssrRenderAttr("for", __props.id)} class="sr-only">${ssrInterpolate(__props.label)}</label>`);
      ssrRenderSlot(_ctx.$slots, "icon", {}, null, _push, _parent);
      _push(`<input${ssrRenderAttr("id", __props.id)}${ssrRenderAttr("value", __props.modelValue)}${ssrRenderAttr("name", __props.name)} type="text" role="combobox" autocomplete="off"${ssrRenderAttr("maxlength", __props.maxlength)}${ssrRenderAttr("placeholder", __props.placeholder)}${ssrIncludeBooleanAttr(__props.required) ? " required" : ""} class="${ssrRenderClass(__props.inputClass)}"${ssrRenderAttr("aria-invalid", __props.invalid)} aria-autocomplete="list"${ssrRenderAttr("aria-expanded", open.value)}${ssrRenderAttr("aria-controls", listId.value)}${ssrRenderAttr("aria-activedescendant", active.value >= 0 ? optionId(active.value) : void 0)}><ul${ssrRenderAttr("id", listId.value)} role="listbox"${ssrRenderAttr("aria-label", `Sugestões para ${__props.label}`)} class="absolute inset-x-0 top-full z-40 mt-1.5 max-h-80 overflow-auto rounded-xl border border-line bg-white py-1.5 text-left shadow-(--shadow-pop)" style="${ssrRenderStyle(open.value ? null : { display: "none" })}"><!--[-->`);
      ssrRenderList(items.value, (s, i) => {
        _push(`<!--[-->`);
        if (showGroup(i)) {
          _push(`<li role="presentation" class="px-3 pt-2 pb-1 text-[11px] font-bold tracking-widest text-subtle uppercase">${ssrInterpolate(s.group)}</li>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<li${ssrRenderAttr("id", optionId(i))} role="option"${ssrRenderAttr("aria-selected", active.value === i)} class="${ssrRenderClass([active.value === i ? "bg-action-50" : "hover:bg-surface", "mx-1.5 flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-ink"])}">`);
        if (s.logo) {
          _push(`<img${ssrRenderAttr("src", s.logo)} alt="" class="size-6 shrink-0 rounded-md border border-line bg-white object-contain" loading="lazy">`);
        } else {
          ssrRenderVNode(_push, createVNode(resolveDynamicComponent(icons[s.icon ?? "briefcase"]), {
            class: "size-4 shrink-0 text-subtle",
            "aria-hidden": "true"
          }, null), _parent);
        }
        _push(`<span class="min-w-0 flex-1 truncate"><!--[-->`);
        ssrRenderList(parts(s.label), (p, k) => {
          _push(`<!--[-->`);
          if (p.hit) {
            _push(`<strong class="font-extrabold text-action-700">${ssrInterpolate(p.text)}</strong>`);
          } else {
            _push(`<!--[-->${ssrInterpolate(p.text)}<!--]-->`);
          }
          _push(`<!--]-->`);
        });
        _push(`<!--]--></span>`);
        if (s.hint) {
          _push(`<span class="shrink-0 text-xs text-muted">${ssrInterpolate(s.hint)}</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</li><!--]-->`);
      });
      _push(`<!--]--></ul><span class="sr-only" role="status" aria-live="polite">${ssrInterpolate(open.value ? `${items.value.length} sugestões disponíveis` : "")}</span></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/Autocomplete.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as _
};
//# sourceMappingURL=Autocomplete-BKL9ffcG.js.map
