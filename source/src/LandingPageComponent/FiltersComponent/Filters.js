import './Filters.css';
import { reloadMap } from '../MapComponent/Map';
import { View, Pressable, Text, Button } from 'react-native';
const RadioButton = require('../../UIComponents/RadioButton').default;
const styles = require('./FilterStylesheet').default;

var locationTypes = {
    "Women's Shelters": false,
    'Domestic Violence Shelters': false,
    'Homeless Shelters': false
};
var amenities = {
    'Allows Pets': false,
    'Allows Children': false,
    'Offers Meals': false,
    'Offers Showers': false
};
var range = {
    "radius": 30
}

const overflow = 4; //how many elements must be in a list to show a scroll bar
let previousRange = "30";

function onCheckboxClick(i) {
    let checkbox = document.getElementById(i.toString());
    if (i >= Object.keys(locationTypes).length && false) {
        if (checkbox.checked) {
            console.log(checkbox.value + " has been checked");
        }
        else {
            console.log(checkbox.value + " has been unchecked");
        }
    }

    //Apply checkbox.value to current list of filters in map
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
            if (index === i - Object.keys(locationTypes).length) {
                //console.log(amenities[amenity]);
                amenities[amenity] = !amenities[amenity];
                //console.log(amenities[amenity]);
            }
        });
    }
    console.log(locationTypes, amenities);

    reloadMap();
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
        range["radius"] = parseInt(slider.value) * 1609.344; //google uses meters instead of miles
        reloadMap();
    }
}

export default function Filters() {
    const locationTypeHTML = Object.keys(locationTypes).map((type, index) =>
        /*<li key={index}>
            <input id={index.toString()} type="radio" name="location" value={type} onClick={() => onCheckboxClick(index)} />
            <label htmlFor={index.toString()}>&nbsp;{type}</label>
        </li>*/
        /*<View key={index}>
            <Pressable style={styles.button} onPress={() => onCheckboxClick(index)}>
                <Text>{type}</Text>
            </Pressable>
            <Text>{"\n"}</Text>
        </View>*/
        <View key={index}>
            <RadioButton text={type} onPress={onCheckboxClick} input={index} isPressed={locationTypes[type]} ></RadioButton>
            <Text>{"\n"}</Text>
        </View>
    );
    //console.log(locationTypeHTML);

    let baseKey = Object.keys(locationTypes).length;
    const amenitiesHTML = Object.keys(amenities).map((amenity, index) => {
        let key = baseKey + index;
        return (
            <View key={key}>
                <RadioButton text={amenity} onPress={onCheckboxClick} input={key} isPressed={amenities[amenity]} ></RadioButton>
                <Text>{"\n"}</Text>
            </View>
            /*<View key={key}>
                <Pressable style={styles.button} onPress={() => onCheckboxClick(key)}>
                    <Text>{amenity}</Text>
                </Pressable>
                <Text>{"\n"}</Text>
            </View>*/
            /*<li key={key}>
                <input id={key.toString()} type="checkbox" name="amenity" value={amenity} onClick={() => onCheckboxClick(key)} />
                <label htmlFor={key.toString()}>&nbsp;{amenity}</label>
            </li>*/
        );
    });

    let locationClass = [styles.checkboxContainer];
    let amenityClass = [styles.checkboxContainer];
    //test
    if (Object.keys(locationTypes).length > overflow) locationClass.push(styles.list);
    if (Object.keys(amenities).length > overflow) amenityClass.push(styles.list)
    //console.log(locationClass, Object.keys(locationTypes).length, amenityClass, Object.keys(amenities).length);

    return (
        <View>
            <View style={styles.container}>
                <View style={locationClass}>
                    <ul>
                        {locationTypeHTML}
                    </ul>
                </View>
            </View>

            <Text>{"\n\n\n"}</Text>

            <View style={styles.container}>
                <Text style={styles.title}>{"that..."}</Text>
                <View style={amenityClass}>
                    <ul>
                        {amenitiesHTML}
                    </ul>
                </View>
            </View>

            <Text>{"\n\n\n\n\n\n"}</Text>

            <View style={styles.container}>
                <Text style={styles.title}>{"Search Radius"}</Text>
                <View style={styles.slideContainer}>
                    <input type="range" min="1" max="30" className="slider" id="range"
                        onInput={() => setRangeValue()} onMouseUp={() => updateRangeValue()}></input>
                </View>
                <div className="inline">
                    <p id="rangeValue" className="inline">30</p> mi
                </div>
            </View>
        </View>
    );
}

export {
    locationTypes,
    amenities,
    range
};