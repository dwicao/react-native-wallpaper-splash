import React, { Component } from 'react';
import Dimensions from 'Dimensions';
import {
  StyleSheet,
  Text,
  View,
  Image,
  PanResponder,
  CameraRoll,
  AlertIOS,
  Platform,
} from 'react-native';
import Swiper from 'react-native-swiper';
import RNFetchBlob from 'react-native-fetch-blob';
import NetworkImage from 'react-native-image-progress';
import { uniqueRandomNumbers, distance } from '../utils/RandManager';

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

export default class SplashWall extends Component {
  constructor() {
    super();

    this.state = {
      wallsJSON: [],
      isLoading: true
    };

    this.imagePanResponder = {};
    this.currentWallIndex = 0;

    this.prevTouchInfo = {
      prevTouchX: 0,
      prevTouchY: 0,
      prevTouchTimeStamp: 0
    };

    this.handlePanResponderGrant = this.handlePanResponderGrant.bind(this);
    this.onMomentumScrollEnd = this.onMomentumScrollEnd.bind(this);
  }

  componentWillMount() {
    this.imagePanResponder = PanResponder.create({
      onStartShouldSetPanResponder: this.handleStartShouldSetPanResponder,
      onPanResponderGrant: this.handlePanResponderGrant,
      onPanResponderRelease: this.handlePanResponderEnd,
      onPanResponderTerminate: this.handlePanResponderEnd
    });
  }

  componentDidMount() {
    this.fetchWallsJSON();
  }

  saveCurrentWallpaperToCameraRoll() {
    const {wallsJSON} = this.state;
    const currentWall = wallsJSON[this.currentWallIndex];
    const currentWallURL = `https://unsplash.it/${DEVICE_WIDTH}/${DEVICE_HEIGHT}?image=${currentWall.id}`;
   // console.log('currentWallURL', currentWallURL);

    // IDK but this cause the App crashed on iOS simulator 
    //CameraRoll.saveToCameraRoll(currentWallURL);
  }

  onMomentumScrollEnd(e, state, context) {
    this.currentWallIndex = state.index;
  }

  isDoubleTap(currentTouchTimeStamp, {x0, y0}) {
    const { prevTouchX, prevTouchY, prevTouchTimeStamp } = this.prevTouchInfo;
    const dt = currentTouchTimeStamp - prevTouchTimeStamp;
    const DOUBLE_TAP_DELAY = 300; //milliseconds
    const DOUBLE_TAP_RADIUS = 20;

    return ( dt < DOUBLE_TAP_DELAY && distance(prevTouchX, prevTouchY, x0, y0) < DOUBLE_TAP_RADIUS );
  }

  handleStartShouldSetPanResponder(e, gestureState) {
    return true;
  }

  handlePanResponderGrant(e, gestureState) {
    const currentTouchTimeStamp = Date.now();

    if ( this.isDoubleTap(currentTouchTimeStamp, gestureState) ) {
      this.saveCurrentWallpaperToCameraRoll();
    }
    
    this.prevTouchInfo = {
      prevTouchX: gestureState.x0,
      prevTouchY: gestureState.y0,
      prevTouchTimeStamp: currentTouchTimeStamp
    };
 }

  handlePanResponderEnd(e, gestureState) {
   // console.log('FInger pulled from the image');
  }

  fetchWallsJSON() {
    const url = `https://unsplash.it/list`;

    fetch(url)
      .then(response => response.json())
      .then(jsonData => {
        const randomIds = uniqueRandomNumbers(5, 0, jsonData.length);
        const walls = randomIds.map(randomId => jsonData[randomId]);

        this.setState({
          isLoading: false,
          wallsJSON: [].concat(walls)
        });
      })
      .catch(error => console.error(`Fetch error ${error}`));
  }

  renderLoadingMessage() {
    return (
      <View style={styles.loadingContainer}>
          <Text style={{color: '#fff'}}>Containing Unsplash</Text>
      </View>
    );
  }

  renderResult() {
    const { wallsJSON, isLoading } = this.state;
    const size = (Platform.OS === 'ios') ? 0 : 60; 

    if ( !isLoading ) {
      return (
        <Swiper
          dot={<View style={{backgroundColor: 'rgba(255,255,255,0.4)', width: 8, height: 8, borderRadius: 10, marginLeft: 3, marginRight: 3, marginBottom: 3}} />}
          activeDot={<View style={{backgroundColor: '#FFF', width: 13, height: 13, borderRadius: 7, marginLeft: 7, marginRight: 7 }} />}
          loop={false}
          onMomentumScrollEnd={this.onMomentumScrollEnd}
        >
          {wallsJSON.map((wallpaper, index) => (
            <View style={{flex: 1}} key={index}>
              <NetworkImage
                source={{uri: `https://unsplash.it/${DEVICE_WIDTH}/${DEVICE_HEIGHT}/?image=${wallpaper.id}`}}
                style={styles.wallpaperImage}
                indicatorProps={{
                  color: '#ffffff',
                  size: size,
                  thickness: 7
                }}
                // IDK but this cause swipe be very slow
                //{...this.imagePanResponder.panHandlers}
              />
              <Text style={styles.label}>Photo by</Text>
              <Text style={styles.label_authorName}>{wallpaper.author}</Text>
            </View>
          ))}
        </Swiper>
      );
    }
  }

  render() {
    const { isLoading } = this.state;
    if (isLoading) return this.renderLoadingMessage();
    
    return this.renderResult();
  }
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000'
  },
  wallpaperImage: {
    flex: 1,
    width: DEVICE_WIDTH,
    height: DEVICE_HEIGHT,
    backgroundColor: '#000'
  },
  label: {
    position: 'absolute',
    color: '#fff',
    fontSize: 13,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 2,
    paddingLeft: 5,
    top: 20,
    left: 20,
    width: DEVICE_WIDTH / 2
  },
  label_authorName: {
    position: 'absolute',
    color: '#fff',
    fontSize: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 2,
    paddingLeft: 5,
    top: 41,
    left: 20,
    fontWeight: 'bold',
    width: DEVICE_WIDTH / 2
  },
});
