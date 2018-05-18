import React, { Component } from 'react';
import { Alert, StyleSheet } from 'react-native';
import {
    Container,
    Content,
    Text,
    Toast,
    Spinner
} from 'native-base';
import firebase from 'firebase'

import { Status } from '../App';
import { SERVER_KEY, FCM_URL } from '../FirebaseConstants';
import { AppHeader, OrderList } from '../components';
import styles, { config } from '../styles';

class VendorOrders extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            orders: {}
        }
        this.orderRef = firebase.database().ref(`/vendor-orders/${firebase.auth().currentUser.uid}/orders/`).orderByKey();
        this.asConfig = {
            title: 'Set Order Status',
            options: ['Not Ready', 'Ready', 'Picked Up', 'Cancel Order', 'Cancel'],
            cancelIndex: 4,
            destructiveIndex: 3,
            handleActionSelect: this.handleStatusChange
        }
    }

    componentDidMount() {
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
                        this.setState({ loading: false, orders: orderObj });
                    })
                    .catch((error) => console.log(error))
            } else {
                this.setState({ loading: false });
            }
        });
        this.orderRef.on('child_added', this.orderChanged);
        this.orderRef.on('child_changed', this.orderChanged);
        this.orderRef.on('child_removed', this.orderRemoved); // TODO: remove canceled orders?
    }

    orderChanged = (snapshot) => {
        let newOrderObj = Object.assign({}, this.state.orders);
        firebase.database().ref(`/orders/${snapshot.key}`).once('value').then((orderSnapshot) => {
            let order = orderSnapshot.val();
            order.id = snapshot.key;
            newOrderObj[snapshot.key] = order;
            this.setState((prevState) => {
                return { orders: {...prevState.orders, [order.id]: order} };
            });
        })
    }

    orderRemoved = (snapshot) => {
        let newOrderObj = Object.assign({}, this.state.orders);
        delete newOrderObj[snapshot.key];
        this.setState({ orders: newOrderObj });
    }

    componentWillUnmount() {
        this.orderRef.off();
    }

    // determine which orders to display whether on active or completed screen
    getFilteredOrders = (orders, active) => {
        return orders.filter((order) => {
            return (order && ((active && ![Status.PICKED_UP,Status.CANCELED].includes(order.status))
                || (!active && [Status.PICKED_UP,Status.CANCELED].includes(order.status))))
        });
    }

    handleStatusChange = async (index, selectedItem) => {
        let statuses = [Status.NOT_READY, Status.READY, Status.PICKED_UP, Status.CANCELED];
        if (index === this.asConfig.destructiveIndex) {
            Alert.alert(
                'Cancel this order?',
                'The attendee will be notified.',
                [
                    { text: 'No', style: 'cancel'},
                    { text: 'Cancel Order', style: 'destructive', onPress: async () =>  {
                        if (await this.updateOrder(statuses[index], selectedItem)) {
                            this.buildAndSendNotification(statuses[index], selectedItem);
                        }
                    }}
                ]
            );
        } else {
            if (await this.updateOrder(statuses[index], selectedItem)) {
                if (statuses[index] === Status.PICKED_UP) {
                    Toast.show({
                        text: `Order completed`,
                        type: 'success',
                        position: 'bottom',
                        duration: 5000
                    });
                }
                this.buildAndSendNotification(statuses[index], selectedItem);
            }
        }
    }

    buildAndSendNotification = (status, order) => {
        let title, body = '';
        let notif = {};
        switch (status) {
            case Status.READY:
            title = 'Order ready!';
            body = `Please head to ${order.vendorName} to pick it up.`
            notif = this.buildNotificationBasedOnOS(order, title, body, status);
            this.sendNotification(JSON.stringify(notif));
            break;
            
            case Status.CANCELED:
            title = 'Order canceled';
            body = `Unfortunately, ${order.vendorName} could not fulfill your order.`
            notif = this.buildNotificationBasedOnOS(order, title, body, status);
            this.sendNotification(JSON.stringify(notif));
            Toast.show({
                text: `Order canceled`,
                position: 'bottom',
                duration: 5000
            });
            break;
        }
    }

    updateOrder = (status, order) => {
        return new Promise((resolve) => {
            let updates = {};
            updates[`/orders/${order.id}/status`] = status;
            updates['/user-orders/' + order.userId + '/' + order.id] = status;
            updates['/vendor-orders/' + order.vendorId + '/orders/' + order.id] = status;
            firebase.database().ref().update(updates).then((res) => {
                resolve(true)
            }).catch(e => { 
                console.log(e)
                resolve(false);
            });
        })
    }

    buildNotificationBasedOnOS = (order, title, body, status) => {
        if (order.platform === 'android') {
            return {
                "to": order.userToken,
                "data": {
                    "type": "MEASURE_CHANGE",
                    "custom_notification": {
                        "title": title,
                        "body": body,
                        "color": config.colorPrimary,
                        "priority": "high",
                        "icon": "ic_notif",
                        "show_in_foreground": true,
                        "sound": "default",
                        "vendorId": order.vendorId,
                        "orderId": order.id,
                        "status": status
                    }
                }
            }
        } else {
            return {
                "to": order.userToken,
                "notification": {
                    "title": title,
                    "body": body,
                    "sound": "default"
                },
                "data": {
                    "vendorId": order.vendorId,
                    "orderId": order.id,
                    "status": status
                },
                "priority": 10
            };
        }
    }

    sendNotification = async (body) => {
        let headers = new Headers({
            "Content-Type": "application/json",
            "Authorization": "key=" + SERVER_KEY
        });

        try {
            let response = await fetch(FCM_URL, { method: "POST", headers, body });
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
        const { loading, orders } = this.state;
        let active = params && params.active;
        let filteredOrders = this.getFilteredOrders(Object.values(orders), active);
        return (
            <Container>
                <AppHeader navigation={this.props.navigation}>
                    Orders
                </AppHeader>
                <Content style={[styles.paddedContainer]}>
                    {orders && Object.keys(orders).length > 0 ? 
                        !loading ? 
                            filteredOrders.length > 0 ? 
                                <OrderList
                                    asConfig={this.asConfig}
                                    orders={filteredOrders}
                                    vendor={true}></OrderList> 
                            : <Text style={[styles.section, styles.center]}>You currently have no {active ? 'active' : 'completed'} orders.</Text>
                        : <Spinner color={config.colorPrimary} />
                    : <Text style={[styles.section, styles.center]}>No one has ordered from you yet.</Text>}
                </Content>
            </Container>
        );
    }
}

export { VendorOrders }