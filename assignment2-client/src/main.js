import Vue from 'vue'
import App from './App.vue'
import Venues from './Venues.vue'
import Venue from './Venue.vue'

import VueRouter from 'vue-router';
Vue.use(VueRouter);
import VueResource from 'vue-resource';
Vue.use(VueResource);

require('./assets/styles/style.css')

Vue.http.options.emulateJSON = false;

const routes = [
  {
    path: "/",
    name: "Venues",
    component: Venues
  },
  {
    path: "/venue/:venueid",
    name: "Venue",
    component: Venue
  }
];

const router = new VueRouter({
  routes: routes,
  mode: 'history'
});

Vue.mixin({
  data: function() {
    return {
      serverAddress: 'http://localhost:4941/api/v1/',
      // serverAddress: 'http://csse-s365.canterbury.ac.nz:4001/api/v1/',
    }
  }
});

Vue.prototype.$eventHub = new Vue(); //global event bus

new Vue({
  el: '#app',
  router: router,
  render: h => h(App)
});
