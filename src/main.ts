// @ts-nocheck
import 'buefy/dist/buefy.css';
import './assets/sass/main.scss';
import Vue from 'vue';
import App from './App';
import router from './router';
import store from './store';
import i18n from './i18n';
import Buefy from 'buefy';
import Filters from './filters';
import Flow from '~flow/main';

// Force importing all dynamic vuex modules. This is necessary until
// we only use the Store modules directly (

Vue.config.productionTip = false;
Vue.config.performance = true;
Vue.use(Buefy, {
  defaultIconPack: 'fas'
});
Vue.use(Filters);
Vue.use(Flow);

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app');
