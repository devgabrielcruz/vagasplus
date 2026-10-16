import { defineComponent, computed, createVNode, resolveDynamicComponent, mergeProps, useSSRContext } from "vue";
import { ssrRenderVNode } from "vue/server-renderer";
import { Building2, Factory, Utensils, Users, Scale, Palette, Wrench, ShoppingCart, Truck, GraduationCap, HeartPulse, Landmark, Megaphone, Headset, Code2, Briefcase } from "lucide-vue-next";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "CategoryIcon",
  __ssrInlineRender: true,
  props: {
    name: {}
  },
  setup(__props) {
    const props = __props;
    const icons = {
      briefcase: Briefcase,
      code: Code2,
      headset: Headset,
      megaphone: Megaphone,
      landmark: Landmark,
      "heart-pulse": HeartPulse,
      "graduation-cap": GraduationCap,
      truck: Truck,
      "shopping-cart": ShoppingCart,
      wrench: Wrench,
      palette: Palette,
      scale: Scale,
      users: Users,
      utensils: Utensils,
      factory: Factory,
      building: Building2
    };
    const icon = computed(() => icons[props.name ?? ""] ?? Briefcase);
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderVNode(_push, createVNode(resolveDynamicComponent(icon.value), mergeProps({ "aria-hidden": "true" }, _attrs), null), _parent);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/CategoryIcon.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as _
};
//# sourceMappingURL=CategoryIcon-Cd_HT9vu.js.map
