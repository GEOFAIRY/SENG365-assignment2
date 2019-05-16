import Vue from 'vue'
import App from './App.vue'
import Venues from './Venue.vue'

import VueRouter from 'vue-router';
Vue.use(VueRouter);
import VueResource from 'vue-resource';
Vue.use(VueResource);

Vue.http.options.emulateJSON = false;

const routes = [
  {
    path: "/",
    component: Venues
  }
];

const router = new VueRouter({
  routes: routes,
  mode: 'history'
});

Vue.mixin({
  data: function() {
    return {
      serverAddress: 'http://localhost:4941/api/v1/'
      //serverAddress: 'http://csse-s365.canterbury.ac.nz:4001/api/v1/'
    }
  }
});

new Vue({
  el: '#app',
  router: router,
  render: h => h(App)
});
