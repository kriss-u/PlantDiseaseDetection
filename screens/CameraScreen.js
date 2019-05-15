import React, {Component} from 'react';
import {CameraRoll, StyleSheet, Text, TouchableOpacity, View, StatusBar } from 'react-native';
import {Camera, FileSystem, Permissions } from 'expo';
import { Ionicons } from '@expo/vector-icons';

export default class CameraScreen extends Component {
    state = {
        hasPermission: null,
        type: Camera.Constants.Type.back,
    };

    async componentDidMount() {
        const {status} = await Permissions.askAsync(Permissions.CAMERA, Permissions.CAMERA_ROLL);
        this.setState({
            hasPermission: status === 'granted',
        });
        FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'photos').catch(e => {
            console.log(e, 'Directory exists');
        });
    }

    takePicture() {
        if (this.camera) {
            this.camera.takePictureAsync({onPictureSaved: this.isPictureOkay});
        }
    };

    isPictureOkay = async photo => {
        // console.log(photo)
        const {navigate} = this.props.navigation;
        navigate('Imagee',
            { photoss: photo });
    }

    renderBottomBar = () =>
        <View
            style={styles.bottomBar}>
            <View style={{flex: 0.4}}>
                <TouchableOpacity
                    onPress={() => this.takePicture()}
                    style={{alignSelf: 'center'}}
                >
                    <Ionicons name="ios-radio-button-on" size={70} color="white"/>
                </TouchableOpacity>
            </View>
        </View>

    render() {
        const {hasPermission} = this.state;
        if (hasPermission === null) {
            return <View/>;
        } else if (hasPermission === false) {
            return <Text>Give all accesses</Text>;
        } else {
                return (
                    <View style={{flex: 1}}>
                        <Camera style={{flex:1}}
                            ref={(ref) => { this.camera = ref; }}
                            type={this.state.type}>
                        <View
                            style={{
                                flex: 1,
                                backgroundColor: 'transparent',
                                flexDirection: 'row',
                            }}>
                            <TouchableOpacity
                                style={{
                                    flex: 0.1,
                                    alignSelf: 'flex-end',
                                    alignItems: 'center',
                                }}
                                onPress={() => {
                                    this.setState({
                                        type: this.state.type === Camera.Constants.Type.back
                                            ? Camera.Constants.Type.front
                                            : Camera.Constants.Type.back,
                                    });
                                }}>
                                <Text
                                    style={{fontSize: 18, marginBottom: 10, color: 'white'}}>
                                    {' '}Flip{' '}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        {this.renderBottomBar()}
                    </Camera>
                </View>
                );
            }
        }
    }

    const
    styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: '#000',
        },
        camera: {
            flex: 1,
            justifyContent: 'space-between',
        },
        bottomBar: {
            paddingBottom: 0,
            backgroundColor: 'transparent',
            alignSelf: 'flex-end',
            justifyContent: 'space-between',
            flex: 0.12,
            flexDirection: 'row',
        },
    });