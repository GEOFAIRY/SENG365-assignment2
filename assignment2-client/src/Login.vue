<template>
  <div>
    <div v-if="loggedIn === true" id="loggedIn">
      <p v-if="username != ''">Logged in as: {{ username }}</p>
      <p v-else>Logged in as: {{ emailAddress }}</p>
      <button type="button" class="btn btn-primary" v-on:click="viewUser()">View User</button><br><br>
      <button type="button" class="btn btn-primary" v-on:click="logout()">Logout</button>
      <router-link :to="{name: 'AddVenue'}">
        <button type="button" class="btn btn-primary">New venue</button>
      </router-link>
      <router-link :to="{name: 'MyVenues'}">
        <button type="button" class="btn btn-primary">My venues</button>
      </router-link>
    </div>

    <div v-else id="notLogged">
      <button
        type="button"
        class="btn btn-primary"
        data-toggle="modal"
        data-target="#RegisterUserModal"
      >Register</button>
      <button
        type="button"
        class="btn btn-primary"
        data-toggle="modal"
        data-target="#LoginUserModal"
      >Login</button>
    </div>

    <div
      class="modal fade"
      id="RegisterUserModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="RegisterUserModal"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="RegisterUserModalLabel">Register User</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <p>Enter new details for user:</p>
            <div class="userInput">
              Given name
              <input v-model="givenName" placeholder="Given Name" required>
              <br>
              <br>Family Name
              <input v-model="familyName" placeholder="Family Name" required>
              <br>
              <br>Username
              <input v-model="username" placeholder="Username" maxlength="64" required>
              <br>
              <br>Email Address
              <input v-model="emailAddress" placeholder="Email Address" required>
              <br>
              <br>Password
              <input type="password" v-model="password" placeholder="Password" required>
            </div>
          </div>
          <div class="modal-footer">
            <button type="submit" class="btn btn-primary" v-on:click="registerUser()">Register User</button>
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>

    <div
      class="modal fade"
      id="LoginUserModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="LoginUserModal"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="LoginUserModalLabel">Login User</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <p>Enter details to login:</p>
            <div class="userInput">
              <br>Username or Email
              <input
                v-model="username"
                placeholder="Username"
                maxlength="64"
                required
              >
              <br>
              <br>Email Address
              <input v-model="emailAddress" placeholder="Email Address" required>
              <br>
              <br>Password
              <input type="password" v-model="password" placeholder="Password" required>
            </div>
          </div>
          <div class="modal-footer">
            <button type="submit" class="btn btn-primary" v-on:click="loginUser()">Login User</button>
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
let emailValidator = require("email-validator");

export default {
  data() {
    return {
      error: "",
      errorFlag: false,
      givenName: "",
      familyName: "",
      username: "",
      emailAddress: "",
      password: ""
    };
  },
  methods: {
    registerUser: function() {
      if (
        this.givenName === "" ||
        this.familyName === "" ||
        this.username === "" ||
        this.emailAddress === "" ||
        this.password === ""
      ) {
        alert("All fields are required");
      } else if (!emailValidator.validate(this.emailAddress)) {
        alert("Email is not valid");
      }

      this.$http
        .post(this.serverAddress + "users/", {
          username: this.username,
          email: this.emailAddress,
          givenName: this.givenName,
          familyName: this.familyName,
          password: this.password
        })
        .then(
          function(response) {
            this.login(this.username, this.emailAddress, this.password)
            $("#RegisterUserModal").modal("hide");
            alert("Success");
          },
          function(error) {
            if (error.status === 400) {
              alert("That username or email address already in use");
            } else {
              alert("Server error.");
            }
          }
        );
    },
    login: function(username, email, password) {
      if (username == "") {
        this.$http
          .post(this.serverAddress + "users/login/", {
            email: email,
            password: password
          })
          .then(function(response) {
            localStorage.setItem("authToken", response.data["token"]);
            localStorage.setItem("id", response.data["userId"]);
            $("#LoginUserModal").modal("hide");
            this.loggedIn = true
            this.$router.push({ name: "Venues" });
          })
          .catch(function(error) {
            console.log(error);
            if (error.status == 400) {
              alert("Incorrect username or password.");
            } else {
              alert("Error: " + error.status);
            }
          });
      } else {
        this.$http
          .post(this.serverAddress + "users/login/", {
            username: username,
            password: password
          })
          .then(function(response) {
            localStorage.setItem("authToken", response.data["token"]);
            localStorage.setItem("id", response.data["userId"]);
            console.log(this.$getUserId())
            $("#LoginUserModal").modal("hide");
            this.loggedIn = true
            this.$router.push({ name: "Venues" });
          })
          .catch(function(error) {
            console.log(error);
            if (error.status == 400) {
              alert("Incorrect username or password.");
            } else {
              alert("Error: " + error.status);
            }
          });
      }
    },
    loginUser: function() {
      this.login(this.username, this.emailAddress, this.password)
    },

    logout: function() {
        localStorage.removeItem("authToken")
        localStorage.removeItem("id")
        this.loggedIn = false
        location.reload()
    },
    viewUser() {
      this.$router.push({ name: "User", params: { userid: this.$getUserId() } });
    }
  }
};
</script>
