<template>
  <div v-if="checkLoading()">
    <h1>Loading</h1>
  </div>
  <div v-else id="Page">
    <div id="sidebar">
      <router-link to="/">
        <a>Back to Venues</a>
      </router-link>

      <div id="basicVenue">
        <h1>{{ venue.venueName }}</h1>
        <p>{{ venue.category.categoryName }}</p>
        <p>Admin: {{ venue.admin.username }}</p>
        <p>City: {{ venue.city }}</p>
        <p>{{ venue.address }}</p>
        <p>Date Added: {{ venue.dateAdded.split("T")[0] }}</p>
        <h3>Star Rating: {{ starRating }}</h3>
        <h3>Cost Rating: {{ costRating }}</h3>
      </div>
    </div>

    <div id="mainBody">
      <div class="wrapper-parent">
        <carousel paginationActiveColor="#73c000" autoplayTimeout:1000>
          <slide v-for="image in images" v-bind:key="image">
            <img v-if="image === 'default'" src="./assets/default.png" height="400px">
            <img v-else :src="getVenueImageUrl(image)" height="400px">
          </slide>
        </carousel>
      </div>
      <div id="edit">
        <h2>Edit Venue</h2>
        <div id="editinput" style="display: none">
          Name
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
          <button button type="button" class="btn btn-primary" v-on:click="submitVenue()">Submit</button>
        </div>
        <a v-on:click="showHideEdit()">{{ editOutput }}</a>
      </div>
      <div id="description">
        <h2>About</h2>
        <p>{{ venue.shortDescription }}</p>
        <p style="display: none" id="longDescription">{{ venue.longDescription }}</p>
        <a v-on:click="showHideDescription()">{{ longDescOutput }}</a>
      </div>

      <h2>Reviews</h2>
      <div id="reviews" v-for="review in reviews">
        <div class="container">
          <div class="panel panel-default">
            <div class="panel-heading">{{ review.reviewAuthor.username }}</div>
            <div class="panel-body">★{{ review.starRating }} ${{ review.costRating }}</div>
            <div class="panel-footer">{{ review.reviewBody }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Carousel, Slide } from "vue-carousel";

export default {
  data() {
    return {
      error: "",
      errorFlag: false,
      venue: {
        venueName: "",
        admin: {
          userId: "",
          username: ""
        },
        category: {
          categoryId: "",
          categoryName: "",
          categoryDescription: ""
        },
        city: "",
        shortDescription: "",
        longDescription: "",
        dateAdded: "",
        address: "",
        latitude: "",
        longitude: "",
        photos: []
      },
      venueid: this.$route.params.venueid,
      images: [],
      index: null,
      link:
        "http://localhost:4941/api/v1/venues/" +
        this.$route.params.venueid +
        "/photos/",
      descriptionShown: false,
      longDescOutput: "More",
      editShown: false,
      editOutput: "Show",
      costRating: 0,
      starRating: 0,
      reviews: {},

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
  watch: {
    $route() {
      this.venue = {
        venueName: "",
        admin: {
          userId: "",
          username: ""
        },
        category: {
          categoryId: "",
          categoryName: "",
          categoryDescription: ""
        },
        city: "",
        shortDescription: "",
        longDescription: "",
        dateAdded: "",
        address: "",
        latitude: "",
        longitude: "",
        photos: []
      };
      this.getVenue();
    }
  },
  beforeMount: function() {
    if (this.$route.params.venueid === null) {
      console.log("passed");
      this.$router.push({ name: "Venues" });
    }
  },
  mounted: function() {
    this.getVenue(), this.getCategories();
  },
  methods: {
    checkLoading: function() {
      return this.venue.venueName == "";
    },
    getVenue: function() {
      this.$http
        .get(this.serverAddress + "venues/" + this.$route.params.venueid)
        .then(
          function(response) {
            this.venue = response.data;
            this.venueid = this.$route.params.venueid;
          },
          function(error) {
            this.error = error;
            this.errorFlag = true;
          }
        )
        .then(function() {
          for (var i = 0; i < this.venue.photos.length; i++) {
            this.images.push(this.venue.photos[i].photoFilename);
          }
          if (this.images.length === 0) {
            this.images.push("default");
          }
          if (this.venueid === null) {
            this.$router.push({ name: "Venues" });
          }
          this.name = this.venue.venueName;
          this.shortDescription = this.venue.shortDescription;
          this.longDescription = this.venue.longDescription;
          this.city = this.venue.city;
          this.address = this.venue.address;
          this.latitude = this.venue.latitude;
          this.longitude = this.venue.longitude;

          this.getStarRating();
          this.getCostRating();
          this.getReviews();
        });
    },
    getVenueImageUrl: function(photo) {
      //gets the primary image get uri of a venue
      return this.link + photo;
    },
    showHideDescription: function() {
      if (this.descriptionShown) {
        document.getElementById("longDescription").style.display = "none";
        this.descriptionShown = false;
        this.longDescOutput = "More";
      } else {
        document.getElementById("longDescription").style.display = "block";
        this.descriptionShown = true;
        this.longDescOutput = "Less";
      }
    },
    showHideEdit: function() {
      if (this.editShown) {
        document.getElementById("editinput").style.display = "none";
        this.editShown = false;
        this.editOutput = "Show";
      } else {
        document.getElementById("editinput").style.display = "block";
        this.editShown = true;
        this.editOutput = "Hide";
      }
    },
    getStarRating: function() {
      this.$http.get(this.serverAddress + "venues/").then(
        function(response) {
          for (var i = 0; i < response.data.length; i++) {
            if (response.data[i].venueId == this.venueid) {
              this.starRating = response.data[i].meanStarRating;
            }
          }
        },
        function(error) {
          this.error = error;
          this.errorFlag = true;
        }
      );
    },
    getCostRating: function() {
      this.$http.get(this.serverAddress + "venues/").then(
        function(response) {
          for (var i = 0; i < response.data.length; i++) {
            if (response.data[i].venueId == this.venueid) {
              this.costRating = response.data[i].modeCostRating;
              break;
            }
          }
        },
        function(error) {
          this.error = error;
          this.errorFlag = true;
        }
      );
    },
    getReviews: function() {
      this.$http
        .get(this.serverAddress + "venues/" + this.venueid + "/reviews")
        .then(
          function(response) {
            this.reviews = response.data;
          },
          function(error) {
            this.error = error;
            this.errorFlag = true;
          }
        );
    },
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
        console.log(this.category);
        this.$http
          .patch(
            this.serverAddress + "venues/" + this.$route.params.venueid,
            {
              venueName: this.name,
              categoryId: parseInt(this.category),
              city: this.city,
              shortDescription: this.shortDescription,
              longDescription: this.longDescription,
              address: this.address,
              latitude: parseInt(this.latitude),
              longitude: parseInt(this.longitude)
            },
            { headers: { "x-authorization": this.$getToken() } }
          )
          .then(
            function(response) {
              let id = response.data.venueId;
              this.$router.push({ name: "MyVenues" });
            },
            function(error) {
              this.error = error;
              this.errorFlag = true;
            }
          );
      }
    }
  },
  components: {
    Carousel,
    Slide
  }
};
</script>
