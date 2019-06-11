import React, {Component} from 'react';
import { View, Text, StyleSheet, Button} from 'react-native';
import firebase from 'react-native-firebase'
import {GoogleSignin} from "react-native-google-signin";
export default class ProfilesScreen extends React.Component {
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
              <View style={styles.container}>
                <Text>DashboardScreen</Text>
                <Button title="Sign out" onPress={() => this._signOut()} />
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
})