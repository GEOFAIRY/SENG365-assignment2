<template>
  <div id="Page">
    <!-- filtering options -->
    <div id="sidebar">
      <h1>Venues</h1>
      <p>Search</p>
      <input id="venueSearch" v-model="filterVenueName" placeholder="Search" @input="getVenues()">
      <p>Filter by city:</p>
      <select name="cityFilter" @change="onCityFilterChange($event)">
        <option selected="selected" value>No filter</option>
        <option v-for="city in cities" :value="city" v-bind:key="city">{{ city }}</option>
      </select>
      <p>Filter by category:</p>
      <select name="categoryFilter" @change="onCategoryFilterChange($event)">
        <option selected="selected" value>No filter</option>
        <option
          v-for="category in categories"
          :value="category.categoryId"
          v-bind:key="category.categoryId"
        >{{ category.categoryName }}</option>
      </select>
      <p>Order:</p>
      <select name="orderFilter" id="orderFilter" @change="onOrderFilterChange($event)">
        <option selected="selected" value="1">Highest to lowest star rating</option>
        <option value="2">Lowest to highest star rating</option>
        <option value="3">Highest to lowest cost rating</option>
        <option value="4">Lowest to highest cost rating</option>
        <option value="5" id="closestDistance">Closest to me</option>
        <option value="6" id="furthestDistance">Furthest from me</option>
      </select>

      <div id="starFilter">
        <p>Minimum Star Average</p>
        <input
          class="starFilterButton"
          type="radio"
          name="noStarFilter"
          id="noStarFilter"
          value="0"
          v-model="minimumStarRating"
          v-on:change="getVenues()"
        >
        <label for="noStarFilter">None</label>
        <input
          class="starFilterButton"
          type="radio"
          name="oneStar"
          id="oneStar"
          value="1"
          v-model="minimumStarRating"
          v-on:change="getVenues()"
        >
        <label for="oneStar">1</label>
        <input
          class="starFilterButton"
          type="radio"
          name="twoStar"
          id="twoStar"
          value="2"
          v-model="minimumStarRating"
          v-on:change="getVenues()"
        >
        <label for="twoStar">2</label>
        <input
          class="starFilterButton"
          type="radio"
          name="threeStar"
          id="threeStar"
          value="3"
          v-model="minimumStarRating"
          v-on:change="getVenues()"
        >
        <label for="threeStar">3</label>
        <input
          class="starFilterButton"
          type="radio"
          name="fourStar"
          id="fourStar"
          value="4"
          v-model="minimumStarRating"
          v-on:change="getVenues()"
        >
        <label for="fourStar">4</label>
        <input
          class="starFilterButton"
          type="radio"
          name="fiveStar"
          id="fiveStar"
          value="5"
          v-model="minimumStarRating"
          v-on:change="getVenues()"
        >
        <label for="fiveStar">5</label>
      </div>

      <div id="starFilter">
        <p>Cost Rating</p>
        <input
          class="costFilterButton"
          type="radio"
          name="noFilter"
          id="noFilter"
          value="5"
          v-model="maxCostRating"
          v-on:change="getVenues()"
        >
        <label for="noFilter">None</label>
        <input
          class="costFilterButton"
          type="radio"
          name="freeCost"
          id="freeCost"
          value="0"
          v-model="maxCostRating"
          v-on:change="getVenues()"
        >
        <label for="freeCost">Free</label>
        <input
          class="costFilterButton"
          type="radio"
          name="oneCost"
          id="oneCost"
          value="1"
          v-model="maxCostRating"
          v-on:change="getVenues()"
        >
        <label for="oneCost">1</label>
        <input
          class="costFilterButton"
          type="radio"
          name="twoCost"
          id="twoCost"
          value="2"
          v-model="maxCostRating"
          v-on:change="getVenues()"
        >
        <label for="twoCost">2</label>
        <input
          class="costFilterButton"
          type="radio"
          name="threeCost"
          id="threeCost"
          value="3"
          v-model="maxCostRating"
          v-on:change="getVenues()"
        >
        <label for="threeCost">3</label>
        <input
          class="costFilterButton"
          type="radio"
          name="fourCost"
          id="fourCost"
          value="4"
          v-model="maxCostRating"
          v-on:change="getVenues()"
        >
        <label for="fourCost">4</label>
      </div>

      <div id="forwardBack">
        <a id="nextLink" @click="nextVenues()">next</a>
        <span>Viewing: {{ displayVenuesCount() }}</span>
        <a id="previousLink" @click="previousVenues()">back</a>
      </div>
    </div>

    <div id="mainBody">
      <!-- display table of venues -->
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
      categories: [], //stores all venue categories
      cities: [], //stores all cities that are bound to venues, only unique cities
      filterCity: "", //the city that is currently being filtered by
      filterCategory: "", //category to filter by
      defaultVenuePhoto: defaultPhoto, //the default photo for when a venue has no photos
      filterVenueName: "", //the name search to filter by
      sortBy: "STAR_RATING", //sort by star_rating or cost_rating
      reversedOrder: false, //reverse the order of the venues
      geolocationEnabled: false, //tells the program if location is set
      lat: "", //the latitude of the client
      lon: "", //the longitude of the client
      venuePage: 1, //current viewing page for venues
      minimumStarRating: 0, //minimum star rating to filter by
      maxCostRating: 5 //max cost rating to filter by
    };
  },
  beforeMount() {
    this.geolocation();
  },
  mounted: function() {
    this.getVenues(), this.getCategories();
  },
  methods: {
    geolocation() {
      //get the users location
      navigator.geolocation.getCurrentPosition(this.buildUrl, this.geoError);
    },
    buildUrl(position) {
      //set the lat lon of the client
      this.lat = position.coords.latitude;
      this.lon = position.coords.longitude;
      this.geolocationEnabled = true;
    },
    geoError(error) {
      //if theres an error with geolocation
      this.geolocationEnabled = false;
      document.getElementById("closestDistance").disabled = true;
      document.getElementById("furthestDistance").disabled = true;
    },
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
          questionMarkFlag = true;
        } else uri = uri + "&q=" + this.filterVenueName;
      }
      if (this.filterCategory !== "") {
        if (!questionMarkFlag) {
          uri = uri + "?categoryId=" + this.filterCategory;
          questionMarkFlag = true;
        } else uri = uri + "&categoryId=" + this.filterCategory;
      }
      if (this.sortBy !== "STAR_RATING") {
        if (!questionMarkFlag) {
          uri = uri + "?sortBy=" + this.sortBy;
          questionMarkFlag = true;
        } else uri = uri + "&sortBy=" + this.sortBy;
      }
      if (this.reversedOrder) {
        if (!questionMarkFlag) {
          uri = uri + "?reverseSort=" + this.reversedOrder;
          questionMarkFlag = true;
        } else uri = uri + "&reverseSort=" + this.reversedOrder;
      }
      if (this.sortBy === "DISTANCE") {
        uri = uri + "&myLatitude=" + this.lat;
        uri = uri + "&myLongitude=" + this.lon;
      }
      if (this.venuePage !== 1) {
        var index = (this.venuePage - 1) * 10;
        if (!questionMarkFlag) {
          uri = uri + "?startIndex=" + index;
          questionMarkFlag = true;
        } else uri = uri + "&startIndex=" + index;
      }
      if (!questionMarkFlag) {
        uri = uri + "?count=" + 10;
        questionMarkFlag = true;
      } else uri = uri + "&count=" + 10;
      if (this.minimumStarRating != 0) {
        if (!questionMarkFlag) {
          uri = uri + "?minStarRating=" + this.minimumStarRating;
          questionMarkFlag = true;
        } else uri = uri + "&minStarRating=" + this.minimumStarRating;
      }
      if (this.maxCostRating != 5) {
        if (!questionMarkFlag) {
          uri = uri + "?maxCostRating=" + this.maxCostRating;
          questionMarkFlag = true;
        } else uri = uri + "&maxCostRating=" + this.maxCostRating;
      }

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
    displayVenuesCount: function() {
      //displays the count of venues being shown formatted
      var str = "";
      str = str + ((this.venuePage - 1) * 10 + 1);
      str = str + " - ";
      str = str + ((this.venuePage - 1) * 10 + this.venues.length);
      return str;
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
      if (event.target.value === "5") {
        this.sortBy = "DISTANCE";
        this.reversedOrder = false;
      }
      if (event.target.value === "6") {
        this.sortBy = "DISTANCE";
        this.reversedOrder = true;
      }
      this.getVenues();
    },
    nextVenues: function() {
      //next batch of venues
      if (this.venues.length === 10) {
        this.venuePage++;
        this.getVenues();
      }
    },
    previousVenues: function() {
      //previous batch of venues
      if (this.venuePage != 1) {
        this.venuePage--;
        this.getVenues();
      }
    },
    getVenue: function(id) {
      this.$router.push({ name: "Venue", params: { venueid: id } });
    }
  }
};
</script>
