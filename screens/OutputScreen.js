import React, { Component } from 'react';
import { View, Text } from 'react-native';
import firebase from "react-native-firebase";

export default class OutputScreen extends Component {
    constructor() {
        super()
        this.state = {
            disease: {},
            species: {}
        };
    }

    getDiseaseData = () => {
        // console.log(this.props.navigation.state.params.result)
        let disease = this.props.navigation.state.params.result
        let diseaseDetail
        let species
        // console.log(disease);
        species = disease.species
        // console.log(JSON.stringify(this.props.navigation.state.params.result))
        let ref = firebase.database().ref("species/");
        let query = ref.orderByChild("common_name")
            .equalTo(species)
        query.on("value", (snapshot) => {
            // console.log(snapshot)
            snapshot.forEach((child) => {
                console.log(child)
                if (disease.disease !== 'h') {
                    species = child.val()
                    diseaseDetail = child.val().diseases.filter(function (childDisease) {
                        return childDisease.common_name === disease.disease
                    })
                    console.log(diseaseDetail)
                    console.log(species)
                    // console.log("lol: " + JSON.stringify(diseaseDetail))
                }
                name = diseaseDetail[0].common_name
                console.log(name)
                this.setState({
                    disease: diseaseDetail[0],
                    species: species
                })
            });
        });
    }

    componentDidMount() {
        this.getDiseaseData()
    }

    render() {
        return (
            <View>
                <Text> Common Name: {this.state.species.common_name} </Text>
                <Text> Description of the Plant: {this.state.species.description} </Text>
                <Text>Scientific Name: {this.state.species.scientific_name}</Text>
                <Text> About Disease: </Text>
                <Text> Cause: {this.state.disease.cause}</Text>
                <Text>Common Name: {this.state.disease.common_name}</Text>
                <Text>Control: {this.state.disease.control}</Text>
                <Text>Scientific Name: {this.state.disease.disease_scientific_name}</Text>
                <Text>Symptoms: {this.state.disease.symptoms}</Text>
            </View>
        )
    }
}