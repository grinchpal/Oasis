import { useState } from "react";
import { View, StyleSheet, TouchableHighlight, Text } from "react-native";

const RadioButton = (props) => {
    const [isPressed, setIsPressed] = useState(false);

    //let isPressed = props.isPressed;

    let touchProps = {
        activeOpacity: 1,
        underlayColor: 'lightgray', // <-- "backgroundColor" will be always overwritten by "underlayColor"
        borderColor: 'lightblue',
        style: isPressed ? styles.btnPress : styles.btnNormal,
        //onHideUnderlay: () => setIsPressed(false),
        //onShowUnderlay: () => setIsPressed(true),
        onPress: () => {
            props.onPress(props.input);
            setIsPressed(!isPressed);
            //console.log(props.isPressed);
            //setIsPressed(!isPressed);
        }
    }

    return (
        <View>
            <TouchableHighlight {...touchProps}>
                <Text>{props.text}</Text>
            </TouchableHighlight>
        </View>
    );
}

var styles = StyleSheet.create({
    btnNormal: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: '0.7em',
        backgroundColor: 'lightblue',
        borderColor: 'lightblue'
    },
    btnPress: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: '0.7em',
        backgroundColor: 'lightgray',
        borderColor: 'lightblue'
    }
});

export default RadioButton;