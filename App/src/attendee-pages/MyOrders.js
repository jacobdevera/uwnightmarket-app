import React, { Component } from 'react';
import { Image, View } from 'react-native';
import { Button, Container, Content, H1, H2, H3, Text } from 'native-base';
import firebase from 'firebase';

import { AppHeader } from '../components';
import styles from '../styles';

class MyOrders extends Component {
    constructor(props) {
        super(props);
        this.state = { orders: [] }
    }

    componentDidMount() {
        let orderRef = firebase.database().ref('/orders').orderByKey();
        firebase.auth().currentUser.getIdToken(true).then((token) => {
            fetch('https://us-central1-uwnightmarket-90946.cloudfunctions.net/getOrders', { 
                method: 'GET', 
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            }).then((response) => {
                    return response.json();
            }).then((data) => {
                    console.log(data);
            });
        }).catch(function (err) {
            console.error(err);
        });
        
    }

    render() {
        return (
            <Container>
                <AppHeader navigation={this.props.navigation}>
                    My Orders
                </AppHeader>
                <View style={styles.column}>
                    <Text>You have no active orders right now.</Text>
                    <Button style={{ alignSelf: 'center' }} onPress={() => this.props.navigation.navigate('VendorNavigator')}>
                        <Text>Order Now</Text>
                    </Button>
                </View>
            </Container>);
    }
}

export { MyOrders }