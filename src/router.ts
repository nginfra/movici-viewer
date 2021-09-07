// @ts-nocheck
import Vue from 'vue';
import Router from 'vue-router';
import Main from './components/Main';

const originalPush = Router.prototype.push;

Router.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) {
    return originalPush.call(this, location, onResolve, onReject);
  }

  return originalPush.call(this, location).catch(err => {
    if (Router.isNavigationFailure(err, Router.NavigationFailureType.duplicated)) {
      // resolve err
      return err;
    }
    // rethrow error
    return Promise.reject(err);
  });
};

Vue.use(Router);
const router = new Router({
  routes: [
    {
      path: '/',
      component: Main,
      redirect: '/flow',
      children: [
        {
          path: '/flow',
          name: 'Flow',
          redirect: { name: 'FlowProjects' },
          component: () => import('./components/flow/Flow'),
          children: [
            {
              path: '/flow/workspace',
              name: 'FlowProjects',
              component: () => import('./components/flow/FlowProjects.vue'),
              props: route => {
                const { project } = route.query;
                return { currentProjectName: project };
              }
            },
            {
              path: '/flow/datasets',
              name: 'FlowDatasets',
              component: () => import('./components/flow/FlowDatasets.vue'),
              props: route => {
                const { project } = route.query;
                return { currentProjectName: project };
              }
            },
            {
              path: '/flow/scenario',
              name: 'FlowScenario',
              component: () => import('./components/flow/FlowScenario.vue'),
              props: route => {
                const { project, scenario } = route.query;
                return { currentProjectName: project, currentScenarioName: scenario };
              }
            },
            {
              path: '/flow/visualization',
              name: 'FlowVisualization',
              component: () => import('./components/flow/FlowVisualization.vue'),
              props: route => {
                const { project, scenario, view } = route.query;
                return {
                  currentProjectName: project,
                  currentScenarioName: scenario,
                  currentViewUUID: view
                };
              }
            },
            {
              path: '/flow/export',
              name: 'FlowExport',
              component: () => import('./components/flow/FlowExport.vue'),
              props: route => {
                const { project, scenario, view } = route.query;
                return {
                  currentProjectName: project,
                  currentScenarioName: scenario,
                  currentViewUUID: view
                };
              }
            }
          ]
        }
      ]
    }
  ],
  mode: 'history'
});

router.beforeEach((to, from, next) => {
  if (!to.matched.length) {
    next({ name: 'Flow' });
  } else {
    next();
  }
});

export default router;
