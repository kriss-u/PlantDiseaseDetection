import React , { Component } from 'react';
import CameraScreen from '../screens/CameraScreen'
import { createStackNavigator, createAppContainer } from 'react-navigation';
import ImageScreen from "../screens/ImageScreen";
import OutputScreen from '../screens/OutputScreen'

const CameraNavigators = createStackNavigator({
        Camera: CameraScreen,
    Imagee: ImageScreen,
    Output: OutputScreen,
    },
    {
        headerMode: 'none',
        navigationOptions: {
            headerVisible: false,
        }
    });

const AppContainer = createAppContainer(CameraNavigators);

export default class CameraNavigator extends Component{
    render() {
        return <AppContainer/>;
    }
}