import { Loader } from '@googlemaps/js-api-loader';
import './Map.css';

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

    // Promise
    loader.load().then((google) => {
        console.log("Landing page map successfully loaded.");
        new google.maps.Map(document.getElementById("map"), mapOptions);
    })
        .catch(e => {
            console.error("Error occured while loading landing page map.");
        });

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

export default Map;