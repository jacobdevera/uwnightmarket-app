import React, {Component} from 'react';
import {Alert, Image, View, FlatList, TouchableOpacity} from 'react-native';
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
import styles, {config, moderateScale} from '../styles';
import StatusPicker from './StatusPicker';
import {Status} from '../App';
import {StackNavigator} from "react-navigation";
import firebase from 'firebase';
import dayjs from 'dayjs';
import { hash } from '../utils/order';

export class OrderList extends Component {
    constructor(props) {
        super(props);
    }

    getTotalPrice = (order) => {
        let totalPrice = 0;
        order.items.forEach((item) => {
            totalPrice += item.quantity * item.price;
        });
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
            
            case Status.CANCELED:
                return 'black';

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
                if (buttonIndex !== cancelIndex)
                    handleActionSelect(buttonIndex, item);
            }
        );
    }

    render() {
        return (
            <View>
                <FlatList
                    data={this.props.orders}
                    extraData={this.props}
                    keyExtractor={item => `${item.time}`}
                    renderItem={({ item }) => {
                    let timeDiff = Math.floor(dayjs().diff(dayjs(item.time), 'seconds') / 60);
                    return (
                        <Card>
                            <ListItem itemDivider style={[styles.rowSpaceBetween, { alignItems: 'flex-start' }]}>
                                <View style={{ marginTop: 8, marginLeft: 8 }}>
                                    {!this.props.vendor &&
                                    <Text style={[styles.header, styles.cardH2]}>
                                        Vendor: {item.vendorName}
                                    </Text>}
                                    <Text style={[{ color: 'gray', alignSelf: 'flex-start' }, styles.cardH3]}>
                                        {timeDiff < 1 ? 'just now' : `${timeDiff} minute${timeDiff > 1 ? 's' : ''} ago`}
                                    </Text>
                                </View>
                                {((item.status === Status.NOT_READY) || this.props.vendor) && 
                                <Button transparent
                                    style={{ marginLeft: 'auto', height: 32 }}
                                    onPress={() => this.showActionSheet(item)}
                                >
                                    <Icon style={{ fontSize: moderateScale(32, 0.25), marginLeft: moderateScale(8), marginRight: moderateScale(8) }} name='more' />
                                </Button>}
                            </ListItem>
                            <TouchableOpacity onPress={() => { if (this.props.orderOnPress) this.props.orderOnPress(item) }}>
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
                                            }}>{hash(item.id)}</Text>
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
                                                    fontSize: moderateScale(12),
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
                                                width: moderateScale(72),
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
                                                        fontSize: moderateScale(10),
                                                        lineHeight: moderateScale(12)
                                                    }
                                                ]}>{item.status}</Text>
                                            </Button>
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </Card>
                    )
                }}/>
            </View>
        );
    }
}