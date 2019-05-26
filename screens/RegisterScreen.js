import React from 'react'
import { StyleSheet, Text, TextInput, View, Button } from 'react-native'
import firebase from  'firebase'
export default class RegisterScreen extends React.Component {
    state = { email: '', password: '', errorMessage: null, lastname: '', firstname: '' }
    handleSignUp = () => {
        let that = this
        firebase
            .auth()
            .createUserWithEmailAndPassword(this.state.email, this.state.password)
            .then(function(result) {
                console.log('result',result);
                    firebase
                        .database()
                        .ref('/users/' + result.user.uid)
                        .set({
                            // profile_picture: result.user.picture,
                            email: that.state.email,
                            firstname: that.state.firstname,
                            lastname: that.state.lastname,
                            created_at: Date.now()
                        })
                        .then(function() {
                            this.props.navigation.navigate('ProfilesScreen');
                        })
            .catch(error => this.setState({ errorMessage: error.message }))
    })}
    render() {
        return (
            <View style={styles.container}>
                <Text>Sign Up</Text>
                {this.state.errorMessage &&
                <Text style={{ color: 'red' }}>
                    {this.state.errorMessage}
                </Text>}
                <TextInput
                    placeholder="Email"
                    autoCapitalize="none"
                    style={styles.textInput}
                    onChangeText={email => this.setState({ email })}
                    value={this.state.email}
                />
                <TextInput
                    secureTextEntry
                    placeholder="Password"
                    autoCapitalize="none"
                    style={styles.textInput}
                    onChangeText={password => this.setState({ password })}
                    value={this.state.password}
                />
                <TextInput
                    placeholder="Firstname"
                    autoCapitalize="none"
                    style={styles.textInput}
                    onChangeText={firstname => this.setState({ firstname })}
                    value={this.state.firstname}
                />
                <TextInput
                    placeholder="Lastname"
                    autoCapitalize="none"
                    style={styles.textInput}
                    onChangeText={lastname => this.setState({ lastname })}
                    value={this.state.lastname}
                />
                <Button title="Sign Up" onPress={this.handleSignUp.bind(this)} />
                <Button
                    title="Already have an account? Login"
                    onPress={() => this.props.navigation.navigate('LoginScreen')}
                />
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    textInput: {
        height: 40,
        width: '90%',
        borderColor: 'gray',
        borderWidth: 1,
        marginTop: 8
    }
})