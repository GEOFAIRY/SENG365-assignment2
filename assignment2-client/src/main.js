import Vue from 'vue'
import App from './App.vue'
import Venues from './Venues.vue'
import Venue from './Venue.vue'
import AddVenue from './AddVenue.vue'
import MyVenues from './MyVenues.vue'
import MyVenue from './MyVenue.vue'
import User from './User.vue'

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
  },
  {
    path: "/addVenue",
    name: "AddVenue",
    component: AddVenue
  },
  {
    path: "/myvenues",
    name: "MyVenues",
    component: MyVenues
  },
  {
    path: "/myvenues/:venueid",
    name: "MyVenue",
    component: MyVenue
  },
  {
    path: "/users/:userid",
    name: "User",
    component: User
  },
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
      loggedIn: false
    }
  },
  methods: {
    $getToken: function () {
      return localStorage.getItem("authToken");
    },
    $getUserId: function () {
      return parseInt(localStorage.getItem("id"));
    },
  }
});


new Vue({
  el: '#app',
  router: router,
  render: h => h(App)
});
