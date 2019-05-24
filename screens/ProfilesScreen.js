import React, {Component} from 'react';
import { View, Text, StyleSheet, Button} from 'react-native';
import  firebase from  'firebase'

export default class ProfilesScreen extends React.Component {


      render() {
          return (
              <View style={styles.container}>
                <Text>DashboardScreen</Text>
                <Button title="Sign out" onPress={() => firebase.auth().signOut()} />
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