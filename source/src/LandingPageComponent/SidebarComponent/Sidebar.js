import '../MapComponent/Map.css';
import { infoPane, Google, currentInfoWindow } from '../MapComponent/Map';

export default function Sidebar(placeResult, marker, status) {
    if (Google && status && marker && status === Google.maps.places.PlacesServiceStatus.OK) {
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
        console.error('showDetails failed: ' + status);
        return null;
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
        let photo = <img className='hero' alt='Shelter image' src={firstPhoto.getUrl()}></img>;
        infoPane.appendChild(photo);
    }

    // place details
    let name = <h3 className='place'>{placeResult.name}</h3>;
    infoPane.appendChild(name);

    if (placeResult.rating) {
        let rating = <p className='details'>{`Rating: ${placeResult.rating} \u272e`}</p>;
        infoPane.appendChild(rating);
    }

    let address = <p className='details'>{placeResult.formatted_address}</p>;
    infoPane.appendChild(address);

    if (placeResult.website) {
        let website = <a href={placeResult.website} target='_blank'>{placeResult.website}</a>;
        infoPane.appendChild(website);
    }

    // Open the infoPane
    infoPane.classList.add("open");

    return (
        <div>{infoPane}</div>
    );
}