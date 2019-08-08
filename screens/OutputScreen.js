import React, { Component } from 'react';
import { View, FlatList, ScrollView } from 'react-native';
import firebase from "react-native-firebase";
import NetInfo from "@react-native-community/netinfo";
import { ListItem, Text } from 'react-native-elements';

export default class OutputScreen extends Component {
    constructor() {
        super()
        this.state = {
            disease: {},
            species: {},
            isInternetConnected: false,
            isDescriptionVisible: false,
            isCauseVisible: false,
            isControlVisible: false,
            isSymptomsVisible: false
        };
    }

    componentWillMount() {
        NetInfo.addEventListener(state => {
            this.setState({
                isInternetConnected: state.isInternetReachable
            })
        })
    }

    getDiseaseData = () => {
        if (this.state.isInternetConnected) {
            console.log('online')
            let disease = this.props.navigation.state.params.result
            let diseaseDetail
            let species = disease.species
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
                    // name = diseaseDetail[0].common_name
                    // console.log(name)
                    this.setState({
                        disease: diseaseDetail[0] !== "undefined" ? diseaseDetail[0] : '',
                        species: species
                    })
                });
            });
        } else {
            console.log('offline')
        }
        // console.log(JSON.stringify(this.props.navigation.state.params.result))

    }

    componentDidMount() {
        this.getDiseaseData()
    }

    toggleDescription = () => {
        this.setState({
            isDescriptionVisible: !this.state.isDescriptionVisible
        })
    }

    toggleCause = () => {
        this.setState({
            isCauseVisible: !this.state.isCauseVisible
        })
    }

    toggleControl = () => {
        this.setState({
            isControlVisible: !this.state.isControlVisible
        })
    }

    toggleSymptoms = () => {
        this.setState({
            isSymptomsVisible: !this.state.isSymptomsVisible
        })
    }

    renderSeparator = () => {
        return (
            <View
                style={{
                    height: 1,
                    width: '100%',
                    backgroundColor: '#CED0CE'
                }}
            />
        );
    };

    render() {
        let i = 1;
        return (
            <ScrollView>
                <View>
                    <FlatList
                        data={[`${this.state.species.common_name}`]}
                        renderItem={({ item }) =>
                            <ListItem

                                title={<Text h2>About Species:</Text>}
                            ></ListItem>}
                        keyExtractor={item => item}
                    />

                    {this.renderSeparator()}
                    <FlatList
                        data={[`${this.state.species.common_name}`]}
                        renderItem={({ item }) =>
                            <ListItem

                                title={<Text><Text h4>Common Name: </Text> <Text style={{ fontSize: 20 }}>{item}</Text></Text>}
                            ></ListItem>}
                        keyExtractor={item => item}
                    />

                    {this.renderSeparator()}
                    <FlatList
                        data={[`${this.state.species.scientific_name}`]}
                        renderItem={({ item }) =>
                            <ListItem

                                title={<Text><Text h4>Scientific Name: </Text><Text style={{ fontSize: 20 }}>{item}</Text></Text>}
                            ></ListItem>}
                        keyExtractor={item => item}
                    />

                    {this.renderSeparator()}
                    <FlatList
                        data={[`${this.state.species.description}`]}
                        renderItem={({ item }) =>
                            <ListItem

                                title={<Text><Text h4>Description:</Text> <Text style={{ fontSize: 20 }}>(Touch for detail)</Text></Text>}
                                onPress={() => this.toggleDescription()}
                            ></ListItem>}
                        keyExtractor={item => item}
                    />
                    {this.state.isDescriptionVisible ? <FlatList
                        data={[`${this.state.species.description}`]}
                        renderItem={({ item }) =>
                            <ListItem

                                title={<Text style={{ fontSize: 20 }}>{item}</Text>}
                            ></ListItem>}
                        keyExtractor={item => item}
                    /> : null}
                    {this.renderSeparator()}
                    {this.renderSeparator()}
                    {
                        this.props.navigation.state.params.result.disease !== 'Healthy' ?
                            <View>
                                <FlatList
                                    data={[`${this.state.disease.common_name}`]}
                                    renderItem={({ item }) =>
                                        <ListItem

                                            title={<Text h2>About Disease:</Text>}
                                        ></ListItem>}
                                    keyExtractor={item => item}
                                />
                                {this.renderSeparator()}
                                <FlatList
                                    data={[`${this.state.disease.common_name}`]}
                                    renderItem={({ item }) =>
                                        <ListItem

                                            title={<Text><Text h4>Common Name:</Text> <Text style={{ fontSize: 20 }}> {item}</Text></Text>}
                                        ></ListItem>}
                                    keyExtractor={item => item}
                                />
                                {this.renderSeparator()}
                                <FlatList
                                    data={[`${this.state.disease.disease_scientific_name}`]}
                                    renderItem={({ item }) =>
                                        <ListItem

                                            title={<Text><Text h4>Scientific Name:</Text> <Text style={{ fontSize: 20 }}>{item}</Text></Text>}
                                        ></ListItem>}
                                    keyExtractor={item => item}
                                />
                                {this.renderSeparator()}
                                <FlatList
                                    data={[`${this.state.disease.cause}`]}
                                    renderItem={({ item }) =>
                                        <ListItem

                                            title={<Text><Text h4>Cause:</Text> <Text style={{ fontSize: 20 }}>(Touch for detail)</Text></Text>}
                                            onPress={() => this.toggleCause()}
                                        ></ListItem>}
                                    keyExtractor={item => item}
                                />
                                {this.state.isCauseVisible ?
                                    <FlatList
                                        data={[`${this.state.disease.cause}`]}
                                        renderItem={({ item }) =>
                                            <ListItem

                                                title={<Text style={{ fontSize: 20 }}>{item} </Text>}
                                            ></ListItem>}
                                        keyExtractor={item => item}
                                    /> : null}
                                {this.renderSeparator()}
                                <FlatList
                                    data={[`${this.state.disease.symptoms}`]}
                                    renderItem={({ item }) =>
                                        <ListItem

                                            title={<Text><Text h4>Symptoms:</Text> <Text style={{ fontSize: 20 }}>(Touch for detail)</Text></Text>}
                                            onPress={() => this.toggleSymptoms()}
                                        ></ListItem>}
                                    keyExtractor={item => item}
                                />
                                {this.state.isSymptomsVisible ?
                                    <FlatList
                                        data={[`${this.state.disease.symptoms}`]}
                                        renderItem={({ item }) =>
                                            <ListItem

                                                title={<Text style={{ fontSize: 20 }}>{item} </Text>}
                                            ></ListItem>}
                                        keyExtractor={item => item}
                                    /> : null}
                                {this.renderSeparator()}
                                <FlatList
                                    data={[`${this.state.disease.control}`]}
                                    renderItem={({ item }) =>
                                        <ListItem

                                            title={<Text><Text h4>Control:</Text> <Text style={{ fontSize: 20 }}>(Touch for detail)</Text></Text>}
                                            onPress={() => this.toggleControl()}
                                        ></ListItem>}
                                    keyExtractor={item => item}
                                />
                                {this.state.isControlVisible ?
                                    <FlatList
                                        data={[`${this.state.disease.control}`]}
                                        renderItem={({ item }) =>
                                            <ListItem

                                                title={<Text style={{ fontSize: 20 }}>{item} </Text>}
                                            ></ListItem>}
                                        keyExtractor={item => item}
                                    /> : null}
                                {this.renderSeparator()}
                            </View> :
                            <View>
                                <FlatList
                                    data={[`${this.state.species.common_name}`]}
                                    renderItem={({ item }) =>
                                        <ListItem

                                            title={<Text h2>Your Plant is totally healthy</Text>}
                                        ></ListItem>}
                                    keyExtractor={item => item}
                                />
                                {this.renderSeparator()}
                            </View>
                    }
                </View >
            </ScrollView>
        )
    }
}