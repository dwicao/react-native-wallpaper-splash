import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image
} from 'react-native';
import SplashWall from './src/components/SplashWall';

export default class splazzz extends Component {
  render() {
    return (
      <View style={styles.container}>
        <SplashWall />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

AppRegistry.registerComponent('splazzz', () => splazzz);
