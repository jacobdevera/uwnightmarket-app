import React, { Component } from 'react';
import { Content, List, ListItem, Text } from 'native-base';
import styles from '../styles';

const Sidebar = (props) => {
    let routes = [
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
        </Content>
    );
}
export { Sidebar };