import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';
import React from 'react';
import CameraScreen from '../screens/CameraScreen'
import ImageScreen from "../screens/ImageScreen";
import OutputScreen from '../screens/OutputScreen';
import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import ProfilesScreen from '../screens/ProfilesScreen';

const HomeStack = createStackNavigator({
  Home: HomeScreen,
});

HomeStack.navigationOptions = {
  tabBarLabel: 'Home',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-home${focused ? '' : '-outline'}`
          : 'md-home'
      }
    />
  ),
};

const CameraStack = createStackNavigator({
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

CameraStack.navigationOptions = {
    tabBarLabel:'Diagnose',
    tabBarIcon: ({ focused }) => (

    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-camera' : 'md-camera'}
    />
  ),
};


const ProfilesStack = createStackNavigator({
  Profiles: ProfilesScreen,
});

ProfilesStack.navigationOptions = {
  tabBarLabel: 'Profile',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-person' : 'md-person'}
    />
  ),
};


export default createBottomTabNavigator({
  HomeStack,
  CameraStack,
  ProfilesStack,
});