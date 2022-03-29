import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    btnRoot: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: '0.7em',
        borderRadius: '6px'
    },
    btnNormal: {
        backgroundColor: 'lightblue',
        border: '2px solid lightblue',
    },
    radioNormal: {
        boxShadow: 'lightgray 0px 10px 5px;'
    },
    radioPress: {
        backgroundColor: 'lightgray',
        border: '2px solid lightgray',
    },
    checkboxPress: {
        backgroundColor: 'lightgreen',
        border: '2px solid lightblue'
    }
});

export default styles;