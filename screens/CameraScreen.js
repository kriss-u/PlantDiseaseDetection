import React, {Component} from 'react';
import {StyleSheet, Button, View } from 'react-native';
import ImagePicker from "react-native-image-picker"
const options = {
      storageOptions: {
        skipBackup: true,
        path: 'images',
    },
};
export default class CameraScreen extends Component {
     openCamera(){
        // Launch Camera:
        ImagePicker.launchCamera(options, (response) => {
            // Same code as in above section!
            console.log(response.uri)
            const source = {uri: response.uri};
            this.setState({
                photo: source,
            })
            const {navigate} = this.props.navigation;
            navigate('Imagee',
                { photoss: this.state.photo });
        });
    }

     openGallery(){
        // Open Image Library:
        ImagePicker.launchImageLibrary(options, (response) => {
            // Same code as in above section!
        });
    }
    onPictureSaved = async photo => {
        alert('Uploading');
        CameraRoll.saveToCameraRoll(photo.uri, 'photo');
        this.uploadPicture(await CameraRoll.getPhotos({first:1})
            .then((r) => {return r.edges[0].node}));
    }

    

    render() {
        
            return (
                <View style={styles.container} >
                    <Button title="Camera" onPress={() => this.openCamera()}/>
                    <Button title="Gallery" onPress={() => this.openGallery()}/>
                </View>
        )               
    }
};
const  styles = StyleSheet.create({
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