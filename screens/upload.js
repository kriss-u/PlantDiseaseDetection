import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import uuid from 'uuid';
import firebase from 'react-native-firebase'
const options = {
    title: 'Select Image',
    storageOptions: {
        skipBackup: true,
        path: 'images'
    }
};

export default class App extends Component {
    state = {
        imgSource: ''
    };
    /**
     * Select image method
     */

    pickImage = async() => {
        // Launch Camera:
        ImagePicker.launchCamera(options, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                const source = {uri: response.uri};
                this.setState({
                    result: source,
                })
            }
        });

        if (!this.state.result) {
            console.log(this.state.result.uri)
            await this.uploadImage(this.state.result.uri,uuid.v4());
        }
    };
    uploadImage = async(uri,name) => {
        const blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function() {
                resolve(xhr.response);
            };
            xhr.onerror = function(e) {
                console.log(e);
                reject(new TypeError('Network request failed'));
            };
            xhr.responseType = 'blob';
            xhr.open('GET', uri, true);
            xhr.send(null);
        });


        let uploadTask = firebase
            .storage()
            .ref()
            .child(name).putFile(blob);
        uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
            function(snapshot) {
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                switch (snapshot.state) {
                    case firebase.storage.TaskState.PAUSED: // or 'paused'
                        console.log('Upload is paused');
                        break;
                    case firebase.storage.TaskState.RUNNING: // or 'running'
                        console.log('Upload is running');
                        break;
                }
            }, function(error) {

                // A full list of error codes is available at
                // https://firebase.google.com/docs/storage/web/handle-errors
                switch (error.code) {
                    case 'storage/unauthorized':
                        // User doesn't have permission to access the object
                        break;

                    case 'storage/canceled':
                        // User canceled the upload
                        break;



                    case 'storage/unknown':
                        // Unknown error occurred, inspect error.serverResponse
                        break;
                }
            }, function() {
                // Upload completed successfully, now we can get the download URL
                uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                    console.log('File available at', downloadURL);
                });
            })
        // We're done with the blob, close and release it



    }


    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>React Native Firebase Image Upload </Text>
                <Text style={styles.instructions}>Hello 👋, Let us upload an Image</Text>
                {/** Select Image button */}
                <TouchableOpacity style={styles.btn} onPress={this.pickImage}>
                    <View>
                        <Text style={styles.btnTxt}>Pick image</Text>
                    </View>
                </TouchableOpacity>
                {/** Display selected image */}
                {this.state.imgSource ? (
                    <Image
                        source={this.state.imgSource}
                        style={styles.image}
                    />
                ) : (
                    <Text>Select an Image!</Text>
                )}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF'
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5
    },
    btn: {
        borderWidth: 1,
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 10,
        paddingBottom: 10,
        borderRadius: 20,
        borderColor: 'rgba(0,0,0,0.3)',
        backgroundColor: 'rgb(68, 99, 147)'
    },
    btnTxt: {
        color: '#fff'
    },
    image: {
        marginTop: 20,
        minWidth: 200,
        height: 200
    }
});