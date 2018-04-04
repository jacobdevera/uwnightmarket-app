import React, { Component } from 'react';
import { Image, View, Modal, StyleSheet, FlatList } from 'react-native';
import { Button, Container, Content, Card, CardItem, CheckBox, Body, Text, Icon, Left, Right, Thumbnail, List, ListItem, Radio, Badge } from 'native-base';
import { StackNavigator } from "react-navigation";
import firebase from 'firebase'

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
    },
});

const vendorID = "9O2WgapdDsbo6t0vy2nHSXIsj072";


class VendorOrders extends Component {
    constructor(props){
        super(props);
        this.state = {
            orders: [],
        }
    }
    
    componentDidMount(){
        console.log("hello")
        // let orderRef = firebase.database().ref('/orders/' + firebase.auth().currentUser.uid).orderByKey();
        let orderRef = firebase.database().ref('/orders/').orderByKey();
        
        orderRef.once('value').then((snapshot) => {
            console.log(snapshot.val());
            let orders = snapshot.val();
            let orderList = [];
            let promises = [];
            Object.keys(orders).forEach((key) => {
                orders[key].id = key;
                if (orders[key].vendorId == vendorID) {
                    orderList.push(orders[key]);
                } 
            });
            this.setState({orders : orderList})
        });


    }

    // handleStatusChange = (index) => {
    //     // let orderId = this.state.selectedItem.id;
    //     let orderId = this.pickedid;
    //     console.log(orderId)
    //     let status = ['NOT READY', 'READY', 'PICKED UP'];
    //     let updates = {status : status[index]};
    //     firebase.database().ref(`/orders/${orderId}`).update(updates);
    //     this.setState();
    // }

    render() {
        return (
        <Container>
            <AppHeader navigation={this.props.navigation}>
                Orders
            </AppHeader>
            <Content style={styles.paddedContainer}>
                    {this.state.orders ?
                        <FlatList
                            data={this.state.orders}
                            extraData={this.state}
                            // keyExtractor={ item => item.name }
                            renderItem={({ item }) => {
                                let foodNames = [];
                                item.items.forEach((food) => foodNames.push(food.name));
                                return (
                                    <OrderList  orders = {this.state.orders} vendor = {true} ></ OrderList>
                                )
                            }}
                        />
                        : <Spinner size='small' />}
                </Content>
        </Container>);
    }
}

export { VendorOrders }