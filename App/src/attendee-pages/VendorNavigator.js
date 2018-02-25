import React, { Component } from 'react';
import { Image, View } from 'react-native';
import { Button, Container, Content, Card, CardItem, Body, Text, Icon, Left, Right, Thumbnail, List, ListItem } from 'native-base';
import { StackNavigator } from "react-navigation";


import { AppHeader, StackHeader } from '../components';
import styles from '../styles';

const VendorList = (props) => {
    let items = [
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
    ];

    return (
        <Container>
            <AppHeader navigation={props.navigation}>
                Vendors / Food
            </AppHeader>
            <Content style={styles.paddedContainer}>
                <List
                    dataArray={items}
                    renderRow={(data) => {
                        let itemNames = [];
                        data.menu.forEach((item) => itemNames.push(item.name));
                        return (
                            <Card>
                            <CardItem 
                                button onPress={() => { props.navigation.navigate('VendorFood', {
                                        vendor: data
                                    }); 
                                }}
                            >
                                <Left>
                                    <Thumbnail
                                        square
                                        style={styles.listImage}
                                        source={data.img}
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
            </Content>
        </Container>);
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

    updateQuantity(index, add) {
        let order = this.state.order.slice();
        if (add && order[index].quantity < 7) {
            order[index].quantity++;
        } else if (!add && order[index].quantity > 0){
            order[index].quantity--;
        }
        this.setState({ order: order })
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