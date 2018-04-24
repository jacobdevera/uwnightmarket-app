import React, { Component } from 'react';
import { Alert, Image, View, Modal, StyleSheet, FlatList, Platform, PushNotificationIOS } from 'react-native';
import { Button, Container, Content, Card, CardItem, CheckBox, Body, Text, Icon, Left, Right, Thumbnail, List, ListItem, Toast, Spinner } from 'native-base';
import firebase from 'firebase';
import FCM, { FCMEvent, RemoteNotificationResult, WillPresentNotificationResult, NotificationType, 
    NotificationActionType, NotificationActionOption, NotificationCategoryOption } from 'react-native-fcm';
import { NavigationActions } from 'react-navigation';

import { Status, limits, ErrorToken } from '../App';
import { AppHeader } from '../components';
import styles, { config, scale } from '../styles';

export default class VendorFood extends Component {
    constructor() {
        super();
        this.state = {
            vendor: {},
            order: [],
            showToast: false,
            subMenus: [],
            loading: true
        }
    }

    async componentDidMount() {
        const { params } = this.props.navigation.state;
        const vendor = params ? params.vendor : null;
        let order = new Array(vendor.menu.length);
        let descs = vendor.menu.map(item => item.desc);

        let subMenus = vendor.categories ? 
            vendor.categories.map(category => {
                return {
                    name: category,
                    menu: []
                }
            }) : [{ name: '', menu: [] }];

        vendor.menu.forEach((item, index) => {
            order[index] = { 
                name: item.name,
                trueIndex: index,
                price: item.price,
                quantity: 0, 
                available: item.traits.includes('available')
            }
            subMenus[item.hasOwnProperty('category') ? item.category : 0].menu.push(order[index]);
        });

        let token;
        if (vendor.canOrder) {
            try {
                let queueSnapshot = await firebase.database().ref(`/vendor-orders/${vendor.userId}/order_count`).once('value');
                currentQueueSize = queueSnapshot.val();
                vendor.currentQueueSize = currentQueueSize;
                token = await FCM.getFCMToken();
                console.log(token);
            } catch (e) { console.log(e);}
        }

        this.setState({ 
            vendor: vendor, 
            order: order, 
            token: token || "", 
            descs: descs, 
            subMenus: subMenus,
            loading: false
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

    submitOrder = async () => {
        try {
            await FCM.requestPermissions();
            if (this.state.token.length > 0) {
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
            } else {
                console.log(token);
                ErrorToken();
            }
        } catch (e) {
            console.log(e);
            ErrorToken();
        }
    }

    isQueueLong = () => this.state.vendor.currentQueueSize >= limits.queue;
    
    render() {
        let { vendor, order, descs, subMenus, loading } = this.state;
        let totalQuantity = 0;
        let totalPrice = 0;
        order.forEach((item) => {
            totalQuantity += item.quantity;
            totalPrice += item.quantity * item.price;
        });
        let subMenuLists = subMenus.map((subMenu) => {
            return (
                <View key={subMenu.name}>
                    {(subMenu.name.length > 0 && subMenu.menu.length > 0) &&<Text style={[styles.section, styles.bold]}>{subMenu.name}</Text>}
                    <FlatList
                        data={subMenu.menu}
                        extraData={this.state}
                        keyExtractor={(item) => item.name + item.trueIndex}
                        renderItem={({item, index}) => {
                            return (
                                    <View>
                                        <ListItem style={{ borderBottomWidth: 0, marginLeft: 0 }}>
                                            <Body style={{ flex: 2 }}>
                                                <Text>{item.name}</Text>
                                                {descs[item.trueIndex] && <Text style={styles.menuDesc}>{descs[item.trueIndex]}</Text>}
                                            </Body>
                                            {item.price > 0 && <Text>${item.price}</Text>}
                                        </ListItem>
                                        {vendor.canOrder &&
                                        <ListItem style={{ marginLeft: 0 }}>
                                            {item.available ? 
                                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
                                                <Button style={{ width: 48 }} disabled={!item.available} transparent onPress={() => { 
                                                    if (item.available) this.updateQuantity(item.trueIndex, false) 
                                                }}>
                                                    <Icon style={{ color: item.available ? config.colorPrimary : 'gray' }} name='remove' />
                                                </Button>
                                                <Text style={[{ width: 24, marginLeft: 0 }, styles.center]}>{order[item.trueIndex].quantity}</Text>
                                                <Button style={{ width: 48 }} disabled={!item.available} transparent onPress={() => { 
                                                    if (item.available) this.updateQuantity(item.trueIndex, true) 
                                                }}>
                                                    <Icon style={{ color: item.available ? config.colorPrimary : 'gray' }} name='add' />
                                                </Button>
                                            </View>
                                            : <Text style={{ marginLeft: 'auto', color: 'gray' }}>SOLD OUT</Text>}
                                        </ListItem>}
                                    </View>
                            )
                        }}
                    />
                </View>
            );
        })
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
                {!loading ?
                    <View>
                        <View style={[styles.rowSpaceBetween, styles.section]}>
                            <View style={{flex: 1}}><Text style={[{textAlign: 'left'}, styles.bold, styles.h2]}>Item</Text></View>
                            <View style={{flex: 1}}><Text style={[{textAlign: 'right'}, styles.bold, styles.h2]}>Price</Text></View>
                        </View>
                        {vendor && subMenuLists}
                        {vendor.canOrder ? 
                        <View>
                            <View style={[styles.row, { alignItems: 'center' }]}>
                                <Text style={[styles.bold, styles.h1, { flex: 1, textAlign: 'right' }]}>Total Due: </Text>
                                <Text style={[styles.h1, { flex: 1, textAlign: 'right'}]}>${totalPrice}</Text>
                            </View>
                            <View style={[styles.row, { alignItems: 'center', paddingTop: 0 }]}>
                                <Text style={[styles.bold, { flex: 1, textAlign: 'right', color: this.isQueueLong() ? 'red' : config.textLight }]}>
                                    Orders in queue: 
                                </Text>
                                <Text style={[styles.h1, { flex: 1, textAlign: 'right', color: this.isQueueLong() ? 'red' : config.textLight}]}>
                                    {vendor.currentQueueSize ? vendor.currentQueueSize : 0}
                                </Text>
                            </View>
                            {this.isQueueLong() && <Text style={[styles.row,styles.center,{ color: 'red' }]}>Your order may take a while to begin preparing.</Text>}
                            <View style={[styles.row, styles.last]}>
                                <Button disabled={!vendor.canOrder || totalQuantity <= 0} 
                                    onPress={async () => { if (await this.lessThanMaxOrders()) this.submitOrder() }}>
                                    <Text>Submit Order</Text>
                                </Button>
                            </View>
                        </View>
                        : <Text style={[styles.section, styles.center, styles.last]}>
                            This vendor does not support mobile ordering.
                        </Text>}
                    </View>
                    : <Spinner color={config.colorPrimary} />}
                </Content>
            </Container>
        );
    }
}