import React, {Component} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from "react-native";
import Modal from "react-native-modal";
import * as Progress from 'react-native-progress';
import {DownloadableModels, PostFeed} from '../components/container'
import firebase from "react-native-firebase";

export default class ModelsDownloadScreen extends Component {

    state = {
        isUploadModalVisible: false,
        downloadProgress: 0,
    };
    toggleUploadModal = () => {
        this.setState({ isUploadModalVisible: !this.state.isUploadModalVisible });
    };

    remoteDiagnosis = async()=>{

    }

    localDiagnosis = async ()=>{
    };





    render() {

        return (
            <View style={{flex: 1}}>
                <Modal style={{ flex: 1,
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center'}} isVisible={this.state.isUploadModalVisible}>
                    <View><Progress.Circle  progress={this.state.uploadProgress} size={200} showsText={true} />
                        <Text style={{color: "#FFFF00"}}>Uploading Image !</Text></View>
                </Modal>

                    <View style={styles.navBar}>
                        <Text>Models download</Text>
                    </View>
                    <DownloadableModels/>


            </View>
        );
    }
}
const styles = StyleSheet.create({
    navBar:{
        width: 100+"%",
        height: 56,
        marginTop: 20,
        backgroundColor:"rgb(250,250,250)",
        borderBottomColor:"rgb(233,233,233)",
        borderBottomWidth: StyleSheet.hairlineWidth,
        justifyContent: "center",
        alignItems: "center"
    }
});