import React, { Component } from 'react';
import { View, Text } from 'react-native';
import firebase from "react-native-firebase";

export default class OutputScreen extends Component {
    constructor() {
        super()
        this.state = {
            disease: ''
        };
    }

    getDiseaseData = () => {
        console.log(JSON.stringify(this.props.navigation.state.params.result))
        // this.setState({
        //     disease: this.props.navigation.state.params.result.diseases[0]
        // })
    }

    render() {
        this.getDiseaseData()
        return (
            <View>
                {/* <Text> Common Name: {this.props.navigation.state.params.result.common_name} </Text>
                <Text> Description of the Plant: {this.props.navigation.state.params.result.description} </Text>
                <Text>Scientific Name: {this.props.navigation.state.params.result.scientific_name}</Text>
                <Text> About Disease: </Text>
                <Text> Cause: {this.state.disease.cause}</Text>
                <Text>Common Name: {this.state.disease.common_name}</Text>
                <Text>Control: {this.state.disease.control}</Text>
                <Text>Scientific Name: {this.state.disease.disease_scientific_name}</Text>
                <Text>Symptoms: {this.state.disease.symptoms}</Text> */}
            </View>
        )
    }
}