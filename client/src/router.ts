import { createRouter, createWebHashHistory } from 'vue-router';
import FlowWrapperView from './views/FlowWrapperView.vue';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/:step?',
      name: 'home',
      component: FlowWrapperView,
      props: (route) => {
        return {
          location: route.params.step
            ? {
                step: route.params.step,
                projectName: route.query.project,
                scenarioName: route.query.scenario,
                viewUUID: route.query.view,
              }
            : undefined,
        };
      },
    },

  ]
})

export default router
