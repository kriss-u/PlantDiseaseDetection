import React, { Component } from 'react';
import {
    Image,
    View,
    Text,
    Dimensions,
    TouchableOpacity, FlatList, AsyncStorage
} from "react-native";
import Modal from "react-native-modal";
import * as Progress from 'react-native-progress';
import { CheckBox, ListItem, SearchBar } from 'react-native-elements'
import firebase from "react-native-firebase";
import uuid from 'uuid';
import Tflite from 'tflite-react-native';
import { NavigationEvents } from 'react-navigation';

let tflite = new Tflite();

export default class ImageScreen extends Component {
    constructor() {
        super()
        this.state = {
            whole_data: [],
            isUploadModalVisible: false,
            isPredictionModalVisible: false,
            isDiseaseModalVisible: false,
            uploadProgress: 0,
            data: [],
            diseaseData: [],
            error: null,
            isSpeciesSelectionModalVisible: false,
            species: "unknown",
            modelName: "unknown",
            checked: false,
        };
        this.arrayholder = [];
    }

    componentDidMount() {
        this.getDownloadedModelsList();
    }
    toggleChecked = () => {
        this.setState({ checked: !this.state.checked })
    }

    toggleSpeciesSelectionModal = () => {
        if (this.state.checked === false || this.state.isSpeciesSelectionModalVisible === true) {
            this.setState({ isSpeciesSelectionModalVisible: !this.state.isSpeciesSelectionModalVisible });
        }
        else {
            this.setState({ species: "unknown", modelName: "unknown" })
        }
    };
    getDownloadedModelsList = () => {
        try {
            AsyncStorage.getAllKeys((err, keys) => {
                AsyncStorage.multiGet(keys, (err, stores) => {
                    stores.map((result, i, store) => {
                        // get at each store's value so you can work with it
                        let value = JSON.parse(store[i][1]);
                        this.arrayholder.push(value);
                    });
                });
            });
            this.setState({
                data: this.arrayholder,
            });
        } catch (error) {

        };

    };

    renderSeparator = () => {
        return (
            <View
                style={{
                    height: 1,
                    width: '86%',
                    backgroundColor: '#CED0CE',
                    marginLeft: '14%',
                }}
            />
        );
    };

    searchFilterFunction = text => {
        this.setState({
            value: text,
        });

        const newData = this.arrayholder.filter(item => {
            const itemData = `${item.name.toUpperCase()}  ${item.modelName.toUpperCase()}`;
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1;
        });
        this.setState({
            data: newData,
        });
    };

    renderHeader = () => {
        return (
            <SearchBar
                placeholder="Search Model..."
                lightTheme
                round
                onChangeText={text => this.searchFilterFunction(text)}
                autoCorrect={false}
                value={this.state.value}
            />
        );
    };
    toggleUploadModal = () => {
        this.setState({ isUploadModalVisible: !this.state.isUploadModalVisible });
    };
    togglePredictionModal = () => {
        this.setState({ isPredictionModalVisible: !this.state.isPredictionModalVisible });
    };
    toggleDiseaseModal = () => {
        this.setState({ isDiseaseModalVisible: !this.state.isDiseaseModalVisible });
    };
    selectSpecies = (item) => {
        this.setState({ species: `${item.name}`, modelName: `${item.modelName}` })
        this.toggleSpeciesSelectionModal()
    }
    selectDisease = (item) => {
        this.setState({
            diseases: `${item}`
        })
        this.toggleDiseaseModal()
    }

    remoteDiagnosis = async (photo) => {
        this.toggleUploadModal()
        await this.handleRemoteDiagnosis(photo)
    }

    localDiagnosis = async (photo) => {
        await this.predictOffline(photo);
    };

    handleRemoteDiagnosis = async (uri) => {
        const name = uuid.v4()
        const ref = firebase.storage().ref("/images").child(name);
        const unsubscribe = ref.putFile(uri).on(
            firebase.storage.TaskEvent.STATE_CHANGED,
            (snapshot) => {
                console.log(snapshot.bytesTransferred);
                let progress = (snapshot.bytesTransferred / snapshot.totalBytes);
                this.setState({ uploadProgress: progress })
                if (snapshot.state === firebase.storage.TaskState.SUCCESS) {
                    //predict
                }
            },
            (error) => {
                unsubscribe();
                console.error(error);
            }, () => {
                this.setState({ uploadProgress: 0 })
                this.predictOnline(name)
            })
    }

    predictOnline = (name) => {
        this.toggleUploadModal();
        this.togglePredictionModal();
        fetch('https://lit-temple-63394.herokuapp.com/disease/' + this.state.species + '/' + name, {
            method: 'GET'
            //Request Type
        })
            .then((response) => response.json())
            //If response is in json then in success
            .then((responseJson) => {
                //Success
                this.setState({
                    diseaseData: responseJson
                })
                this.toggleDiseaseModal()
                this.togglePredictionModal()
            })
            //If response is not in json then in error
            .catch((error) => {
                //Error
                this.togglePredictionModal()
                console.error(error);
            });
    }
    predictOffline(uri) {
        this.predict(uri)
    }
    predict(path) {
        let modelFile = `${firebase.storage.Native.DOCUMENT_DIRECTORY_PATH}/models/` + this.state.modelName + '.tflite';
        let labelsFile = `${firebase.storage.Native.DOCUMENT_DIRECTORY_PATH}/labels/` + this.state.modelName + '.txt';

        tflite.loadModel({
            model: modelFile,
            labels: labelsFile,
        },
            (err, res) => {
                if (err)
                    console.log(err);
                else
                    console.log(res);
            });
        tflite.runModelOnImage({
            path,
            imageMean: 0.0,
            imageStd: 255.0,
            numResults: 4,
            threshold: 0.05
        },
            (err, res) => {
                if (err)
                    console.log(err);
                else
                    res.map((res) => {
                        let name

                        let ref = firebase.database().ref("species/");
                        let query = ref.orderByChild("common_name")
                            .equalTo(this.state.species)
                        query.on("value", function (snapshot) {
                            snapshot.forEach(function (child) {
                                if (res.label !== 'h') {
                                    var diseaseDetail = child.val().diseases.filter(function (disease) {
                                        return disease.id === res.label
                                    })
                                }
                                name = diseaseDetail[0].common_name
                                console.log(name);
                            });
                        });

                        alert(name + ':' + res.confidence)
                    })
            });

    }

    render() {
        let { height, width } = Dimensions.get('window');
        let photoToBeChecked = this.props.navigation.state.params.photoss;
        return (
            <View style={{ flex: 1 }}>
                <Image
                    style={{
                        flex: 1,
                        height: height,
                        width: width
                    }}
                    source={{ uri: photoToBeChecked.uri }} />

                <CheckBox
                    title='I know the species'
                    checked={this.state.checked}
                    onPress={() => { this.toggleChecked(); this.toggleSpeciesSelectionModal() }}
                />
                <Modal onBackdropPress={() => this.toggleSpeciesSelectionModal()} style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center'
                }} isVisible={this.state.isSpeciesSelectionModalVisible}>
                    <FlatList style={{ flex: 1 }}
                        data={this.state.data}
                        renderItem={({ item }) => (
                            <ListItem onPress={() => this.selectSpecies(item)}
                                // leftAvatar={{ source: { uri: item.picture.thumbnail } }}
                                title={`${item.name}`}
                                subtitle={item.modelName}
                            />
                        )}
                        keyExtractor={item => item.modelName}
                        ItemSeparatorComponent={this.renderSeparator}
                        ListHeaderComponent={this.renderHeader}
                    />
                </Modal>
                <Modal style={{
                    flex: 1,
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center'
                }} isVisible={this.state.isUploadModalVisible}>
                    <View><Progress.Circle progress={this.state.uploadProgress} size={200} showsText={true} />
                        <Text style={{ color: "#FFFF00" }}>Uploading Image !</Text></View>
                </Modal>
                <Modal style={{
                    flex: 1,
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center'
                }} isVisible={this.state.isPredictionModalVisible}>
                    <View><Progress.CircleSnail indeterminateAnimationDuration={200} size={200} color={['blue']} />
                        <Text style={{ color: "#FFFF00" }}>Diagnosing Image !</Text></View>
                </Modal>
                <Modal style={{
                    flex: 1,
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center'
                }} isVisible={this.state.isDiseaseModalVisible}>
                    <View style={{
                        width: 300,
                        height: 300
                    }}>
                        <FlatList style={{ flex: 1 }}
                            data={this.state.diseaseData}
                            renderItem={({ item }) => (
                                <ListItem onPress={() => this.selectDisease(item)}
                                    // leftAvatar={{ source: { uri: item.picture.thumbnail } }}
                                    title={`${item}`}
                                // subtitle={item.modelName}
                                />
                            )}
                            keyExtractor={item => item[2][0]}
                            ItemSeparatorComponent={this.renderSeparator}
                            ListHeaderComponent={this.renderHeader}
                        /></View>
                </Modal>
                <View style={{ flexDirection: 'row', height: 100 }}>
                    <TouchableOpacity style={{ flex: 1, backgroundColor: '#6000FF', justifyContent: 'center', alignItems: 'center', borderColor: '#FFFFFF' }}
                        onPress={() => this.props.navigation.goBack()}>
                        <Text style={{ color: '#FFFFFF' }}>
                            Cancel
                  </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ flex: 1, backgroundColor: '#6000FF', justifyContent: 'center', alignItems: 'center' }}
                        onPress={() => this.remoteDiagnosis(photoToBeChecked.uri)}>
                        <Text style={{ color: '#FFFFFF' }}>
                            Remote Diagnosis
                  </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ flex: 1, backgroundColor: '#6000FF', justifyContent: 'center', alignItems: 'center' }}
                        onPress={() => {
                            alert('predicting'),
                                this.localDiagnosis(photoToBeChecked.uri)
                        }}>
                        <Text style={{ color: '#FFFFFF' }}>
                            Local Diagnosis
                      </Text>
                    </TouchableOpacity>
                </View>

            </View>
        );
    }
}
