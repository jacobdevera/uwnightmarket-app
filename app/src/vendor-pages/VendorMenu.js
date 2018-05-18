import React, { Component } from 'react';
import { View, FlatList, Alert } from 'react-native';
import {
    ActionSheet,
    Button,
    Container,
    Content,
    Text,
    ListItem
} from 'native-base';
import { AppHeader } from '../components';
import styles, { moderateScale } from '../styles';
import firebase from 'firebase';

const STATUS_ITEMS = ['Available', 'Sold Out', 'Cancel'];

class VendorMenu extends Component {
    constructor(props) {
        super(props);
        this.state = { menu: [], selectedMenuIndex: -1 }
    }

    componentDidMount() {
        let menuRef = firebase.database().ref(`/vendors/${firebase.auth().currentUser.uid}/menu/`).orderByKey();
        menuRef.once('value').then((snapshot) => {
            let menu = [];
            snapshot.forEach((itemSnapshot) => {
                menu.push(itemSnapshot.val());
            });
            this.setState({ menu: menu });
        })
    }

    setMenuItemStatus = async (index, selectedMenuIndex) => {
        if (index < STATUS_ITEMS.length - 1) {
            let statusLower = STATUS_ITEMS.map((item) => item.toLowerCase()).slice(0, STATUS_ITEMS.length - 1);
            let newMenu = this.state.menu.slice();
            let newItem = newMenu[selectedMenuIndex];
            newItem.traits = newItem.traits.filter((filter) => !statusLower.includes(filter));
            newItem.traits.push(statusLower[index]);
            this.setState({ menu: newMenu });

            await firebase.database().ref(`/vendors/${firebase.auth().currentUser.uid}/menu/`).set(newMenu).catch(res => Alert.alert('Failed to update menu status'));
        }
    }

    render() {
        return (
            <Container>
                <AppHeader navigation={this.props.navigation}>
                    Menu
                </AppHeader>
                <Content style={styles.paddedContainer}>
                    <FlatList
                        data={this.state.menu}
                        extraData={this.state}
                        keyExtractor={item => `${item.name}`}
                        renderItem={({ item, index }) => {
                            return (
                                <ListItem> 
                                    <Text style={{ flex: 60 }}>{item.name}</Text>
                                    <Text style={[styles.center, { flex: 10 }]}>${item.price}</Text>
                                    <View style={{ flex: 30 }}>
                                        <Button
                                            small
                                            style={{ alignSelf: 'flex-end', width: moderateScale(72), justifyContent: 'center' }}
                                            onPress = {() => {
                                                ActionSheet.show(
                                                    {
                                                        options: STATUS_ITEMS,
                                                        cancelButtonIndex: 2,
                                                        destructiveButtonIndex: 1,
                                                        title: 'Set Menu Item Status'
                                                    },
                                                    buttonIndex => {
                                                        this.setMenuItemStatus(buttonIndex, index)
                                                    }
                                                );
                                            }}
                                        >
                                            <Text style={{ 
                                                paddingLeft: 0, 
                                                paddingRight: 0, 
                                                fontSize: moderateScale(10),
                                                lineHeight: moderateScale(12)
                                            }}>
                                                {item.traits.includes('available') ? 'AVAILABLE' : 'SOLD OUT'}
                                            </Text>
                                        </Button>
                                    </View>
                                </ListItem>
                            );
                        }} 
                    />
                </Content>
            </Container>
        );
    }
}

export { VendorMenu }