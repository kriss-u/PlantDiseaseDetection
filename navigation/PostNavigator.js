import React , { Component } from 'react';
import PostScreen from '../screens/PostScreen'
import { createStackNavigator, createAppContainer } from 'react-navigation';
import {Post} from '../components/presentations'

const PostNavigators = createStackNavigator({
        Post: Post,

        PostScreen: PostScreen,
    },
    {
        headerMode: 'none',
        navigationOptions: {
            headerVisible: false,
        }
    });

const AppContainer = createAppContainer(PostNavigators);

export default class PostNavigator extends Component{
    render() {
        return <AppContainer/>;
    }
}