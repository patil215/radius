 function sizeBox(){
    document.getElementById('search-term').size = document.getElementById('search-term').value.length + 3;}


function map_initialize(latitude, longitude) {
        var mapOptions = {
          center: new google.maps.LatLng(latitude, longitude),
          zoom: 14
        };
        var map = new google.maps.Map(document.getElementById("map-canvas"),
            mapOptions);
}

function PlaceList(lat, lon, r) {
    this.lat = lat;
    this.lon = lon;
    this.r = r;
    this.results = [];
    var thisOuterObject = this;
    
    this.refresh = function() {
        var location = this.lat + "," + this.lon;
        var radius = "" + this.r;
        var key = "AIzaSyDeXYN2gBD6YUlIAEYOjSuKRQMbcuEPVOw";
        old_url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?sensor=true&location=" + location + "&radius=" + radius + "&key=" + key;
        $.ajax({
            url: "https://maps.googleapis.com/maps/api/place/nearbysearch/json",
            async: false,
            data: {
                key: key,
                location: location,
                radius: radius,
                sensor: "true",
            },
            success: function(data) {
                if (data.status != "OK") {
                    console.log("No data sent back");
                }
                thisOuterObject.results = data.results;
            },
            fail: function(data) {
                console.log("AJAX Google Place API request failed");
            },
        });
    };
    
    this.toString = function() {
        output = "";
        for (i = 0; i < this.results.length; ++i) {
            output += this.results[i].name + " <br /> ";
        }
        return output;
    }
    
    this.refresh();
}

var refreshed = 0;
var currentPosition = {
    coords: {
        latitude: 34.0500,
        longitude: -118.2500,
    },
    timetsamp: 0,
}

function getLocation() {
    console.log("Device ready!");
    navigator.geolocation.getCurrentPosition(function() { // on success
        currentPosition = position;
        refreshed += 1;
        console.log(currentPosition.timestamp);
        /*
        var lat = position.coords.latitude;
        var lon = position.coords.longitude;
        var altitude = positions.coords.accuracy;
        var coordAccuracy = position.coords.accuracy;
        var altitudeAccuracy = position.coords.altitudeAccuracy;
        var heading = position.coords.heading;
        var speed = position.coords.speed;
        */
    }, function() { // on failure
        console.log("Phone Gap location API failed");
        console.log("code: " + error.code);
        console.log("message: " + error.message);
    });
}
document.addEventListener("deviceready", getLocation, false);
console.log("Waiting for device to be ready...");
