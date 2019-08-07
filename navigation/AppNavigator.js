import React from 'react';
import {createAppContainer, createStackNavigator} from 'react-navigation';

import MainTabNavigator from './MainTabNavigator';

export default createAppContainer(createStackNavigator({
        // You could add another route here for authentication.
        // Read more at https://reactnavigation.org/docs/en/auth-flow.html
        Main: MainTabNavigator,
        //Posts: PostNavigator,
    },
    {
        headerMode: 'none',
        navigationOptions: {
            //auto refresh screen on bottom tab navigation
            resetOnBlur: true,
            headerVisible: false,
        },
        // defaultNavigationOptions: {
        //     title: 'Leafnosis'
        // }
    }));