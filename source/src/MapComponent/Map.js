import { Loader } from '@googlemaps/js-api-loader';
import './Map.css';

var map;
var infowindow;
const google = window.google

function Map() {
    const loader = new Loader({
        apiKey: "AIzaSyB4-FUFjLVyDHZ0gb8am_qa51l31DRv-d8",
        version: "weekly",
        libraries: ["places"]
    });

    const mapOptions = {
        center: {
            lat: 40.744118,
            lng: -74.032679
        },
        zoom: 13
    };

    var currentMarker = new google.maps.Marker({
        map: map,
        position: {
            lat: 40.744118,
            lng: -74.032679
        },
        title: 'Current Location',
        icon: {
          url: "https://maps.gstatic.com/intl/en_us/mapfiles/markers2/measle.png",
          size: new google.maps.Size(7, 7),
          anchor: new google.maps.Point(3.5, 3.5)
        }
      });

    var request = {
        location: {
            lat: 40.744118,
            lng: -74.032679
        },
        radius: 15000, 
        types: ["shelter"]
    };

    // Promise
    loader.load().then((google) => {
        console.log("LOADED");
        map = new google.maps.Map(document.getElementById("map"), mapOptions);
    })
        .catch(e => {
            console.error("Error occured while loading map.");
        });

    infowindow = new google.maps.InfoWindow();
    var service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, callback);



    return (
        <main>
            <div id="map"></div>
            <script
                src="https://maps.googleapis.com/maps/api/js?key=AIzaSyB4-FUFjLVyDHZ0gb8am_qa51l31DRv-d8&callback=initMap&v=weekly"
                async
            ></script>
        </main>
    );
}

function callback(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
        document.getElementById('status').innerHTML = results.length + " places found";
        for (var i = 0; i < results.length; i++) {
            createMarker(results[i]);
        }
    } else{
        alert("Status not OK");
    }

    return(
        <>
        <div id="status"></div>
        </>
    )
}

function createMarker(place) {
    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
        map: map,
        position: placeLoc
    });

    google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent(place.name);
        infowindow.open(map, this);
    });
}

export default Map;