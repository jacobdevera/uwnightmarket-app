import React, { Component } from 'react';
import { Image, View, Modal, StyleSheet, FlatList } from 'react-native';
import { Button, Container, Content, Card, CardItem, CheckBox, Body, Text, Icon, Left, Right, Thumbnail, List, ListItem } from 'native-base';
import { StackNavigator } from "react-navigation";

import { AppHeader, StackHeader } from '../components';
import { Spinner } from '../components/common';
import styles from '../styles';
import firebase from 'firebase'

const modalStyles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.3)'
    },
    innerContainer: {
        margin: 16,
        padding: 16,
        backgroundColor: 'white'
    },
});

class VendorList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            vendors: [],
            filters: [{
                name: 'food',
                active: false
            },{
                name: 'beverage',
                active: false
            },{
                name: 'hot',
                active: false
            },{
                name: 'cold',
                active: false
            },{
                name: 'savory',
                active: false
            },{
                name: 'sweet',
                active: false
            },{
                name: 'spicy',
                active: false
            },{
                name: 'available',
                active: false
            }],
            modalVisible: false
        }
    }
    
    componentDidMount() {
        let vendorRef = firebase.database().ref('/users').orderByKey();
        vendorRef.once('value').then((snapshot) => {
            let vendorList = [];
            snapshot.forEach((vendorSnapshot) => {
                let vendorObj = vendorSnapshot.val();
                vendorList.push(vendorObj);
            });
            this.setState({ vendors: vendorList });
        });
    }

    modalOpen() { this.setState({ modalVisible: true }); }
    modalClose() { this.setState({ modalVisible: false }); }

    toggleFilter = (index) => {
        let newFilters = this.state.filters.slice();
        newFilters[index].active = !newFilters[index].active;
        this.setState({ filters: newFilters });
    }

    render() {
        return (
            <Container>
                <AppHeader 
                    navigation={this.props.navigation} 
                    right={<Button transparent onPress={() => this.modalOpen()}><Icon name='funnel' /></Button>}
                >
                    Vendors / Food
                </AppHeader>
                
                <Content style={styles.paddedContainer}>
                    <Modal
                        transparent={true}
                        visible={this.state.modalVisible}
                        animationType={'fade'}
                        onRequestClose={() => this.modalClose()}
                    >
                        <View style={modalStyles.modalContainer}>
                            <View style={modalStyles.innerContainer}>
                                <Text style={[styles.bold, styles.cardH1]}>Filters</Text>
                                <FlatList
                                    data={this.state.filters}
                                    extraData={this.state}
                                    keyExtractor={ item => item.name }
                                    renderItem={({ item, index }) => {
                                        return (
                                            <ListItem>
                                                <CheckBox 
                                                    checked={item.active} 
                                                    onPress={() => this.toggleFilter(index)} />
                                                <Body>
                                                    <Text>{item.name}</Text>
                                                </Body>
                                            </ListItem>
                                        );
                                    }}
                                />
                                <View style={styles.row}>
                                    <Button
                                        onPress={() => this.modalClose()}
                                    >
                                        <Text>Close</Text>
                                    </Button>
                                </View>
                            </View>
                        </View>
                    </Modal>
                    {this.state.vendors ?
                        <List
                            dataArray={this.state.vendors}
                            renderRow={(data) => {
                                let itemNames = [];
                                data.menu.forEach((item) => itemNames.push(item.name));
                                return (
                                    <Card>
                                    <CardItem 
                                        button onPress={() => { this.props.navigation.navigate('VendorFood', {
                                                vendor: data
                                            }); 
                                        }}
                                    >
                                        <Left>
                                            <Thumbnail
                                                square
                                                style={styles.listImage}
                                                source={{ uri: data.img }}
                                            />
                                        </Left>
                                        <Body>
                                            <Text style={ [styles.header, styles.cardH1] }>{data.name}</Text>
                                            <Text style={ [styles.desc] }>{data.desc}</Text>
                                            <Text style={styles.bold}>Menu: <Text style={styles.menuItem}>{itemNames.join(', ')}</Text></Text>
                                        </Body>
                                    </CardItem>
                                    </Card>
                                )
                            }}
                        />
                        : <Spinner size='small' />}
                </Content>
            </Container>
        );
    }
}

class VendorFood extends Component {
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
        let orderData = {
            userId: firebase.auth().currentUser.uid,
            time: firebase.database.ServerValue.TIMESTAMP,
            items: this.state.order
        }

        let orderRef = firebase.database().ref('orders/' + this.state.vendor.userId);
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
                        <List
                            key={'quantity ' + totalQuantity}
                            dataArray={vendor.menu}
                            renderRow={(item, sectionID, rowID) => {
                                return (
                                        <ListItem>
                                            <Left>
                                                <Button onPress={() => this.updateQuantity(rowID, false)}><Text>-</Text></Button>
                                                <Text>{order[rowID].quantity}</Text>
                                                <Button onPress={() => this.updateQuantity(rowID, true)}><Text>+</Text></Button>
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

const VendorNavigator = StackNavigator(
    {
        VendorList: { screen: VendorList },
        VendorFood: { screen: VendorFood }
    }, 
    {
        headerMode: 'none'
    }
);

export { VendorNavigator }