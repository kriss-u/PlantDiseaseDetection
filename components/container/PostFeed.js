import React, {Component} from "react";
import {AsyncStorage, FlatList, TouchableOpacity, View} from "react-native";
import {Post} from "../presentations";
import * as commentActions from "../../screens/ExampleActions";
import firebase from "react-native-firebase";

class PostFeed extends Component {
    constructor() {

        super()
        this._renderPost = this._renderPost.bind(this);

        this.actions = commentActions;
        this.state = {
            dataSource:[]
        }
        this.posts = []
    }

    componentDidMount() {

        firebase.database().ref('posts/').on('value', (snapshot) => {
            let x = {};
            let count = 0;
            x.a = snapshot.val();
            let res = Object.values(x)[0];
            this.posts = Object.freeze(res);
            const p = this.actions.getComments(this.posts);
            console.log('p',p)
            p.forEach(a => {
                //TODO: put user id of logged in user
                firebase.database().ref('posts/'+a.postid+'/likes').orderByChild('userid').equalTo(`${a.userid}`).on('value', (snapshot2) => {
                    a.likeKey = snapshot2._value? Object.keys(snapshot2._value)[0]:null
                    a.liked = snapshot2._value !== null;
                })
                firebase.database().ref('users/').orderByKey().equalTo(`${a.userid}`).on('value', (snapshot1) => {
                    a.name = snapshot1._value[a.userid].firstname + ' ' + snapshot1._value[a.userid].lastname
                    a.userProfilePic = snapshot1._value[a.userid].profile_picture
                    count+=1
                    if(count === p.length)
                        this.setState({
                            dataSource: p.reverse(),
                            loadingComments: false,
                            lastCommentUpdate: new Date().getTime()
                        })
                  })
                })

            });


    }

    _renderPost({item}) {
        return <Post item={item} navigation={this.props.navigation} />;
    }

    _returnKey(item) {
        return item.postid.toString();
    }


    render() {

            return  <FlatList
                data={this.state.dataSource}
                keyExtractor={
                    this._returnKey
                }
                renderItem={this._renderPost}
            />



    }
}
export default PostFeed;