// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import Vuex from 'vuex'
import App from './App';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import { routes } from './routes';
import BootstrapVue from 'bootstrap-vue';
import snotify from 'vue-snotify';
import 'vuetify/dist/vuetify.min.css';
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import store from './store'

Vue.use(VueRouter);
Vue.use(VueResource);
Vue.use(Vuetify);
Vue.use(Vuex);



// Helpers
import colors from 'vuetify/es5/util/colors'

Vue.use(snotify, {
    theme: {
        primary: colors.red.darken1, // #E53935
        secondary: colors.red.lighten4, // #FFCDD2
        accent: colors.indigo.base // #3F51B5
    },
    global: {
        oneAtTime: true
    }
});

Vue.use(BootstrapVue);

/*eslint-disable no-unused-vars*/
/*global require b:true*/
/*eslint-enable no-unused-vars*/
// require('../node_modules/vue-snotify/styles/material.css');
require('../node_modules/vue-snotify/styles/material.css');

/* eslint-disable no-undef */
let isProd = process.env.NODE_ENV === 'production';
/* eslint-enable no-undef */

let baseUrl = isProd ? 'http://10.8.20.57' : 'http://localhost';
let port = isProd ? 3000 : process.env.EXPRESS_PORT;

baseUrl += ':' + port;
console.log(baseUrl);

Vue.http.options.root = baseUrl;

// Vue.http.options.root =  isProd ? 'http://10.8.20.57:3000' : 'http://localhost:3334';

Vue.config.productionTip = false;

const router = new VueRouter({
    routes: routes,
    mode: 'hash'
});


/* eslint-disable no-new */
new Vue({
    el: '#app',
    store,
    template: '<App/>',
    components: { App },
    router: router,
});
