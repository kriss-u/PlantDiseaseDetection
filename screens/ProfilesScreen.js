import React from 'react';
import {Button, ScrollView, StyleSheet, View} from 'react-native';
import {Text} from 'react-native-elements';
import firebase from 'react-native-firebase'
import {GoogleSignin} from "react-native-google-signin";
import FAIcon from "react-native-vector-icons/FontAwesome5";

export default class ProfilesScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            firstName: '',
            lastName: '',
            email: '',
            posts: [],
            error: []
        }
    }

    componentDidMount() {
        this.setState({
            firstName: 'John',
            lastName: 'Doe'
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
                        <Text h2 style={styles.textStyle}>{this.state.email ? this.state.email: 'Place for Email'}</Text>
                        <Text h2 style={styles.textStyle}>Place for photo</Text>
                    </View>
                    <View style={styles.buttonContainer}>
                        <FAIcon.Button
                            name='sign-out-alt'
                            onPress={()=> this._signOut()}
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
        flexGrow:1,
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
        flex:1,
    },
    buttonContainer: {
        flex: 3,
        padding: 10
    }
});