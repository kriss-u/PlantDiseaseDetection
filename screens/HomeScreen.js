import React, {Component} from 'react';
import {
    Button,
    Dimensions,
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import {PostFeed} from '../components/container'
import Modal from "react-native-modal";
import ImagePicker from "react-native-image-picker";
import firebase from "react-native-firebase"
import uuid from "uuid";

const options = {
    storageOptions: {
        skipBackup: true,
        path: 'images',
    },
};
export default class HomeScreen extends Component {
    static navigationOptions = {

        // headerTitleStyle: {
        //     textAlign: "center",
        //     flex: 1
        // },
        // title: 'AgroPost',
    };

    constructor(props) {
        super(props)
        this.state = {
            isNewPostModalVisible: false,
            textInputHeight: 40,
            photo: 'file://undefined'
        }

    }

    toggleNewPostModal = () => {
        this.setState({isNewPostModalVisible: !this.state.isNewPostModalVisible});
    };
    updateSize = (height) => {
        this.setState({
            height
        });
    }

    openCamera() {
        // Launch Camera:
        ImagePicker.launchCamera(options, (response) => {
            let path = Platform.OS === 'ios' ? response.uri : 'file://' + response.path;
            this.setState({
                photo: path,
            })

        });
    }

    openGallery() {
        this.setState({name: uuid.v4()})
        // Open Image Library:
        ImagePicker.launchImageLibrary(options, (response) => {
            // Same code as in above section!
            let path = Platform.OS === 'ios' ? response.uri : 'file://' + response.path;
            console.log(path)
            this.setState({
                photo: path,
            })
        });
    }

    handlePost() {
        const name = uuid.v4()
        const ref = firebase.storage().ref("/images/posts").child(name);
        const that = this
        const unsubscribe = ref.putFile(this.state.photo).on(
            firebase.storage.TaskEvent.STATE_CHANGED,
            (snapshot) => {
                console.log(snapshot.bytesTransferred);
                let progress = (snapshot.bytesTransferred / snapshot.totalBytes);
                this.setState({uploadProgress: progress})
                if (snapshot.state === firebase.storage.TaskState.SUCCESS) {
                    //predict
                }
            },
            (error) => {
                unsubscribe();
                console.error(error);
            }, (snapshot) => {
                let imageUri = snapshot.downloadURL
                console.log('uri', imageUri)
                let writeRef = firebase.database().ref('posts/').push()
                let key = writeRef.key
                console.log('key', key)
                writeRef
                    .set({
                        body: this.state.newPostText,
                        comments: 0,
                        imageurl: imageUri,
                        upVotes: 0,
                        userid: 0,
                        postid: key
                    })
                    .then(function (snapshot) {
                        that.toggleNewPostModal()
                    });
            })

    }

    render() {
        let that = this
        const width = Dimensions.get("window").width;
        const height = Dimensions.get("window").height;
        return (
            <View style={styles.container}>

                <Modal
                    style={styles.modal} isVisible={this.state.isNewPostModalVisible}
                >
                    <View style={styles.userBar}>
                        <View style={{flexDirection: 'row'}}>
                            <Button title="x" onPress={() => {
                                this.toggleNewPostModal()
                            }}>
                                {/*<Icon name="close" style={{ color: "black", fontSize: 32 }} />*/}
                            </Button>
                        </View>
                        <View style={{alignItems: "center"}}>
                            <Button onPress={() => this.handlePost()}
                                    title="Post"
                            />
                        </View>

                    </View>

                    <ScrollView>
                        <View style={styles.userBar}>

                            <View style={{flexDirection: 'row'}}>
                                <Image
                                    source={{uri: "https://lh4.googleusercontent.com/-nxzWnbmf4S0/AAAAAAAAAAI/AAAAAAAAABc/eXuoqHhvASM/photo.jpg"}}
                                    style={styles.userImage}
                                />
                            </View>
                            <View style={{alignItems: "center"}}>
                                <Text style={{fontSize: 30}}>...</Text>
                            </View>
                        </View>

                        <View style={styles.inputSection}>
                            <TextInput
                                style={styles.input}
                                height={this.state.height}
                                multiline={true}

                                onChangeText={text => this.setState({newPostText: text})}
                                placeholder={"Write something ..."}
                                numberOfLines={3}
                                onContentSizeChange={(e) => this.updateSize(e.nativeEvent.contentSize.height)}
                            /></View>

                        <TouchableOpacity onPress={() => this.openGallery()}><Image
                            source={this.state.photo === 'file://undefined'
                                ? require('../assets/images/imageThumbnail.jpg')
                                : {uri: this.state.photo}}

                            style={styles.postImage}
                        /></TouchableOpacity>

                    </ScrollView>
                    <View style={styles.modalFooter}>

                        <View style={{flexDirection: 'row'}}>
                            <Button title="ClickImage" onPress={() => {
                                this.openCamera()
                            }}>
                                {/*<Icon name="ios-image" />*/}
                            </Button>
                        </View>

                    </View>
                </Modal>
                {/*<View style={styles.navBar}>*/}
                {/*  <Text>AgroPost</Text>*/}
                {/*</View>*/}
                <PostFeed navigation={that.props.navigation}/>
                {/*new post button*/}
                <TouchableOpacity
                    style={{
                        position: "absolute",
                        top: height / 1.55,
                        left: width / 1.3
                    }}
                    onPress={() => {
                        this.toggleNewPostModal()
                    }}>
                    <View
                        style={{
                            height: 60,
                            width: 60,
                            borderRadius: 30,
                            backgroundColor: "#1DA812",
                            alignItems: "center",
                            justifyContent: "center"
                        }}
                    ><Image

                        style={{height: 30, width: 30}}
                        source={require("../assets/images/icons/tweet.png")}
                    />
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    navBar: {
        width: 100 + "%",
        height: 56,
        marginTop: 2,
        backgroundColor: "rgb(250,250,250)",
        borderBottomColor: "rgb(233,233,233)",
        borderBottomWidth: StyleSheet.hairlineWidth,
        justifyContent: "center",
        alignItems: "center"
    },
    modalFooter: {
        position: 'absolute',
        top: Dimensions.get("window").height / 1.23,
        width: 100 + "%",
        height: 50,
        marginTop: 5,
        flexDirection: "row",
        paddingHorizontal: 6,
        justifyContent: "space-between"
    },
    modal: {
        justifyContent: "flex-start",
        alignItems: "center",
        position: "absolute",
        zIndex: 4,
        elevation: 4,
        width: Dimensions.get("window").width / 1.1,
        height: Dimensions.get("window").height / 1.1

    },
    userImage: {
        height: 40,
        width: 40,
        borderRadius: 20,
    },
    postImage: {
        height: 290,
        width: 320,
        borderRadius: 20,

    },
    userBar: {
        width: 100 + "%",
        height: 50,
        marginTop: 5,
        flexDirection: "row",
        paddingHorizontal: 6,
        justifyContent: "space-between"
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        height: 100 + "%",
        width: 100 + "%"
    },
    input: {
        flex: 1,
        width: "100%",
        height: 60,
        fontSize: 20,
        alignContent: "center",
        justifyContent: "center",
        textAlignVertical: "top",
        margin: 2,
        borderRadius: 20,
        backgroundColor: "#CCCCCC"

    },
    inputSection: {
        width: '50%',
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
        borderRadius: 20,
        marginBottom: 15
    },
});
