import React, {Component} from 'react';
import {View, Text, FlatList, ActivityIndicator, StyleSheet, AsyncStorage, ToastAndroid} from 'react-native';
import {ListItem, SearchBar} from 'react-native-elements';
import firebase from 'react-native-firebase'
import Modal from "react-native-modal";
import NetInfo from "@react-native-community/netinfo";

import * as Progress from 'react-native-progress';

function showInternetConnectedToast() {
    ToastAndroid.showWithGravity('Internet Connected!', ToastAndroid.SHORT, ToastAndroid.CENTER)
}

function showNoInternetToast() {
    ToastAndroid.showWithGravity('No Internet Connection!', ToastAndroid.SHORT, ToastAndroid.CENTER)
}

export default class DownloadableModels extends Component {


    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            isInternetConnected: true,
            data: [],
            error: null,
            isDownloadModalVisible: false,
            downloadProgress: 0,
        };

        this.arrayholder = [];
    }

    componentDidMount() {
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
        if (!Array.isArray(this.state.data) || !this.state.data.length) {
            this.makeRemoteRequest();
        }
    }

    componentWillMount() {
        if (!Array.isArray(this.state.data) || !this.state.data.length && this.state.isInternetConnected) {
            this.makeRemoteRequest();
        }

    }

    toggleDownloadModal = () => {
        this.setState({isDownloadModalVisible: !this.state.isDownloadModalVisible});
    };

    makeRemoteRequest = () => {
        this.setState({loading: true});
        try {
            firebase.database().ref('models/').on('value', (snapshot) => {
                let x = {};
                x.a = snapshot.val();
                let res = Object.values(x)[0];
                this.setState({
                    data: res,
                    loading: false,
                });
                console.log(res);
                this.arrayholder = res
            })
        } catch (error) {
            this.setState({error, loading: false});
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

    download(item) {
        if (this.state.isInternetConnected) {
            this.toggleDownloadModal();
            // Create a reference to the file we want to download
            const path = `${firebase.storage.Native.DOCUMENT_DIRECTORY_PATH}/labels/` + item.modelName + ".txt";
            console.log(path)
            const ref = firebase.storage().ref('/labels/' + item.modelName + '.txt');

            const unsubscribe = ref.downloadFile(path).on(
                firebase.storage.TaskEvent.STATE_CHANGED,
                (snapshot) => {
                    console.log(snapshot.bytesTransferred);
                    console.log(snapshot.totalBytes);
                    if (snapshot.state === firebase.storage.TaskState.SUCCESS) {
                        // complete
                        console.log("Complete")
                    }
                },
                (error) => {
                    unsubscribe();
                    console.error(error);
                    this.toggleDownloadModal()
                });
            this.downloadModel(item)
        } else {
            showNoInternetToast()
        }
    }

    downloadModel(item) {
        // Create a reference to the file we want to download
        const path = `${firebase.storage.Native.DOCUMENT_DIRECTORY_PATH}/models/` + item.modelName + '.tflite';
        console.log(path);
        const ref = firebase.storage().ref('/models/' + item.modelName + '.tflite');

        const unsubscribe = ref.downloadFile(path).on(
            firebase.storage.TaskEvent.STATE_CHANGED,
            (snapshot) => {
                console.log(snapshot.bytesTransferred);
                let progress = (snapshot.bytesTransferred / snapshot.totalBytes);
                this.setState({downloadProgress: progress})

                if (snapshot.state === firebase.storage.TaskState.SUCCESS) {
                    // complete
                    // AsyncStorage.clear()
                    AsyncStorage.setItem(`${item.name}`, JSON.stringify(item))
                    this.toggleDownloadModal()
                }
            },
            (error) => {
                unsubscribe();
                console.error(error);
                this.toggleDownloadModal()
            })
    }

    render() {
        if (this.state.loading) {
            return (
                <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                    <ActivityIndicator/>
                </View>
            );
        }
        return (
            <View style={{flex: 1}}>
                <Modal style={{
                    flex: 1,
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center'
                }} isVisible={this.state.isDownloadModalVisible}>
                    <View><Progress.Circle progress={this.state.downloadProgress} size={200} showsText={true}/>
                        <Text style={{color: "#FFFF00"}}>Downloading Model !</Text></View>
                </Modal>
                <FlatList
                    data={this.state.data}
                    renderItem={({item}) => (
                        <ListItem onPress={() => this.download(item)}
                            // leftAvatar={{ source: { uri: item.picture.thumbnail } }}
                                  title={`${item.name}`}
                                  subtitle={item.modelName}
                        />
                    )}
                    keyExtractor={item => item.modelName}
                    ItemSeparatorComponent={this.renderSeparator}
                    ListHeaderComponent={this.renderHeader}
                />
            </View>
        );
    }
}
