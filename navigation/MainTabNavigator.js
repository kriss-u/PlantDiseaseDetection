import {Platform} from 'react-native';
import {createBottomTabNavigator, createStackNavigator, createSwitchNavigator} from 'react-navigation';
import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';


import {
    CameraScreen,
    HomeScreen,
    ImageScreen,
    LoginScreen,
    ModelsDownloadScreen,
    OutputScreen,
    PostScreen,
    ProfilesScreen,
    RegisterScreen,
    userScreen
} from '../screens';

const COLORS = {
    FOCUSED: '#009900',
    DEFAULT: '#000000'
}

const HomeStack = createStackNavigator({
        Home: HomeScreen,
        ProfilesScreen: ProfilesScreen,
        PostScreen: PostScreen,
    }, {
        defaultNavigationOptions: {
            title: 'Leafnosis'
        }
    }
    /*{
        headerMode: 'none',
        navigationOptions: {
            headerVisible: false,
        }
    }*/
);

HomeStack.navigationOptions = {
    tabBarLabel: 'Home',
    tabBarIcon: ({focused}) => (
        <Icon
            focused={focused}
            name={Platform.OS === 'ios' ? 'ios-home' : 'md-home'}
            color={focused ? COLORS.FOCUSED : COLORS.DEFAULT}
            size={30}
        />
    ),
};


const CameraStack = createStackNavigator({
        Camera: CameraScreen,
        Imagee: ImageScreen,
        DownloadModels: ModelsDownloadScreen,
        Output: OutputScreen,
    }
    /*{
        headerMode: 'none',
        navigationOptions: {
            headerVisible: false,
        }
    }*/
);

CameraStack.navigationOptions = {
    tabBarLabel: 'Diagnose',
    tabBarIcon: ({focused}) => (

        <Icon
            focused={focused}
            name={Platform.OS === 'ios' ? 'ios-camera' : 'md-camera'}
            color={focused ? COLORS.FOCUSED : COLORS.DEFAULT}
            size={30}
        />
    ),
};


const UsersStack = createSwitchNavigator({
        user: userScreen,
        LoginScreen: LoginScreen,
        RegisterScreen: RegisterScreen,
        ProfilesScreen: ProfilesScreen,

    }
    /*{
        headerMode: 'none',
        navigationOptions: {
            headerVisible: false,
        }
    }*/
);

UsersStack.navigationOptions = {
    tabBarLabel: 'Profile',
    tabBarIcon: ({focused}) => (
        <Icon
            focused={focused}
            name={Platform.OS === 'ios' ? 'ios-person' : 'md-person'}
            color={focused ? COLORS.FOCUSED : COLORS.DEFAULT}
            size={30}
        />
    ),
};


export default createBottomTabNavigator({
    HomeStack,
    CameraStack,
    UsersStack,

}, {
    tabBarOptions: {
        showLabel: false
    }
});

