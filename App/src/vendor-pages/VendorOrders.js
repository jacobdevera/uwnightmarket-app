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

const vendorID = "9O2WgapdDsbo6t0vy2nHSXIsj072";

class VendorOrders extends Component {
    constructor(props) {
        super(props);
        this.state = {
            orders: [],
            update: false
        }
    }

    componentDidMount() {
        // console.log("hello") // let orderRef = firebase.database().ref('/orders/' +
        // // firebase.auth().currentUser.uid).orderByKey(); let orderRef = firebase
        // .database()     .ref('/orders/')     .orderByKey(); orderRef     .on('value')
        //     .then((snapshot) => {         console.log(snapshot.val());         let
        // orders = snapshot.val();         let orderList = [];         let promises =
        // [];         Object             .keys(orders)             .forEach((key) => {
        //                orders[key].id = key;                 if (orders[key].vendorId
        // == vendorID ) {                     orderList.push(orders[key]);
        //    }             });         this.setState({orders: orderList})     });
        // console.log(firebase.auth().currentUser.uid);
        let orderRef = firebase
            .database()
            .ref(`/vendor-orders/${firebase.auth().currentUser.uid}`)
            .orderByKey();
        orderRef.on('value', (snapshot) => {
            if (snapshot.val()) {
                let orderList = [];
                let promises = [];
                Object
                    .keys(snapshot.val())
                    .forEach((key) => {
                        promises.push(firebase.database().ref(`/orders/${key}`).once('value').then((orderSnapshot) => {
                            order = orderSnapshot.val();
                            order.id = key;
                            orderList.push(order);
                        }))
                    })
                Promise
                    .all(promises)
                    .then((responses) => {
                        this.setState({orders: orderList});
                    })
                    .catch((error) => console.log(error))
            }
        });

    }

    handleStatusChange = (index, selectedItem) => {
        let orderId = selectedItem.id;
        // let orderId = this.pickedid; console.log(orderId)
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
            // this.componentDidMount();
        }
    }

    render() {
        return (
            <Container>
                <AppHeader navigation={this.props.navigation}>
                    Orders
                </AppHeader>
                <Content style={styles.paddedContainer}>
                    {this.state.orders
                        ? <OrderList
                                orders={this.state.orders}
                                vendor={true}
                                handleStatusChange={this.handleStatusChange}></ OrderList>
                        : <Spinner size='small'/>}
                </Content>
            </Container>
        );
    }
}

export { VendorOrders }