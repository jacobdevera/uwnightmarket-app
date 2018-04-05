import React, { Component } from 'react';
import { Image, View } from 'react-native';
import { Button, Container, Content, H1, H2, H3, Text, FlatList, Card, CardItem, Body } from 'native-base';
import firebase from 'firebase';

import { AppHeader, OrderList } from '../components';
import { Status } from '../App';
import styles from '../styles';

class MyOrders extends Component {
    constructor(props) {
        super(props);
        this.state = { orders: [] }
    }

    componentDidMount() {
        let orderRef = firebase.database().ref(`/user-orders/${firebase.auth().currentUser.uid}`).orderByKey();
        orderRef.on('value', (snapshot) => {
            if (snapshot.val()) {
                let orderList = [];
                let promises = [];
                Object.keys(snapshot.val()).forEach((key) => {
                    promises.push(firebase.database().ref(`/orders/${key}`).once('value').then((orderSnapshot) => {
                        let order = orderSnapshot.val();
                        order.id = key;
                        orderList.push(order);
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
                    {this.state.orders && this.state.orders.length > 0 ? 
                    <View>
                        <View style={styles.section}>
                            <Text style={ [styles.header, styles.h1] }>Active Orders</Text>
                            <OrderList orders={this.state.orders.filter((order) => order.status !== Status.PICKED_UP)} vendor={false} /> 
                        </View>
                        <View style={styles.section}>
                            <Text style={ [styles.header, styles.h1] }>Past Orders</Text>
                            <OrderList orders={this.state.orders.filter((order) => order.status == Status.PICKED_UP)} vendor={false} />
                        </View>
                    </View>
                    : <View style={[styles.column]}>
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