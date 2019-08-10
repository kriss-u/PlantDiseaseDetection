import React from 'react';
import { ScrollView, StyleSheet, View, Image } from 'react-native';
import { Text } from 'react-native-elements';
import firebase from 'react-native-firebase'

export default class ProfilesScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            firstName: '',
            lastName: '',
            email: '',
            error: [],
            profile_picture: ''
        }
    }

    componentDidMount() {
        let userId = this.props.navigation.state.params.item.userid
        let ref = firebase.database().ref("users/");
        let query = ref.orderByKey()
            .equalTo(`${userId}`)
        query.on("value", (snapshot) => {
            console.log(snapshot)
            let user = Object.values(snapshot.val())[0]
            this.setState({
                firstName: user.firstname,
                lastName: user.lastname,
                email: user.email,
                profile_picture: user.profile_picture
            })
        })
    }

    render() {
        return (
            <ScrollView contentContainerStyle={styles.scrollViewContainer}>
                <View style={styles.container}>
                    <View style={styles.nameContainer}>
                        <Text h1 style={styles.textStyle}>{this.state.firstName} {this.state.lastName}</Text>
                        <Text h2 style={styles.textStyle}>{this.state.email ? this.state.email : 'Place for Email'}</Text>
                        {this.state.profile_picture ?
                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <Image
                                    source={{
                                        uri: this.state.profile_picture
                                    }}
                                    style={styles.userImage}
                                /></View> : null}
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
    userImage: {
        height: 300,
        width: 300,
        borderRadius: 300
    }
});