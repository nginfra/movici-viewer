// @ts-nocheck
import Vue_ from 'vue';
import MovAction from '@/flow/components/global/Action.vue';
import MovActionBar from '@/flow/components/global/ActionBar.vue';
import MovActionMenu from '@/flow/components/global/ActionMenu.vue';
import MovLanguagePicker from '@/flow/components/global/LanguagePicker.vue';
import MovTooltipInfo from '@/flow/components/global/TooltipInfo.vue';

const components: Record<string, typeof Vue_> = {
  MovAction,
  MovActionBar,
  MovActionMenu,
  MovLanguagePicker,
  MovTooltipInfo
};

export default {
  install(Vue: typeof Vue_) {
    for (const componentName in components) {
      if (Object.prototype.hasOwnProperty.call(components, componentName)) {
        Vue.component(
          componentName,
          // Look for the component options on `.default`, which will
          // exist if the component was exported with `export default`,
          // otherwise fall back to module's root.
          components[componentName]
        );
      }
    }
  }
};
