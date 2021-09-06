// @ts-nocheck
import 'buefy/dist/buefy.css';
import './assets/sass/main.scss';
import Vue from 'vue';
import App from './App';
import router from './router';
import store from './store/store';
import i18n from './i18n';
import Buefy from 'buefy';
import Filters from './filters';

// Force importing all dynamic vuex modules. This is necessary until
// we only use the Store modules directly (ie no `this.$store`)
require('@/store/modules/CurrentUserStore');
require('@/store/modules/ProjectStore');
require('@/store/modules/DatasetsStore');
require('@/store/modules/DatasetGeneratorsStore');
require('@/store/modules/DatasetSchemaStore');
require('@/store/modules/ViewStore');
require('@/store/modules/ScenarioStore');
require('@/store/modules/SimulationStore');

import Globals from './components/global';

Vue.config.productionTip = false;
Vue.config.performance = true;
Vue.use(Globals);
Vue.use(Buefy, {
  defaultIconPack: 'fas'
});
Vue.use(Filters);

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app');
