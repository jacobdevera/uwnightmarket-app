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
                let newItem = !soldItems.hasOwnProperty(item.name);
                soldItems[item.name] = { 
                    quantity: newItem ? item.quantity : soldItems[item.name].quantity + item.quantity,
                    revenue: newItem ? revenue : soldItems[item.name].revenue + revenue
                }
            })
        });
        console.log(soldItems);
        return (
            <Container>
                <AppHeader navigation={this.props.navigation}>
                    Sales Summary
                </AppHeader>
                <Content contentContainerStyle={styles.paddedContainer}>
                    <View style={styles.section}>
                        <View style={styles.rowSpaceBetween}>
                            <View style={styles.column}>
                                <Text style={{ alignSelf: 'flex-start' }}>Total Revenue: </Text>
                                <Text style={{ alignSelf: 'flex-start' }}>Total Number of Orders Completed: </Text>
                            </View>
                            <View style={[styles.column]}>
                                <Text style={[styles.bold, { alignSelf: 'flex-end'}]}>${totalRevenue}</Text>
                                <Text style={[styles.bold, { alignSelf: 'flex-end'}]}>{Object.keys(orders).length}</Text>
                            </View>
                        </View>
                        {Object.keys(soldItems).length > 0 &&
                        <View style={[styles.section, styles.last]}>
                            <View style={styles.row}>
                                <Text style={[styles.bold, { flex: 10 }]}>Item</Text>
                                <Text style={[styles.bold, { flex: 2 }]}>Qty</Text>
                                <Text style={[styles.bold, { flex: 2 }]}>Revenue</Text>
                            </View>
                            <FlatList
                                data={Object.keys(soldItems)}
                                extraData={this.state}
                                keyExtractor={ item => item }
                                renderItem={({ item }) => {
                                    return (
                                        <View style={styles.row}>
                                            <Text style={{ flex: 10 }}>{item}</Text>
                                            <Text style={{ flex: 2 }}>{soldItems[item].quantity}</Text>
                                            <Text style={{ flex: 2 }}>${soldItems[item].revenue}</Text>
                                        </View>
                                    )
                                }}
                            />
                        </View>}
                    </View>
                </Content>
            </Container>
        );
    }
}

export { VendorSalesSummary };