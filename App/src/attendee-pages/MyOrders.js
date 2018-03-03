import React, { Component } from 'react';
import { Image, View } from 'react-native';
import { Button, Container, Content, H1, H2, H3, Text } from 'native-base';

import { AppHeader } from '../components';
import styles from '../styles';

class MyOrders extends Component {
    constructor(props) {
        super(props);
        this.state = { orders: [] }
    }

    componentDidMount() {
        let orderRef = firebase.database().ref('/orders').orderByKey();
        
    }

    render() {
        return (
            <Container>
                <AppHeader navigation={props.navigation}>
                    My Orders
                </AppHeader>
                <View style={styles.column}>
                    <Text>You have no active orders right now.</Text>
                    <Button style={{ alignSelf: 'center' }} onPress={() => props.navigation.navigate('VendorNavigator')}>
                        <Text>Order Now</Text>
                    </Button>
                </View>
            </Container>);
    }
}

export { MyOrders }