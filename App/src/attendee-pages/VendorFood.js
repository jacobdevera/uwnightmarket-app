import React, { Component } from 'react';
import { Image, View, Modal, StyleSheet, FlatList } from 'react-native';
import { Button, Container, Content, Card, CardItem, CheckBox, Body, Text, Icon, Left, Right, Thumbnail, List, ListItem, Toast } from 'native-base';
import firebase from 'firebase'

import { AppHeader } from '../components';
import { Spinner } from '../components/common';
import styles from '../styles';

const MAX_QUANTITY = 7;

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
        vendor.menu.forEach((item, index) => {
            order[index] = { name: item.name, price: item.price, quantity: 0};
        })
        this.setState({ vendor: vendor, order: order });
    }

    updateQuantity = (index, add) => {
        let order = this.state.order.slice();
        let totalQuantity = order.reduce((prev, curr) => {
            return { quantity: prev.quantity + curr.quantity} ;
        });
        if (add && totalQuantity.quantity < MAX_QUANTITY) {
            order[index].quantity++;
        } else if (!add && order[index].quantity > 0) {
            order[index].quantity--;
        } else if (totalQuantity.quantity >= MAX_QUANTITY) {
            Toast.show({
                text: `Cannot exceed ${MAX_QUANTITY} items`,
                position: 'bottom'
            });
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
                    <View style={[styles.rowSpaceBetween]}>
                        <View style={{flex: 1}}><Text style={{textAlign: 'center'}}>Qty</Text></View>
                        <View style={{flex: 1}}><Text style={{textAlign: 'right'}}>Item</Text></View>
                        <View style={{flex: 1}}><Text style={{textAlign: 'right'}}>Price</Text></View>
                    </View>
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
                                                <Text style={[{flex:1, marginLeft: 0}, styles.center]}>{order[index].quantity}</Text>
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
                    <Text style={[styles.center, styles.bold, styles.row]}>Total Due: ${totalPrice}</Text>
                    <View style={styles.row}>
                        <Button onPress={() => this.submitOrder()}><Text>Submit Order</Text></Button>
                    </View>
                </Content>
            </Container>
        );
    }
}