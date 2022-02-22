import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        paddingTop: '1em',
        width: '100%'
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: '0.7em',
        backgroundColor: 'lightblue',
    },
    checkboxContainer: {
        height: '8em'
    },
    list: {
        overflowY: 'scroll',
        height: '12em'
    },
    slideContainer: {
        paddingTop: '0.3em',
        paddingBottom: '0.5em',
        width: '100%'
    },
    inline: {
        display: 'inline'
    },
    title: {
        fontSize: '1.5em'
    },
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

export default styles;