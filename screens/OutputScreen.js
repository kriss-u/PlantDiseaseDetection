import React, { Component } from 'react';
import { View, Text } from 'react-native';

export default class OutputScreen extends Component {
    state = {};

    render() {
        return (
            <View>
                {alert('Upload Success \n Retrieving Data...')}
                <Text>
                    Plant: {this.props.navigation.state.params.result[2][0]}</Text>
                <Text> Species: {this.props.navigation.state.params.result[0].split("_")[3]}</Text>
                <Text> Disease: {this.props.navigation.state.params.result[0].split("_")[5]}
                </Text>
            </View>
        )
    }
}