import React, { Component } from 'react';
import { Image, View } from 'react-native';
import { Button, Container, Content, H1, H2, H3, Text } from 'native-base';
import firebase from 'firebase';

import { AppHeader } from '../components';
import styles from '../styles';
import MapScreen from "./MapScreen";

const Map = (props) => {
    const goToVendor = (vendor) => {
        if (firebase.auth().currentUser.isAnonymous)
            props.navigation.navigate('VendorView', { vendor: vendor});
    }
    console.log('muh props')
    console.log(props.screenProps);
    console.log('muh params');
    console.log(props.navigation.state);
    return (
        <Container>
            <AppHeader navigation={props.navigation}>
                Map
            </AppHeader>
            <MapScreen 
                clearInitialNotif={props.screenProps.clearInitialNotif} 
                notif={props.screenProps.state.initialNotif} 
                onCalloutPress={goToVendor}/>
        </Container>);
}

export { Map }