import { Loader } from '@googlemaps/js-api-loader';
import './Map.css';
import { locationTypes, amenities, range } from '../FiltersComponent/Filters';

const defaultLat = 40.744118;
const defaultLng = -74.032679;
const defaultZoom = 14;

let Google;
let map;
let infoPane;
let currentInfoWindow;
let service;
let bounds;
let placeMarkers = [];

function reloadMap(center=false) {
    let pos = {
        lat: defaultLat,
        lng: defaultLng
    };

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            let userPos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            if (center) {
                map.setCenter(userPos);
            }
            else {
                getNearbyPlaces(userPos); //updated with user's current position
            }
        }, () => {
            if (center) {
                map.setCenter(pos);
            }
            else {
                getNearbyPlaces(pos); //default pos, user denied geolocation
            }
        });
    }
    else {
        if (center) {
            map.setCenter(pos);
        }
        else {
            getNearbyPlaces(pos); //default pos, no browser geolocation
        }
    }
}

function showPanel(placeResult) {
    // If infoPane is already open, close it
    if (infoPane.classList.contains("open")) {
        infoPane.classList.remove("open");
    }

    // Clear the previous details
    while (infoPane.lastChild) {
        infoPane.removeChild(infoPane.lastChild);
    }

    
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

        placeMarkers.push(marker);

        // Adjust the map bounds to include the location of this marker
        bounds.extend(place.geometry.location);
    });
    /* Once all the markers have been placed, adjust the bounds of the map to
     * show all the markers within the visible area. */
    map.fitBounds(bounds);
}
function deleteMarkers() {
    for (let i = 0; i < placeMarkers.length; i++) {
        placeMarkers[i].setMap(null); //dereference marker from the map
    }
    placeMarkers = []; //delete markers
}

function nearbyCallback(results, status) {
    console.log("Pulled " + results.length + " results.");
    deleteMarkers();
    if (status === Google.maps.places.PlacesServiceStatus.OK && results.length > 0) {
        createMarkers(results);
    }
}

function getNearbyPlaces(position) {
    //console.log(range.radius)
    //parse location and amenity objects here
    var searchQuery = "";
    Object.keys(locationTypes).forEach((location) => {
        //console.log(locationTypes[location]);
        if (locationTypes[location] === true) {
            searchQuery = searchQuery.concat(location + " ");
            //console.log(searchQuery);
        }
    });
    Object.keys(amenities).forEach((amenity) => {
        //console.log(amenities[amenity]);
        if (amenities[amenity] === true) {
            searchQuery = searchQuery.concat(amenity + " ");
        }
    });
    console.log("Query is: " + searchQuery);
    let request = {
        location: position,
        radius: range.radius,
        keyword: searchQuery
    };

    service = new Google.maps.places.PlacesService(map);
    service.nearbySearch(request, nearbyCallback);
}

function handleLocationError(browserHasGeolocation, infoWindow) {
    // Set default location to Hoboken, NJ
    let pos = {
        lat: defaultLat,
        lng: defaultLng
    };
    map = new Google.maps.Map(document.getElementById('map'), {
        center: pos,
        zoom: defaultZoom
    });

    // Display an InfoWindow at the map center
    infoWindow.setPosition(pos);
    if (browserHasGeolocation) {
        infoWindow.setContent("Location tracking denied. Using default location.");
    }
    else {
        infoWindow.setContent("Error: Browser doesn't support geolocation.");
    }
    infoWindow.open(map);
    currentInfoWindow = infoWindow;

    // Call Places Nearby Search on the default location
    //getNearbyPlaces(pos);
}

function Map() {
    const loadMap = true;

    if (loadMap) {
        const loader = new Loader({
            apiKey: "AIzaSyB4-FUFjLVyDHZ0gb8am_qa51l31DRv-d8",
            version: "weekly",
            libraries: ["places"]
        });

        let infoWindow;

        // Promise
        loader.load().then((google) => {
            Google = google;
            console.log("Landing page map successfully loaded.");

            bounds = new google.maps.LatLngBounds();
            infoWindow = new google.maps.InfoWindow();
            currentInfoWindow = infoWindow;
            infoPane = document.getElementById('panel');

            // Try HTML5 geolocation
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(position => {
                    let pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    map = new google.maps.Map(document.getElementById('map'), {
                        center: pos,
                        zoom: defaultZoom
                    });
                    bounds.extend(pos);

                    infoWindow.setPosition(pos);
                    infoWindow.setContent('You are here');
                    infoWindow.open(map);
                    map.setCenter(pos);

                    // Call Places Nearby Search on user's location
                    //getNearbyPlaces(pos);
                }, () => {
                    // Browser supports geolocation, but user has denied permission
                    handleLocationError(true, infoWindow);
                });
            }
            else {
                // Browser doesn't support geolocation
                handleLocationError(false, infoWindow);
            }
        }, (error) => {
            console.error("Error occured while loading landing page map. " + error);
        });
    }

    return (
        <>
            <button className="button" onClick={() => reloadMap(true)}>Reset Location</button>
            
            <div id="map"></div>
        </>
    );
}

export default Map;

export {
    reloadMap
};