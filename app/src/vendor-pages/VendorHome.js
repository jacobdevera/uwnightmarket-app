import React, { Component } from 'react';
import { Image, View } from 'react-native';
import { Container, Content, Text } from 'native-base';
import firebase from 'firebase';

import styles from '../styles';
import { AppHeader } from '../components';

class VendorHome extends Component {
    constructor(props) {
        super(props);
        this.state = { vendor: {} };
    }

    componentDidMount() {
        let vendorRef = firebase.database().ref('/vendors/' + firebase.auth().currentUser.uid);
        vendorRef.once('value').then((snapshot) => {
            let vendorObj = snapshot.val();
            this.setState({ vendor: vendorObj });
        });
    }

    render() {
        let { vendor } = this.state;
        return (
            <Container>
                <AppHeader navigation={this.props.navigation}>
                    Home
                </AppHeader>
                <Content contentContainerStyle={styles.paddedContainer}>
                    {vendor &&
                    <View style={styles.section}>
                        <Image
                            style={styles.logo}
                            resizeMode="contain"
                            source={{ uri: vendor.img }}
                        />
                        <View style={styles.section}>
                            <Text style={[styles.center, styles.header, styles.h1]}>{vendor.name}</Text>
                            <Text style={[styles.center]}>Vendor Booth #{vendor.boothNumber}</Text>
                        </View>
                    </View>}

                    <View style={styles.section}>
                        <Text>Welcome to the UW Night Market app! Thank you for being a vendor with us. 
                            If you need any assistance, please see the contact information below 
                            or find one of our officers (in a grey Night Market shirt). 
                            We will come around to help you guys periodically as well.</Text>
                    </View>

                    <View style={[styles.section, styles.fullWidth]}>
                        <Text style={[styles.header, styles.h2]}>Contacts</Text>
                        <Text>For questions related to the event, vendor assistance, 
                            facilities assistance, or general questions, contact the 
                            TSA team (Jessica Ong) at <Text style={styles.bold}>(281) 698-7289</Text>.</Text>
                        <Text style={styles.section}>For questions related to the mobile app or if you run 
                            into technical difficulties, contact the app development team 
                            (Kevin Chen) at <Text style={styles.bold}>(425) 246-9204</Text>.</Text>
                    </View>
                </Content>
            </Container>
        );
    }
}

export { VendorHome };