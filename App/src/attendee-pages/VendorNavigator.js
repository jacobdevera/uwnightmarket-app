import React, { Component } from 'react';
import { Image, View } from 'react-native';
import { Button, Container, Content, Card, CardItem, Body, Text, Icon, Left, Right, Thumbnail, List, ListItem } from 'native-base';
import { StackNavigator } from "react-navigation";


import { AppHeader, StackHeader } from '../components';
import { Spinner } from '../components/common';
import styles from '../styles';
import firebase from 'firebase'

class VendorList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            vendors: []
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
    /*let items = [
        {
            name: 'Baguette Box',
            desc: 'Specializing in western Chinese fare',
            img: require('../../img/bubble-tea.jpg'),
            menu: [
                { 
                    name: 'Cumin Beef Sandwich',
                    price: 3
                },
                { 
                    name: 'Cold Rice Noodles',
                    price: 5
                },
                { 
                    name: 'Grilled Squid',
                    price: 7
                }
            ]
        },
        {
            name: 'BeanFish',
            desc: "Seattle's only mobile taiyaki (鯛焼き) artisans",
            img: require('../../img/fish-tofu.jpg'),
            menu: [
                { 
                    name: 'Jiro Taiyaki',
                    price: 6
                },
                { 
                    name: 'Kpop Taiyaki',
                    price: 7
                }
            ]
        },
        {
            name: 'Capuli Club Sips & Treats',
            desc: 'Artisanal fruit snacks made in Seattle',
            img: require('../../img/bbq-pork-buns.jpg'),
            menu: [
                { 
                    name: 'BBQ Pork Buns',
                    price: 5
                },
                { 
                    name: 'Fish Tofu',
                    price: 4
                },
                { 
                    name: 'Taiwanese Sausage',
                    price: 3
                }
            ]
        }
    ];*/
    render() {
        return (
            <Container>
                <AppHeader navigation={this.props.navigation}>
                    Vendors / Food
                </AppHeader>
                <Content style={styles.paddedContainer}>
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