import Vue from 'vue';
import Vuex from 'vuex';
import layout from './modules/layout/';
import login from './modules/login/';
import workflow from './modules/workflow/';
import templates from './modules/templates/';
import steps from './modules/steps/'

Vue.use(Vuex)

const store = new Vuex.Store({
    modules: {
        layout,
        login,
        templates,
        workflow,
        steps
    }
});

export default store;
