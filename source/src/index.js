import { Loader } from '@googlemaps/js-api-loader';

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

// Promise
loader.load().then((google) => {
    new google.maps.Map(document.getElementById("map"), mapOptions);
  })
  .catch(e => {
    console.error("Error occured while loading map");
  });