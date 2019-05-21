<template>
  <div id="Page">
    <div id="sidebar">
      <router-link to="/">
        <a>Back to Venues</a>
      </router-link>
      <h1>Add venue</h1>
    </div>
    <div id="mainBody">
      <div v-if="isNaN($getUserId())">
        <h1>Please Login to continue</h1>
      </div>
      <div v-else class="venueInput">
        <h1>Enter new Venue Details</h1>Name
        <input v-model="name" placeholder="Name" required>
        <br>
        <br>Category
        <select id="categoryPicker">
          <option
            v-for="category in categories"
            :value="category.categoryId"
            v-bind:key="category.categoryId"
          >{{ category.categoryName }}</option>
        </select>
        <br>
        <br>Short Description
        <textarea
          v-model="shortDescription"
          placeholder="Short Description"
          rows="5"
          cols="30"
        ></textarea>
        <br>
        <br>Long Description
        <textarea
          v-model="longDescription"
          placeholder="Long Description"
          rows="5"
          cols="50"
        ></textarea>
        <br>
        <br>City
        <input v-model="city" placeholder="City">
        <br>
        <br>Address
        <input v-model="address" placeholder="Address">
        <br>
        <br>Latitude
        <input type="number" v-model="latitude" placeholder="Latitude">
        <br>
        <br>Longitude
        <input type="number" v-model="longitude" placeholder="Longitude">
        <br>
        <br>
        <button v-on:click="submitVenue()">Submit</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      error: "",
      errorFlag: false,
      categories: [], //stores all venue categories
      name: "",
      shortDescription: "",
      longDescription: "",
      city: "",
      address: "",
      latitude: "",
      longitude: "",
      category: ""
    };
  },
  mounted: function() {
    this.getCategories();
  },
  methods: {
    getCategories: function() {
      //gets the categories
      this.$http.get(this.serverAddress + "categories/").then(
        function(response) {
          this.categories = response.data;
        },
        function(error) {
          this.error = error;
          this.errorFlag = true;
        }
      );
    },
    submitVenue: function() {
      var e = document.getElementById("categoryPicker");
      this.category = e.options[e.selectedIndex].value;

      if (
        this.name === "" ||
        this.category === "" ||
        this.shortDescription === "" ||
        this.longDescription === "" ||
        this.city === "" ||
        this.address === "" ||
        this.latitude === "" ||
        this.longitude === ""
      ) {
        alert("All fields required");
      } else {
        console.log(this.category)
        this.$http
          .post(this.serverAddress + "venues/", {
            venueName: this.name,
            categoryId: parseInt(this.category),
            city: this.city,
            shortDescription: this.shortDescription,
            longDescription: this.longDescription,
            address: this.address,
            latitude: parseInt(this.latitude),
            longitude: parseInt(this.longitude)
          }, {headers: {'x-authorization': this.$getToken()}})
          .then(
            function(response) {
              let id = response.data.venueId;
              this.$router.push({ name: "Venue", params: { venueid: id } });
            },
            function(error) {
              this.error = error;
              this.errorFlag = true;
            }
          );
      }
    }
  }
};
</script>
