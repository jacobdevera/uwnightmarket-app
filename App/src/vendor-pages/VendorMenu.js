import React, { Component } from 'react';
import { Image, View, FlatList } from 'react-native';
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
    Badge,
} from 'native-base';
import { AppHeader } from '../components';
import styles from '../styles';
import ActionSheet from 'react-native-actionsheet';
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

    setMenuItemStatus = (index, selectedMenuIndex) => {
        if (index < STATUS_ITEMS.length - 1) {
            let statusLower = STATUS_ITEMS.map((item) => item.toLowerCase()).slice(0, STATUS_ITEMS.length - 1);
            let newMenu = this.state.menu.slice();
            let newItem = newMenu[selectedMenuIndex];
            newItem.traits = newItem.traits.filter((filter) => !statusLower.includes(filter));
            newItem.traits.push(statusLower[index]);
            this.setState({ menu: newMenu });

            firebase.database().ref(`/vendors/${firebase.auth().currentUser.uid}/menu/`).set(newMenu);
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
                                <Text style={{ flex: 10 }}>${item.price}</Text>
                                <View style={{ flex: 30 }}>
                                    <Button full
                                        onPress = {() => {
                                            this.ActionSheet.show();
                                            this.setState({ selectedMenuIndex: index });
                                        }}
                                    >
                                        <Text>{item.traits.includes('available') ? 'Available' : 'Sold Out'}</Text>
                                    </Button>
                                </View>
                            </ListItem>)
                        }} 
                    />
                    <ActionSheet
                        ref={o => this.ActionSheet = o}
                        title={'Set Menu Item Status'}
                        options={STATUS_ITEMS}
                        cancelButtonIndex={2}
                        destructiveButtonIndex={2}
                        onPress={(index) => {
                        this.setMenuItemStatus(index, this.state.selectedMenuIndex);
                    }}/>
                </Content>
            </Container>
        );
    }
}

export { VendorMenu }