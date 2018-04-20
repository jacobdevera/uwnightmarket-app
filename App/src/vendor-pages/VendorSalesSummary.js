import React, { Component } from 'react';
import { Image, View, FlatList } from 'react-native';
import { Container, Content, Header, Left, Button, Icon, Right, Body, Text, Title, List, ListItem, Thumbnail } from 'native-base';
import firebase from 'firebase';


import { Status } from '../App';
import styles from '../styles';
import { AppHeader } from '../components';

class VendorSalesSummary extends Component {
    constructor(props) {
        super(props);
        this.state = { orders: {} };
        this.orderRef = firebase.database().ref(`/vendor-orders/${firebase.auth().currentUser.uid}/orders/`).orderByKey();
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
                            if (order.status === Status.PICKED_UP)
                                orderObj[snapshot.key] = order;
                        }))
                    })
                Promise
                    .all(promises)
                    .then((responses) => {
                        this.setState({ orders: orderObj });
                    })
                    .catch((error) => console.log(error))
            }
        });
    }
    render() {
        let { orders } = this.state;
        let totalRevenue = 0;
        let soldItems = {};
        Object.keys(orders).forEach((order) => {
            orders[order].items.forEach((item) => {
                let revenue = item.quantity * item.price;
                totalRevenue += revenue;
                let newItem = soldItems.hasOwnProperty(item.name);
                soldItems[item.name] = { 
                    quantity: newItem ? item.quantity : soldItems[item.name].quantity + item.quantity,
                    revenue: newItem ? revenue : soldItems[item.name].revenue + revenue
                }
            })
        });

        return (
            <Container>
                <AppHeader navigation={this.props.navigation}>
                    Sales Summary
                </AppHeader>
                <Content contentContainerStyle={styles.paddedContainer}>
                    <View style={styles.section}>
                        <View style={styles.row}>
                            <Text>Total Revenue: </Text>
                            <Text style={[styles.bold, { justifyContent: 'flex-end'}]}>${totalRevenue}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text>Total Number of Orders Completed: </Text>
                            <Text style={[styles.bold, { justifyContent: 'flex-end'}]}>{Object.keys(orders).length}}</Text>
                        </View>
                    </View>
                </Content>
            </Container>
        );
    }
}

export { VendorSalesSummary };