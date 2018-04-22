import React, {Component} from 'react';
import {Alert, AsyncStorage, Image, View} from 'react-native';
import {
    Button,
    Container,
    Content,
    H1,
    H2,
    H3,
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
import styles, { config } from '../styles';


class MyOrders extends Component {
    constructor(props) {
        super(props);
        this.state = {
            orders: [],
            loading: true
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
                        'Are you sure?',
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

    render() {
        const { orders, loading } = this.state;
        let activeOrders = orders.filter((order) => ![Status.PICKED_UP, Status.CANCELED].includes(order.status));
        let pastOrders = orders.filter((order) => [Status.PICKED_UP, Status.CANCELED].includes(order.status));
        return (
            <Container>
                <AppHeader navigation={this.props.navigation}>
                    My Orders
                </AppHeader>
                <Content contentContainerStyle={styles.paddedContainer}>
                    {activeOrders.length > 0 ?
                    <View style={styles.section}>
                        <Text style={ [styles.header, styles.h1] }>Active Orders</Text>
                        <OrderList 
                            asConfig={this.asConfig} 
                            orders={orders.filter((order) => order.status !== Status.PICKED_UP)} 
                            vendor={false} /> 
                    </View>
                    : !loading ? <View style={styles.section}>
                        <View>
                            <Text style={[styles.bold, styles.header, styles.h1]}>Ordering Info</Text>
                            <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                                <Text>{`\u2022 Vendors with the `}
                                <Image
                                    resizeMode="stretch"
                                    style={styles.icon}
                                    source={require('../../img/mobile-order-support-icon.png')}
                                /> 
                                {` icon will be available for mobile ordering.`}</Text> 
                            </View>
                            <Text style={styles.smallSection}>{`\u2022 You can order a maximum of ${limits.quantity} items from one vendor.`}</Text>
                            <Text style={styles.smallSection}>{`\u2022 You can have up to ${limits.orders} active orders at a time.`}</Text>
                            <Text style={styles.smallSection}>{`\u2022 Once you make an order, you have up to ${limits.orderAge / 1000 / 60} minutes to delete the order.`}</Text>
                            <Text style={styles.smallSection}>{`\u2022 You will receive a notification when your order is ready for pick up. `+
                                `Please arrive at the booth within 10 minutes to pick up your order and be prepared to pay with cash.`}</Text>
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
                            asConfig={this.asConfig}
                            orders={pastOrders} 
                            vendor={false} />
                    </View>}
                </Content>
            </Container>);
    }
}

export {MyOrders}