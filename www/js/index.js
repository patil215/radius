var places;
var buckit;
var done;
buckit = new PersistentList("buckit");
done = new PersistentList("done");

document.addEventListener("deviceready", function () {
    buckit = new PersistentList("buckit");
    done = new PersistentList("done");
}, false);


function getMap(distance) {
    var searchterm = $('#search-term').val();

    getLocation();
    var mapOptions = {
        center: new google.maps.LatLng(currentPosition.coords.latitude, currentPosition.coords.longitude),
        zoom: 13
    };
    var map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
    labelMap(map, distance, searchterm);
    $('#current-location').html("Click on a marker to get more info about a location.");
}

function displayInfo(data) {
    var img = data.icon;
    var name = data.name;
    var vac = data.vicinity;
    if (vac == undefined) {
        vac = data.formatted_address;
    }
    var string = '<img src="' + img + '" height="50px" width="50px"><div id="loc-text"><span id="loc-name">' + name + '</span><br><span id="loc-vac">' + vac + '</span></div><button id="add">Add to my BuckitList</button><button onclick="window.plugins.socialsharing.shareViaFacebook(\'I\m planning on going to ' + name + '\', null, null, console.log(\'share ok\'), function(errormsg){alert(errormsg)})">Share this location</button><button id="cancel">Cancel</button>';
    $('#current-location').html(string);
    $("#add").click(function () {
        buckit.add(data);
        $('#current-location').html("");
    });
    $("#cancel").click(function () {
        $('#current-location').html("");
    });
}


function sizeBox() {
    document.getElementById('search-term').size = document.getElementById('search-term').value.length + 3;
}

function labelMap(map, distance, search) {
    places = new PlaceList(currentPosition.coords.latitude, currentPosition.coords.longitude, distance, search);
    console.log(places);
    for (i = 0; i < places.results.length; ++i) {
        place = places.results[i];
        var latlon = new google.maps.LatLng(place.geometry.location.lat, place.geometry.location.lng);
        var marker = new google.maps.Marker({
            position: latlon,
            title: place.name,
            map: map,
        });
        google.maps.event.addListener(marker, 'click', _.partial(displayInfo, place));
    }
}

function PersistentList(name) {
    this.name = name;
    this.list = [];
    this.loads = function (string) {
        this.list = JSON.parse(string);
    };
    this.load = function () {
        if (localStorage.getItem(this.name) === null) {
            this.dump();
        }
        this.loads(localStorage.getItem(this.name));
    };
    this.dumps = function () {
        return JSON.stringify(this.list);
    }
    this.dump = function () {
        localStorage.setItem(this.name, this.dumps());
    };
    this.add = function (place) {
        if (this.list.indexOf(place) === -1) {
            this.list.push(place);
        }
        this.dump();
    };
    this.remove = function (place) {
        if (this.list.indexOf(place) !== -1) {
            this.list.splice(this.list.indexOf(place), 1);
        }
        this.dump();
    };
    this.load();
}

function PlaceList(lat, lon, r, search) {
    this.lat = lat;
    this.lon = lon;
    this.r = r;
    this.results = [];
    var thisOuterObject = this;

    this.refresh = function () {
        var location = this.lat + "," + this.lon;
        var radius = "" + this.r;
        var key = "AIzaSyDeXYN2gBD6YUlIAEYOjSuKRQMbcuEPVOw";
        old_url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?sensor=true&location=" + location + "&radius=" + radius + "&key=" + key;
        if (search == 'Cool Places') {
            $.ajax({
                url: "https://maps.googleapis.com/maps/api/place/nearbysearch/json",
                async: false,
                data: {
                    key: key,
                    location: location,
                    radius: radius,
                    sensor: "true",
                },
                success: function (data) {
                    if (data.status != "OK") {
                        console.log("No data sent back");
                    }
                    thisOuterObject.results = data.results;
                },
                fail: function (data) {
                    console.log("AJAX Google Place API request failed");
                },
            });
        } else {
            $.ajax({
                url: "https://maps.googleapis.com/maps/api/place/textsearch/json",
                async: false,
                data: {
                    key: key,
                    location: location,
                    radius: radius,
                    sensor: "true",
                    query: encodeURIComponent(search)
                },
                success: function (data) {
                    if (data.status != "OK") {
                        console.log("No data sent back");
                    }
                    thisOuterObject.results = data.results;
                },
                fail: function (data) {
                    console.log("AJAX Google Place API request failed");
                },
            });
        }
        
        for (i = 0; i < this.results.length; ++i) {
            if (this.results[i].rating === undefined) {
                this.results[i].rating = Math.floor(Math.random() * (35 - 15) + 15);
            }
        }
    };

    this.toString = function () {
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
        navigator.geolocation.getCurrentPosition(function (position) { // on success
            currentPosition = position;
            refreshed += 1;
            console.log(currentPosition.timestamp);
        }, function () { // on failure
            console.log("Phone Gap location API failed");
            console.log("code: " + error.code);
            console.log("message: " + error.message);
        });
    }
document.addEventListener("deviceready", getLocation, false);
console.log("Waiting for device to be ready...");