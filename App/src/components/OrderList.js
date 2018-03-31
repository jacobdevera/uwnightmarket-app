import React, { Component } from 'react';
import { Image, View, FlatList } from 'react-native';
import { Button, Card, CardItem, Container, Content, Text, Thumbnail, Body, Left, List, ListItem, Badge } from 'native-base';
import styles, { config } from '../styles';

import { Status } from '../App';

export class OrderList extends Component {
    constructor(props) {
        super(props);
    }
    
    getTotalPrice = (order) => {
        return order.items.reduce((acc, curr) => { 
            return { price: (acc.price) + (curr.price * curr.quantity) }
        }).price;
    }

    getStatusButtonColor = (order) => {
        switch (order.status) {
            case Status.NOT_READY:
            return 'red';

            case Status.READY:
            return 'green';

            case Status.PICKED_UP:
            return 'blue';

            default:
            return config.colorPrimary;
        }
    }

    render() {
        return (
            <View>
                <FlatList
                    data={this.props.orders}
                    extraData={this.props}
                    keyExtractor={ item => `${item.time}` }
                    renderItem={({ item }) => {
                        return (
                            <Card>
                                <View style={styles.row}>
                                    <View style={{ flex: 20 }}>
                                        <Text style={[styles.center, styles.header, styles.cardH2]}>Order #</Text>
                                        <Badge width={64} style={{ backgroundColor: config.colorPrimary }}>
                                            <Text>1</Text>
                                        </Badge>
                                    </View>

                                    <View style={{ flex: 45 }}>
                                        <Text style={[styles.center, styles.header, styles.cardH2]}>Qty x Item</Text>
                                        <FlatList
                                            data={item.items}
                                            keyExtractor={ item => `${item.name}` }
                                            renderItem={({ item }) => {
                                                return (
                                                    <Text style={{ fontSize: 12, paddingLeft: 4 }}>{item.quantity} {item.name}</Text>
                                                )
                                            }}
                                        />
                                    </View>

                                    <View style={{ flex: 15, alignItems: 'center' }}>
                                        <Text style={[styles.center, styles.header, styles.cardH2]}>Total</Text>
                                        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
                                            ${this.getTotalPrice(item)}
                                        </Text>
                                    </View>

                                    <View style={{ flex: 20, alignItems: 'center' }}>
                                        <Text style={[styles.header, styles.cardH2]}>Status</Text>
                                        <View>
                                            <Button small style={{ backgroundColor: this.getStatusButtonColor(item) }}>
                                                <Text style={[styles.center, { fontSize: 10, lineHeight: 12 }]}>{item.status}</Text>
                                            </Button>
                                        </View>
                                    </View>
                                </View>
                            </Card>
                        )
                    }}
                />
            </View>
        );
    }
}