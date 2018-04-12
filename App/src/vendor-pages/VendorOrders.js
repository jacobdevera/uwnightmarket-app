import React, { Component } from 'react';
import { Alert, Image, View, Modal, StyleSheet, FlatList } from 'react-native';
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
import { StackNavigator } from "react-navigation";
import firebase from 'firebase'

import { Status } from '../App';
import { SERVER_KEY, FCM_URL } from '../FirebaseConstants';
import { AppHeader, StackHeader, OrderList } from '../components';
import { Spinner } from '../components/common';
import styles, { config } from '../styles';

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
            orders: {}
        }
        this.orderRef = firebase.database().ref(`/vendor-orders/${firebase.auth().currentUser.uid}`).orderByKey();
    }

    componentDidMount() {
        const { params } = this.props.navigation.state;
        this.orderRef.once('value', (snapshot) => {
            if (snapshot.val()) {
                let orderObj = {};
                let promises = [];
                Object
                    .keys(snapshot.val())
                    .forEach((key) => {
                        promises.push(firebase.database().ref(`/orders/${key}`).once('value').then((snapshot) => {
                            let order = snapshot.val();
                            order.id = snapshot.key;
                            orderObj[snapshot.key] = order;
                        }))
                    })
                Promise
                    .all(promises)
                    .then((responses) => {
                        this.setState({ orders: orderObj });
                        this.orderRef.on('child_added', this.orderChanged);
                        this.orderRef.on('child_changed', this.orderChanged);
                        this.orderRef.on('child_removed', this.orderRemoved);
                    })
                    .catch((error) => console.log(error))
            }
        });
    }

    orderChanged = (snapshot) => {
        let newOrderObj = Object.assign({}, this.state.orders);
        firebase.database().ref(`/orders/${snapshot.key}`).once('value').then((orderSnapshot) => {
            let order = orderSnapshot.val();
            order.id = snapshot.key;
            newOrderObj[snapshot.key] = order;
            this.setState({ orders: newOrderObj });
        })
    }

    orderRemoved = (snapshot) => {
        let newOrderObj = Object.assign({}, this.state.orders);
        newOrderObj[snapshot.key] = null;
        this.setState({ orders: newOrderObj });
    }

    componentWillUnmount() {
        this.orderRef.off();
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

            if (status[index] === Status.READY) {
                let notifBody = this.buildNotification(selectedItem);
                this.sendNotification(JSON.stringify(notifBody));
            }
        }
    }

    buildNotification = (order) => {
        return {
            "to": order.userToken,
            "notification": {
                "title": `Order ready!`,
                "body": `Please head to ${order.vendorName} to pick it up.`,
                "sound": "default"
            },
            data: {
                targetScreen: 'detail'
            },
            "priority": 10
        };
    }

    sendNotification = async (body) => {
        console.log(body);
        let headers = new Headers({
            "Content-Type": "application/json",
            "Authorization": "key=" + SERVER_KEY
        });

        try {
            let response = await fetch(FCM_URL, { method: "POST", headers, body });
            console.log(response);
            try {
                response = await response.json();
                if (!response.success) {
                    Alert.alert('Failed to send notification, check error log')
                }
            } catch (err) {
                Alert.alert('Failed to send notification, check error log')
            }
        } catch (err) {
            Alert.alert(err && err.message)
        }
    }

    render() {
        const { params } = this.props.navigation.state;
        const { orders } = this.state;
        return (
            <Container>
                <AppHeader navigation={this.props.navigation}>
                    Orders
                </AppHeader>
                <Content style={styles.paddedContainer}>
                    {orders && Object.values(orders).length > 0
                        ? <OrderList
                            orders={this.getFilteredOrders(Object.values(orders), params && params.active)}
                            vendor={true}
                            handleStatusChange={this.handleStatusChange}></ OrderList>
                        : <Text style={[styles.section, styles.center]}>No one has ordered from you yet.</Text>}
                </Content>
            </Container>
        );
    }
}

export { VendorOrders }