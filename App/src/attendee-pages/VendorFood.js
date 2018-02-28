import React, { Component } from 'react';
import { Image, View, Modal, StyleSheet, FlatList } from 'react-native';
import { Button, Container, Content, Card, CardItem, CheckBox, Body, Text, Icon, Left, Right, Thumbnail, List, ListItem } from 'native-base';
import firebase from 'firebase'

import { AppHeader, StackHeader } from '../components';
import { Spinner } from '../components/common';
import styles from '../styles';

export default class VendorFood extends Component {
    constructor() {
        super();
        this.state = {
            vendor: null,
            order: []
        }
    }

    componentDidMount() {
        const { params } = this.props.navigation.state;
        const vendor = params ? params.vendor : null;
        let order = new Array(vendor.menu.length);
        vendor.menu.forEach((item, index) => {
            order[index] = { name: item.name, price: item.price, quantity: 0};
        })
        this.setState({ vendor: vendor, order: order });
    }

    updateQuantity = (index, add) => {
        let order = this.state.order.slice();
        if (add && order[index].quantity < 7) {
            order[index].quantity++;
        } else if (!add && order[index].quantity > 0) {
            order[index].quantity--;
        }
        this.setState({ order: order })
    }

    submitOrder = () => {
        let orderRef = firebase.database().ref('orders/' + this.state.vendor.userId);
        let orderData = {
            userId: firebase.auth().currentUser.uid,
            time: firebase.database.ServerValue.TIMESTAMP,
            items: this.state.order
        }
        orderRef.push(orderData)
            .then((response) => {
                this.props.navigation.goBack();
            })

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
                <StackHeader navigation={this.props.navigation}>
                    {vendor && vendor.name}
                </StackHeader>
                <Content style={styles.paddedContainer}>
                    {vendor &&
                        <FlatList
                            data={vendor.menu}
                            extraData={this.state}
                            keyExtractor={ item => item.name }
                            renderItem={({item, index}) => {
                                return (
                                        <ListItem>
                                            <Left>
                                                <Button onPress={() => this.updateQuantity(index, false)}><Text>-</Text></Button>
                                                <Text>{order[index].quantity}</Text>
                                                <Button onPress={() => this.updateQuantity(index, true)}><Text>+</Text></Button>
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
                    <Text style={[styles.center, styles.bold]}>Total Due: {totalPrice}</Text>
                    <View style={styles.row}>
                        <Button onPress={() => this.submitOrder()}><Text>Submit Order</Text></Button>
                    </View>
                </Content>
            </Container>
        );
    }
}