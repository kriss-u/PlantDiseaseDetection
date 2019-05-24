import React, {Component} from 'react';
import { View, Text, StyleSheet, ActivityIndicator} from 'react-native';
import  firebase from  'firebase'

export default class userScreen extends React.Component {
    componentDidMount() {
        this.checkIfLoggedIn();
    }
    checkIfLoggedIn = ()=>{
        firebase.auth().onAuthStateChanged(user => {
            if (user){
                this.props.navigation.navigate('ProfilesScreen');
            } else{
                this.props.navigation.navigate('LoginScreen')
            }
        })
    }

    render() {
        return(
            <View style={styles.container}>
                <ActivityIndicator size="large"/>
            </View>)
            ;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
})