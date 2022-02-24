import { locationTypes, amenities, range } from '../FiltersComponent/Filters';
import { service, Google, placeMarkers, createMarkers, map } from './Map';

let searchPos;
const useProceduralGen = false;

function GetNearbyPlaces(position, halfgen = false) {
    searchPos = position;

    //parse location and amenity objects
    var searchQuery = "";
    Object.keys(locationTypes).forEach((location) => {
        if (locationTypes[location] === true) {
            searchQuery = searchQuery.concat(location + " ");
        }
    });
    if (searchQuery === "") { //user did not pick location, use default
        searchQuery = "Women's Shelters ";
    }
    Object.keys(amenities).forEach((amenity) => {
        if (amenities[amenity] === true) {
            searchQuery = searchQuery.concat(amenity + " ");
        }
    });
    console.log("Search query: ", searchQuery);
    if (halfgen) {
        let newCoords = GetNewCoords(position, range.radius / 2);
        newCoords.forEach((newCenter) => {
            let request = {
                location: newCenter,
                radius: range.radius / 2,
                keyword: searchQuery
            }
            service.nearbySearch(request, HalfGenCallBack);
        })
        return;
    }
    //console.log("Keyword is: " + searchQuery);
    let request = {
        location: position,
        radius: range.radius,
        keyword: searchQuery
    };
    //console.log(request);
    service.nearbySearch(request, nearbyCallback);
}

//Handles half generation
function HalfGenCallBack(results, status) {
    if (status === Google.maps.places.PlacesServiceStatus.OK && results.length > 0) {
        createMarkers(results);
    }
}

function nearbyCallback(results, status) {
    console.log("Pulled " + results.length + " results. ");
    deleteMarkers();
    if (results.length === 20 && useProceduralGen) { //hit max results, switch to half generation
        GetNearbyPlaces(searchPos, true);
        return;
    }
    if (status === Google.maps.places.PlacesServiceStatus.OK && results.length > 0) {
        //console.log("creating markers...");
        createMarkers(results);
    }
}

function deleteMarkers() {
    //console.log("Deleting " + placeMarkers.size + " markers");
    placeMarkers.forEach((marker) => {
        marker.setMap(null); //dereference marker from the map
    });
    placeMarkers.clear(); //delete markers
}

//distance in meters
function GetNewCoords(pos, radius) {
    //Returns the center pos of each cardinal direction
    //about 0.008 degrees per km, radius is in meters
    const latDisplacement = radius / 1000 * 0.008;
    const lngDisplacement = latDisplacement / Math.cos(pos.lat * Math.PI / 180);

    let northPos = {
        lat: parseFloat((pos.lat + latDisplacement).toFixed(4)),
        lng: pos.lng
    }
    let southPos = {
        lat: parseFloat((pos.lat - latDisplacement).toFixed(4)),
        lng: pos.lng
    }
    let eastPos = {
        lat: pos.lat,
        lng: parseFloat((pos.lng + lngDisplacement).toFixed(4))
    }
    let westPos = {
        lat: pos.lat,
        lng: parseFloat((pos.lng - lngDisplacement).toFixed(4))
    }
    let result = [northPos, southPos, eastPos, westPos];
    return result;
}

export {
    GetNearbyPlaces
}