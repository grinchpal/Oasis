import './Filters.css';
import { reloadMap } from '../MapComponent/Map';
import { View, Text } from 'react-native';
import Slider from '@react-native-community/slider';
import { useState } from 'react';
import RadioButton from '../../UIComponents/RadioButton';
const CheckboxButton = require('../../UIComponents/CheckboxButton').default;
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
let previousRange = 10;
var range = {
    "radius": previousRange * 1609.344
};
const radioButtonData = [
    {
        key: "Women's Shelters",
        text: "Women's Shelters",
        id: 0,
        onPress: onCheckboxClick
    },
    {
        key: 'Domestic Violence Shelters',
        text: 'Domestic Violence Shelters',
        id: 1,
        onPress: onCheckboxClick
    },
    {
        key: 'Homeless Shelters',
        text: 'Homeless Shelters',
        id: 2,
        onPress: onCheckboxClick
    }
]

const overflow = 4; //how many elements must be in a list to show a scroll bar

function updateLocations(i) {
    Object.keys(locationTypes).forEach((type, index) => {
        if (index === i) {
            locationTypes[type] = true;
            console.log(`${type} has been clicked`);
        }
        else {
            locationTypes[type] = false;
        }
    });
    return locationTypes;
}

function onCheckboxClick(i) {
    //Apply checkbox.value to current list of filters in map
    if (i < Object.keys(locationTypes).length) { //id is in locations
        locationTypes = updateLocations(i);
    }
    else { //id is in filters
        Object.keys(amenities).forEach((amenity, index) => {
            if (index === i - Object.keys(locationTypes).length) {
                //console.log(amenities[amenity]);
                if (amenities[amenity] === true) {
                    amenities[amenity] = false;
                    console.log(`${amenity} has been unchecked`);
                }
                else {
                    amenities[amenity] = true;
                    console.log(`${amenity} has been checked`);
                    
                }
                //console.log(amenities[amenity]);
            }
        });
    }
    //console.log(locationTypes, amenities);

    reloadMap();
    
}

function updateRangeValue(newValue) { //for sending search radius info
    if (newValue !== previousRange) { //only update search radius when its changed
        console.log("User chose search radius of " + newValue + " miles.");
        previousRange = newValue;
        range["radius"] = newValue * 1609.344; //google uses meters instead of miles
        reloadMap();
    }
}

export default function Filters() {
    /*const locationTypeHTML = Object.keys(locationTypes).map((type, index) =>
        <View key={index}>
            <RadioButton PROP={radioButtonData} />
            <Text>{"\n"}</Text>
        </View>
    );*/
    const locationTypeHTML = (
        <View>
            <RadioButton PROP={radioButtonData} />
        </View>
    )
    //console.log(locationTypeHTML);

    let baseKey = Object.keys(locationTypes).length;
    const amenitiesHTML = Object.keys(amenities).map((amenity, index) => {
        let key = baseKey + index;
        return (
            <View key={key}>
                <CheckboxButton text={amenity} onPress={onCheckboxClick} input={key} isPressed={amenities[amenity]} ></CheckboxButton>
                <Text>{"\n"}</Text>
            </View>
        );
    });

    let locationClass = [styles.checkboxContainer];
    let amenityClass = [styles.checkboxContainer];
    if (Object.keys(locationTypes).length > overflow) locationClass.push(styles.list); //create scrollbar
    if (Object.keys(amenities).length > overflow) amenityClass.push(styles.list); //create scrollbar
    //console.log(locationClass, Object.keys(locationTypes).length, amenityClass, Object.keys(amenities).length);

    const [value, setValue] = useState(10); //used for slider bar
    const resetValue = (newValue) => setValue(Number(newValue));

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