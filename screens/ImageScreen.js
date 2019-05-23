import React, {Component} from 'react';
import {
    Image,
    View,
    Text,
    Dimensions,
    CameraRoll,
    TouchableOpacity
} from "react-native";

export default class ImageScreen extends Component {

    state = {};

    onPictureSaved = async photo => {
        alert('Uploading');
        CameraRoll.saveToCameraRoll(photo.uri, 'photo');
        this.uploadPicture(await CameraRoll.getPhotos({first:1})
            .then((r) => {return r.edges[0].node}));
    }

    uploadPicture = photo => {
        this.handleUploadPhoto(photo);
    }

    createFormData = (photo, body) => {
        let i = 0;
        i = i + 1;
        console.log(photo.type);
        const data = new FormData();
        data.append("photo", {
            name: "photo" + i,
            type: photo.type,
            uri: photo.image.uri
        });

        Object.keys(body).forEach(key => {
            data.append(key, body[key]);
        });

        return data;
    };

    handleUploadPhoto = (photo) => {
        fetch("http://10.100.51.70:3000/api/upload", {
            method: "POST",
            body: this.createFormData(photo, { userId: "123" })
        })
            .then(response => response.json())
            .then(response => {
                console.log("upload success", response);
                this.setState({ photo: null });
                const { navigate } = this.props.navigation;
                navigate('Output');
            })
            .catch(error => {
                console.log("upload error", error);
                alert("Upload failed!");
            });
    };

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
              <View style={{flexDirection: 'row', height: 50}}>
              <TouchableOpacity style={{flex: 1, backgroundColor: '#6000FF', justifyContent: 'center', alignItems: 'center', borderColor: '#FFFFFF'}}
                                onPress={() => this.props.navigation.goBack()}>
                  <Text style={{color: '#FFFFFF'}}>
                      Cancel
                  </Text>
              </TouchableOpacity>
              <TouchableOpacity style={{flex: 1, backgroundColor: '#6000FF', justifyContent: 'center', alignItems: 'center'}}
                                onPress={() =>this.onPictureSaved(photoToBeChecked)}>
                  <Text style={{color: '#FFFFFF'}}>
                      OK
                  </Text>
              </TouchableOpacity>
              </View>
          </View>
        );
    }
}
