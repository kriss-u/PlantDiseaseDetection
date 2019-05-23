import React, {Component} from "react";
import  {FlatList} from "react-native";
import {Post} from "../presentations";
class PostFeed extends Component {
    constructor(){
        super()
        this.state = {
            dataSource:[{name:"Rahul",upVotes:5},{name:"Richard",upVotes:50},{name:"parol",upVotes:8},{name:"Larry",upVotes:25}]
        }
    }
_renderPost({item}){
    return <Post item={item}/>;
}
_returnKey(item){
    return item.name.toString();
}
    render(){
        return <FlatList
            data={this.state.dataSource}
            keyExtractor = {
                this._returnKey
            }
            renderItem={this._renderPost}
            />
    }
}
export default PostFeed;