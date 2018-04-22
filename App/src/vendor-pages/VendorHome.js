import React, { Component } from 'react';
import { Image, View } from 'react-native';
import { Container, Content, Header, Left, Button, Icon, Right, Body, Text, Title, List, ListItem, Thumbnail } from 'native-base';
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
                            <Text style={[styles.center]}>Vendor Booth #: {vendor.boothNumber}</Text>
                        </View>
                    </View>
                    }

                    <View style={styles.section}>
                        <Text style={[styles.header, styles.h2]}>General Info</Text>
                        <Text>Water is in the center of Red Square</Text>
                        <Text>Please don't burn your booth down</Text>
                        <Text>Ask the staff in hot pink hats if you have any questions</Text>
                        <Text>Free food for the staff and volunteers is always welcomed</Text>
                    </View>

                    <View style={[styles.section, styles.fullWidth]}>
                        <Text style={[styles.header, styles.h2]}>Contacts</Text>
                        <List>
                            <ListItem avatar>
                                <Left>
                                   {/* <Thumbnail source={{ uri: 'Image URL' }} />}*/}
                                </Left>
                                <Body>
                                    <Text>Jessica Ong</Text>
                                    <Text note>TSA President</Text>
                                    <Text note>206-123-4567</Text>
                                </Body>
                            </ListItem>
                            <ListItem avatar>
                                <Left>
                                   {/* <Thumbnail source={{ uri: 'Image URL' }} />}*/}
                                </Left>
                                <Body>
                                    <Text>Alex Tang</Text>
                                    <Text note>Vendor Lead</Text>
                                    <Text note>206-123-4567</Text>
                                </Body>
                            </ListItem>
                        </List>
                    </View>
                </Content>
            </Container>
        );
    }
}

export { VendorHome };