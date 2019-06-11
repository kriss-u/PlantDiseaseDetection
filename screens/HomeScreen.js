import React , { Component } from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
  View,
    Button,
} from 'react-native';
import {PostFeed} from '../components/container'
import  Icons from '../constants/Icons'
import { MonoText } from '../components/StyledText';

export default class HomeScreen extends Component {

  static navigationOptions = {
    header: null,
  };

  render() {
    return (
      <View style={styles.container}>
        {/*<ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>*/}
            {/*<Button title="haha" onPress={()=> navigate('Camera')}/>*/}
            <View style={styles.navBar}>
              <Text>AgroPost</Text>
            </View>
            <PostFeed/>
          {/*</ScrollView>*/}
      </View>)

  }
}

const styles = StyleSheet.create({
    navBar:{
        width: 100+"%",
        height: 56,
        marginTop: 20,
        backgroundColor:"rgb(250,250,250)",
        borderBottomColor:"rgb(233,233,233)",
        borderBottomWidth: StyleSheet.hairlineWidth,
        justifyContent: "center",
        alignItems: "center"
    },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    height: 100+"%",
    width: 100+"%"
  }
});
