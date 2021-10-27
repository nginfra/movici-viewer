import Vue from 'vue';
import Router from 'vue-router';
import Main from '@/components/Main.vue';
import Settings from '@/components/Settings.vue';
import { getFlowRoutes } from '@movici-flow-common/router';

Vue.use(Router);

const flowBaseRoute = 'flow',
  router = new Router({
    routes: [
      {
        path: '/',
        component: Main,
        redirect: flowBaseRoute,
        children: [
          {
            path: '/settings',
            component: Settings
          },
          ...getFlowRoutes(flowBaseRoute)
        ]
      }
    ],
    mode: 'history'
  });

export default router;
