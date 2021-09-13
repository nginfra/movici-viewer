// @ts-nocheck
import Vue_ from 'vue';
import MovAction from './Action.vue';
import MovActionBar from './ActionBar.vue';
import MovActionMenu from './ActionMenu.vue';
import MovLanguagePicker from './LanguagePicker.vue';
import MovNewPassword from './NewPassword.vue';
import MovTooltipInfo from './TooltipInfo.vue';

const components: Record<string, typeof Vue_> = {
  MovAction,
  MovActionBar,
  MovActionMenu,
  MovLanguagePicker,
  MovNewPassword,
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
