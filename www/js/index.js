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
