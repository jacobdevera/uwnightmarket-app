import React, {Component} from 'react';
import {Alert, AsyncStorage, Image, View, Modal, TouchableOpacity, TouchableWithoutFeedback} from 'react-native';
import {
    Button,
    Container,
    Content,
    H1,
    H2,
    H3,
    Icon,
    Text,
    FlatList,
    Card,
    CardItem,
    Body,
    Toast,
    Spinner
} from 'native-base';
import firebase from 'firebase';

import {AppHeader, OrderList} from '../components';
import {Status, limits} from '../App';
import styles, { config, modalStyles, moderateScale } from '../styles';
import { hash } from '../utils/order';

class MyOrders extends Component {
    constructor(props) {
        super(props);
        this.state = {
            orders: [],
            loading: true,
            modalVisible: false,
            selectedOrder: null
        }
        this.orderRef = firebase
            .database()
            .ref(`/user-orders/${firebase.auth().currentUser.uid}`)
            .orderByKey();
        this.asConfig = {
            title: 'You can delete your order if you are unable to pick it up.',
            options: [
                'Delete Order', 'Cancel'
            ],
            cancelIndex: 1,
            destructiveIndex: 0,
            handleActionSelect: this.handleActionSelect
        }
    }

    componentWillMount() {
        let { screenProps } = this.props;
        let notif = screenProps && screenProps.state && screenProps.state.initialNotif;
        if (notif && notif.vendorId) {
            this.props.navigation.navigate('MapView', { vendorId: notif.vendorId });
        }
    }

    componentDidMount() {
        this
            .orderRef
            .on('value', (snapshot) => {
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
                                console.log("each order" + order);
                            }))
                        })
                    Promise
                        .all(promises)
                        .then((responses) => {
                            this.setState({orders: orderList, loading: false});
                        })
                        .catch((error) => console.log(error))
                } else {
                    this.setState({orders: [], loading: false});
                }
            });
    }

    componentWillUnmount() {
        this
            .orderRef
            .off('value');
    }

    handleActionSelect = async (index, selectedItem) => {
        if (index === 0 && selectedItem.status === Status.NOT_READY) {
            let lastTimeDeleted = parseInt(await AsyncStorage.getItem('lastTimeDeleted'));
            console.log(lastTimeDeleted);
            console.log(Date.now());
            if (lastTimeDeleted === null || isNaN(lastTimeDeleted)) {
                lastTimeDeleted = Date.now() - limits.orderCooldown;
                await AsyncStorage.setItem('lastTimeDeleted', (lastTimeDeleted).toString()).catch((e) => console.log(e));
            }
            if (Date.now() - selectedItem.time <= limits.orderAge) {
                if (Date.now() - lastTimeDeleted >= limits.orderCooldown) {
                    Alert.alert(
                        'Delete order?',
                        `You must wait a short time before being able to delete another order.`,
                        [
                            {text: 'Cancel', style: 'cancel'},
                            {text: 'Delete', onPress: () => this.deleteOrder(selectedItem)}
                        ]
                    );
                } else { 
                    Toast.show({ 
                        text: `Please wait before deleting another order`, 
                        type: 'danger', 
                        position: 'bottom', 
                        duration: 5000
                    })
                }
            } else {
                Toast.show({
                    text: `You cannot remove an order after 2 minutes. Please see the vendor if you have an issue with your order.`, 
                    type: 'danger', 
                    position: 'bottom', 
                    duration: 5000
                })
            }
        }
    }

    deleteOrder = (order) => {
        let {id, userId, vendorId, time} = order;
        let updates = {};
        updates['/orders/' + id] = null;
        updates['/user-orders/' + userId + '/' + id] = null;
        updates['/vendor-orders/' + vendorId + '/orders/' + id] = null;
        firebase
            .database()
            .ref()
            .update(updates)
            .then((res) => {
                Toast.show({text: `Order removed`, position: 'bottom', duration: 5000})
                AsyncStorage.setItem('lastTimeDeleted', Date.now().toString()).catch((e) => console.log(e));
            })
            .catch(e => console.log(e));
    }

    orderOnPress = (order) => { this.setState({ selectedOrder: order, modalVisible: true }) }
    modalClose = () => { this.setState({ modalVisible: false }) }

    render() {
        const { orders, loading, modalVisible, selectedOrder } = this.state;
        let activeOrders = orders.filter((order) => ![Status.PICKED_UP, Status.CANCELED].includes(order.status));
        let pastOrders = orders.filter((order) => [Status.PICKED_UP, Status.CANCELED].includes(order.status));
        return (
            <Container>
                <AppHeader navigation={this.props.navigation}>
                    My Orders
                </AppHeader>
                <Content contentContainerStyle={styles.paddedContainer}>
                    <Modal
                        transparent={true}
                        visible={modalVisible}
                        animationType={'fade'}
                        onRequestClose={() => this.modalClose()}
                    >
                        <TouchableOpacity 
                            style={modalStyles.modalContainer} 
                            activeOpacity={1} 
                            onPressOut={() => {this.modalClose()}}
                        >
                            <TouchableWithoutFeedback>
                                <View style={modalStyles.innerContainer}>
                                    <Text style={[
                                        styles.h1, 
                                        styles.section, 
                                        styles.fullWidth, 
                                        
                                        { textAlign: 'center' }
                                    ]}>
                                        Order #
                                    </Text>
                                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={[styles.bold, styles.orderNumberLarge]}>
                                        {selectedOrder && hash(selectedOrder.id)}
                                    </Text>
                                    </View>
                                </View>
                            </TouchableWithoutFeedback>
                        </TouchableOpacity>
                    </Modal>
                    {activeOrders.length > 0 ?
                    <View style={styles.section}>
                        <Text style={ [styles.header, styles.h1] }>Active Orders</Text>
                        <OrderList
                            orderOnPress={this.orderOnPress}
                            asConfig={this.asConfig} 
                            orders={activeOrders} 
                            vendor={false} /> 
                    </View>
                    : !loading ? <View style={styles.section}>
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.bold, styles.header, styles.h1]}>Ordering Info</Text>
                            <View style={{ flexDirection: 'row' }}>
                                    <Icon name='dot-single' type='Entypo' style={{ fontSize: 16, paddingTop: 8 }}/>
                                    <Text  style={{ flex: 1, flexWrap: 'wrap' }}>{`Vendors with the `}
                                    <Icon name='mobile' type='Entypo' style={{ fontSize: 24, color: config.colorPrimary }}/>
                                    {` icon will be available for mobile ordering.`}</Text>
                            </View>
                            <View style={[{ flexDirection: 'row' }, styles.smallSection]}>
                                <Icon name='dot-single' type='Entypo' style={{ fontSize: 16, paddingTop: 2 }}/>
                                <Text style={{ flex: 1, flexWrap: 'wrap' }}>{`You can order a maximum of ${limits.quantity} items from one vendor.`}</Text>
                            </View>
                            <View style={[{ flexDirection: 'row' }, styles.smallSection]}>
                                <Icon name='dot-single' type='Entypo' style={{ fontSize: 16, paddingTop: 2  }}/>
                                <Text style={{ flex: 1, flexWrap: 'wrap' }}>{`You can have up to ${limits.orders} active orders at a time.`}</Text>
                            </View>
                            <View style={[{ flexDirection: 'row' }, styles.smallSection]}>
                                <Icon name='dot-single' type='Entypo' style={{ fontSize: 16, paddingTop: 2  }}/>
                                <Text style={{ flex: 1, flexWrap: 'wrap' }}>{`Once you make an order, you have up to ${limits.orderAge / 1000 / 60} minutes to cancel the order.`}</Text>
                            </View>
                            <View style={[{ flexDirection: 'row' }, styles.smallSection]}>
                                <Icon name='dot-single' type='Entypo' style={{ fontSize: 16, paddingTop: 2  }}/>    
                                <Text style={{ flex: 1, flexWrap: 'wrap' }}>{`You will receive a notification when your order is ready for pick up. `+
                                `Please arrive at the booth within 10 minutes to pick up your order and be prepared to pay with cash or vouchers.`}</Text>
                            </View>
                            <View style={[{ flexDirection: 'row' }, styles.smallSection]}>
                                <Icon name='dot-single' type='Entypo' style={{ fontSize: 16, paddingTop: 2  }}/>
                                <Text style={{ flex: 1, flexWrap: 'wrap' }}>{`The vendors have the right to cancel your order at any time if and only if they are unable to fulfill your order.`}</Text>
                            </View>
                        </View>
                        <Button style={[{ alignSelf: 'center' }, styles.section]} 
                            onPress={() => {
                                this.props.navigation.navigate('VendorNavigator');
                                this.props.navigation.popToTop();
                            }}
                        >
                            <Text>Order Now</Text>
                        </Button>
                    </View> : <Spinner color={config.colorPrimary} />}
                    {pastOrders.length > 0 &&
                    <View style={styles.section}>
                        <Text style={ [styles.header, styles.h1] }>Past Orders</Text>
                        <OrderList
                            orderOnPress={this.orderOnPress}
                            asConfig={this.asConfig}
                            orders={pastOrders} 
                            vendor={false} />
                    </View>}
                </Content>
            </Container>
        );
    }
}

export {MyOrders}