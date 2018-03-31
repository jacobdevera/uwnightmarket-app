import React, { Component } from 'react';
import { Image, View } from 'react-native';
import { Button, Container, Content, H1, H2, H3, Text, FlatList, Card, CardItem, Body } from 'native-base';
import firebase from 'firebase';

import { AppHeader, OrderList } from '../components';
import styles from '../styles';

class MyOrders extends Component {
    constructor(props) {
        super(props);
        this.state = { orders: [] }
    }

    componentDidMount() {
        let orderRef = firebase.database().ref(`/user-orders/${firebase.auth().currentUser.uid}`).orderByKey();
        orderRef.once('value').then((snapshot) => {
            if (snapshot.val()) {
                let orderList = [];
                let promises = [];
                Object.keys(snapshot.val()).forEach((key) => {
                    promises.push(firebase.database().ref(`/orders/${key}`).once('value').then((orderSnapshot) => {
                        orderList.push(orderSnapshot.val());
                    }))
                })
                Promise.all(promises).then((responses) => {
                    this.setState({ orders: orderList });
                }).catch((error) => console.log(error))
            }
        });
    }

    render() {
        return (
            <Container>
                <AppHeader navigation={this.props.navigation}>
                    My Orders
                </AppHeader>
                <Content contentContainerStyle={styles.paddedContainer}>
                    {this.state.orders && this.state.orders.length > 0 ? <OrderList orders={this.state.orders} vendor={false} /> : 
                    <View style={[styles.column]}>
                        <Text style={styles.section}>You have no active orders right now.</Text>
                        <Button style={[{ alignSelf: 'center' }, styles.section]} onPress={() => this.props.navigation.navigate('VendorNavigator')}>
                            <Text>Order Now</Text>
                        </Button>
                    </View>
                    }
                </Content>
            </Container>);
    }
}

export { MyOrders }