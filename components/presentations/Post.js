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
import { MonoText } from '../../components/StyledText';

class Post extends Component {
    constructor() {
        super();
        this.state = {
            screenWidth: Dimensions.get("window").width,
            liked: false

        };
    }
    likeToggled() {
        this.setState({
            liked: !this.state.liked
        });
    }


    render() {
        let imageWidth = this.state.screenWidth
        let  imageHeight= Math.floor(imageWidth*0.6)
        let username = this.props.item.name
        let upvotes = this.props.item.upVotes
        const upvoteIconColor= (this.state.liked)? 'rgb(251,61,57)':null;
        return (
                <View style={{flex:1, width: 100+"%"}}>
                <View style={styles.userBar}>
                    <View style={{flexDirection: 'row'}}>
                        <Image
                            source={
                                require('../../assets/images/apple-scab.jpg')
                            }
                            style={styles.userImage}
                        />
                        <Text style={{marginLeft: 10}}>{username}</Text>
                    </View>
                    <View style={{alignItems:"center"}}>
                        <Text style={{fontSize: 30}}>...</Text>
                    </View>
                </View>

                <Image
                    source={
                        require('../../assets/images/apple-scab.jpg')
                    }
                    style={[styles.postImage,{width: imageWidth,height: imageHeight}]}
                />

                <View style={styles.iconBar}>
                    <TouchableOpacity
                        onPress={() =>{
                            this.likeToggled();
                        }}>
                        <Image style={[styles.icon,{tintColor: upvoteIconColor}]} source={Icons.images.upvoteIcon}/>
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