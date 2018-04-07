import React, {Component} from 'react';
import {Image, View, Modal, StyleSheet, FlatList} from 'react-native';
import {
    Button,
    Container,
    Content,
    Card,
    CardItem,
    CheckBox,
    Body,
    Text,
    Icon,
    Left,
    Right,
    Thumbnail,
    List,
    ListItem,
    Radio,
    Badge
} from 'native-base';
import {StackNavigator} from "react-navigation";
import firebase from 'firebase'

import { Status } from '../App';
import {AppHeader, StackHeader, OrderList} from '../components';
import {Spinner} from '../components/common';
import styles, {config} from '../styles';

const modalStyles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.3)'
    },
    innerContainer: {
        margin: 16,
        backgroundColor: 'white'
    }
});

class VendorOrders extends Component {
    constructor(props) {
        super(props);
        this.state = {
            orders: [],
            update: false
        }
        this.orderRef = firebase.database().ref(`/vendor-orders/${firebase.auth().currentUser.uid}`).orderByKey();
    }

    componentDidMount() {
        const { params } = this.props.navigation.state;
        this.orderRef.on('value', (snapshot) => {
            if (snapshot.val()) {
                let orderList = [];
                let promises = [];
                Object
                    .keys(snapshot.val())
                    .forEach((key) => {
                        promises.push(firebase.database().ref(`/orders/${key}`).once('value').then((orderSnapshot) => {
                            let order = orderSnapshot.val();
                            order.id = key;
                            orderList.push(order);
                        }))
                    })
                Promise
                    .all(promises)
                    .then((responses) => {
                        this.setState({ orders: orderList });
                    })
                    .catch((error) => console.log(error))
            }
        });
    }

    componentWillUnmount() {
        this.orderRef.off('value');
    }

    // determine which orders to display whether on active or completed screen
    getFilteredOrders = (orders, active) => {
        return orders.filter((order) => {
            return ((active && order.status !== Status.PICKED_UP) 
                || (!active && order.status === Status.PICKED_UP))
        });
    }

    handleStatusChange = (index, selectedItem) => {
        let orderId = selectedItem.id;
        if (index <= 2) {
            let status = ['NOT READY', 'READY', 'PICKED UP'];
            let updates = {
                status: status[index]
            };
            firebase
                .database()
                .ref(`/orders/${orderId}`)
                .update(updates);
            let updates2 = {};
            updates2['/user-orders/' + selectedItem.userId + '/' + orderId] = status[index];
            updates2['/vendor-orders/' + selectedItem.vendorId + '/' + orderId] = status[index];
            firebase.database().ref().update(updates2);
        }
    }

    render() {
        const { params } = this.props.navigation.state;
        return (
            <Container>
                <AppHeader navigation={this.props.navigation}>
                    Orders
                </AppHeader>
                <Content style={styles.paddedContainer}>
                    {this.state.orders
                        ? <OrderList
                                orders={this.getFilteredOrders(this.state.orders, params && params.active)}
                                vendor={true}
                                handleStatusChange={this.handleStatusChange}></ OrderList>
                        : <Spinner size='small'/>}
                </Content>
            </Container>
        );
    }
}

export { VendorOrders }