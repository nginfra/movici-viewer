// @ts-nocheck

import Vue from 'vue';
import Router from 'vue-router';
import Console from './components/Console.vue';
import Dashboard from './components/dashboard/Dashboard';
import Scenarios from './components/scenarios/Scenarios';
import ScenarioDetail from './components/scenarios/ScenarioDetail';
import Organisations from './components/organisations/Organisations';
import OrganisationDetail from './components/organisations/OrganisationDetail';
import Views from './components/views/Views';
import ViewDetail from './components/views/ViewDetail';
import Projects from './components/projects/Projects';
import ProjectDetail from './components/projects/ProjectDetail';
import Datasets from './components/datasets/Datasets';
import DatasetDetail from './components/datasets/DatasetDetail';
import Users from './components/users/Users';
import UserDetail from './components/users/UserDetail';
import Scopes from './components/scopes/Scopes';
import Profile from './components/profile/Profile';
import Activation from './components/account/Activation';
import ForgotPassword from './components/account/ForgotPassword';
import ResetPassword from './components/account/ResetPassword';
import Settings from './components/Settings';
import Main from './components/Main';
import ModelTypes from './components/model_types/ModelTypes';
import ModelTypeDetail from './components/model_types/ModelTypeDetail';
import datasetSchema from './components/dataset_schema/DatasetSchema';

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
      children: [
        {
          path: '/',
          component: Console,
          children: [
            {
              path: '',
              name: 'Home',
              component: Dashboard
            },
            {
              path: '/dashboard',
              name: 'Dashboard',
              component: Dashboard
            },
            {
              path: '/organisations',
              name: 'Organisations',
              component: Organisations
            },
            {
              path: '/organisations/add',
              name: 'OrganisationAdd',
              component: OrganisationDetail
            },
            {
              path: '/organisations/:uuid',
              name: 'OrganisationEdit',
              component: OrganisationDetail,
              props: route => {
                return {
                  uuid: route.params.uuid
                };
              }
            },
            {
              path: '/projects',
              name: 'Projects',
              component: Projects
            },
            {
              path: '/projects/add',
              name: 'ProjectAdd',
              component: ProjectDetail
            },
            {
              path: '/projects/:uuid',
              name: 'ProjectEdit',
              component: ProjectDetail,
              props: route => {
                return {
                  uuid: route.params.uuid
                };
              }
            },
            {
              path: '/scenarios',
              name: 'Scenarios',
              component: Scenarios
            },
            {
              path: '/scenarios/add',
              name: 'ScenarioAdd',
              component: ScenarioDetail
            },
            {
              path: '/scenarios/:uuid',
              name: 'ScenarioEdit',
              component: ScenarioDetail,
              props: route => {
                return {
                  uuid: route.params.uuid
                };
              }
            },
            {
              path: '/views',
              name: 'Views',
              component: Views
            },
            {
              path: '/views/add',
              name: 'ViewAdd',
              component: ViewDetail
            },
            {
              path: '/views/:uuid',
              name: 'ViewEdit',
              component: ViewDetail,
              props: route => {
                return {
                  uuid: route.params.uuid
                };
              }
            },
            {
              path: '/datasets',
              name: 'Datasets',
              component: Datasets
            },
            {
              path: '/datasets/add',
              name: 'DatasetAdd',
              component: DatasetDetail
            },
            {
              path: '/datasets/:uuid',
              name: 'DatasetEdit',
              component: DatasetDetail,

              props: route => {
                return {
                  uuid: route.params.uuid
                };
              }
            },
            {
              path: '/dataset_generators',
              name: 'DatasetGenerators',
              component: () => import('./components/dataset_generators/DatasetGenerators')
            },
            {
              path: '/dataset_generators/add',
              name: 'DatasetGeneratorAdd',
              component: () => import('./components/dataset_generators/DatasetGeneratorDetail')
            },
            {
              path: '/dataset_generators/:uuid',
              name: 'DatasetGeneratorEdit',
              component: () => import('./components/dataset_generators/DatasetGeneratorDetail'),
              props: route => {
                return {
                  uuid: route.params.uuid
                };
              }
            },
            {
              path: '/dataset_generators/:uuid',
              name: 'DatasetGeneratorLogs',
              component: () => import('./components/dataset_generators/DatasetGeneratorDetail'),
              props: route => {
                return {
                  uuid: route.params.uuid,
                  requested_tab: 'logs'
                };
              }
            },
            {
              path: '/users',
              name: 'Users',
              component: Users
            },
            {
              path: '/users/add',
              name: 'UserAdd',
              component: UserDetail
            },
            {
              path: '/users/:uuid',
              name: 'UserEdit',
              component: UserDetail,
              props: route => {
                return {
                  uuid: route.params.uuid
                };
              }
            },
            {
              path: '/scopes',
              name: 'Scopes',
              component: Scopes
            },
            {
              path: '/model_types',
              name: 'ModelTypes',
              component: ModelTypes
            },
            {
              path: '/model_types/add',
              name: 'ModelTypeAdd',
              component: ModelTypeDetail
            },
            {
              path: '/model_types/:uuid',
              name: 'ModelTypeEdit',
              component: ModelTypeDetail,
              props: route => {
                return {
                  uuid: route.params.uuid
                };
              }
            },
            {
              path: '/schema',
              name: 'Schema',
              component: datasetSchema
            },
            {
              path: '/profile',
              name: 'Profile',
              component: Profile
            },
            {
              path: '/settings',
              name: 'Settings',
              component: Settings
            }
          ]
        },
        {
          path: '/webviz',
          name: 'WebViz',
          component: () => import('./components/webviz/WebViz'),
          props: route => {
            let viewConfig = null;
            try {
              const decodedView = atob(route.query.view);
              const view = JSON.parse(decodedView);
              if (view instanceof Object) {
                viewConfig = view;
              }
            } catch (e) {
              // empty catch block, let viewConfig remain null
            }
            return {
              viewConfig
            };
          }
        },
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
    },

    {
      path: '/activate',
      name: 'Activate',
      component: Activation,
      props: route => {
        try {
          const queryToken: string = route.query.token;
          const decodedQueryToken = atob(queryToken);
          const jsonProps = JSON.parse(decodedQueryToken);
          return { ...route.query, ...jsonProps };
        } catch (error) {
          return {};
        }
      }
    },
    {
      path: '/forgot-password',
      name: 'ForgotPassword',
      component: ForgotPassword
    },
    {
      path: '/reset-password',
      name: 'ResetPassword',
      component: ResetPassword,
      props: route => {
        try {
          const queryToken: string = route.query.token;
          const decodedQueryToken = atob(queryToken);
          const jsonProps = JSON.parse(decodedQueryToken);
          return { ...route.query, ...jsonProps };
        } catch (error) {
          return {};
        }
      }
    }
  ],
  mode: 'history'
});

router.beforeEach((to, from, next) => {
  if (!to.matched.length) {
    next({ name: 'Home' });
  } else {
    next();
  }
});

export default router;
