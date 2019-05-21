<template>
  <div id="Page">
    <div id="sidebar">
      <router-link to="/">
        <a>Back to Venues</a>
      </router-link>
      <h1>My Venues</h1>
    </div>
    <div id="mainBody">
      <div>
        <div
          class="venueTable"
          v-for="venue in venues"
          v-bind:key="venue.venueId"
          :value="venue.venueId"
          v-on:click="getVenue(venue.venueId)"
        >
          <div class="venuePhoto">
            <img v-bind:src="getVenuePrimaryImage(venue)" id="venuePrimaryThumbnail">
          </div>
          <div class="venueDetails">
            {{ venue.venueName }}
            <br>
            {{ displayCategory(venue.categoryId) }}
            <br>
            ★{{ venue.meanStarRating}} ${{venue.modeCostRating}}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import defaultPhoto from "./assets/default.png";
export default {
  data() {
    return {
      error: "",
      errorFlag: false,
      venues: [], //stores all venues
      defaultVenuePhoto: defaultPhoto,
      categories: [],
      userId: this.$getUserId()
    };
  },
  mounted: function() {
    this.getVenues(), this.getCategories();
  },
  methods: {
    getVenues: function() {
      //gets the venues
      var uri = this.serverAddress + "venues/?adminId=" + this.userId; //prepare the uri

      // make the request
      this.$http.get(uri).then(
        function(response) {
          this.venues = response.data;

          //change venues with no rating to have default values
          for (var i = 0; i < this.venues.length; i++) {
            if (this.venues[i].meanStarRating === null) {
              this.venues[i].meanStarRating = 3;
            }
            if (this.venues[i].modeCostRating === null) {
              this.venues[i].modeCostRating = 0;
            }
          }
        },
        function(error) {
          this.error = error;
          this.errorFlag = true;
        }
      );
    },
    getVenuePrimaryImage: function(venue) {
      //gets the primary image get uri of a venue
      if (venue.primaryPhoto === null) {
        return defaultPhoto;
      }
      return (
        this.serverAddress +
        "venues/" +
        venue.venueId +
        "/photos/" +
        venue.primaryPhoto +
        "/"
      );
    },
    displayCategory: function(categoryId) {
      //displays a category name from a category id
      for (var i = 0; i < this.categories.length; i++) {
        if (this.categories[i].categoryId === categoryId) {
          return this.categories[i].categoryName;
        }
      }
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
    getVenue: function(id) {
      this.$router.push({ name: "Venue", params: { venueid: id } });
    }
  }
};
</script>
