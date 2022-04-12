import { Loader } from '@googlemaps/js-api-loader';
import './Map.css';
import { GetNearbyPlaces } from './FindPlaces';
import Sidebar from '../SidebarComponent/Sidebar'
import { useState } from 'react';

const defaultLat = 40.744118;
const defaultLng = -74.032679;
const defaultZoom = 14;

let Google; //google API. Instantiated after loader promise
let map;    //map API. Instantiated after loader promise
let currentInfoWindow;
let service;
let bounds; //the area that the map displays
let placeMarkers = new Set();
let time1, time2; //timers used for tracking loading time
let placeInfo; //used for updating sidebar

let clickPair = { //controls execution order
    marker: false, //google api listener
    map: false //map div onclick
}
let infoHTML;
let stateFn;

//activation fn executes only when all components of stateObj are true
//stateObj is the object that is being analyzed
function updateState(activationFn, stateObj, key, arg) {
    stateObj[key] = true;
    let allKeysTrue = true;
    for (let k of Object.keys(stateObj)) {
        if (stateObj[k] === false) {
            allKeysTrue = false;
            break;
        }
    }
    if (allKeysTrue) {
        infoHTML = activationFn(arg);
        for (let k of Object.keys(stateObj)) {
            stateObj[k] = false;
        }
        stateFn(infoHTML);
    }
}

//called every time a filter is changed
function reloadMap(center = false) {
    console.log("------------------------");
    let pos = {
        lat: defaultLat,
        lng: defaultLng
    };

    service = new Google.maps.places.PlacesService(map);

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
                GetNearbyPlaces(userPos); //updated with user's current position
            }
        }, () => {
            if (center) {
                map.setCenter(pos);
            }
            else {
                GetNearbyPlaces(pos); //default pos, user denied geolocation
            }
        });
    }
    else {
        if (center) {
            map.setCenter(pos);
        }
        else {
            GetNearbyPlaces(pos); //default pos, no browser geolocation
        }
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
                //showDetails(placeResult, marker, status)
                placeInfo = placeResult;
                //show info bit above marker
                if (status === Google.maps.places.PlacesServiceStatus.OK) {
                    updateState(Sidebar, clickPair, 'marker', placeInfo);
                    let placeInfowindow = new Google.maps.InfoWindow();
                    let rating = placeResult.rating ? placeResult.rating : "None";
                    placeInfowindow.setContent('<div><strong>' + placeResult.name +
                        '</strong><br>\nRating: ' + rating + '</div>');
                    currentInfoWindow.close();
                    placeInfowindow.open(marker.map, marker);
                    currentInfoWindow = placeInfowindow;
                    console.log("showing info");
                }
                else {
                    console.error('showDetails failed: ' + status);
                }
            });
        });
        placeMarkers.add(marker);
    });
    displayMarkers();
}
function displayMarkers() {
    bounds = new Google.maps.LatLngBounds();
    placeMarkers.forEach((marker) => {
        //Adjust the map bounds to include the location of the marker
        bounds.extend(marker.position);
    });
    //console.log("Markers: ", placeMarkers);
    //Adjust the map bounds to show all the markers within the visible area
    map.fitBounds(bounds);
    time2 = new Date();
    console.log("Loading map took: " + (time2 - time1) / 1000 + " seconds.");
    console.log("Currently loaded:", placeMarkers.size, "results.");
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
    const loadMap = true;
    if (loadMap && placeMarkers.size === 0) {
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
                    console.warn("Browser supports geolocation, but user has denied permission");
                    handleLocationError(true, infoWindow);
                });
            }
            else {
                console.warn("Browser doesn't support geolocation");
                handleLocationError(false, infoWindow);
            }
        }, (error) => {
            console.error("Error occured while loading landing page map. " + error);
        });
    }

    const [infoPane, setValue] = useState(null);
    const resetPane = (html) => {
        setValue(html);
        console.log(html);
    };
    stateFn = resetPane;

    return (
        <>
            <div className='modal-body-row'>
                <button className="button" onClick={() => reloadMap(true)}>Reset Location</button>
            </div>
            <div className='modal-body-row'>
                <div className='col-lg-6 col-md-6 col-sm-6' style={{ padding: 'inherit' }}>
                    <div onClick={() => updateState(Sidebar, clickPair, 'map', placeInfo)} id="map"></div>
                </div>
                <br></br>
                <div className='col-lg-6 col-md-6 col-sm-6'>
                    <div>{infoPane}</div>
                </div>
            </div>
        </>
    );
}

export default Map;

export {
    reloadMap,
    createMarkers,
    service,
    Google,
    placeMarkers,
    map,
};