import React, {Component} from 'react';
import {Image, View, FlatList} from 'react-native';
import {
    ActionSheet,
    Button,
    Card,
    CardItem,
    Container,
    Content,
    Text,
    Thumbnail,
    Body,
    Left,
    List,
    ListItem,
    Badge,
    Icon
} from 'native-base';
import styles, {config, scale} from '../styles';
import StatusPicker from './StatusPicker';
import {Status} from '../App';
import {StackNavigator} from "react-navigation";
import firebase from 'firebase';

export class OrderList extends Component {
    constructor(props) {
        super(props);
    }

    getTotalPrice = (order) => {
        let totalPrice = 0;
        order.items.forEach((item) => {
            totalPrice += item.quantity * item.price;
        });
        /*let totalPrice = order.items.length > 1 ? order
            .items
            .reduce((acc, curr) => {
                return {
                    price: (acc.price) + (curr.price * curr.quantity)
                }
            })
            .price 
            : order.items.length > 0 ? order.items[0].price * order.items[0].quantity 
            : 0;*/
        return totalPrice;
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

    showActionSheet = (item) => {
        let { title, options, cancelIndex, destructiveIndex, handleActionSelect } = this.props.asConfig;
        ActionSheet.show(
            {
                options: options,
                cancelButtonIndex: cancelIndex,
                destructiveButtonIndex: destructiveIndex,
                title: title
            },
            buttonIndex => {
                console.log("item:   " +item);
                handleActionSelect(buttonIndex, item);
            }
        );
    }
    

    hash = (input) => {
        let count = 3;
        let res = "";
        let index = 6;
        let alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        while (count > 0 && index < input.length) {
            let c = input[index];
            if (alphabet.indexOf(c) != -1) {
                res += c;
                count--;
            }
            index++;
        }
        return res;
    }

    render() {
        return (
            <View>
                <FlatList
                    data={this.props.orders}
                    extraData={this.props}
                    keyExtractor={item => `${item.time}`}
                    renderItem={({ item }) => {
                    return (
                        <Card>
                            <ListItem itemDivider style={[styles.rowSpaceBetween, { alignItems: 'flex-start' }]}>
                                {!this.props.vendor &&
                                <Text style={[styles.header, styles.cardH2, { marginTop: 8, marginLeft: 8 }]}>
                                    Vendor: {item.vendorName}
                                </Text>}
                                {((item.status === Status.NOT_READY) || this.props.vendor) && 
                                <Button transparent
                                    style={{ marginLeft: 'auto', height: 32 }}
                                    onPress={() => this.showActionSheet(item)}
                                >
                                    <Icon style={{ fontSize: 32, marginLeft: 8, marginRight: 8 }} name='more' />
                                </Button>}
                            </ListItem>
                            <View style={styles.row}>
                                <View
                                    style={{
                                    flex: 20
                                }}>
                                    <Text style={[styles.center, styles.header, styles.cardH2]}>Order #</Text>
                                    <Badge
                                        width={64}
                                        style={{ 
                                            alignSelf: 'center',
                                            backgroundColor: config.colorPrimary 
                                        }}>
                                        <Text
                                          style={{
                                            textAlign:'center'
                                        }}>{this.hash(item.id)}</Text>
                                    </Badge>
                                </View>
                                <View
                                    style={{
                                    flex: 45
                                }}>
                                    <Text style={[styles.center, styles.header, styles.cardH2]}>Qty x Item</Text>
                                    <FlatList
                                        data={item.items}
                                        keyExtractor={item => `${item.name}`}
                                        renderItem={({item}) => {
                                        return (
                                            <Text
                                                style={{
                                                fontSize: 12,
                                                paddingLeft: 4,
                                                textAlign: 'center'
                                            }}>{item.quantity} {item.name}</Text>
                                        )
                                    }}/>
                                </View>
                                <View
                                    style={{
                                    flex: 15,
                                    alignItems: 'center'
                                }}>
                                    <Text style={[styles.center, styles.header, styles.cardH2]}>Total</Text>
                                    <Text
                                        style={{
                                        textAlign:'center',
                                        fontSize: 18,
                                        fontWeight: 'bold'
                                    }}>
                                        ${this.getTotalPrice(item)}
                                    </Text>
                                </View>
                                <View
                                    style={{
                                    flex: 20,
                                    alignItems: 'center'
                                }}>
                                    <Text style={[styles.header, styles.cardH2]}>Status</Text>
                                    <View>
                                        <Button
                                            small
                                            style={{
                                            width: 72 * scale,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            backgroundColor: this.getStatusButtonColor(item)
                                        }}>
                                            <Text
                                                style={[
                                                styles.bold,
                                                styles.center, {
                                                    paddingLeft: 0,
                                                    paddingRight: 0,
                                                    fontSize: Math.max(10, 10 * scale),
                                                    lineHeight: Math.max(12, 12 * scale)
                                                }
                                            ]}>{item.status}</Text>
                                        </Button>
                                    </View>
                                </View>
                            </View>
                        </Card>
                    )
                }}/>
            </View>
        );
    }
}