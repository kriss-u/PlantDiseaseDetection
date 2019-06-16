import React, {Component} from 'react';
import {
    Image,
    View,
    Text,
    Dimensions,
    TouchableOpacity,
} from "react-native";
import Modal from "react-native-modal";
import * as Progress from 'react-native-progress';
import { CheckBox } from 'react-native-elements'
import firebase from "react-native-firebase";
import uuid from 'uuid';
import Tflite from 'tflite-react-native';
let tflite = new Tflite();
export default class ImageScreen extends Component {

    state = {
        isUploadModalVisible: false,
        isPredictionModalVisible: false,
        uploadProgress: 0,
    };
    toggleUploadModal = () => {
        this.setState({ isUploadModalVisible: !this.state.isUploadModalVisible });
    };
    togglePredictionModal = () => {
        this.setState({ isPredictionModalVisible: !this.state.isPredictionModalVisible });
    };

    remoteDiagnosis = async(photo)=>{
        this.toggleUploadModal()
        await this.handleRemoteDiagnosis(photo)
    }
    predict(path) {
        let modelFile = `${firebase.storage.Native.DOCUMENT_DIRECTORY_PATH}/models/Apple_mixed_inception_resnet_se.tflite`;
        let labelsFile = `${firebase.storage.Native.DOCUMENT_DIRECTORY_PATH}/labels/Apple_mixed_inception_resnet_se.txt`;

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
                    this.togglePredictionModal();
                        res.map((res) => {
                            console.log(res)
                        })
            });

    }


    localDiagnosis = async (photo)=>{
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
                this.setState({uploadProgress: progress})
                if (snapshot.state === firebase.storage.TaskState.SUCCESS) {
                    //predict
                }
            },
            (error) => {
                unsubscribe();
                console.error(error);
            },()=>{
                console.log(name)
                this.predictOnline(name)
            })
            }

    predictOnline(name){
        this.toggleUploadModal();
        this.togglePredictionModal();
        fetch('https://lit-temple-63394.herokuapp.com/disease/unknown/'+name, {
            method: 'GET'
            //Request Type
        })
            .then((response) => response.json())
            //If response is in json then in success
            .then((responseJson) => {
                //Success
                this.togglePredictionModal()
                console.log(responseJson);
            })
            //If response is not in json then in error
            .catch((error) => {
                //Error
                this.togglePredictionModal()
                console.error(error);
            });
    }
    predictOffline(uri){
        this.predict(uri)
    }

    render() {
        let {height, width} = Dimensions.get('window');
        let photoToBeChecked = this.props.navigation.state.params.photoss;
        return (
          <View style={{flex: 1}}>
              <Image
                  style={{flex: 1,
                  height: height,
                  width: width }}
                  source={{uri:photoToBeChecked.uri}}/>

              <CheckBox
                  title='I know the species'
                  checked={this.state.checked}
                  onPress={() => this.setState({checked: !this.state.checked})}
              />
              <Modal style={{ flex: 1,
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center'}} isVisible={this.state.isUploadModalVisible}>
                  <View><Progress.Circle  progress={this.state.uploadProgress} size={200} showsText={true} />
                      <Text style={{color: "#FFFF00"}}>Uploading Image !</Text></View>
              </Modal>
              <Modal onModalShow={async () =>await this.localDiagnosis(photoToBeChecked.uri)} style={{ flex: 1,
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center'}} isVisible={this.state.isPredictionModalVisible}>
                  <View><Progress.CircleSnail indeterminateAnimationDuration={200} size={200} color={[ 'blue']} />
                      <Text style={{color: "#FFFF00"}}>Diagnosing Image !</Text></View>
              </Modal>
              <View style={{flexDirection: 'row', height: 100}}>
              <TouchableOpacity style={{flex: 1, backgroundColor: '#6000FF', justifyContent: 'center', alignItems: 'center', borderColor: '#FFFFFF'}}
                                onPress={() => this.props.navigation.goBack()}>
                  <Text style={{color: '#FFFFFF'}}>
                      Cancel
                  </Text>
              </TouchableOpacity>
              <TouchableOpacity style={{flex: 1, backgroundColor: '#6000FF', justifyContent: 'center', alignItems: 'center'}}
                                onPress={() =>this.remoteDiagnosis(photoToBeChecked.uri)}>
                  <Text style={{color: '#FFFFFF'}}>
                      Remote Diagnosis
                  </Text>
              </TouchableOpacity>
                  <TouchableOpacity style={{flex: 1, backgroundColor: '#6000FF', justifyContent: 'center', alignItems: 'center'}}
                                    onPress={() =>{alert('predicting'),
                                        this.togglePredictionModal()}}>
                      <Text style={{color: '#FFFFFF'}}>
                          Local Diagnosis
                      </Text>
                  </TouchableOpacity>
              </View>

          </View>
        );
    }
}
