import './Filters.css';

var locationTypes = {
    'Domestic Violence Shelters': false,
    'Homeless Shelters': false,
};
var amenities = {
    'Allows Pets': false,
    'Allows Children': false,
    'Offers Meals': false,
    'Offers Showers': false
};
var range = {
    "radius": -1
}

const overflow = 4; //how many elements must be in a list to show a scroll bar
let previousRange = "50";

function onCheckboxClick(i) {
    let checkbox = document.getElementById(i.toString());
    if (checkbox.checked) {
        console.log(checkbox.value + " has been checked");
    }
    else {
        console.log(checkbox.value + " has been unchecked");
    }
    //TODO: Apply checkbox.value to current list of filters in map
    if (i < Object.keys(locationTypes).length) { //id is in locations
        Object.keys(locationTypes).forEach((type, index) => {
            if (index === i) {
                locationTypes[type] = true;
            }
            else {
                locationTypes[type] = false;
            }
        });
    }
    else { //id is in filters
        Object.keys(amenities).forEach((amenity, index) => {
            if (index === i - Object.keys(amenities).length) {
                amenities[amenity] = !amenities[amenity];
            }
        });
    }
}

function setRangeValue() { //for UI purposes
    var slider = document.getElementById("range");
    var output = document.getElementById("rangeValue");
    output.innerHTML = slider.value;
}

function updateRangeValue() { //for sending search radius info
    var slider = document.getElementById("range");
    if (slider.value !== previousRange) { //only update search radius when its changed
        console.log("User chose search radius of " + slider.value + " miles.");
        previousRange = slider.value;
        range["radius"] = slider.value;
    }
}

export default function Filters() {
    const locationTypeHTML = Object.keys(locationTypes).map((type, index) =>
        <li key={index}>
            <input id={index.toString()} type="radio" name="location" value={type} onClick={() => onCheckboxClick(index)} />
            <label htmlFor={index.toString()}>&nbsp;{type}</label>
        </li>
    );
    //console.log(locationTypeHTML);

    let baseKey = Object.keys(locationTypes).length;
    const amenitiesHTML = Object.keys(amenities).map((amenity, index) => {
        let key = baseKey + index;
        return (
            <li key={key}>
                <input id={key.toString()} type="checkbox" name="amenity" value={amenity} onClick={() => onCheckboxClick(key)} />
                <label htmlFor={key.toString()}>&nbsp;{amenity}</label>
            </li>
        );
    });

    let locationClass = "checkboxContainer";
    let amenityClass = "checkboxContainer";
    if (Object.keys(locationTypes).length > overflow) locationClass = "checkboxContainer list";
    if (Object.keys(amenities).length > overflow) amenityClass = "checkboxContainer list";
    console.log(locationClass, Object.keys(locationTypes).length, amenityClass, Object.keys(amenities).length);

    return (
        <>
            <div className="container">
                <div className={locationClass}>
                    <ul>
                        {locationTypeHTML}
                    </ul>
                </div>
            </div>

            <br></br>

            <div className="container">
                <h4>that...</h4>
                <div className={amenityClass}>
                    <ul>
                        {amenitiesHTML}
                    </ul>
                </div>
            </div>

            <br></br>

            <div className="container">
                <h4>Search Radius</h4>
                <div className="slideContainer">
                    <input type="range" min="1" max="50" className="slider" id="range"
                        onInput={() => setRangeValue()} onMouseUp={() => updateRangeValue()}></input>
                </div>
                <div className="inline">
                    <p id="rangeValue" className="inline">50</p> mi
                </div>
            </div>
        </>
    );
}

export {
    locationTypes,
    amenities,
    range
};