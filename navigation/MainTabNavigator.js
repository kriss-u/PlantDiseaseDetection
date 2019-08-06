import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator, createSwitchNavigator, createAppContainer } from 'react-navigation';
import React from 'react';
import TabBarIcon from '../components/TabBarIcon';
import { Post } from '../components/presentations';
import { CameraScreen, ImageScreen, OutputScreen, HomeScreen, userScreen, LoginScreen, ProfilesScreen, RegisterScreen, ModelsDownloadScreen, PostScreen } from '../screens';
import { PostFeed } from '../components/container'
const HomeStack = createStackNavigator({
  Home: HomeScreen,
  ProfilesScreen: ProfilesScreen,
  PostScreen: PostScreen,
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
  DownloadModels: ModelsDownloadScreen,
  Output: OutputScreen,
},
  // {
  //     headerMode: 'none',
  //     navigationOptions: {
  //         headerVisible: false,
  //     }
  // }
);

CameraStack.navigationOptions = {
  tabBarLabel: 'Diagnose',
  tabBarIcon: ({ focused }) => (

    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-camera' : 'md-camera'}
    />
  ),
};


const usersStack = createSwitchNavigator({
  user: userScreen,
  LoginScreen: LoginScreen,
  RegisterScreen: RegisterScreen,
  ProfilesScreen: ProfilesScreen
});

usersStack.navigationOptions = {
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
  usersStack,
});

