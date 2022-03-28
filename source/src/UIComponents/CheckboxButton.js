import { useState } from "react";
import { View, TouchableHighlight, Text } from "react-native";
const styles = require('./styles').default;

const CheckboxButton = (props) => {
    const [isPressed, setIsPressed] = useState(false);

    let touchProps = {
        activeOpacity: 1,
        underlayColor: 'lightgray', // <-- "backgroundColor" will be always overwritten by "underlayColor"
        style: isPressed ? [styles.checkboxPress, styles.btnRoot] : [styles.btnRoot, styles.btnNormal],
        onPress: () => {
            props.onPress(props.input);
            setIsPressed(!isPressed);
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

export default CheckboxButton;