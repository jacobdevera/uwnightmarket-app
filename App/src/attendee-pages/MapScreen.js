import React, { Component } from "react";
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  Dimensions,
  TouchableOpacity,
  Animated
} from "react-native";

import { Icon } from 'native-base';

import MapView ,{ Callout, AnimatedRegion, Marker  } from "react-native-maps";
import firebase from 'firebase';
import Carousel from 'react-native-snap-carousel';

import { sortByName } from '../utils/vendor';

const { width, height } = Dimensions.get("window");
const scale = parseInt(width) / 375; // 375 is default iphone 6 width

const cardsOnScreen = 3;
const distanceBetweenCards = 20;
const CARD_HEIGHT = height / 4;
const CARD_WIDTH = (width / cardsOnScreen);

export default class MapScreen extends Component {

    constructor(props){
      super(props);
      this.centerMarker = this.centerMarker.bind(this);
      this.onDragEnd = this.onDragEnd.bind(this);
    
      this.intervalLen = CARD_WIDTH;
      this.intervalDiff = distanceBetweenCards;
      this.markers = [];
    }
      
  state = {
    vendors:[],
    markers: [],

    centeredIndex: 1,

    cards:[],

    region:{
      latitude: 47.655661,
      longitude: -122.309414,
      latitudeDelta: 0.0014,
      longitudeDelta: 0.0014,    
    },
    currentCard :1,
    markerPressed: false,
    calloutIsRendered:false,
    marginTopHack: 1 // get map view to re-render to show location button
  };

  componentWillMount() {
    this.index = 0;
    this.animation = new Animated.Value(0);
  }
  componentDidMount() {
    // We should detect when scrolling has stopped then animate
    // We should just debounce the event listener here
    let vendorRef = firebase.database().ref('/vendors/').orderByKey();
    vendorRef.once('value').then((snapshot) => {
        // console.log("map snapshot:    ", snapshot.val());
      let vendorList = [];
      snapshot.forEach((vendorSnapshot) => {
        let each = vendorSnapshot.val();
        if(each.latitude !==  0 &&each.longitude !==  0){
          vendorList.push(each);
        }
      });
      vendorList.sort(sortByName);
      console.log(vendorList);

      // vendorList = vendorList.sort(this.sortByBoothNumber);
      this.setState({ vendors: vendorList });
    });
  }


  onDragEnd(event) {
    let value = event.nativeEvent.contentOffset.x;
    console.log("value    ", value);

    let { height, width } = Dimensions.get('window');

    console.log("CARD_WIDTH   ",CARD_WIDTH)
    console.log("this.intervalDiff     ", this.intervalDiff)
    console.log("scale", scale)

    let index = (Math.round((value + width / 2 - (this.intervalLen + this.intervalDiff) / 2) / (this.intervalLen + this.intervalDiff))); // animate 30% away from landing on the next item
    if (index >= this.state.vendors.length) {
      index = this.state.vendors.length - 1;
    }
    if (index <= 0) {
      index = 0;
    }

    console.log("index    ", index)
    this.setState({centeredIndex : index})

    // let marker = this.state.markers[index];
    this.state.markers[index]._component.showCallout();
    this.map.animateToCoordinate({
      latitude: this.state.vendors[index].latitude,
      longitude: this.state.vendors[index].longitude,
    }, 300);

    console.log("state center index    " + this.state.centeredCard)
  }

  centerMarker(index){
    console.log(this.state.vendors)
    this.map.animateToCoordinate({
      latitude: this.state.vendors[index].latitude,
      longitude: this.state.vendors[index].longitude
    }, 300);
    // this.sv._component.scrollTo({x:  (key) * (this.intervalLen + this.intervalDiff) - (width / 2) + (this.intervalLen + this.intervalDiff) / 2});
  }

  showMarkerCallout = (index) => {
    this.state.markers[index]._component.showCallout();
  }

  makeCoordinate(vendor){
    return {
      latitude: vendor.latitude,
      longitude: vendor.longitude,
    }
  }

  onRegionChange(region) {
    this.setState({ region });
  }

  centeredStyle = function(myColor) {
    return {
      borderRadius: 10,
      background: myColor,
    }
  }


  addMarker(marker){
    // this.markers.push(marker)
    
    this.setState((prevState) => {markers : prevState.markers.push(marker)})
  }


  addCard(card){
    
    // this.markers.push(marker)
    this.setState((prevState) => {card : prevState.cards.push(card)})
  }


  setMarkerRef = (ref) => {
    this.marker = ref
  }

  renderCallout() {
    if(this.state.calloutIsRendered === true) return;
    this.setState({calloutIsRendered: true});
    this.marker.showCallout();
    console.log(this.marker)
    console.log(this.map)

  }

  _renderItem = ({item, index}) => {
    return (
    <View  
      style={styles.card}
      key={index}
        
        >
        <Text style = {styles.cardtitle}>
        
        Booth: {item.boothNumber}</Text>
        <Image
          source={{ uri: item.img}}
          style={styles.cardImage}
          resizeMode="contain"
        />
        <View style={styles.textContent}>
          <Text numberOfLines={1} style={
            styles.cardtitle}>{item.name}
            </Text>
        </View>
      </View>
    );
  }

  render() {
    const interpolations = this.state.vendors.map((marker, index) => {
      const inputRange = [
        (index - 1) * CARD_WIDTH,
        index * CARD_WIDTH,
        ((index + 1) * CARD_WIDTH),
      ];
      const scale = this.animation.interpolate({
        inputRange,
        outputRange: [1, 2.5, 1],
        extrapolate: "clamp",
      });
      const opacity = this.animation.interpolate({
        inputRange,
        outputRange: [0.35, 1, 0.35],
        extrapolate: "clamp",
      });
      return { scale, opacity };
    });

    return (
      <View style={styles.container}>
        <MapView
          ref={map => this.map = map}
          loadingEnabled
          
          initialRegion={this.state.region}
          style={[styles.container, { marginTop: this.state.marginTopHack }]}
          showsUserLocation={true}
          showsMyLocationButton={true}
          onMapReady={()=>this.setState({ marginTopHack: 0 })}

        >
          {this.state.vendors.map((marker, index) => {
            const scaleStyle = {
              transform: [
                {
                  scale: interpolations[index].scale,
                },
              ],
            };
            const opacityStyle = {
              opacity: interpolations[index].opacity,
            };
            return (
              <Marker.Animated
              ref={marker => {this.addMarker(marker)}
              }
              coordinate={this.makeCoordinate(marker)} 
              key={index} 
              onPress={e => {
                  this.setState({markerPressed: true});
                  this._carousel.snapToItem(index);
                  this.centerMarker(index);
                  {/*this.map.animateToCoordinate({
                    latitude: marker.latitude,
                    longitude: marker.longitude
                  }, 300);*/}

                  setTimeout(() =>
                    this.setState({markerPressed: false})
                  , 3000);
                }
              }>
 
                    {/* <Image
                      source={require('../../img/location-marker.png')}
                      style={{ width: 25, height: 25 }}
                      resizeMode='contain'
                    /> */}
                  <Callout
                    style = {{
                      flexDirection: 'row',
                      flex: 1,
                      elevation: 5,
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      // width:100,
                      // textAlign:"center"
                    }}
                    onPress={() => { this.props.onCalloutPress(marker) }}
                  >
                        <Text>{marker.boothNumber}. {marker.name}</ Text>
                   </Callout>

              </Marker.Animated>
            );
          })}
        </MapView>
        {/*
        <Animated.ScrollView 
          ref = {sv => this.sv = sv}
          horizontal
          scrollEventThrottle={10000}
          showsHorizontalScrollIndicator={false}
          snapToInterval={this.intervalLen + this.intervalDiff} // works
          snapToAlignment={"center"}
          // snapToInterval={this.intervalDiff}
          decelerationRate={"fast"}
          // pagingEnabled={true}

          onMomentumScrollEnd={
            this.onDragEnd
          }
          onScroll={
              Animated.event(
                [{ nativeEvent: { contentOffset: { x: this.animation } } }],
                { useNativeDriver: true },
                )
          }
          style={styles.scrollView}
          contentContainerStyle={styles.endPadding}
        >
          {this.state.vendors.map((marker, index) => {
            // console.log(" index !!!  " + index);
              return (<View  
              
              ref = {(card) =>{this.addCard(card)}}
              style={
                index === this.state.centeredIndex? styles.centeredCard :
                styles.card}
              key={index}
               
               >
               <Text style = {styles.cardtitle}>
               {}
               
               Booth: {marker.boothNumber}</Text>
                <Image
                  source={{ uri: marker.img}}
                  style={styles.cardImage}
                  resizeMode="contain"
                />
                <View style={styles.textContent}>
                  <Text numberOfLines={1} style={
                    styles.cardtitle}>{marker.name}
                    </Text>
                </View>
              </View>);
          })}
        </Animated.ScrollView>*/}
        <Carousel
          ref={(c) => { this._carousel = c; }}
          containerCustomStyle={styles.scrollView}
          data={this.state.vendors}
          renderItem={this._renderItem}
          sliderHeight={height / 4}
          sliderWidth={width}
          itemWidth={width / 3}
          onBeforeSnapToItem={(index) => {
            this.centerMarker(index);
            this.showMarkerCallout(index);
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  scrollView: {
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
    paddingVertical: 10,
  },
  endPadding: {
    paddingRight: width - CARD_WIDTH,
  },
  customView: {
    width: 140,
    height: 100,
  },
  card: {
    borderRadius:10,
    padding: 10,
    elevation: 2,
    backgroundColor: "#FFF",
    marginHorizontal: distanceBetweenCards / 2,
    marginBottom: 0,
    paddingBottom: 0,
    shadowColor: "#000",
    shadowRadius: 5,
    shadowOpacity: 0.3,
    shadowOffset: { x: 2, y: -2 },
    height: CARD_HEIGHT,
    overflow: "hidden",
  },
  centeredCard: {
    borderRadius:10,
    padding: 10,
    elevation: 2,
    borderColor:"#D94C5D",
    backgroundColor: "#FFF",
    borderWidth: 2,
    marginHorizontal: distanceBetweenCards / 2,
    marginBottom: 0,
    paddingBottom: 0,
    shadowColor: "#000",
    shadowRadius: 5,
    shadowOpacity: 0.3,
    shadowOffset: { x: 2, y: -2 },
    height: CARD_HEIGHT + 15,
    width: CARD_WIDTH,
    overflow: "hidden",
  },
  cardImage: {
    flex: 3,
    width: "100%",
    height: "100%",
    alignSelf: "center",
  },
  textContent: {
    flex: 1,
  },
  cardtitle: {
    fontSize: 12,
    marginTop: 5,
    textAlign: 'center',
    marginBottom: 0,
    paddingBottom: 0,
    fontWeight: "bold",
  },
  cardDescription: {
    fontSize: 12,
    color: "#444",
  },
  markerWrap: {
    alignItems: "center",
    justifyContent: "center",
  },
  marker: {
    // width: 20,
    // height: 20,
    borderRadius: 4,
    backgroundColor: "rgba(130,4,150, 0.9)",
  },
  ring: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(130,4,150, 0.3)",
    position: "absolute",
    borderWidth: 1,
    borderColor: "rgba(130,4,150, 0.5)",
  },
});