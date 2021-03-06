import React from 'react';
import { Container } from 'native-base';
import firebase from 'firebase';

import { AppHeader } from '../components';
import MapScreen from "./MapScreen";

const Map = (props) => {
    const goToVendor = (vendor) => {
        let isAttendee = firebase.auth().currentUser.isAnonymous;
        props.navigation.navigate('VendorView', { vendor: vendor, isAttendee: isAttendee });
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
        </Container>
    );
}

export { Map }