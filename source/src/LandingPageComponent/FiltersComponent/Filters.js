import './Filters.css';

const locationTypes = ['Domestic Violence Shelters', 'Homeless Shelters', 'Public Restrooms'];
const filters = ['Allows Pets', 'Offers Education', 'Offers Meals'];
const overflow = 3;
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
        //TODO: Send slider.value to map
        previousRange = slider.value;
    }
}

export default function Filters() {
    const locationTypeHTML = locationTypes.map((type, index) =>
        <li key={index}>
            <input id={index.toString()} type="checkbox" name="location" value={type} onClick={() => onCheckboxClick(index)} />
            <label htmlFor={index.toString()}>&nbsp;{type}</label>
        </li>
    );
    //console.log(locationTypeHTML);

    const filtersHTML = filters.map((filter, index) => {
        let key = locationTypes.length - 1 + index;
        return (
            <li key={key}>
                <input id={key.toString()} type="checkbox" name="filter" value={filter} onClick={() => onCheckboxClick(key)} />
                <label htmlFor={key.toString()}>&nbsp;{filter}</label>
            </li>
        );
    });

    let locationClass = "checkboxContainer";
    let filterClass = "checkboxContainer";
    if (locationTypes.length > overflow) locationClass = " list";
    if (filters.length > overflow) filterClass = " list"; //There are spaces so css can detect multiple classes

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
                <h4>Filters</h4>
                <div className={filterClass}>
                    <ul>
                        {filtersHTML}
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