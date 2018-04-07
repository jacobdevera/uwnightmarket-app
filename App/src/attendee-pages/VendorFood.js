import React, { Component } from 'react';
import { Image, View, Modal, StyleSheet, FlatList } from 'react-native';
import { Button, Container, Content, Card, CardItem, CheckBox, Body, Text, Icon, Left, Right, Thumbnail, List, ListItem, Toast } from 'native-base';
import firebase from 'firebase';

import { Status } from '../App';
import { AppHeader } from '../components';
import { Spinner } from '../components/common';
import styles from '../styles';

const MAX_QUANTITY = 7;

export default class VendorFood extends Component {
    constructor() {
        super();
        this.state = {
            vendor: {},
            order: [],
            showToast: false
        }
    }

    componentDidMount() {
        const { params } = this.props.navigation.state;
        const vendor = params ? params.vendor : null;
        let order = new Array(vendor.menu.length);
        vendor.menu.forEach((item, index) => {
            order[index] = { 
                name: item.name, 
                price: item.price, 
                quantity: 0, 
                available: item.traits.includes('available') 
            }
        });

        this.setState({ vendor: vendor, order: order });
    }

    updateQuantity = (index, add) => {
        let order = this.state.order.slice();
        let totalQuantity = order.reduce((prev, curr) => {
            return { quantity: prev.quantity + curr.quantity} ;
        });
        if (add && totalQuantity.quantity < MAX_QUANTITY) {
            order[index].quantity++;
        } else if (!add && order[index].quantity > 0) {
            order[index].quantity--;
        } else if (totalQuantity.quantity >= MAX_QUANTITY) {
            Toast.show({
                text: `Cannot exceed ${MAX_QUANTITY} items`,
                buttonText: 'okay',
                position: 'bottom',
                type: 'danger',
                duration: 5000
            });
        }
        this.setState({ order: order })
    }

    submitOrder = (totalQuantity) => {
        if (totalQuantity <= 0) {
            Toast.show({
                text: `Must order something`,
                position: 'bottom',
                type: 'danger',
                duration: 5000
            });
        } else {
            let newOrderKey = firebase.database().ref().child('orders').push().key;
            let userId = firebase.auth().currentUser.uid;
            let filtered = this.state.order.filter((item) => item.quantity > 0);
            
            let orderData = {
                vendorName: this.state.vendor.name,
                vendorId: this.state.vendor.userId,
                userId: userId,
                time: firebase.database.ServerValue.TIMESTAMP,
                items: filtered,
                status: Status.NOT_READY
            }

            let updates = {};
            updates['/orders/' + newOrderKey] = orderData;
            updates['/user-orders/' + userId + '/' + newOrderKey] = Status.NOT_READY; 
            updates['/vendor-orders/' + this.state.vendor.userId + '/' + newOrderKey] = Status.NOT_READY;
            
            firebase.database().ref().update(updates).then((response) => {
                this.props.navigation.goBack();
            });
        }
    }
    
    render() {
        let { vendor, order } = this.state;
        let totalQuantity = 0;
        let totalPrice = 0;
        order.forEach((item) => {
            totalQuantity += item.quantity;
            totalPrice += item.quantity * item.price;
        });
        return (
            <Container>
                <AppHeader 
                    navigation={this.props.navigation}
                    left={<Left>
                            <Button transparent onPress={() => this.props.navigation.goBack()}>
                                <Icon name='arrow-back' />
                            </Button>
                        </Left>}
                >
                    {vendor && vendor.name}
                </AppHeader>
                <Content style={styles.paddedContainer}>
                    <View style={[styles.rowSpaceBetween]}>
                        <View style={{flex: 1}}><Text style={{textAlign: 'center'}}>Qty</Text></View>
                        <View style={{flex: 1}}><Text style={{textAlign: 'right'}}>Item</Text></View>
                        <View style={{flex: 1}}><Text style={{textAlign: 'right'}}>Price</Text></View>
                    </View>
                    {vendor &&
                        <FlatList
                            data={order}
                            extraData={this.state}
                            keyExtractor={ item => item.name }
                            renderItem={({item, index}) => {
                                return (
                                        <ListItem>
                                            <Left>
                                                <Button disabled={!item.available} onPress={() => { 
                                                    if (item.available) this.updateQuantity(index, false) 
                                                }}>
                                                    <Text>-</Text>
                                                </Button>
                                                <Text style={[{flex:1, marginLeft: 0}, styles.center]}>{order[index].quantity}</Text>
                                                <Button disabled={!item.available} onPress={() => { 
                                                    if (item.available) this.updateQuantity(index, true) 
                                                }}>
                                                    <Text>+</Text>
                                                </Button>
                                            </Left>
                                            <Body>
                                                <Text>{item.name}</Text>
                                            </Body>
                                            <Right>
                                                <Text>${item.price}</Text>
                                            </Right>
                                        </ListItem>
                                )
                            }}
                        />}
                    <Text style={[styles.center, styles.bold, styles.row]}>Total Due: ${totalPrice}</Text>
                    <View style={styles.row}>
                        <Button disabled={!vendor.canOrder} onPress={() => this.submitOrder(totalQuantity)}><Text>Submit Order</Text></Button>
                    </View>
                    {!vendor.canOrder && <Text style={styles.center}>This vendor does not support mobile ordering.</Text>}
                </Content>
            </Container>
        );
    }
}