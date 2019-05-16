<template>
    <div id="Page">
        <div id="sidebar">
            <router-link to="/">
            <a>Back to Venues</a>
            </router-link>
            
            <div id="basicVenue">
                
            </div>
        </div>

        <div id="mainBody">
            <h1> {{ $route.params.venueid }} </h1>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            venue: {},
            venueid: null
        };
    },
    beforeMount: function() {
        if(this.$route.params.venueid === null) {
            console.log("passed")
            this.$router.push( { name: "Venues" } )
        }
    },
    mounted: function() {
        this.getVenue();
    },
    methods: {
        getVenue: function() {
            this.$http.get(this.serverAddress + 'venues/' + this.$route.params.venueid)
            .then(function(response) {
                this.venue = response.data;
                this.venueid = this.$route.params.venueid;
            },
            function(error) {
                this.error = error;
                this.errorFlag = true;
            }).then(function(){
                if(this.venueid === null) {
                    this.$router.push( { name: "Venues" } )
                }
            });
        }
    }
}
</script>
