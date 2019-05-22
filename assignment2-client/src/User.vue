<template>
  <div id="page">
    <div id="sidebar">
      <router-link to="/">
        <a>Back to Venues</a>
      </router-link>

      
      <h1>User details</h1>
      <h3>Username: {{user.username}}</h3>
      <h5>Email: {{user.email}}</h5>
      <h5>Given Name: {{user.givenName}}</h5>
      <h5>Family Name: {{ user.familyName}}</h5>
    </div>
    <div id="mainBody">
      <img v-bind:src="getPhoto()">
    </div>
  </div>
</template>

<script>
import defaultPhoto from "./assets/default.png";
export default {
  data() {
    return {
      user: {},
      defaultVenuePhoto: defaultPhoto,
    };
  },
  mounted: function() {
    this.getUser();
  },
  methods: {
    getUser: function() {
      this.$http
        .get(this.serverAddress + "users/" + this.$route.params.userid, {headers: {'x-authorization': this.$getToken()}})
        .then(
          function(response) {
            this.user = response.data;
            console.log(this.user)
          },
          function(error) {
            this.error = error;
            this.errorFlag = true;
          }
        );
    },
    getPhoto: function() {
        var link = this.serverAddress + "users/" + this.$route.params.userid + "/photo"
        console.log(link)
        return link
    }
  }
};
</script>
