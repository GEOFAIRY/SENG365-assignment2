<template>
  <div id="venuesPage">
    <h1>Venues</h1>
    <br>
    <br>
    <div id="Venues">
      <!-- filtering options -->
      <div id="filters">
        Search
        <input v-model="filterVenueName" placeholder="Search" @input="getVenues()">
        Filter by city:
        <select name="cityFilter" @change="onCityFilterChange($event)">
          <option selected="selected" value>No filter</option>
          <option v-for="city in cities" :value="city" v-bind:key="city">{{ city }}</option>
        </select>
        Filter by category:
        <select
          name="categoryFilter"
          @change="onCategoryFilterChange($event)"
        >
          <option selected="selected" value>No filter</option>
          <option
            v-for="category in categories"
            :value="category.categoryId"
            v-bind:key="category.categoryId"
          >{{ category.categoryName }}</option>
        </select>
        Order:
        <select name="orderFilter" id="orderFilter" @change="onOrderFilterChange($event)">
          <option selected="selected" value=1>highest to lowest average (mean) star rating</option>
          <option value=2>lowest to highest average (mean) star rating</option>
          <option value=3>highest to lowest average (mode) cost rating</option>
          <option value=4>lowest to highest average (mode) cost rating</option>
        </select>
      </div>


      <!-- display table of venues -->
      <div>
        <td class="venueTable" v-for="venue in venues" v-bind:key="venue.id">
          <div class="venuePhoto">
            <img v-bind:src="getVenuePrimaryImage(venue)" height="100" width="100">
          </div>
          <div class="venueDetails">
            {{ venue.venueName }}
            <br>
            {{ displayCategory(venue.categoryId) }}
            <br>
            ★{{ venue.meanStarRating}} ${{venue.modeCostRating}}
          </div>
        </td>
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
      categories: [], //stores all venue categories
      cities: [], //stores all cities that are bound to venues, only unique cities
      filterCity: "", //the city that is currently being filtered by
      filterCategory: "", //category to filter by
      defaultVenuePhoto: defaultPhoto, //the default photo for when a venue has no photos
      filterVenueName: "", //the name search to filter by
      sortBy: "STAR_RATING", //sort by star_rating or cost_rating
      reversedOrder: false //reverse the order of the venues
    };
  },
  mounted: function() {
    this.getVenues(), this.getCategories();
  },
  methods: {
    getVenues: function() {
      //gets the venues
      var uri = this.serverAddress + "venues/"; //prepare the uri with filters
      var questionMarkFlag = false;
      if (this.filterCity != "") {
        uri = uri + "?city=" + this.filterCity;
        questionMarkFlag = true;
      }
      if (this.filterVenueName !== "") {
        if (!questionMarkFlag) {
          uri = uri + "?q=" + this.filterVenueName; 
          questionMarkFlag = true;}
        else uri = uri + "&q=" + this.filterVenueName;
      }
      if (this.filterCategory !== "") {
        if (!questionMarkFlag) {
          uri = uri + "?categoryId=" + this.filterCategory;
          questionMarkFlag = true;
        }
        else uri = uri + "&categoryId=" + this.filterCategory;
      }
      if (this.sortBy !== "STAR_RATING") {
        if (!questionMarkFlag) {
          uri = uri + "?sortBy=" + this.sortBy;
          questionMarkFlag = true;
        }
        else uri = uri + "&sortBy=" + this.sortBy;
      }
      if (this.reversedOrder){
        if (!questionMarkFlag) {
          uri = uri + "?reverseSort=" + this.reversedOrder;
          questionMarkFlag = true;
        }
        else uri = uri + "&reverseSort=" + this.reversedOrder;
      }

      // make the request
      this.$http.get(uri).then(
        function(response) {
          this.venues = response.data;
          this.getCities(); //Needs to be run once venues are got correctly, not when mounted
        },
        function(error) {
          this.error = error;
          this.errorFlag = true;
        }
      );
    },
    getCities: function() {
      //gets the cities from the current venues
      for (var i = 0; i < this.venues.length; i++) {
        if (!this.cities.includes(this.venues[i].city)) {
          this.cities.push(this.venues[i].city);
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
    onCityFilterChange: function(event) {
      //change the filter city when the drop down is changed
      this.filterCity = event.target.value;
      this.getVenues();
    },
    onCategoryFilterChange: function(event) {
      //change the filter city when the drop down is changed
      this.filterCategory = event.target.value;
      this.getVenues();
    },
    onOrderFilterChange: function(event) {
      //re orders the venues by chosen terms
      if (event.target.value === "1") {
        this.sortBy = "STAR_RATING";
        this.reversedOrder = false;
      }
      if (event.target.value === "2") {
        this.sortBy = "STAR_RATING";
        this.reversedOrder = true;
      }
      if (event.target.value === "3") {
        this.sortBy = "COST_RATING";
        this.reversedOrder = true;
      }
      if (event.target.value === "4") {
        this.sortBy = "COST_RATING";
        this.reversedOrder = false;
      }
      this.getVenues();
    }
  }
};
</script>
