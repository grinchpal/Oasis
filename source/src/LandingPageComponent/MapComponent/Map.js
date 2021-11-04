import { Loader } from '@googlemaps/js-api-loader';
import './Map.css';
import { locationTypes, amenities, range } from '../FiltersComponent/Filters';

const defaultLat = 40.744118;
const defaultLng = -74.032679;
const defaultZoom = 13;

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

        let pos;
        let map;
        let bounds;
        let infoWindow;
        let currentInfoWindow;
        let service;
        let infoPane;
        // Promise
        loader.load().then((google) => {
            console.log("Landing page map successfully loaded.");
            map = new google.maps.Map(document.getElementById("map"), mapOptions);

            // Create the search box and link it to the UI element.
            const input = document.getElementById("mapInput");
            const searchBox = new google.maps.places.SearchBox(input);

            bounds = new google.maps.LatLngBounds();
            infoWindow = new google.maps.InfoWindow();
            currentInfoWindow = infoWindow;
            infoPane = document.getElementById('panel');

            let showPanel = function (placeResult) {
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

            let showDetails = function (placeResult, marker, status) {
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    let placeInfowindow = new google.maps.InfoWindow();
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

            let createMarkers = function (places) {
                places.forEach(place => {
                    let marker = new google.maps.Marker({
                        position: place.geometry.location,
                        map: map,
                        title: place.name
                    });

                    /* TODO: Step 4B: Add click listeners to the markers */
                    // Add click listener to each marker
                    google.maps.event.addListener(marker, 'click', () => {
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

            let nearbyCallback = function (results, status) {
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    createMarkers(results);
                }
            }

            let getNearbyPlaces = function (position) {
                let request = {
                    location: position,
                    rankBy: google.maps.places.RankBy.DISTANCE,
                    keyword: "women's shelter"
                };

                service = new google.maps.places.PlacesService(map);
                service.nearbySearch(request, nearbyCallback);
            }
            let handleLocationError = function (browserHasGeolocation, infoWindow) {
                // Set default location to Hoboken, NJ
                pos = {
                    lat: defaultLat,
                    lng: defaultLng
                };
                map = new google.maps.Map(document.getElementById('map'), {
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

            map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
            // Bias the SearchBox results towards current map's viewport.
            map.addListener("bounds_changed", () => {
                searchBox.setBounds(map.getBounds());
            });

            let markers = [];
            // Listen for the event fired when the user selects a prediction and retrieve
            // more details for that place.
            searchBox.addListener("places_changed", () => {
                const places = searchBox.getPlaces();

                if (places.length === 0) {
                    return;
                }

                // Clear out the old markers.
                markers.forEach((marker) => {
                    marker.setMap(null);
                });
                markers = [];

                // For each place, get the icon, name and location.
                const bounds = new google.maps.LatLngBounds();

                places.forEach((place) => {
                    if (!place.geometry || !place.geometry.location) {
                        console.log("Returned place contains no geometry");
                        return;
                    }
                    const icon = {
                        url: place.icon,
                        size: new google.maps.Size(71, 71),
                        origin: new google.maps.Point(0, 0),
                        anchor: new google.maps.Point(17, 34),
                        scaledSize: new google.maps.Size(25, 25),
                    };

                    // Create a marker for each place.
                    markers.push(
                        new google.maps.Marker({
                            map,
                            icon,
                            title: place.name,
                            position: place.geometry.location,
                        })
                    );
                    if (place.geometry.viewport) {
                        // Only geocodes have viewport.
                        bounds.union(place.geometry.viewport);
                    } else {
                        bounds.extend(place.geometry.location);
                    }
                });
                map.fitBounds(bounds);
            });
        })
            .catch(e => {
                console.error("Error occured while loading landing page map.");
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