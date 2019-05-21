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
      <div id="description">
        <h2>About</h2>
        <p>{{ venue.shortDescription }}</p>
        <p style="display: none" id="longDescription">{{ venue.longDescription }}</p>
        <a v-on:click="showHideDescription()">{{ longDescOutput }}</a>
      </div>

      <h2>Reviews</h2>
      <div
        v-if="loggedToken != null && venue.admin.userId != $getUserId() && !alreadyReviewed"
        id="addReview"
      >
        <button
          type="button"
          class="btn btn-primary"
          data-toggle="modal"
          data-target="#ReviewModal"
        >New Review</button>
      </div>
      <div id="reviews" v-for="review in reviews">
        <div class="container">
          <div class="panel panel-default">
            <div class="panel-heading">{{ review.reviewAuthor.username }}</div>
            <div class="panel-body">★{{ review.starRating }} ${{ review.costRating }}</div>
            <div class="panel-footer">{{ review.reviewBody }}</div>
          </div>
        </div>
      </div>

      <div
        class="modal fade"
        id="ReviewModal"
        tabindex="-1"
        role="dialog"
        aria-labelledby="ReviewModal"
        aria-hidden="true"
      >
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="ReviewModal">Login User</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <p>Enter Review:</p>
              <div class="userInput">
                <br>Cost Rating
                <select id="costRatingReview">
                  <option value="0">0</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                </select>
                <br>Star Rating
                <select id="starRatingReview">
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
                <br>
                <br>details
                <br>
                <textarea
                  v-model="reviewBody"
                  name="reviewDetails"
                  id="reviewDetails"
                  cols="75"
                  rows="10"
                  placeholder="Enter some details"
                ></textarea>
              </div>
            </div>
            <div class="modal-footer">
              <button type="submit" class="btn btn-primary" v-on:click="postReview()">Post Review</button>
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            </div>
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
      costRating: 0,
      starRating: 0,
      reviews: {},
      loggedToken: "",
      alreadyReviewed: false,
      reviewBody: ""
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
    this.getVenue();
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
          this.loggedToken = this.$getToken();
          for (var i = 0; i < this.venue.photos.length; i++) {
            this.images.push(this.venue.photos[i].photoFilename);
          }
          if (this.images.length === 0) {
            this.images.push("default");
          }
          if (this.venueid === null) {
            this.$router.push({ name: "Venues" });
          }
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
            this.checkReview();
          },
          function(error) {
            this.error = error;
            this.errorFlag = true;
          }
        );
    },
    checkReview: function() {
      for (var i = 0; i < this.reviews.length; i++) {
        console.log(
          parseInt(this.reviews[i].reviewAuthor.userId) === this.$getUserId()
        );
        if (
          parseInt(this.reviews[i].reviewAuthor.userId) === this.$getUserId()
        ) {
          console.log("here");
          this.alreadyReviewed = true;
        }
      }
    },
    postReview: function() {
      var starRating = document.getElementById('starRatingReview').value;
      var costRating = document.getElementById('costRatingReview').value;
      this.$http
        .post(
          this.serverAddress + "venues/" + this.venueid + "/reviews",
          {
            reviewBody: this.reviewBody,
            starRating: parseInt(starRating),
            costRating: parseInt(costRating)
          },
          { headers: { "x-authorization": this.$getToken() } }
        )
        .then(
          function(response) {
            $("#ReviewModal").modal("hide");
            this.$router.push({ name: "Venues" });

          },
          function(error) {
            this.error = error;
            this.errorFlag = true;
          }
        );
    }
  },
  components: {
    Carousel,
    Slide
  }
};
</script>
