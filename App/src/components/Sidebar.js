import React, { Component } from 'react';
import { View, Linking } from 'react-native';
import { Content, List, ListItem, Text, Icon } from 'native-base';
import styles from '../styles';

const Sidebar = (props) => {
    let routes = [];
    switch (props.screenProps.view) {
        case 1:
        routes = [
            { 
                route: 'MyOrders',
                title: 'My Orders'
            },
            { 
                route: 'VendorsFood',
                title: 'Vendors / Food'
            },
            { 
                route: 'Map',
                title: 'Map'
            },
            { 
                route: 'Games',
                title: 'Games'
            },
            { 
                route: 'Merchandise',
                title: 'Merchandise'
            },
            { 
                route: 'EventInfo',
                title: 'Event Info'
            },
            { 
                route: 'Donate',
                title: 'Donate'
            },
        ];
        break;

        case 2:
        routes = [
            { 
                route: 'VendorHome',
                title: 'Home'
            },
            { 
                route: 'VendorOrders',
                title: 'Orders'
            },
            { 
                route: 'VendorOrders',
                title: '\tActive'
            },
            { 
                route: 'VendorOrders',
                title: '\tCompleted'
            },
            { 
                route: 'VendorMenu',
                title: 'Menu'
            },
            { 
                route: 'VendorSalesSummary',
                title: 'Sales Summary'
            },
            { 
                route: 'Map',
                title: 'Map'
            },
        ];
    }
    return (
        <Content style={styles.sideBar}>
            <List
                dataArray={routes}
                renderRow={(data, index) => {
                    return (
                        <ListItem key={index} noBorder button onPress={() => props.navigation.navigate(data.route)}>
                            <Text style={styles.light}>{data.title}</Text>
                        </ListItem>
                    );
                }}
            />
            <View style={styles.row}>
                <Icon name='logo-facebook' onPress={ ()=>{ Linking.openURL('https://www.facebook.com/TheUWNightMarket')}} style={styles.iconWhite}/>
                <Icon name='logo-instagram' onPress={ ()=>{ Linking.openURL('https://www.instagram.com/uwnightmarket/')} } style={styles.iconWhite}/>
                <Icon name='logo-twitter' onPress={ ()=>{ Linking.openURL('https://twitter.com/uwnightmarket')} } style={styles.iconWhite}/>
            </View>
        </Content>
    );
}
export { Sidebar };