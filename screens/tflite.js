import React, {Component} from 'react';
import Tflite from 'tflite-react-native';
let tflite = new Tflite();
export default class tflites extends Component{
        static download() {
            // Create a reference to the file we want to download
            const path = `${firebase.storage.Native.DOCUMENT_DIRECTORY_PATH}/models/Apple_mixed_inception_resnet_se.tflite`;
            console.log(path)
            const ref = firebase.storage().ref('/models/Apple_mixed_inception_resnet_se.tflite');

            const unsubscribe = ref.downloadFile(path).on(
                firebase.storage.TaskEvent.STATE_CHANGED,
                (snapshot) => {
                    console.log(snapshot.bytesTransferred);
                    console.log(snapshot.totalBytes);
                    if (snapshot.state === firebase.storage.TaskState.SUCCESS) {
                        // complete
                    }
                },
                (error) => {
                    unsubscribe();
                    console.error(error);
                })
        }
     static predict(path) {
        var modelFile = `${firebase.storage.Native.DOCUMENT_DIRECTORY_PATH}/models/Apple_mixed_inception_resnet_se.tflite`;
        var labelsFile = 'Android/data/Models/mobilenet_v1_1.0_224.txt';

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
                        imageMean: 128.0,
                        imageStd: 128.0,
                        numResults: 3,
                        threshold: 0.05
                    },
                    (err, res) => {
                        if (err)
                            console.log(err);
                        else
                            this.setState({ recognitions: res });
                    });
        const {recognitions} = this.state;

        recognitions.map((res) => {


                   console.log( res["label"] + "-" + (res["confidence"] * 100).toFixed(0) + "%")

            })
    }



}

