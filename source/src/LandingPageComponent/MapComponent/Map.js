import { Loader } from '@googlemaps/js-api-loader';
import './Map.css';
import { locationTypes, amenities, range } from '../FiltersComponent/Filters';

const defaultLat = 40.744118;
const defaultLng = -74.032679;
const defaultZoom = 13;

let Google;
let map;
let infoPane;
let currentInfoWindow;
let service;
let bounds;
let pos;

function showPanel(placeResult) {
    // If infoPane is already open, close it
    if (infoPane.classList.contains("open")) {
        infoPane.classList.remove("open");
    }

    // Clear the previous details
    while (infoPane.lastChild) {
        infoPane.removeChild(infoPane.lastChild);
    }

    /* TODO: Step 4E: Display a Place Photo with the Place Details */
    // Add the primary photo, if there is one
    if (placeResult.photos) {
        let firstPhoto = placeResult.photos[0];
        let photo = document.createElement('img');
        photo.classList.add('hero');
        photo.src = firstPhoto.getUrl();
        infoPane.appendChild(photo);
    }

    // Add place details with text formatting
    let name = document.createElement('h3');
    name.classList.add('place');
    name.textContent = placeResult.name;
    infoPane.appendChild(name);
    if (placeResult.rating) {
        let rating = document.createElement('p');
        rating.classList.add('details');
        rating.textContent = `Rating: ${placeResult.rating} \u272e`;
        infoPane.appendChild(rating);
    }
    let address = document.createElement('p');
    address.classList.add('details');
    address.textContent = placeResult.formatted_address;
    infoPane.appendChild(address);
    if (placeResult.website) {
        let websitePara = document.createElement('p');
        let websiteLink = document.createElement('a');
        let websiteUrl = document.createTextNode(placeResult.website);
        websiteLink.appendChild(websiteUrl);
        websiteLink.title = placeResult.website;
        websiteLink.href = placeResult.website;
        websitePara.appendChild(websiteLink);
        infoPane.appendChild(websitePara);
    }

    // Open the infoPane
    infoPane.classList.add("open");
}

function showDetails(placeResult, marker, status) {
    if (status === Google.maps.places.PlacesServiceStatus.OK) {
        let placeInfowindow = new Google.maps.InfoWindow();
        let rating = "None";
        if (placeResult.rating) rating = placeResult.rating;
        placeInfowindow.setContent('<div><strong>' + placeResult.name +
            '</strong><br>\nRating: ' + rating + '</div>');
        placeInfowindow.open(marker.map, marker);
        currentInfoWindow.close();
        currentInfoWindow = placeInfowindow;
        showPanel(placeResult);
    } else {
        console.log('showDetails failed: ' + status);
    }
}

function createMarkers(places) {
    places.forEach(place => {
        let marker = new Google.maps.Marker({
            position: place.geometry.location,
            map: map,
            title: place.name
        });

        /* TODO: Step 4B: Add click listeners to the markers */
        // Add click listener to each marker
        Google.maps.event.addListener(marker, 'click', () => {
            let request = {
                placeId: place.place_id,
                fields: ['name', 'formatted_address', 'geometry', 'rating',
                    'website', 'photos']
            };

            /* Only fetch the details of a place when the user clicks on a marker.
             * If we fetch the details for all place results as soon as we get
             * the search response, we will hit API rate limits. */
            service.getDetails(request, (placeResult, status) => {
                showDetails(placeResult, marker, status)
            });
        });

        // Adjust the map bounds to include the location of this marker
        bounds.extend(place.geometry.location);
    });
    /* Once all the markers have been placed, adjust the bounds of the map to
     * show all the markers within the visible area. */
    map.fitBounds(bounds);
}

function nearbyCallback(results, status) {
    if (status === Google.maps.places.PlacesServiceStatus.OK) {
        createMarkers(results);
    }
}

function getNearbyPlaces(position) {
    let request = {
        location: position,
        rankBy: Google.maps.places.RankBy.DISTANCE,
        keyword: "women's shelter"
    };

    service = new Google.maps.places.PlacesService(map);
    service.nearbySearch(request, nearbyCallback);
}

let handleLocationError = function (browserHasGeolocation, infoWindow) {
    // Set default location to Hoboken, NJ
    pos = {
        lat: defaultLat,
        lng: defaultLng
    };
    map = new Google.maps.Map(document.getElementById('map'), {
        center: pos,
        zoom: defaultZoom
    });

    // Display an InfoWindow at the map center
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Geolocation permissions denied. Using default location.' :
        'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
    currentInfoWindow = infoWindow;

    // Call Places Nearby Search on the default location
    getNearbyPlaces(pos);
}

function Map() {
    const loadMap = true;

    if (loadMap) {
        const loader = new Loader({
            apiKey: "AIzaSyB4-FUFjLVyDHZ0gb8am_qa51l31DRv-d8",
            version: "weekly",
            libraries: ["places"]
        });

        const mapOptions = {
            center: {
                lat: defaultLat,
                lng: defaultLng
            },
            zoom: defaultZoom,
            mapTypeId: "roadmap"
        };

        let infoWindow;

        // Promise
        loader.load().then((google) => {
            Google = google;
            console.log("Landing page map successfully loaded.");
            map = new google.maps.Map(document.getElementById("map"), mapOptions);

            bounds = new google.maps.LatLngBounds();
            infoWindow = new google.maps.InfoWindow();
            currentInfoWindow = infoWindow;
            infoPane = document.getElementById('panel');

            // Try HTML5 geolocation
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(position => {
                    pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    map = new google.maps.Map(document.getElementById('map'), {
                        center: pos,
                        zoom: 15
                    });
                    bounds.extend(pos);

                    infoWindow.setPosition(pos);
                    infoWindow.setContent('Location found.');
                    infoWindow.open(map);
                    map.setCenter(pos);

                    // Call Places Nearby Search on user's location
                    getNearbyPlaces(pos);
                }, () => {
                    // Browser supports geolocation, but user has denied permission
                    handleLocationError(true, infoWindow);
                });
            } else {
                // Browser doesn't support geolocation
                handleLocationError(false, infoWindow);
            }
        })
            .catch(e => {
                console.error("Error occured while loading landing page map. " + e);
            });
    }

    return (
        <>
            {/*<input id="mapInput" type="text" placeholder="Search" />*/}
            <div id="map"></div>
        </>
    );
}

export default Map;