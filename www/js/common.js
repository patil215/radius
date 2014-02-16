function get_places(location, radius) {
    output = {};
    var key = "AIzaSyDeXYN2gBD6YUlIAEYOjSuKRQMbcuEPVOw";
    $.ajax({
        url:"https://maps.googleapis.com/maps/api/place/nearbysearch/json",
        async: false,
        data: {
            key: key,
            location: location,
            radius: radius,
            sensor: "true",
        },
        success:  function(data) {
            output = data.results;
        },

    });
    return output;
}