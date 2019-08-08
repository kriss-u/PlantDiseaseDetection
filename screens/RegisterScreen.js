import React from 'react'
import {ScrollView, StyleSheet, View} from 'react-native'
import firebase from "react-native-firebase";
import {Input} from "react-native-elements";
import IconEntypo from "react-native-vector-icons/Entypo";
import Ionicon from 'react-native-vector-icons/Ionicons';
import MCIcon from "react-native-vector-icons/MaterialCommunityIcons";
import FAIcon from "react-native-vector-icons/FontAwesome5";

export default class RegisterScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            rePassword: '',
            errorMessage: null,
            passwordMismatchMessage: null,
            firstName: '',
            lastName: '',
            isInputWrong: true,
        };
        this.handleChange = this.handleChange.bind(this);
    }

    handleSignUp = () => {
        //save the context outside the .then function
        let that = this;
        firebase
            .auth()
            .createUserWithEmailAndPassword(this.state.email, this.state.password)
            .then(function (result) {
                firebase
                    .database()
                    .ref('/users/' + result.user.uid)
                    .set({
                        // profile_picture: result.user.picture,
                        email: that.state.email,
                        firstname: that.state.firstName,
                        lastname: that.state.lastName,
                        created_at: Date.now()
                    })
                    .then(function () {
                        this.props.navigation.navigate('ProfilesScreen');
                    })
            })
            .catch(error => this.setState({errorMessage: error.message}))
    };

    handleChange = (type, value) => {
        this.setState({
            [type]: value
        }, () => {
            let isMismatchPassword = this.state.rePassword !== this.state.password;
            this.setState({
                isInputWrong: !this.state.email || !this.state.password || !this.state.firstName || !this.state.lastName || isMismatchPassword,
            });
        });
    };

    render() {
        return (
            <ScrollView
                contentContainerStyle={{
                    paddingTop: 40,
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                <Input
                    placeholder='Enter your first name here...'
                    autoCapitalize="words"
                    label='First Name'
                    containerStyle={styles.input}
                    onChangeText={(value) => this.handleChange('firstName', value)}
                    value={this.state.firstName}
                    leftIcon={
                        <Ionicon
                            name='md-person'
                            size={24}
                            color='#009900'
                            style={styles.icon}
                        />
                    }
                />
                <Input
                    placeholder='Enter your last name here...'
                    autoCapitalize="words"
                    label='Last Name'
                    containerStyle={styles.input}
                    onChangeText={(value) => this.handleChange('lastName', value)}
                    value={this.state.lastName}
                    leftIcon={
                        <Ionicon
                            name='md-person'
                            size={24}
                            color='#009900'
                            style={styles.icon}
                        />
                    }
                />
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
                    placeholder='Enter a password...'
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
                <Input
                    placeholder='Confirm your password...'
                    secureTextEntry
                    label='Confirm Password'
                    containerStyle={styles.input}
                    autoCapitalize="none"
                    onChangeText={(value) => this.handleChange('rePassword', value)}
                    value={this.state.rePassword}
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
                        name='user-plus'
                        disabled={this.state.isInputWrong}
                        onPress={this.handleSignUp}
                        backgroundColor={this.state.isInputWrong ? '#d3d3d3' : '#009900'}
                    >
                        Create a New Account
                    </FAIcon.Button>
                </View>

                <View style={styles.button}>
                    <FAIcon.Button
                        name='user-check'
                        backgroundColor='#076C91'
                        onPress={() => this.props.navigation.navigate('LoginScreen')}
                    >
                        Already have an account? Login!
                    </FAIcon.Button>
                </View>
            </ScrollView>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    input: {
        paddingBottom: 30,
        paddingHorizontal: 30,
    },
    textInput: {
        height: 40,
        width: '90%',
        borderColor: 'gray',
        borderWidth: 1,
        marginTop: 8
    },
    errorStyle: {
        color: 'red'
    },
    icon: {
        paddingRight: 10
    },
    button: {
        padding: 10
    }
});