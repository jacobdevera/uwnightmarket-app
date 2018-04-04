import React, {Component} from 'react';
import {Image, View, FlatList} from 'react-native';
import {
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
    Badge
} from 'native-base';
import styles, {config} from '../styles';
import StatusPicker from './StatusPicker';
import {Status} from '../App';
import {StackNavigator} from "react-navigation";
import ActionSheet from 'react-native-actionsheet';
import firebase from 'firebase';

export class OrderList extends Component {
    constructor(props) {
        super(props);
        this.state = {selectedItem : null}
    }

    getTotalPrice = (order) => {
        return order
            .items
            .reduce((acc, curr) => {
                return {
                    price: (acc.price) + (curr.price * curr.quantity)
                }
            })
            .price;
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

    changestatus = (val) => {
        if (!this.props.vendor) 
            return;
        this
            .props
            .changeStatus(val);

    }

    showActionSheet = () => {
        this.ActionSheet.show();
    }

    // handleStatusChange = (index) => {
    //     // let orderId = this.state.selectedItem.id;
    //     // // let orderId = this.pickedid;
    //     // console.log(orderId)
    //     // let status = ['NOT READY', 'READY', 'PICKED UP'];
    //     // let updates = {status : status[index]};
    //     // firebase.database().ref(`/orders/${orderId}`).update(updates);

    //     this.props.handleStatusChange(index);
    // }

    render() {
        return (
            <View>
                <FlatList
                    data={this.props.orders}
                    extraData={this.props}
                    keyExtractor={item => `${item.time}`}
                    renderItem={({item}) => {
                    return (
                        <Card>
                            {!this.props.vendor
                                ? <Text style={[styles.row, styles.header, styles.cardH2]}>
                                        Vendor: {item.vendorName}
                                    </Text>
                                : null}
                            <View style={styles.row}>
                                <View
                                    style={{
                                    flex: 20
                                }}>
                                    <Text style={[styles.center, styles.header, styles.cardH2]}>Order #</Text>
                                    <Badge
                                        width={64}
                                        style={{
                                        backgroundColor: config.colorPrimary
                                    }}>
                                        <Text>1</Text>
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
                                                paddingLeft: 4
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
                                        <Button onPress={() => {
                                            if(this.props.vendor)
                                            {
                                                // this.pickedid = item.id;
                                                this.showActionSheet();
                                                this.setState({selectedItem: item});
                                                 }}}
                                            small
                                            style={{
                                            backgroundColor: this.getStatusButtonColor(item)
                                        }}>
                                            <Text
                                                style={[
                                                styles.center, {
                                                    fontSize: 10,
                                                    lineHeight: 12
                                                }
                                            ]}>{item.status}</Text>
                                        </Button>
                                    </View>
                                </View>
                            </View>
                        </Card>
                    )
                }}/>
                <ActionSheet
                    ref={o => this.ActionSheet = o}
                    title={'Which one do you like ?'}
                    options={['Not Ready', 'Ready', 'Picked Up', 'Cancel']}
                    cancelButtonIndex={3}
                    destructiveButtonIndex={3}
                    onPress={(index) => {
                    var handleToUpdate  =   this.props.handleStatusChange;
                    handleToUpdate(index,this.state.selectedItem);
                }}/>
            </View>
        );
    }
}

{/* <StatusPicker changeStatus={this.changeStatus}
style={{
    backgroundColor: this.getStatusButtonColor(item)
}}/> */
}