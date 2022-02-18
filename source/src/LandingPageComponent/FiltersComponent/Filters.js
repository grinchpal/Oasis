import './Filters.css';
import { reloadMap } from '../MapComponent/Map';
import { View, Text } from 'react-native';
import Slider from '@react-native-community/slider';
import { useState } from 'react';
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
let previousRange = 10;

function onCheckboxClick(i) {
    //Apply checkbox.value to current list of filters in map
    if (i < Object.keys(locationTypes).length) { //id is in locations
        Object.keys(locationTypes).forEach((type, index) => {
            if (index === i) {
                locationTypes[type] = true;
                console.log(`${type} has been clicked`);
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
                if (amenities[amenities] === true) {
                    console.log(`${amenity} has been checked`);
                }
                else {
                    console.log(`${amenity} has been unchecked`);
                }
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

function updateRangeValue(newValue) { //for sending search radius info
    if (newValue !== previousRange) { //only update search radius when its changed
        console.log("User chose search radius of " + newValue + " miles.");
        range["radius"] = newValue * 1609.344; //google uses meters instead of miles
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

    const [value, setValue] = useState(10);
    const resetValue = (newValue) => setValue(value - value + Number(newValue));
    return (
        <View>
            <View style={styles.container}>
                <View style={locationClass}>
                    {locationTypeHTML}
                </View>
            </View>

            <Text>{"\n\n\n"}</Text>

            <View style={styles.container}>
                <Text style={styles.title}>{"that..."}</Text>
                <View style={amenityClass}>
                    {amenitiesHTML}
                </View>
            </View>

            <Text>{"\n\n\n\n\n\n"}</Text>

            <View style={styles.container}>
                <Text style={styles.title}>{"Search Radius"}</Text>
                <View style={styles.slideContainer}>
                    <Slider maximumValue={30} minimumValue={1} step={1} value={previousRange}
                    onSlidingComplete={(sliderValue) => updateRangeValue(sliderValue)}
                    onValueChange={(sliderValue) => resetValue(sliderValue)} />
                </View>
                <View style={styles.inline}>
                    <Text style={styles.inline}>{value} {"mi"}</Text>
                </View>
            </View>
        </View>
    );
}

export {
    locationTypes,
    amenities,
    range
};