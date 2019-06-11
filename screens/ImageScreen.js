import React, {Component} from 'react';
import {
    Image,
    View,
    Text,
    Dimensions,
    TouchableOpacity,
    Picker
} from "react-native";

export default class ImageScreen extends Component {

    state = {};

    uploadPicture = photo => {
        alert(this.state.language)
        // this.handleUploadPhoto(photo);
    }
    handleUploadPhoto = (photo) => {
        // fetch("http://10.100.51.70:3000/api/upload", {
        //     method: "POST",
        //     body: this.createFormData(photo, { userId: "123" })
        // })
        //     .then(response => response.json())
        //     .then(response => {
        //         console.log("upload success", response);
        //         this.setState({ photo: null });
        //         const { navigate } = this.props.navigation;
        //         navigate('Output');
        //     })
        //     .catch(error => {
        //         console.log("upload error", error);
        //         alert("Upload failed!");
        //     });
    };

    predict(){}

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
                                onPress={() =>this.uploadPicture(photoToBeChecked)}>
                  <Text style={{color: '#FFFFFF'}}>
                      Online
                  </Text>
              </TouchableOpacity>
                  <Picker
                      selectedValue={this.state.language}
                      style={{height: 50, width: 100}}
                      onValueChange={(itemValue, itemIndex) =>
                          this.setState({language: itemValue})
                      }>
                      <Picker.Item label="Select Species(unknown)" value="java" />
                      <Picker.Item label="JavaScript" value="js" />
                      <Picker.Item label="Java" value="java" />
                      <Picker.Item label="JavaScript" value="js" />
                      <Picker.Item label="Java" value="java" />
                      <Picker.Item label="JavaScript" value="js" />
                  </Picker>
                  <TouchableOpacity style={{flex: 1, backgroundColor: '#6000FF', justifyContent: 'center', alignItems: 'center'}}
                                    onPress={() =>this.predict(photoToBeChecked)}>
                      <Text style={{color: '#FFFFFF'}}>
                          Offline
                      </Text>
                  </TouchableOpacity>
              </View>
          </View>
        );
    }
}
