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

                                // let count = 0;
                                // firebase.database().ref(`/vendor-orders/${order.vendorId}`).on('value',
                                // (snapshot) => {     if (snapshot.val()) {
                                // Object.keys(snapshot.val()).forEach((key) => {             if (key !=
                                // order.id) {                 count++;             } else { break; }         })
                                //     } }); order.numberOfOrderAhead = count;
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
                    text: `You cannot remove an order after 2 minutes`, 
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
        let activeOrders = orders.filter((order) => order.status !== Status.PICKED_UP);
        let pastOrders = orders.filter((order) => order.status === Status.PICKED_UP);
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
                    : !loading ? <View style={[styles.column, styles.section]}>
                        <Text>You have no active orders right now.</Text>
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