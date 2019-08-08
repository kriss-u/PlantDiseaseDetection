import React, {Component} from 'react';
import {View, Text, StyleSheet, Button, TextInput} from 'react-native';
import firebase from 'react-native-firebase';
import {GoogleSignin} from 'react-native-google-signin';

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
    state = {email: '', password: '', errorMessage: null}
    handleLogin = () => {
        const {email, password} = this.state
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
            <View style={styles.container}>
                <Text>Login</Text>
                {this.state.errorMessage &&
                <Text style={{color: 'red'}}>
                    {this.state.errorMessage}
                </Text>}
                <TextInput
                    style={styles.textInput}
                    autoCapitalize="none"
                    placeholder="Email"
                    onChangeText={email => this.setState({email})}
                    value={this.state.email}
                />
                <TextInput
                    secureTextEntry
                    style={styles.textInput}
                    autoCapitalize="none"
                    placeholder="Password"
                    onChangeText={password => this.setState({password})}
                    value={this.state.password}
                />
                <Button title="Login" onPress={this.handleLogin}/>
                <Button
                    title="Don't have an account? Sign Up"
                    onPress={() => this.props.navigation.navigate('RegisterScreen')}
                />
                <Button title="Sign In with Google" onPress={() => this.signInWithGoogleAsync()}/>
                <Button title="Sign In with Facebook" onPress={() => this.signInWithFacebookAsync()}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});
