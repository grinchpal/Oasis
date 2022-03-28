import React, { Component } from 'react';
import { TouchableOpacity, TouchableHighlight, View, Text } from 'react-native';
const styles = require('./styles').default;

export default class RadioButton extends Component {
    state = {
        value: null,
    };

    render() {
        const { PROP } = this.props;
        const { value } = this.state;

        return (
            <View>

                {PROP.map(button => {
                    return (
                        <View key={button.key} style={{ paddingVertical: '0.7em' }}>
                            <TouchableHighlight onPress={() => {
                                this.setState({
                                    value: button.key,
                                });
                                button.onPress(button.id);
                            }}
                                style={value === button.key ? [styles.radioPress, styles.btnRoot] : [styles.btnRoot, styles.btnNormal, styles.radioNormal]}
                                underlayColor={'lightgray'}
                            >
                                <Text>{button.text}</Text>
                            </TouchableHighlight>
                        </View>
                    );
                })
                }
            </View >
        );
    }
}