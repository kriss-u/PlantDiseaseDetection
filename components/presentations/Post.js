import React, { Component } from 'react';
import {
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    Dimensions,
    View,
    Button,
} from 'react-native';
import Icons from '../../constants/Icons'
import firebase from "react-native-firebase";
import Icon from 'react-native-vector-icons/EvilIcons';
import FontIcon from 'react-native-vector-icons/FontAwesome5';

import { MenuProvider } from 'react-native-popup-menu';
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
} from 'react-native-popup-menu';


class Post extends Component {
    constructor(props) {
        super(props);
        this.state = {
            screenWidth: Dimensions.get("window").width,
            liked: props.item.liked

        };
    }
    componentDidMount() {
        const { currentUser } = firebase.auth()
        let userId = currentUser.uid
        let ref = firebase.database().ref("users/");
        let query = ref.orderByKey()
            .equalTo(userId)
        query.on("value", (snapshot) => {
            let user = Object.values(snapshot.val())[0]
            user.id = userId
            this.setState({
                user: user
            })
        })
    }
    deletePost(item){
        if(item.userid===this.state.user.id) {
            let updates = {};
            let writeRef = firebase.database().ref('posts/')
            updates[item.postid] = null;
            writeRef.update(updates);
        }
        else
            alert('This is not your post')

    }
    likeToggled(item) {

        //update upVotes
        let writeRef = firebase.database().ref('posts/' + item.postid)
        if (this.state.liked === false) {
            writeRef.child('likes')
                .push({
                    userid: `${item.userid}`
                })
        }
        else {
            let updates = {};
            updates["/likes/" + item.likeKey] = null;
            writeRef.update(updates);
            //     .
        }
        this.setState({
            liked: !this.state.liked
        });
    }


    render() {
        let imageWidth = this.state.screenWidth
        let imageHeight = Math.floor(imageWidth * 0.6)
        let username = this.props.item.name
        let body = this.props.item.body
        let userid = this.props.item.userid
        //calculate number of likes
        let upvotes = this.props.item.likes ? Object.keys(this.props.item.likes).length : 0
        let comments = this.props.item.comments
        let userPic = this.props.item.userProfilePic
        let postImage = this.props.item.imageurl
        let nav = this.props.navigation
        let item = this.props.item
        let user = this.state.user
        const upvoteIconColor = (this.state.liked) ? '#009900' : null;
        return (
            <MenuProvider>

            <View style={{ flex: 1, width: 100 + "%" }}>
                    <View style={styles.userBar}>
                        <TouchableOpacity
                            onPress={() => nav.navigate('OtherUsersProfilesScreen', {
                                item: { userid }
                            })}
                        >
                        <View style={{ flexDirection: 'row' }}>
                            <Image
                                source={{
                                    uri: userPic
                                }}
                                style={styles.userImage}
                            />
                            <Text style={{ marginLeft: 10 }}>{username}</Text>
                        </View>
                </TouchableOpacity>

                        <View style={{ alignItems: "center" }}>
                                    <Menu>
                                        <MenuTrigger>
                                            <Text style={{fontSize:30,paddingRight:6}}>
                                                <FontIcon
                                                    name="ellipsis-v"
                                                    size={20}
                                                />
                                            </Text>
                                        </MenuTrigger>
                                        <MenuOptions>
                                            <MenuOption onSelect={() => this.deletePost(item)} >
                                                <Text style={{color: 'red',fontSize:20}}>Delete Post</Text>
                                            </MenuOption>
                                        </MenuOptions>
                                    </Menu>
                        </View>

                    </View>


                <Text style={{ marginLeft: 60, marginTop: 20 }}>{body}</Text>
                <TouchableOpacity
                    onPress={() => nav.navigate('PostScreen', { post: item, nav: nav, user: user })}>

                <Image
                        source={{ uri: postImage }}

                        style={[styles.postImage, { width: imageWidth, height: imageHeight }]}
                    />
                </TouchableOpacity>

                <View style={styles.iconBar}>
                    <TouchableOpacity
                        onPress={() => {
                            this.likeToggled(item);
                        }}>
                        <Icon
                            name="like"
                            color={upvoteIconColor}
                            size={50}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => nav.navigate('PostScreen', { post: item, nav: nav, user: user })}>
                        <Icon
                            name="comment"
                            size={50}
                        />
                    </TouchableOpacity>

                </View>

                <View style={styles.commentBar}>
                    <Text>     {upvotes}     </Text>
                    <Text>       {comments} </Text>

                </View>
                {/*</ScrollView>*/}
            </View>
    </MenuProvider>

        )
    }
}

const styles = StyleSheet.create({

    userBar: {
        width: 100 + "%",
        height: 20,
        backgroundColor: "rgb(255,255,255)",
        marginTop: 5,
        flexDirection: "row",
        paddingHorizontal: 10,
        justifyContent: "space-between"
    },
    userImage: {
        height: 40,
        width: 40,
        borderRadius: 20
    },
    postImage: {
        resizeMode: 'contain',
        marginTop: 30,

    },
    iconBar: {
        height: Icons.styleConstants.rowHeight,
        width: 100 + "%",
        borderColor: "rgb(233,233,233)",
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderTopWidth: StyleSheet.hairlineWidth,
        flexDirection: "row",
        paddingLeft: 15
    },

    icon: {
        height: 40,
        width: 40,
        marginLeft: 5
    },
    commentBar: {
        height: Icons.styleConstants.rowHeight,
        width: 100 + "%",
        borderColor: "rgb(233,233,233)",
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderTopWidth: StyleSheet.hairlineWidth,
        flexDirection: "row",
        paddingLeft: 15

    },
});

export default Post