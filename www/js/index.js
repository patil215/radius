var places;
function getMap(distance){
    getLocation();
    var mapOptions = {
        center: new google.maps.LatLng(currentPosition.coords.latitude, currentPosition.coords.longitude),
        zoom: 13
    };
    var map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
    labelMap(map, distance);
    $('#current-location').html("Click on a marker to get more info about a location.");
}

function displayInfo(data){
    var img = data.icon;
    var name = data.name;
    var vac = data.vicinity;
    var string = '<img src="'+img+'" height="50px" width="50px"><div id="loc-text"><span id="loc-name">'+name+'</span><br><span id="loc-vac">'+vac+'</span></div><button onclick="addItem('+data+');">Add to my BuckitList</button><button onclick="window.plugins.socialsharing.share(\'Im planning on going to'+name+'\')">Share this location</button>';
    $('#current-location').html(string);
}


function labelMap(map, distance){
    places = new PlaceList(currentPosition.coords.latitude, currentPosition.coords.longitude, distance);
    for(i = 0; i < places.results.length; ++i) {
        place = places.results[i];
        var latlon = new google.maps.LatLng(place.geometry.location.lat, place.geometry.location.lng);
        var marker = new google.maps.Marker({
            position: latlon,
            title: place.name,
            map:map,
        });
        google.maps.event.addListener(marker, 'click', _.partial(displayInfo, place));
    }
}

function BucketList() {
    this.list = [];
    this.writeToFile = function() {
        localStorage.setItem("bucket_list", JSON.stringify(this.list));
    };
    this.readFromFile = function() {
        this.list = JSON.parse(localStorage.getItem("bucket_list"));
    };
    this.add = function(place) {
        if (this.list.indexOf(place) === -1) {
            this.list.push(place);
        }
    };
    this.remove = function(place) {
        if (this.list.indexOf(place) !== -1) {
            this.list.splice(this.list.indexOf(place), 1);
        }
    }
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