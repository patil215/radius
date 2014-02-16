function getMap(distance){
    getLocation();
    
    var mapOptions = {
        center: new google.maps.LatLng(currentPosition.coords.latitude, currentPosition.coords.longitude),
        zoom: 13
    };
    
    var map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
    
    var g = new PlaceList(currentPosition.coords.latitude, currentPosition.coords.longitude, distance);
    labelMap(g.results, map);
    
    $('#current-location').html("Click on a marker to get more info about a location.");
}

function labelMap(places, map){
    for(i = 0; i < places.length; ++i) {
        //console.log(places[i].geometry.location.lat + " " +  places[i].geometry.location.lng);
        var latlon = new google.maps.LatLng(places[i].geometry.location.lat, places[i].geometry.location.lng);
        var marker = new google.maps.Marker({
            position: latlon,
            title:"Hello World!",
            map:map,
        });
        //marker.setMap();
    }
}

function BucketList() {
    this.list = [];
    this.writeToFile = function() {
        
    };
    this.readFromFile = function() {
        
    };
    this.add = function() {
        
    };
}

function sizeBox() {
    document.getElementById('search-term').size = document.getElementById('search-term').value.length + 3;
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
    };
    
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
    navigator.geolocation.getCurrentPosition(function(position) { // on success
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
