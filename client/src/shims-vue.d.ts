import 'vue';
import snackbar from '@movici-flow-common/utils/snackbar';

declare module '*.vue' {
  import Vue from 'vue';
  export default Vue;
}

declare module 'vue/types/vue' {
  interface Vue {
    $flow: {
      snackbar: typeof snackbar;
      settings: {
        homeRoute: Route;
      };
    };
  }
  interface VueConstructor {
    $flow: {
      snackbar: typeof snackbar;
      settings: {
        homeRoute: Route;
      };
    };
  }
}
