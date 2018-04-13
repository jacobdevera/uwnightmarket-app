import React, {Component} from "react";
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    ScrollView,
    Animated,
    Image,
    Dimensions,
    TouchableOpacity
} from "react-native";

import MapView, {Callout} from "react-native-maps";

class MapTest extends Component {
    state = {
        mapRegion: null,
        lastLat: null,
        lastLong: null
    }

    componentDidMount() {
        this.watchID = navigator
            .geolocation
            .watchPosition((position) => {
                // Create the object to update this.state.mapRegion through the onRegionChange
                // function
                let region = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    latitudeDelta: 0.00922 *1.5,
                    longitudeDelta: 0.00421 *1.5
                }
                this.onRegionChange(region, region.latitude, region.longitude);
            });
    }

    componentWillUnmount() {
        navigator.geolocation.clearWatch(this.watchID);
      }

    onRegionChange(region, lastLat, lastLong) {
        this.setState({
            mapRegion: region,
            // If there are no new values set the current ones
            lastLat: lastLat || this.state.lastLat,
            lastLong: lastLong || this.state.lastLong
        });
    }

    onMapPress(e) {
        let region = {
          latitude:       e.nativeEvent.coordinate.latitude,
          longitude:      e.nativeEvent.coordinate.longitude,
          latitudeDelta:  0.00922*1.5,
          longitudeDelta: 0.00421*1.5
        }
        this.onRegionChange(region, region.latitude, region.longitude);
      }

    render() {
        return (

          <View style={{flex: 1}}>
            <Text>1222333</Text>
            <MapView
              style={styles.map}
              region={this.state.mapRegion}
              showsUserLocation={true}
              followUserLocation={true}
              onRegionChange={this.onRegionChange.bind(this)}>
              <MapView.Marker
                coordinate={{
                  latitude: (this.state.lastLat + 0.00050) || -36.82339,
                  longitude: (this.state.lastLong + 0.00050) || -73.03569,
                }}>
                <View>
                  <Text style={{color: '#000'}}>
                    { this.state.lastLong } / { this.state.lastLat }
                  </Text>
                </View>
              </MapView.Marker>
            </MapView>
          </View>
        );
      }

    }

    export default MapTest;