var places;
var buckit;
var done;
buckit = new PersistentList("buckit");

document.addEventListener("deviceready", function () {
    buckit = new PersistentList("buckit");
}, false);


function getMap(distance) {
    //Main function.
    var searchterm = $('#search-term').val(); //Get the user's search term - Defualt is 'Cool Places'

    getLocation(); //Get the user's current GeoLocation
    var mapOptions = { //Initalize the map options. ToDo: Set zoom to scale with distance.
        center: new google.maps.LatLng(currentPosition.coords.latitude, currentPosition.coords.longitude),
        zoom: 13
    };
    var map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions); //Display map.
    labelMap(map, distance, searchterm); //Get google places and place them on the map.
    $('#current-location').html("Click on a marker to get more info about a location."); //Tell the user to click on a thing.
}

function displayInfo(data) {
    var img = data.icon; //Set img to the place's icon
    var name = data.name; //Set name to the place's name
    var rating = Math.floor(data.rating * 10); //Set rating to score
    var vac = data.vicinity; //Set vac to place's vainity
    if (vac == undefined) {
        vac = data.formatted_address; //(Or fomatted address, for text search.)
    }
    var string = '<div><img src="' + img + '" height="50px" width="50px"><div id="loc-text"><span id="loc-name">' + name + ',&nbsp;&nbsp;&nbsp; ' + rating + ' Points' + '</span><br><span id="loc-vac">' + vac + '</span></div></div><button id="add">Add to my BuckitList</button><button id="cancel">Cancel</button>'; //Messy HTML using the information above.
    $('#current-location').html(string); //Display it.
    $("#add").click(function () {
        buckit.add(data);
        $('#current-location').html(""); //Add to buckit list
    });
    $("#cancel").click(function () {
        $('#current-location').html(""); //Close the window
    });
}


function sizeBox() {
    document.getElementById('search-term').size = document.getElementById('search-term').value.length + 3; //Dynamically size search box
}

function labelMap(map, distance, search) {
    places = new PlaceList(currentPosition.coords.latitude, currentPosition.coords.longitude, distance, search); //Get places based on user location distance and search.
    console.log(places);
    for (i = 0; i < places.results.length; ++i) { //Go through each place.
        place = places.results[i]; //Select this place
        var latlon = new google.maps.LatLng(place.geometry.location.lat, place.geometry.location.lng); //Make a new marker object.
        var marker = new google.maps.Marker({
            position: latlon,
            title: place.name,
            map: map,
        }); //Initalize it.
        google.maps.event.addListener(marker, 'click', _.partial(displayInfo, place)); //Magic event tracking using lodash
    }
}

function PersistentList(name) {
    //I have no idea what is going on here.
    //Local storage to store a user's buckit list. May move to sever later.
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
    //Get list of places within distance
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
        if (search == 'Cool Places' || search == '') { //If defualt or blank, use nearby search
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
        } else { //Else use text search.
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
            this.results[i].visited = false; //Add a false visited.
            if (this.results[i].rating === undefined) { //If google doesn't provide a rating - make one.
                this.results[i].rating = Math.random() * (3.5 - 1.5) + 1.5;
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

function checkVisited() { //Check if location has been visited. ToDo: loop.
    var a1 = currentPosition.coords.latitude
    var b1 = currentPosition.coords.longitude
    console.log(a1 + ', ' + b1);
    for (i = 0; i < buckit.list.length; ++i) {
        var a2 = buckit.list[i].geometry.location.lat
        var b2 = buckit.list[i].geometry.location.lng
        d = Math.sqrt(Math.pow(a1 - a2, 2) + Math.pow(b1 - b2, 2));
        console.log(i + ": " + d);
        if (d < 0.005) {
            console.log("success");
            buckit.list[i].visited = true;
            buckit.dump();buckit.load();
        }
    }
}

var refreshed = 0;
var currentPosition = { //Defualt location is LA.
    coords: {
        latitude: 34.0500,
        longitude: -118.2500,
    },
    timetsamp: 0,
}

    function getLocation() { //Get the user's GeoLocation
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

document.addEventListener("deviceready", getLocation, false); //On ready, get user location.
console.log("Waiting for device to be ready...");