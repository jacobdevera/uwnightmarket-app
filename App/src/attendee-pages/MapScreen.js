import React, { Component } from "react";
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Animated,
  Image,
  Dimensions,
  TouchableOpacity,
} from "react-native";

import MapView ,{ Callout, } from "react-native-maps";


const Images = [
  { uri: "https://s.yimg.com/ny/api/res/1.2/g7I3e.RD0ngPAwFoft5kPg--/YXBwaWQ9aGlnaGxhbmRlcjtzbT0xO3c9MTI4MDtoPTk2MA--/http://media.zenfs.com/en-US/homerun/delish_597/51abed18dd08738b233b51058275c63f" },
  { uri: "https://www.visitstockton.org/images/made/images/remote/https_files.idssasp.com/public/C102/0740e0c3-1adc-45f6-902c-e09b99d7a4ab/4cc8d671-c1b3-4114-8448-9274ffcb5379_768_432auto_s_c1.jpg" },
  { uri: "https://www.stpetepride.com/assets/media/bbq.jpg" },
  { uri: "https://i.pinimg.com/736x/d0/38/85/d03885db785eca97fee927118b43aa99--tornado-potato-tornados.jpg" }
]

const { width, height } = Dimensions.get("window");

const CARD_HEIGHT = height / 4;
const CARD_WIDTH = CARD_HEIGHT - 50;

export default class MapScreen extends Component {

    constructor(props){
        super();
        this.centerMarker = this.centerMarker.bind(this);
        // this.scrollView = null;
    }

  state = {
    markers: [
      {
        coordinate: {
          latitude: 47.656139,
          longitude: -122.309745,
        },
        title: "Rice",
        description: "Best Shrimp Rice",
        image: Images[0],
      },
      {
        coordinate: {
          latitude: 47.655687,
          longitude: -122.309927,
        },
        title: "No.1 Mexican",
        description: "Best Taco",
        image: Images[1],
      },
      {
        coordinate: {
          latitude: 47.656131,
          longitude: -122.308924,
        },
        title: "BBQ",
        description: "All kinds of BBQ",
        image: Images[2],
      },
      {
        coordinate: {
          latitude: 47.655611,
          longitude: -122.308962,
        },
        title: "Tornato Potato",
        description: "Delicious",
        image: Images[3],
      },
    ],
    region: {
      latitude: 47.655990,
      longitude: -122.309463,
      latitudeDelta: 0.0025,
      longitudeDelta: 0.0025,
    },
    currentCard :1
  };

 
  componentWillMount() {
    this.index = 0;
    this.animation = new Animated.Value(0);
  }
  componentDidMount() {
    // We should detect when scrolling has stopped then animate
    // We should just debounce the event listener here
    this.animation.addListener(({ value }) => {
      let index = Math.floor(value / CARD_WIDTH + 0.3); // animate 30% away from landing on the next item
      if (index >= this.state.markers.length) {
        index = this.state.markers.length - 1;
      }
      if (index <= 0) {
        index = 0;
      }

      clearTimeout(this.regionTimeout);
      this.regionTimeout = setTimeout(() => {
        if (this.index !== index) {
          this.index = index;
          const { coordinate } = this.state.markers[index];
          this.map.animateToRegion(
            {
              ...coordinate,
              latitudeDelta: this.state.region.latitudeDelta,
              longitudeDelta: this.state.region.longitudeDelta,
            },
            350
          );
        }
      }, 10);
    });
  }

  centerMarker(key){
    // const _scrollView = this.scrollView;
    // console.log(_scrollView)
    // if (_scrollView) {
    
    // var diff = this.sv.props.key
    console.log(this.sv)
    console.log(key)
    this.sv._component.scrollTo({x:  (key - 1) * 140});
    // this.setState({currentCard: this.sv.props.key});
    // }
  }

å
  render() {
    const interpolations = this.state.markers.map((marker, index) => {
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
          initialRegion={this.state.region}
          style={styles.container}
        >
          {this.state.markers.map((marker, index) => {
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
              <MapView.Marker key={index} coordinate={marker.coordinate} 
              onPress={e => {
                  console.log(e.nativeEvent);
                  // breaks tapping header -> this.centerMarker(index);
                }
              }>
              
                {/* <Animated.View style={[styles.markerWrap, opacityStyle]}> */}
                  {/* <Animated.View style={[styles.ring, scaleStyle]}> */}
                  {/* <View style={styles.marker} /> */}
                    <Callout>
                      {/* <CustomCallout> */}
                        <Text>{marker.title}</ Text>
                      {/* </ CustomCallout> */}
                   </Callout>
                  {/* </ Animated.View> */}
                {/* </Animated.View> */}
              </MapView.Marker>
            );
          })}
        </MapView>
        <Animated.ScrollView 
          ref = {sv => this.sv = sv}
          horizontal
          scrollEventThrottle={1}
          showsHorizontalScrollIndicator={false}
          snapToInterval={CARD_WIDTH}

          onScroll={Animated.event(
            [
              {
                nativeEvent: {
                  contentOffset: {
                    x: this.animation,
                  },
                },
              },
            ],
            { useNativeDriver: true }
          )}
          style={styles.scrollView}
          contentContainerStyle={styles.endPadding}
        >
          {this.state.markers.map((marker, index) => (
            <View style={styles.card} key={index}>
              <Image
                source={marker.image}
                style={styles.cardImage}
                resizeMode="cover"
              />
              <View style={styles.textContent}>
                <Text numberOfLines={1} style={styles.cardtitle}>{marker.title}</Text>
                <Text numberOfLines={1} style={styles.cardDescription}>
                  {marker.description}
                </Text>
              </View>
            </View>
          ))}
        </Animated.ScrollView>
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
    padding: 10,
    elevation: 2,
    backgroundColor: "#FFF",
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowRadius: 5,
    shadowOpacity: 0.3,
    shadowOffset: { x: 2, y: -2 },
    height: CARD_HEIGHT,
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