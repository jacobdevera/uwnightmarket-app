import React, { Component } from 'react';
import { Image, View } from 'react-native';
import { Button, Container, Content, H1, H2, H3, Text } from 'native-base';

import { AppHeader } from '../components';
import styles from '../styles';

const MyOrders = (props) => {
    return (
        <Container>
            <AppHeader navigation={props.navigation}>
                My Orders
            </AppHeader>
            <View style={styles.column}>
                <Text>You have no active orders right now.</Text>
                <Button style={{ alignSelf: 'center' }}>
                    <Text>Order Now</Text>
                </Button>
            </View>
        </Container>);
}

export { MyOrders }