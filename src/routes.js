import Workflow from './components/workflow/Workflow.vue';
import AddWorkflow from './components/workflow/AddWorkflow.vue';
import ListWorkflow from './components/workflow/ListWorkflow.vue';
import Home from './components/Home.vue';
import Configuration from './components/Configuration.vue';
import AddElements from './components/input/AddElements.vue';
import CommitConfig from './components/CommitConfig.vue';
import PreviewConfig from './components/PreviewConfig.vue';
import PrintView from './components/PrintView.vue';
import WorkflowSelector from './components/WorkflowSelector';
import Opts from './components/Opts';
import TabbedOpts from './components/TabbedOpts';

import Login from './components/login/Login';


function isLoggedInGuard (to, from, next) {
    const isLoggedInToken = localStorage.getItem('isLoggedIn');
    if (isLoggedInToken) {
        next();
        return;
    }

    next('/login');
}


function authGuard (to, from, next) {
    const isLoggedInToken = localStorage.getItem('isLoggedIn');

    if (isLoggedInToken) {
        next('/');
        return;
    }

    next();

}

export const routes = [
    {
        path: '/login',
        name: 'Login',
        component: Login,
        beforeEnter: authGuard
    },

    {
        path: '/',
        name: 'Home',
        component: Home,
        props: true,
        beforeEnter: isLoggedInGuard

    },
    {
        path: '/workflows',
        component: Workflow,
        props: true,
        beforeEnter: isLoggedInGuard,
        children: [
            {
                path: '',
                name: 'workflows',
                component: ListWorkflow
            },
            {
                path: 'add',
                name: 'addWorkflow',
                component: AddWorkflow
            }
        ]

    },

    {
        path: '/findworkflows',
        name: 'findWorkflows',
        component: WorkflowSelector,
        props: true,
    },

    {
        path: '/commitconfig/:workflowObj',
        name: 'commitConfig',
        component: CommitConfig,
        props: true
    },

    {
        path: '/previewconfig/:workflowObj',
        name: 'previewConfig',
        component: PreviewConfig,
        props: true
    },

    {
        path: '/printview/:workflowObj',
        name: 'printView',
        component: PrintView,
        props: true
    },

    {
        path: '/configuration/:workflowObj',
        name: 'configWorkflow',
        component: Configuration,
        props: true,
        children: [
          { path: 'opts/:stepId?/:id',
            name: 'Opts',
            component: Opts,
            props: true
          },
          {
              path: 'tabbed-opts/:stepId?/:id',
              name: 'TabbedOpts',
              component: TabbedOpts,
              props: true
          }
      ]
    }
];
