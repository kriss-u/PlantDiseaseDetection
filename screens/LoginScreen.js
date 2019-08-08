import React, {Component} from 'react';
import {View, Text, StyleSheet, Button, TouchableNativeFeedback, ScrollView} from 'react-native';
import {Input} from "react-native-elements";
import firebase from 'react-native-firebase';
import {GoogleSignin} from 'react-native-google-signin';
import IconEntypo from 'react-native-vector-icons/Entypo';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import FAIcon from 'react-native-vector-icons/FontAwesome5';
import IonIcon from "react-native-vector-icons/Ionicons";
// import { YellowBox } from 'react-native';
// import _ from 'lodash';
// import * as console from "react-native/flow/console";
//
// YellowBox.ignoreWarnings(['Setting a timer']);
// const _console = _.clone(console);
// console.warn = message => {
//     if (message.indexOf('Setting a timer') <= -1) {
//         _console.warn(message);
//     }
// };


export default class LoginScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            errorMessage: null,
            isInputNull: true,
        };
        this.handleChange = this.handleChange.bind(this);
    }

    /* componentDidMount(){

     }

     componentWillUnmount() {
     }*/

    handleChange = (type, value) => {
        this.setState({
            [type]: value
        }, () => {
            this.setState({
                isInputNull: !this.state.email || !this.state.password
            })
        });
    };

    handleLogin = () => {
        const {email, password} = this.state;
        firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .then(() => this.props.navigation.navigate('ProfilesScreen'))
            .catch(error => this.setState({errorMessage: error.message}))
    };

    onSignIn = credential => {
        console.log('Credential', credential);
        // Sign in with credential from the Google user.
        firebase
            .auth()
            .signInWithCredential(credential)
            .then(function (result) {
                console.log('result', result);
                if (result.additionalUserInfo.isNewUser) {
                    console.log("the use is not signed up")
                    console.log(result.user.uid);
                    firebase
                        .database()
                        .ref('/users/' + result.user.uid)
                        .set({
                            // profile_picture: result.user.picture,
                            email: result.user.email,
                            firstname: result.additionalUserInfo.profile.given_name ? result.additionalUserInfo.profile.given_name : result.additionalUserInfo.profile.first_name,
                            lastname: result.additionalUserInfo.profile.family_name ? result.additionalUserInfo.profile.family_name : result.additionalUserInfo.profile.last_name,
                            profile_picture: result.user.photoURL,
                            phone: result.user.phoneNumber,
                            created_at: Date.now()
                        })
                        .then(function (snapshot) {
                            console.log('Snapshot', snapshot);
                        });
                } else {
                    firebase
                        .database()
                        .ref('/users/' + result.user.uid)
                        .update({
                            last_logged_in: Date.now()
                        });
                }
            })
            .catch(function (error) {
                // Handle Errors here.
                let errorCode = error.code;
                let errorMessage = error.message;
                // The email of the user's account used.
                let email = error.email;
                // The firebase.auth.AuthCredential type that was used.
                let credential = error.credential;
            })
    };

    signInWithGoogleAsync = async () => {
        try {
            console.log('result');


            await GoogleSignin.configure();
            const userInfo = await GoogleSignin.signIn();
            console.log(userInfo);
            const result = await GoogleSignin.getTokens();
            console.log(result);


// Build Firebase credential with the Google ID token.
            const credential = firebase.auth.GoogleAuthProvider.credential(
                result.idToken,
                result.accessToken
            );
            this.onSignIn(credential);
            return result.accessToken;

        } catch (e) {
            console.warn('error');
            return {error: true};
        }
    };

    async signInWithFacebookAsync() {

        try {
            await GoogleSignin.revokeAccess();
            await GoogleSignin.signOut();
            this.setState({user: null}); // Remember to remove the user from your app's state as well
        } catch (error) {
            console.error(error);
        }
        const {type, token} = await Expo.Facebook.logInWithReadPermissionsAsync('2289708561085828'
            , {permissions: ['public_profile']});

        if (type === 'success') {
            // Build Firebase credential with the Facebook ID token.
            const credential = firebase.auth.FacebookAuthProvider.credential(token);
            this.onSignIn(credential);

        }
    }

    render() {
        return (
            <ScrollView
                contentContainerStyle={{
                    paddingTop: 40,
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                <Input
                    placeholder='Enter your email here...'
                    autoCapitalize="none"
                    label='Email'
                    containerStyle={styles.input}
                    onChangeText={(value) => this.handleChange('email', value)}
                    value={this.state.email}
                    leftIcon={
                        <IconEntypo
                            name='email'
                            size={24}
                            color='#009900'
                            style={styles.icon}
                        />
                    }
                    errorStyle={styles.errorStyle}
                    errorMessage={this.state.errorMessage}
                />
                <Input
                    placeholder='Enter your password here...'
                    secureTextEntry
                    label='Password'
                    containerStyle={styles.input}
                    autoCapitalize="none"
                    onChangeText={(value) => this.handleChange('password', value)}
                    value={this.state.password}
                    leftIcon={
                        <MCIcon
                            name='textbox-password'
                            size={24}
                            color='#009900'
                            style={styles.icon}
                        />
                    }
                />

                <View style={styles.button}>
                    <FAIcon.Button
                        name='sign-in-alt'
                        disabled={this.state.isInputNull}
                        onPress={this.handleLogin}
                        backgroundColor={this.state.isInputNull ? 'red' : '#009900'}
                    >
                        Login
                    </FAIcon.Button>
                </View>

                <View style={styles.button}>
                    <FAIcon.Button
                        name='user-plus'
                        backgroundColor='#24292E'
                        onPress={() => this.props.navigation.navigate('RegisterScreen')}
                    >
                        Don't have an account? Sign Up!
                    </FAIcon.Button>
                </View>
                <View style={styles.button}>
                    <FAIcon.Button
                        name="google"
                        backgroundColor='#DD4B39'
                        onPress={() => this.signInWithGoogleAsync()}
                    > Sign In with Google
                    </FAIcon.Button>
                </View>
                <View style={styles.button}>
                    <FAIcon.Button
                        name="facebook"
                        backgroundColor='#2E4B92'
                        onPress={() => this.signInWithFacebookAsync()}
                    >
                        Sign In with Facebook
                    </FAIcon.Button>
                </View>

            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center'
    },
    inputContainers: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonContainers: {
        flex: 2,
        flexDirection: 'column',
        alignItems: 'center',
    },
    buttonContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    errorStyle: {
        color: 'red'
    },
    icon: {
        paddingRight: 10
    },
    input: {
        paddingBottom: 30,
        paddingHorizontal: 30,
    },
    button: {
        padding: 10
    }
});
