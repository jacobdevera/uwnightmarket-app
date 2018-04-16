import React, { Component } from 'react';
import { Alert, Image, View, Modal, StyleSheet, FlatList, Platform } from 'react-native';
import { Button, Container, Content, Card, CardItem, CheckBox, Body, Text, Icon, Left, Right, Thumbnail, List, ListItem, Toast } from 'native-base';
import firebase from 'firebase';
import FCM, { FCMEvent, RemoteNotificationResult, WillPresentNotificationResult, NotificationType, 
    NotificationActionType, NotificationActionOption, NotificationCategoryOption } from 'react-native-fcm';
import { NavigationActions } from 'react-navigation';

import { Status, limits } from '../App';
import { AppHeader } from '../components';
import { Spinner } from '../components/common';
import styles from '../styles';

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
        let descs = vendor.menu.map(item => item.desc);
        vendor.menu.forEach((item, index) => {
            order[index] = { 
                name: item.name, 
                price: item.price,
                quantity: 0, 
                available: item.traits.includes('available') 
            }
        });
        FCM.getFCMToken().then(token => {
            console.log(token);
            this.setState({ vendor: vendor, order: order, token: token || "", descs: descs })
        });
    }

    updateQuantity = (index, add) => {
        let order = this.state.order.slice();
        let totalQuantity = order.reduce((prev, curr) => {
            return { quantity: prev.quantity + curr.quantity} ;
        });
        if (add && totalQuantity.quantity < limits.quantity) {
            order[index].quantity++;
        } else if (!add && order[index].quantity > 0) {
            order[index].quantity--;
        } else if (totalQuantity.quantity >= limits.quantity) {
            Toast.show({
                text: `Cannot exceed ${limits.quantity} items`,
                buttonText: 'okay',
                position: 'bottom',
                type: 'danger',
                duration: 5000
            });
        }
        this.setState({ order: order })
    }

    lessThanMaxOrders = () => {
        return new Promise((resolve) => {
            firebase.database().ref(`/user-orders/${firebase.auth().currentUser.uid}`).once('value', (snapshot) => {
                if (snapshot.val()) {
                    activeOrders = Object.values(snapshot.val()).filter((order) => order !== Status.PICKED_UP);
                    if (activeOrders.length >= limits.orders) {
                        Toast.show({
                            text: `Cannot exceed ${limits.orders} active orders`,
                            buttonText: 'okay',
                            position: 'bottom',
                            type: 'danger',
                            duration: 5000
                        });
                        resolve(false);
                    } else {
                        resolve(true);
                    }
                } else {
                    resolve(true);
                }
            })
        });
    }

    submitOrder = () => {
        let newOrderKey = firebase.database().ref().child('orders').push().key;
        let userId = firebase.auth().currentUser.uid;
        let filtered = this.state.order.filter((item) => item.quantity > 0);
        
        let orderData = {
            vendorName: this.state.vendor.name,
            vendorId: this.state.vendor.userId,
            userId: userId,
            userToken: this.state.token,
            time: firebase.database.ServerValue.TIMESTAMP,
            items: filtered,
            status: Status.NOT_READY,
            platform: Platform.OS
        }

        let updates = {};
        updates['/orders/' + newOrderKey] = orderData;
        updates['/user-orders/' + userId + '/' + newOrderKey] = Status.NOT_READY; 
        updates['/vendor-orders/' + this.state.vendor.userId + '/orders/' + newOrderKey] = Status.NOT_READY;
        
        Alert.alert(
            'Are you sure?',
            `When your order is ready, you must go to the vendor's booth and be prepared to pay with cash. You will be unable to delete your order after two minutes.`,
            [
                {text: 'Cancel', style: 'cancel'},
                {text: 'Submit', onPress: () => firebase.database().ref().update(updates).then((response) => {
                        Toast.show({ 
                            text: `Order submitted`,
                            position: 'bottom', 
                            duration: 5000
                        })
                        this.props.navigation.navigate({ routeName: 'MyOrders' });
                    }
                )},
            ]
        );
    }
    
    render() {
        let { vendor, order, descs } = this.state;
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
                    <View style={[styles.rowSpaceBetween, styles.section]}>
                        {vendor.canOrder && <View style={{flex: 1}}><Text style={[{textAlign: 'center'}, styles.bold]}>Qty</Text></View>}
                        <View style={{flex: 1}}><Text style={[{textAlign: 'center'}, styles.bold]}>Item</Text></View>
                        <View style={{flex: 1}}><Text style={[{textAlign: 'right'}, styles.bold]}>Price</Text></View>
                    </View>
                    {vendor &&
                        <FlatList
                            data={order}
                            extraData={this.state}
                            keyExtractor={(item, index) => item.name + index}
                            renderItem={({item, index}) => {
                                return (
                                        <ListItem style={{ marginLeft: 0 }}>
                                            {vendor.canOrder &&
                                            <Left style={{ flex: 1 }}>
                                                <Button disabled={!item.available} onPress={() => { 
                                                    if (item.available) this.updateQuantity(index, false) 
                                                }}>
                                                    <Text>-</Text>
                                                </Button>
                                                <Text style={[{ flex: 1, marginLeft: 0 }, styles.center]}>{order[index].quantity}</Text>
                                                <Button disabled={!item.available} onPress={() => { 
                                                    if (item.available) this.updateQuantity(index, true) 
                                                }}>
                                                    <Text>+</Text>
                                                </Button>
                                            </Left>}
                                            <Body style={{ flex: 2 }}>
                                                <Text style={styles.bold}>{item.name}</Text>
                                                {descs[index] && <Text style={styles.menuDesc}>{descs[index]}</Text>}
                                            </Body>
                                            <Right>
                                                <Text>${item.price}</Text>
                                            </Right>
                                        </ListItem>
                                )
                            }}
                        />}
                    {vendor.canOrder ? 
                    <View>
                        <Text style={[styles.center, styles.bold, styles.row]}>Total Due: ${totalPrice}</Text>
                        <View style={styles.row}>
                            <Button disabled={!vendor.canOrder || totalQuantity <= 0} 
                                onPress={async () => { if (await this.lessThanMaxOrders()) this.submitOrder() }}>
                                <Text>Submit Order</Text>
                            </Button>
                        </View>
                    </View>
                    : <Text style={[styles.section, styles.center]}>This vendor does not support mobile ordering.</Text>}
                </Content>
            </Container>
        );
    }
}