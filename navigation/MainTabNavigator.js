import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';
import React from 'react';
import CameraScreen from '../screens/CameraScreen'
import ImageScreen from "../screens/ImageScreen";
import OutputScreen from '../screens/OutputScreen';
import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import SettingsScreen from '../screens/SettingsScreen';

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
  showLabel: false,
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-camera' : 'md-camera'}
    />
  ),
};

const SettingsStack = createStackNavigator({
  Settings: SettingsScreen,
});

SettingsStack.navigationOptions = {
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
  SettingsStack,
});