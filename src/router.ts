// @ts-nocheck
import Vue from 'vue';
import Router from 'vue-router';
import Main from '@/components/Main';
import Settings from '@/components/Settings';
import { getFlowRoutes } from '@/flow/src';

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
