import React, {Component} from 'react';
import {Image, View} from 'react-native';
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
    Toast
} from 'native-base';
import firebase from 'firebase';

import {AppHeader, OrderList} from '../components';
import {Status} from '../App';
import styles from '../styles';

class MyOrders extends Component {
    constructor(props) {
        super(props);
        this.state = {
            orders: []
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
                            this.setState({orders: orderList});
                        })
                        .catch((error) => console.log(error))
                } else {
                    this.setState({orders: []});
                }
            });

    }

    componentWillUnmount() {
        this
            .orderRef
            .off('value');
    }

    handleActionSelect = (index, selectedItem) => {
        let {id, userId, vendorId, status, time} = selectedItem;

        if (index === 0 && status === Status.NOT_READY) {
            if (Date.now() - time >= 120000) {
                let updates = {};
                updates['/orders/' + id] = null;
                updates['/user-orders/' + userId + '/' + id] = null;
                updates['/vendor-orders/' + vendorId + '/' + id] = null;
                firebase
                    .database()
                    .ref()
                    .update(updates)
                    .then((res) => {
                        Toast.show({text: `Order removed`, position: 'bottom', duration: 5000})
                    })
                    .catch(e => console.log(e));
            } else {
                Toast.show({
                    text: `Please wait 2 minutes before deleting another order`, 
                    type: 'danger', 
                    position: 'bottom', 
                    duration: 5000
                })
            }
        }
    }

    render() {
        let activeOrders = this.state.orders.filter((order) => order.status !== Status.PICKED_UP);
        let pastOrders = this.state.orders.filter((order) => order.status == Status.PICKED_UP);
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
                            orders={this.state.orders.filter((order) => order.status !== Status.PICKED_UP)} 
                            vendor={false} /> 
                    </View>
                    : <View style={[styles.column]}>
                        <Text style={styles.section}>You have no active orders right now.</Text>
                        <Button style={[{ alignSelf: 'center' }, styles.section]} onPress={() => this.props.navigation.navigate('VendorNavigator')}>
                            <Text>Order Now</Text>
                        </Button>
                    </View>}
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