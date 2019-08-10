import React from 'react';
import { Button, PermissionsAndroid, ScrollView, StyleSheet, View, Image, TouchableNativeFeedback, ActivityIndicator } from 'react-native';
import ImagePicker from "react-native-image-picker";
import { Text } from 'react-native-elements';
import firebase from 'react-native-firebase'
import { GoogleSignin } from "react-native-google-signin";
import Icon from "react-native-vector-icons/FontAwesome5";
import Ionicon from 'react-native-vector-icons/Ionicons';
import uuid from "uuid";

const options = {
    storageOptions: {
        skipBackup: true,
        path: 'images',
    },
};

async function requestCameraPermission  (){
    try {
        const granted = await PermissionsAndroid.requestMultiple(
            [PermissionsAndroid.PERMISSIONS.CAMERA, PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE]
            /*{
                title: 'Leafnosis Permissions',
                message: ':( Sorry, we need camera and storage permissions to capture and save photo. Please grant them, otherwise you cannot capture photos',
                // buttonNeutral: 'Ask Me Later',
                // buttonNegative: 'Cancel',
                buttonPositive: 'OK',
            },*/
        );
        const grantedLog = Object.values(granted);

        if (grantedLog.includes('denied')) {
            console.log('Permission denied');
        } else {
            console.log('Permission granted');
        }
    } catch (err) {
        console.warn(err);
    }
}



export default class ProfilesScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            userId: '',
            firstName: '',
            lastName: '',
            email: '',
            profile_picture: '',
            error: [],
            uploadProgress: 0,
            name: ''
        }
    }

    handleProfileUpload = async (options, uri) => {
        const name = uuid.v4()
        const ref = firebase.storage().ref("/images/Profile/").child(name)
        console.log(uri.path)
        const unsubscribe = ref.putFile(uri.path).on(
            firebase.storage.TaskEvent.STATE_CHANGED,
            (snapshot) => {
                console.log('haha')
                console.log(snapshot.bytesTransferred);
                let progress = (snapshot.bytesTransferred / snapshot.totalBytes);
                this.setState({ uploadProgress: progress })
                if (snapshot.state === firebase.storage.TaskState.SUCCESS) {
                    //predict
                }
            },
            (error) => {
                unsubscribe();
                console.error(error);
            }, (snapshot) => {
                this.setState({ uploadProgress: 0 })
                let imageUri = snapshot.downloadURL
                console.log('uri', imageUri)
                let writeRef = firebase.database().ref('users/' + this.state.userId)
                // let key = writeRef.key
                // console.log('key', key)
                writeRef
                    .set({
                        firstname: this.state.firstName,
                        lastname: this.state.lastName,
                        profile_picture: imageUri,
                        email: this.state.email,
                    }, () => {
                        this.setState({
                            profile_picture: imageUri
                        })
                    })
            })
    }

    openCamera() {
        requestCameraPermission().then(() => {
            // Launch Camera:
            // console.log('hello')
            ImagePicker.launchCamera(options, (response) => {
                this.handleProfileUpload(options, response);
            });
        });
    }

    openGallery() {
        requestCameraPermission().then(() => {
            this.setState({ name: uuid.v4() });
            // Open Image Library:
            ImagePicker.launchImageLibrary(options, (response) => {
                // Same code as in above section!
                // console.log('lol')
                this.handleProfileUpload(options, response);
            });
        });
    }

    componentDidMount() {
        const { currentUser } = firebase.auth()
        console.log(currentUser)
        let userId = currentUser.uid
        console.log(userId)
        this.setState({
            userId: userId
        }, () => {
            console.log(this.state.userId)
            let ref = firebase.database().ref("users/");
            let query = ref.orderByKey()
                .equalTo(userId)
            query.on("value", (snapshot) => {
                console.log(snapshot)
                try {
                    let user = Object.values(snapshot.val())[0]
                    this.isDataAvailable = true
                    this.setState({
                        firstName: user.firstname,
                        lastName: user.lastname,
                        email: user.email,
                        profile_picture: user.profile_picture
                    })
                } catch (e) {
                    //  console.log(e) 
                }
            })
        })
    }

    _signOut = async () => {
        try {
            await GoogleSignin.revokeAccess();
            await GoogleSignin.signOut();
        } catch (error) {
            this.setState({
                error,
            })
        }
        await firebase.auth().signOut()
    };

    render() {
        return (
            <ScrollView contentContainerStyle={styles.scrollViewContainer}>
                <View style={styles.container}>
                    <View style={styles.nameContainer}>
                        <Text h1 style={styles.textStyle}>{this.state.firstName} {this.state.lastName}</Text>
                        <Text h4 style={styles.textStyle}>{this.state.email ? this.state.email : 'Place for Email'}</Text>
                        {this.state.profile_picture ?
                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <Image
                                    source={{
                                        uri: this.state.profile_picture
                                    }}
                                    style={styles.userImage}
                                /></View> : null}
                        <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center' }}>For profile picture, click below</Text>
                        <View style={styles.photoOption}>
                            <View>

                            </View>
                            <TouchableNativeFeedback
                                onPress={() => this.openCamera()}
                                background={TouchableNativeFeedback.Ripple('#009900')}
                            >
                                <View style={styles.cameraButtonView}>
                                    <Icon
                                        name="camera"
                                        color="black"
                                        size={40}
                                    />
                                    <Text>Open Camera</Text>
                                </View>
                            </TouchableNativeFeedback>
                            <TouchableNativeFeedback
                                onPress={() => this.openGallery()}
                                background={TouchableNativeFeedback.Ripple('#009900')}
                            >

                                <View style={styles.cameraButtonView}>
                                    <Ionicon
                                        name="md-photos"
                                        color="black"
                                        size={40}
                                    />
                                    <Text>Open Gallery</Text>
                                </View>
                            </TouchableNativeFeedback>
                        </View>
                    </View>
                    <View style={styles.buttonContainer}>
                        <Icon.Button
                            name='sign-out-alt'
                            onPress={() => this._signOut()}
                            backgroundColor='#009900'
                        >
                            Sign Out
                        </Icon.Button>
                    </View>
                </View>
            </ScrollView >
        );
    }

}

const styles = StyleSheet.create({
    scrollViewContainer: {
        flexGrow: 1,
        paddingTop: 40,
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    userImage: {
        height: 300,
        width: 300,
        borderRadius: 300
    },
    textStyle: {
        padding: 10,
        textAlign: 'center'},
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        // justifyContent: 'center'
    },
    nameContainer: {
        flex: 1,
    },
    photoOption: {
        flexDirection: 'row',
        padding: 50,
        justifyContent: 'space-between'
    },
    cameraButtonView: {
        padding: 20,
    },
    buttonContainer: {
        flex: 3,
        padding: 10
    }
});