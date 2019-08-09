import React from 'react';
import { Button, PermissionsAndroid, ScrollView, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-elements';
import firebase from 'react-native-firebase'
import { GoogleSignin } from "react-native-google-signin";
import FAIcon from "react-native-vector-icons/FontAwesome5";
import uuid from "uuid";

export default class ProfilesScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            firstName: '',
            lastName: '',
            email: '',
            posts: [],
            error: [],
            uploadProgress: 0
        }
    }
    handleProfileUpload = async (uri) => {
        const name = uuid.v4()
        const ref = firebase.storage().ref("/images/").child(name);
        const unsubscribe = ref.putFile(uri).on(
            firebase.storage.TaskEvent.STATE_CHANGED,
            (snapshot) => {
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
            }, () => {
                this.setState({ uploadProgress: 0 })
                this.predictOnline(name)
            })
    }
    requestCameraPermission = async()=> {
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

    requestStoragePermission = async()=> {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
                /*{
                    title: 'Leafnosis Permissions',
                    message: ':( Sorry, we need storage permission read your photo. Please grant it, otherwise you we cannot read photos',
                    // buttonNeutral: 'Ask Me Later',
                    // buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                },*/
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log('Permission granted');
            } else {
                console.log('Permission denied');
            }
        } catch (err) {
            console.warn(err);
        }
    }

    componentDidMount() {
        const { currentUser } = firebase.auth()
        let userId = currentUser.uid
        let ref = firebase.database().ref("users/");
        let query = ref.orderByKey()
            .equalTo(userId)
        query.on("value", (snapshot) => {
            let user = Object.values(snapshot.val())[0]
            this.setState({
                firstName: user.firstname,
                lastName: user.lastname,
                email: user.email
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
                        <Text h2 style={styles.textStyle}>{this.state.email ? this.state.email : 'Place for Email'}</Text>
                        <Text h2 style={styles.textStyle}>Place for photo</Text>
                    </View>
                    <View style={styles.buttonContainer}>
                        <FAIcon.Button
                            name='sign-out-alt'
                            onPress={() => this._signOut()}
                            backgroundColor='#009900'
                        >
                            Sign Out
                        </FAIcon.Button>
                    </View>
                </View>
            </ScrollView>
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
    textStyle: {
        padding: 10
    },
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        // justifyContent: 'center'
    },
    nameContainer: {
        flex: 1,
    },
    buttonContainer: {
        flex: 3,
        padding: 10
    }
});