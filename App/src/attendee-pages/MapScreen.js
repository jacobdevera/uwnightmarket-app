import React, { Component } from "react";
import {
  AppRegistry,
  StyleSheet,
  View,
  ScrollView,
  Image,
  Dimensions,
  TouchableOpacity,
  Animated
} from "react-native";

import { Icon, Text, Badge } from 'native-base';

import MapView ,{ Callout, AnimatedRegion, Marker  } from "react-native-maps";
import firebase from 'firebase';
import Carousel from 'react-native-snap-carousel';

import { sortByName, sortByBoothNumber } from '../utils/vendor';
import mainStyles, { config, scale as mainScale, moderateScale } from '../styles';

const { width, height } = Dimensions.get("window");
const scale = parseInt(width) / 375; // 375 is default iphone 6 width

const cardsOnScreen = 3;
const CARD_HEIGHT = height / 4;
const CARD_WIDTH = (width / cardsOnScreen);

export default class MapScreen extends Component {
    constructor(props){
      super(props);
      this.markers = [];
      this.state = {
        vendors: [],
        region: {
          latitude: 47.655661,
          longitude: -122.309414,
          latitudeDelta: 0.004,
          longitudeDelta: 0.004,    
        },
        markerPressed: false,
        marginTopHack: 1, // get map view to re-render to show location button
        selectedVendorId: -1,
        notifBoxShow: false,
        finishedScrollingToVendor: false
      };
    }

  componentWillMount() {
    console.log(this.props);
    this.index = 0;
    this.animation = new Animated.Value(0);
    // We should detect when scrolling has stopped then animate
    // We should just debounce the event listener here
    let vendorRef = firebase.database().ref('/vendors/').orderByKey();
    vendorRef.once('value').then((snapshot) => {
        // console.log("map snapshot:    ", snapshot.val());
      let vendorList = [];
      snapshot.forEach((vendorSnapshot) => {
        let each = vendorSnapshot.val();
        if (each.latitude !==  0 && each.longitude !== 0) {
          vendorList.push(each);
        }
      });
      vendorList = vendorList.sort(sortByBoothNumber);
      let vendorPropIndex = this.getVendorPropIndex(vendorList);
      console.log('componentWillMount index ' + vendorPropIndex);
      if (vendorPropIndex < 0) {
        if (this.props.clearInitialNotif)
          this.props.clearInitialNotif();
        this.setState({ finishedScrollingToVendor: true });
      }
      this.markers = new Array(vendorList.length);
      this.setState({ vendors: vendorList, selectedVendorId: vendorPropIndex });
    });
  }

  componentDidUpdate() {
    const { selectedVendorId, vendors, finishedScrollingToVendor } = this.state;
    console.log(selectedVendorId);
    if (selectedVendorId > -1 && !finishedScrollingToVendor) {
      let marker = this.markers[selectedVendorId];
      if (vendors[selectedVendorId] !== null && marker !== undefined) {
          // hack to show callout until react-native-maps fixed
          console.log('this should only be called once')
          setTimeout(() => {
            this.goToVendorFromNotif(selectedVendorId);
          }, 500);
      }
    } else if (this.hasVendorParam()) { // map in foreground when tapping notification
      this.goToVendorFromNotif(selectedVendorId);
    }
  }

  goToVendorFromNotif = (selectedVendorId) => {
    let index = selectedVendorId > -1 ? selectedVendorId : this.getVendorPropIndex(this.state.vendors);
    console.log('notif index ' + index);
    if (index > -1) {
      let marker = this.markers[index];
      this.centerMarker(index);
      this._carousel.snapToItem(index);
      marker._component.showCallout();
      this.setState({ notifBoxShow: true, finishedScrollingToVendor: true, selectedVendorId: index });
    }
    if (this.props.clearInitialNotif)
      this.props.clearInitialNotif();
  }

  hasVendorParam = () => {
    return this.props.notif && this.props.notif.vendorId;
  }

  getVendorPropIndex = (vendors) => {
    console.log("hasVendorParam " + this.hasVendorParam());
    if (this.hasVendorParam()) {
      let vendorIndex = -1;
      console.log(this.props.notif);
      vendors.forEach((vendor, index) => {
        console.log(vendor.userId)
        if (vendor.userId === this.props.notif.vendorId) {
          vendorIndex = index; 
        }
      });
      console.log(' this shouldnt be -1 ' + vendorIndex)
      return vendorIndex;
    } else {
      console.log('walang vendor param')
      return -1;
    }
  }

  centerMarker = (index) => {
    this.map.animateToCoordinate({
      latitude: this.state.vendors[index].latitude,
      longitude: this.state.vendors[index].longitude
    }, 300);
  }

  showMarkerCallout = (index) => {
    this.markers[index]._component.showCallout();
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

  _renderItem = ({item, index}) => {
    return (
      <View  
        style={styles.card}
        key={index}
      >
        <View style={styles.textContent}>
          <Text style={[mainStyles.bold, mainStyles.center, mainStyles.mapText]}>
            Booth: {item.boothNumber}
          </Text>
        </View>
        <Image
          source={{ uri: item.img}}
          style={styles.cardImage}
          resizeMode="contain"
        />
        <View style={styles.textContent}>
          <Text style={[mainStyles.mapText, mainStyles.center]} numberOfLines={2}>
            {item.name}
          </Text>
        </View>
      </View>
    );
  }

  render() {
    const { selectedVendorId, vendors } = this.state;
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

    const markers = this.state.vendors.map((marker, index) => {
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
          ref={marker => { this.markers[index] = marker; }}
          coordinate={this.makeCoordinate(marker)} 
          key={index} 
          onPress={e => {
              this.setState({markerPressed: true});
              this._carousel.snapToItem(index);
              this.centerMarker(index);
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
              alignItems: 'center'
            }}
            onPress={() => { 
              if (marker.menu && marker.menu.length > 0)
                this.props.onCalloutPress(marker)
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={mainStyles.cardH3}>{marker.boothNumber}. {marker.name}</Text>
              <Icon name='chevron-thin-right' type='Entypo' style={{ marginLeft: 8, fontSize: 12 }}/>
            </View>
          </Callout>
        </Marker.Animated>
      )}
    );
    
    return (
      <View style={styles.container}>
        <MapView
          ref={map => this.map = map}
          loadingEnabled
          initialRegion={this.state.region}
          style={[styles.container, { marginTop: this.state.marginTopHack }]}
          showsUserLocation={true}
          showsMyLocationButton={true}
          onMapReady={()=>{
            this.setState({ marginTopHack: 0 });
          }}
        >
          {markers}
        </MapView>

        {this.state.notifBoxShow &&
        <View
          style={mainStyles.mapNotifBox}
        >
          <Text style={mainStyles.mapNotifBoxText}>
            Pick up your order {vendors[selectedVendorId] ?'at ' + vendors[selectedVendorId].name : 'now'}!
          </Text>
        </View>}
        
        <Carousel
          ref={(c) => { this._carousel = c; }}
          containerCustomStyle={styles.scrollView}
          data={this.state.vendors}
          renderItem={this._renderItem}
          sliderHeight={CARD_HEIGHT}
          sliderWidth={width}
          itemWidth={CARD_WIDTH}
          onSnapToItem={(index) => {
            if (this.state.finishedScrollingToVendor) {
              console.log('snapping to ' + index);
              this.centerMarker(index);
              this.showMarkerCallout(index);
            }
          }}
          enableMomentum={true}
          decelerationRate={0.9}
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
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: "#FFF",
    marginBottom: 0,
    shadowColor: "#000",
    shadowRadius: 5,
    shadowOpacity: 0.3,
    shadowOffset: { x: 2, y: -2 },
    height: CARD_HEIGHT,
    overflow: "hidden"
  },
  cardImage: {
    flex: 3,
    width: "100%",
    height: "100%",
    alignSelf: "center",
  },
  textContent: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: moderateScale(10)
  },
  cardTitle: {
    fontSize: 12,
    marginTop: 5,
    textAlign: 'center',
    marginBottom: 0,
    paddingBottom: 0
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