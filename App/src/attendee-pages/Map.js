import React, { Component } from 'react';
import { Image, View } from 'react-native';
import { Button, Container, Content, H1, H2, H3, Text } from 'native-base';

import { AppHeader } from '../components';
import styles from '../styles';
import MapScreen from "./MapScreen";

const Map = (props) => {
    const goToVendor = (vendor) => {
        props.navigation.navigate('VendorView', { vendor: vendor});
    }

    return (
        <Container>
            <AppHeader navigation={props.navigation}>
                Map
            </AppHeader>
            <MapScreen onCalloutPress={goToVendor}/>
        </Container>);
}

export { Map }