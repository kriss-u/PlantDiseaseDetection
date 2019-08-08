import React, {Component} from 'react';
import {
    View,
    Text,
    FlatList,
    ActivityIndicator,
    StyleSheet,
    AsyncStorage,
    ToastAndroid,
    TouchableNativeFeedback
} from 'react-native';
import {ListItem, SearchBar} from 'react-native-elements';
import {TouchableHighlight} from 'react-native';
import firebase from 'react-native-firebase';
import Modal from "react-native-modal";
import NetInfo from "@react-native-community/netinfo";

import * as Progress from 'react-native-progress';

export function showInternetConnectedToast() {
    ToastAndroid.showWithGravity('Internet Connected!', ToastAndroid.SHORT, ToastAndroid.CENTER)
}

export function showNoInternetToast() {
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
            currentItem: ''
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

    componentWillUnmount() {
        NetInfo.removeEventListener('connectionChange');
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
    download = (item) => {
        this.setState({
            currentItem: item.name
        });
        this.downloadLabel(item);
        this.downloadModel(item);
        //save the data related to species
        let ref = firebase.database().ref("species/");
        let query = ref.orderByChild("common_name")
            .equalTo(item.name)
        query.on("value", (snapshot) => {
            console.log(snapshot)
            AsyncStorage.clear()

            AsyncStorage.setItem(`_${item.name}`, JSON.stringify(snapshot._value));

        })
        };

    downloadLabel = (item) => {
        if (this.state.isInternetConnected) {
            /*this.setState({
                isDownloadModalVisible: true
            });*/
            // this.toggleDownloadModal();
            // Create a reference to the file we want to download
            const path = `${firebase.storage.Native.DOCUMENT_DIRECTORY_PATH}/labels/` + item.modelName + ".txt";

            const ref = firebase.storage().ref('/labels/' + item.modelName + '.txt');

            const unsubscribe = ref.downloadFile(path).on(
                firebase.storage.TaskEvent.STATE_CHANGED,
                (snapshot) => {
                    if (snapshot.state === firebase.storage.TaskState.SUCCESS) {
                        // complete
                        /* this.setState({
                             isDownloadModalVisible: false
                         });*/
                        console.log("Complete")
                    }
                },
                (error) => {
                    unsubscribe();
                    console.error(error);
                    this.setState({
                        isDownloadModalVisible: false
                    })
                });
            this.downloadModel(item)
        } else {
            this.setState({
                isDownloadModalVisible: false
            });
            showNoInternetToast()
        }
    };

    downloadModel = (item) => {
        if (this.state.isInternetConnected) {
            this.setState({
                isDownloadModalVisible: true
            });
            // Create a reference to the file we want to download
            const path = `${firebase.storage.Native.DOCUMENT_DIRECTORY_PATH}/models/` + item.modelName + '.tflite';
            const ref = firebase.storage().ref('/models/' + item.modelName + '.tflite');

            const unsubscribe = ref.downloadFile(path).on(
                firebase.storage.TaskEvent.STATE_CHANGED,
                (snapshot) => {
                    let progress = (snapshot.bytesTransferred / snapshot.totalBytes);
                    this.setState({downloadProgress: progress});

                    if (snapshot.state === firebase.storage.TaskState.SUCCESS) {
                        // complete
                        AsyncStorage.setItem(`${item.name}`, JSON.stringify(item));
                        this.setState({
                            isDownloadModalVisible: false
                        });
                    }
                    this.setState({
                        progress: 0
                    })
                },
                (error) => {
                    unsubscribe();
                    console.error(error);
                    this.setState({
                        isDownloadModalVisible: false
                    });
                    // this.toggleDownloadModal()
                });
        } else {
            this.setState({
                isDownloadModalVisible: false
            });
            showNoInternetToast();
        }
    };

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
                <Modal
                    style={{
                        flex: 1,
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                    isVisible={this.state.isDownloadModalVisible}
                    onRequestClose={() => {
                        this.toggleDownloadModal()
                    }}
                >
                    <TouchableNativeFeedback
                        onPress={() => {
                            this.toggleDownloadModal()
                        }}>
                        <View>
                            <Progress.Circle progress={this.state.downloadProgress} size={200} showsText={true}/>
                            <Text style={{color: "#FFFF00"}}>Downloading Model {this.state.currentItem}!</Text>

                        </View>
                    </TouchableNativeFeedback>
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
