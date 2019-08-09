import React, { Component } from "react";
import { ScrollView, Image, View, Text } from "react-native";

import styles from "./styles";
import Comments from "react-native-comments";
import * as commentActions from "./ExampleActions";
import moment from "moment";
import firebase from "react-native-firebase";
import {Post} from "../components/presentations";


export default class PostScreen extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.actions = commentActions;
        this.state = {
            comments: [],
            loadingComments: true,
            lastCommentUpdate: null,
            review: props.review ? props.review : null,
            login: null,
            id: props.id
        };

        this.scrollIndex = 0;
        this.sampleComments = [];
        this.item = {}

    }

    componentDidMount=()=> {
        if(true) {
            firebase.database().ref('comments/').orderByChild('postid').equalTo(this.item.postid).on('value', (snapshot) => {
                console.log(snapshot)
                let comments = Object.keys(snapshot._value).map(function (key) {
                    return snapshot._value[key]
                })
                console.log(comments)
                let count = 0
                const sampleCommentsRaw = comments
                //count and
                sampleCommentsRaw.forEach(c => {
                    console.log(c)
                    if (c.children) {
                        c.childrenCount = c.children.length;
                    }
                    firebase.database().ref('users/').orderByKey().equalTo(`${c.userid}`).on('value', (snapshot1) => {

                        c.name = snapshot1._value[c.userid].firstname + ' ' + snapshot1._value[c.userid].lastname
                        c.userProfilePic = snapshot1._value[c.userid].profile_picture
                        if(!c.parentId){
                        c.parentId = null}
                        count += 1
                        if (count === sampleCommentsRaw.length) {
                            this.sampleComments = Object.freeze(sampleCommentsRaw);
                            const c = this.actions.getComments(this.sampleComments);
                            console.log(c)
                            this.setState({
                                comments: c,
                                loadingComments: false,
                                lastCommentUpdate: new Date().getTime()
                            })
                        }

                    })


                });

            })

        }


    }

    extractUsername(c) {
        try {
            return c.name !== "" ? c.name : null;
        } catch (e) {
            console.log(e);
        }
    }

    extractBody(c) {
        try {
            return c.body && c.body !== "" ? c.body : null;
        } catch (e) {
            console.log(e);
        }
    }

    extractImage(c) {
        try {
            return c.userProfilePic !== "" ? c.userProfilePic : "";
        } catch (e) {
            console.log(e);
        }
    }

    extractChildrenCount(c) {
        try {
            return c.childrenCount || 0;
        } catch (e) {
            console.log(e);
        }
    }

    extractEditTime(item) {
        try {
            return item.updated_at;
        } catch (e) {
            console.log(e);
        }
    }

    extractCreatedTime(item) {
        try {
            return item.created_at;
        } catch (e) {
            console.log(e);
        }
    }

    likeExtractor(item) {
        return item.liked;
    }

    reportedExtractor(item) {
        return item.reported;
    }

    likesExtractor(item) {
        if(item.liked){
        return item.likes.map(like => {
            return {
                image: like.image,
                name: like.username,
                user_id: like.user_id,
                tap: username => {
                    console.log("Taped: " + username);
                }
            };
        });}
    }

    isCommentChild(item) {
        return item.parentId !== null;
    }

    render() {
        let nav = this.props.navigation.getParam('nav')
        let post = this.props.navigation.getParam('post')
        let user = this.props.navigation.getParam('user')
        const review = this.state.review;
        const data = this.state.comments;

        return (
            /*
             * They should add scroll to end on save action
             *They should not update comments if there are modals opened
             *
             * */
            <ScrollView
                style={styles.container}
                keyboardShouldPersistTaps="always"
                onScroll={event => {
                    this.scrollIndex = event.nativeEvent.contentOffset.y;
                }}
                ref={"scrollView"}
            ><View style={{marginTop:8}}><Post item={post} navigation={nav}/></View>
                {this.state.comments.length ? (
                    <Comments
                        data={data}
                        //To compare is user the owner
                        viewingUserName={"Pearline@veda.ca"}
                        //how many comments to display on init
                        initialDisplayCount={5}
                        //How many minutes to pass before locking for editing
                        editMinuteLimit={0}
                        //What happens when user taps on username or photo
                        usernameTapAction={username => {
                            console.log("Taped user: " + username);
                        }}
                        //Where can we find the children within item.
                        //Children must be prepared before for pagination sake
                        childPropName={"children"}
                        isChild={item => this.isCommentChild(item)}
                        //We use this for key prop on flat list (i.e. its comment_id)
                        keyExtractor={item => item.commentId}
                        //Extract the key indicating comments parent
                        parentIdExtractor={item => item.parentId}
                        //what prop holds the comment owners username
                        usernameExtractor={item => this.extractUsername(item)}
                        //when was the comment last time edited
                        editTimeExtractor={item => this.extractEditTime(item)}
                        //When was the comment created
                        createdTimeExtractor={item => this.extractCreatedTime(item)}
                        //where is the body
                        bodyExtractor={item => this.extractBody(item)}
                        //where is the user image
                        imageExtractor={item => this.extractImage(item)}
                        //Where to look to see if user liked comment
                        likeExtractor={item => this.likeExtractor(item)}
                        //Where to look to see if user reported comment
                        reportedExtractor={item => this.reportedExtractor(item)}
                        //Where to find array with user likes
                        likesExtractor={item => this.likesExtractor(item)}
                        //Where to get nr of replies
                        childrenCountExtractor={item => this.extractChildrenCount(item)}
                        //what to do when user clicks reply. Usually its header height + position (b/c scroll list heights are relative)
                        replyAction={offset => {
                            this.refs.scrollView.scrollTo({
                                x: null,
                                y: this.scrollIndex + offset - 300,
                                animated: true
                            });
                        }}
                        //what to do when user clicks submits edited comment
                        saveAction={(text, parentCommentId) => {
                            let date = moment().format("YYYY-MM-DD H:mm:ss");
                            let comments = this.actions.save(this.sampleComments,
                                this.state.comments,
                                text,
                                parentCommentId,
                                date,
                                user,
                                post.id
                            );
                            this.setState({
                                comments: comments
                            });

                            if (!parentCommentId) {
                                this.refs.scrollView.scrollToEnd();
                            }
                        }}
                        //what to do when user clicks submits edited comment
                        editAction={(text, comment) => {
                            let comments = this.actions.edit(
                                this.state.comments,
                                comment,
                                text
                            );
                            this.setState({
                                comments: comments
                            });
                        }}
                        //what to do when user clicks report submit
                        reportAction={comment => {
                            let comments = this.actions.report(this.state.comments, comment);
                            this.setState({
                                comments: comments
                            });
                        }}
                        //what to do when user clicks like
                        likeAction={comment => {
                            let comments = this.actions.like(this.state.comments, comment);
                            this.setState({
                                comments: comments
                            });
                        }}
                        //what to do when user clicks like
                        deleteAction={comment => {
                            let comments = this.actions.deleteComment(
                                this.state.comments,
                                comment
                            );
                            this.setState({
                                comments: comments
                            });
                        }}
                        //Must return promise
                        paginateAction={(from_comment_id, direction, parent_comment_id) => {
                            //Must return array of new comments after pagination

                            let newComments = this.actions.paginateComments(this.sampleComments,
                                this.state.comments,
                                from_comment_id,
                                direction,
                                parent_comment_id
                            );

                            this.setState({
                                comments: newComments
                            });
                            let self = this;
                            setTimeout(function() {
                                if (direction === "up") {
                                    self.refs.scrollView.scrollTo({
                                        x: 0,
                                        y: 500,
                                        animated: true
                                    });
                                } else {
                                    self.refs.scrollView.scrollTo({ x: 0, y: 0, animated: true });
                                }
                            }, 3000);
                        }}
                    />
                ) : null}
            </ScrollView>
        );
    }
}