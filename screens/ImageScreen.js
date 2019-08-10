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
import NetInfo from "@react-native-community/netinfo";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { showInternetConnectedToast, showNoInternetToast } from "../components/container/DownloadableModels";

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
            diseaseDetail: [],
            disease: '',
            error: null,
            isSpeciesSelectionModalVisible: false,
            species: "unknown",
            modelName: "unknown",
            checked: false,
            isInternetConnected: true
        };
        this.arrayholder = [];
    }

    componentDidMount() {
        this.getDownloadedModelsList();
        NetInfo.addEventListener(state => {
            this.setState({
                isInternetConnected: state.isInternetReachable
            });
            if (state.isInternetReachable) {
                showInternetConnectedToast();
            } else {
                showNoInternetToast();
            }
        });
    }
    componentWillUnmount() {
        NetInfo.removeEventListener('connectionChange');
    }

    toggleChecked = () => {
        this.setState({ checked: !this.state.checked })
    }

    toggleSpeciesSelectionModal = () => {
        if (this.state.checked === false || this.state.isSpeciesSelectionModalVisible === true) {
            this.setState({ isSpeciesSelectionModalVisible: !this.state.isSpeciesSelectionModalVisible });
        } else {
            this.setState({ species: "unknown", modelName: "unknown" })
        }
    };
    getDownloadedModelsList = async () => {
        try {
            AsyncStorage.getAllKeys((err, keys) => {
                AsyncStorage.multiGet(keys, (err, stores) => {
                    console.log(stores)
                    stores.map((result, i, store) => {
                        // get at each store's value so you can work with it
                        let value = JSON.parse(store[i][1]);
                        if (value.name !== undefined) {
                            this.arrayholder.push(value);
                        }
                    });
                });
            });
            this.setState({
                data: this.arrayholder,
            });
        } catch (error) {

        }

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
        this.toggleChecked()
    };
    selectDisease = (item) => {
        // console.log(item)
        const { navigate } = this.props.navigation;
        this.toggleDiseaseModal()
        navigate('Output', {
            result: item
        })
    };

    remoteDiagnosis = async (photo) => {
        if (this.state.isInternetConnected) {
            this.toggleUploadModal();
            await this.handleRemoteDiagnosis(photo)
        } else {
            showNoInternetToast();
        }
    };

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
                // console.log(responseJson)
                let response = responseJson
                let array = []
                console.log(responseJson)
                response.forEach(data => {
                    let object = {}
                    object.species = data[2][0]
                    if (data[0] === "h") {
                        object.disease = "Healthy"
                    } else {
                        object.disease = data[0]
                    }
                    object.diseaseConfidence = data[1]
                    object.speciesConfidence = data[2][1]
                    array.push(object)
                })
                this.setState({
                    diseaseData: array
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
                else {
                    let array = []
                    console.log(res)
                    res.forEach((res) => {
                        let object = {}
                        object.disease = (res.label === "h" ? "Healthy" : res.label)
                        object.species = this.state.modelName.split('_')[0]
                        object.speciesConfidence = 1
                        object.diseaseConfidence = res.confidence
                        array.push(object)
                        // console.log(res)
                    })
                    this.setState({
                        diseaseData: array
                    })
                    this.togglePredictionModal()
                    this.toggleDiseaseModal()
                }
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
                    onPress={() => {
                        this.state.checked ? this.toggleChecked() : null;
                        this.toggleSpeciesSelectionModal()
                    }}
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
                                      leftAvatar={{ source: { uri: item.image } }}
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
                                    title={`${item.species} Confidence: ${item.speciesConfidence}`}
                                    subtitle={`${item.disease} Confidence: ${item.diseaseConfidence}`}
                                />
                            )}
                            keyExtractor={item => item.disease}
                            ItemSeparatorComponent={this.renderSeparator}
                        /></View>
                </Modal>
                <View style={{ flexDirection: 'row', height: 100 }}>
                    <TouchableOpacity style={{
                        flex: 1,
                        backgroundColor: '#990000',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderColor: '#FFFFFF'
                    }}
                        onPress={() => this.props.navigation.goBack()}>
                        <Icon
                            name="close-box"
                            color="white"
                            size={50}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{ flex: 1, backgroundColor: '#009900', justifyContent: 'center', alignItems: 'center' }}
                        onPress={() => this.remoteDiagnosis(photoToBeChecked.uri)}>
                        <Icon
                            name="wifi"
                            color="white"
                            size={40}
                        />
                        <Text style={{ color: '#FFFFFF' }}>
                            Remote Diagnosis
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        disabled={!this.state.checked}
                        style={{ flex: 1, backgroundColor: `${this.state.checked ? '#009900' : '#D3D3D3'}`, justifyContent: 'center', alignItems: 'center' }}
                        onPress={() => {
                            this.togglePredictionModal(),
                                setTimeout(() => this.localDiagnosis(photoToBeChecked.uri), 2000)
                        }}>
                        <Icon
                            name="wifi-off"
                            color="white"
                            size={40}
                        />
                        <Text style={{ color: `${this.state.checked ? '#FFFFFF' : '#000000'}` }}>
                            Local Diagnosis
                        </Text>
                    </TouchableOpacity>
                </View>

            </View>
        );
    }
}
