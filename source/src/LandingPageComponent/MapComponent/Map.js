import { Loader } from '@googlemaps/js-api-loader';
import './Map.css';
import { locationTypes, amenities, range } from '../FiltersComponent/Filters';

const defaultLat = 40.744118;
const defaultLng = -74.032679;
const defaultZoom = 14;

let Google; //google API. Instantiated after loader promise
let map;    //map API. Instantiated after loader promise
let infoPane;
let currentInfoWindow;
let service;
let bounds; //the area that the map displays
let placeMarkers = new Set();
let time1, time2; //timers used for tracking loading time

let searchPos;

function reloadMap(center = false) {
    let pos = {
        lat: defaultLat,
        lng: defaultLng
    };

    time1 = new Date();
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
        //console.log(marker.position);

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
        placeMarkers.add(marker);
    });
    displayMarkers();
}
function deleteMarkers() {
    console.log("Deleting " + placeMarkers.size + " markers");
    placeMarkers.forEach((marker) => {
        marker.setMap(null); //dereference marker from the map
    });
    placeMarkers.clear(); //delete markers
}
function displayMarkers() {
    bounds = new Google.maps.LatLngBounds();
    placeMarkers.forEach((marker) => {
        //Adjust the map bounds to include the location of the marker
        bounds.extend(marker.position);
    });
    //Adjust the map bounds to show all the markers within the visible area
    map.fitBounds(bounds);
    time2 = new Date();
    console.log("Loading map took: " + (time2 - time1) / 1000 + " seconds.");
}

function nearbyCallback(results, status) {
    //console.log("Pulled " + results.length + " results. " + typeof(results.length));
    deleteMarkers();
    if (results.length === 20) { //hit max results, switch to half generation
        getNearbyPlaces(searchPos, true);
        return;
    }
    if (status === Google.maps.places.PlacesServiceStatus.OK && results.length > 0) {
        createMarkers(results);
    }
}

//Handles half generation
function HalfGenCallBack(results, status) {
    //console.log("Halfgen");
    console.log(Google.maps.places.PlacesServiceStatus.OK + " " + results.length);
    if (status === Google.maps.places.PlacesServiceStatus.OK && results.length > 0) {
        console.log("creating markers");
        createMarkers(results);
    }
}

function getNearbyPlaces(position, halfgen = false) {
    service = new Google.maps.places.PlacesService(map);
    searchPos = position;

    //parse location and amenity objects
    var searchQuery = "";
    Object.keys(locationTypes).forEach((location) => {
        if (locationTypes[location] === true) {
            searchQuery = searchQuery.concat(location + " ");
        }
    });
    Object.keys(amenities).forEach((amenity) => {
        if (amenities[amenity] === true) {
            searchQuery = searchQuery.concat(amenity + " ");
        }
    });
    if (halfgen) {
        let newCoords = GetNewCoords(position, range.radius);
        let request = {
            location: newCoords[0],
            radius: range.radius / 2,
            keyword: searchQuery
        }
        service.nearbySearch(request, HalfGenCallBack);
        /*Object.keys(newCoords).forEach((newCenter) => {
            console.log("dir " + newCenter);
            let request = {
                location: newCenter,
                radius: range.radius / 2,
                keyword: searchQuery
            }
            service.nearbySearch(request, HalfGenCallBack);
        });*/
        return;
    }
    //console.log("Keyword is: " + searchQuery);
    let request = {
        location: position,
        radius: range.radius,
        keyword: searchQuery
    };

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
}

function Map() {
    const loadMap = false;

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

//distance in meters
function GetNewCoords(pos, radius) {
    //Returns the center pos of each cardinal direction
    console.log(pos);
    const earthRadius = 6371; //in km
    const base = (radius / earthRadius * 180 / Math.PI);
    //console.log(base);
    let northPos = {
        lat: pos.lat + base,
        lng: pos.lng
    }
    let southPos = {
        lat: pos.lat - base,
        lng: pos.lng
    }
    let eastPos = {
        lat: pos.lat,
        lng: pos.lng + base / Math.cos(pos.lat * Math.PI / 180)
    }
    let westPos = {
        lat: pos.lat,
        lng: pos.lng - base / Math.cos(pos.lat * Math.PI / 180)
    }
    let result = [northPos, southPos, eastPos, westPos];
    console.log(result);
    return result;
}

export default Map;

export {
    reloadMap
};