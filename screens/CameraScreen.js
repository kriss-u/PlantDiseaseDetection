import React, {Component} from 'react';
import {StyleSheet, Button, View, Platform} from 'react-native';
import ImagePicker from "react-native-image-picker"
import uuid from 'uuid';

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
            let path = Platform.OS === 'ios' ? response.uri : 'file://' + response.path;
            const source = {uri: path};
            this.setState({
                photo: source,
            })
            const {navigate} = this.props.navigation;
            navigate('Imagee',
                { photoss: this.state.photo });
        });
    }

     openGallery(){
         this.setState({name: uuid.v4()})
        // Open Image Library:
        ImagePicker.launchImageLibrary(options, (response) => {
            // Same code as in above section!
            let path = Platform.OS === 'ios' ? response.uri : 'file://' + response.path;
            const source = {uri: path};
            this.setState({
                photo: source,
            })
            const {navigate} = this.props.navigation;
            navigate('Imagee',
                { photoss: this.state.photo});
        });
    }
    navigateToDownload(){
         const  {navigate} = this.props.navigation;
        navigate('DownloadModels')
    }


    render() {
        
            return (
                <View style={styles.container} >
                    <Button title="Camera" onPress={() => this.openCamera()}/>
                    <Button title="Gallery" onPress={() => this.openGallery()}/>
                    <Button title="Download Models for offline use" onPress={() => this.navigateToDownload() }/>

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