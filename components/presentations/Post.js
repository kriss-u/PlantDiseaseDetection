import React , { Component } from 'react';
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
import  Icons from '../../constants/Icons'
import firebase from "react-native-firebase";
import Icon from 'react-native-vector-icons/EvilIcons';


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
                user:user
            })
        })
    }
    likeToggled(item) {

        //update upVotes
        let writeRef = firebase.database().ref('posts/'+item.postid)
        if(this.state.liked===false) {
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
        let  imageHeight= Math.floor(imageWidth*0.6)
        let username = this.props.item.name
        let body = this.props.item.body
        //calculate number of likes
        let upvotes = this.props.item.likes? Object.keys(this.props.item.likes).length:0
        let userPic = this.props.item.userProfilePic
        let postImage = this.props.item.imageurl
        let nav = this.props.navigation
        let item = this.props.item
        let user = this.state.user
        const upvoteIconColor= (this.state.liked)? '#009900':null;
        return (
                <View style={{flex:1, width: 100+"%"}}>
                <TouchableOpacity
                    onPress={() => nav.navigate('ProfilesScreen')}
                >
                <View style={styles.userBar}>
                    <View style={{flexDirection: 'row'}}>
                        <Image
                            source={{uri: userPic
                            }}
                            style={styles.userImage}
                        />
                        <Text style={{marginLeft: 10}}>{username}</Text>
                    </View>
                    <View style={{alignItems:"center"}}>
                        <Text style={{fontSize: 30}}>...</Text>
                    </View>
                </View></TouchableOpacity>

                <TouchableOpacity
                    onPress={() => nav.navigate('PostScreen',{post:item,nav:nav,user:user})}>
                    <Text style={{marginLeft: 60,marginTop: 20}}>{body}</Text>

                    <Image
                    source={{uri:postImage}}

                    style={[styles.postImage,{width: imageWidth,height: imageHeight}]}
                />
                </TouchableOpacity>

                <View style={styles.iconBar}>
                    <TouchableOpacity
                        onPress={() =>{
                            this.likeToggled(item);
                        }}>
                        <Icon
                            name="like"
                            color={upvoteIconColor}
                            size={50}
                        />
                    </TouchableOpacity>
                   
                </View>

                <View style={styles.commentBar}>
                    <Text>{upvotes} UpVotes</Text>
                    

                </View>
                {/*</ScrollView>*/}
            </View>

        )
    }
}

const styles = StyleSheet.create({

    userBar: {
        width: 100+"%",
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
        width: 100+"%",
        borderColor:"rgb(233,233,233)",
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderTopWidth: StyleSheet.hairlineWidth
    },
    icon:{
        height: 40,
        width: 40,
        marginLeft: 5
    },
    commentBar: {
        height: Icons.styleConstants.rowHeight,
        width: 100+"%",
        borderColor:"rgb(233,233,233)",
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderTopWidth: StyleSheet.hairlineWidth
    },
});

export default Post