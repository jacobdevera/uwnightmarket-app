import React, { Component } from 'react';
import { View, Linking } from 'react-native';
import { Content, List, ListItem, Text, Icon, Toast } from 'native-base';
import styles from '../styles';

import firebase from 'firebase';
import { Views } from '../App';

class Sidebar extends Component {
    state = { routes: [], showToast: false }

    componentDidMount() {
        let routes = [];
        switch (this.props.screenProps.state.view) {
            case Views.ATTENDEE:
            routes = [
                { route: 'MyOrders', title: 'My Orders' },
                { route: 'VendorNavigator', title: 'Vendors / Food' },
                { route: 'Map', title: 'Map' },
                { route: 'Games', title: 'Games' },
                { route: 'Merchandise', title: 'Merchandise' },
                { route: 'EventInfo', title: 'Event Info' },
                { route: 'Donate', title: 'Donate' },
            ];
            break;
            
            case Views.VENDOR:
            routes = [
                { route: 'VendorHome', title: 'Home' },
                { route: 'VendorOrders', title: 'Orders' },
                { route: 'VendorOrders', title: '\tActive' },
                { route: 'VendorOrders', title: '\tCompleted'},
                { route: 'VendorMenu', title: 'Menu' },
                { route: 'VendorSalesSummary', title: 'Sales Summary' },
                { route: 'Map', title: 'Map' },
            ];
        }
        this.setState({ routes: routes });
    }

    handleSignOut = () => {
        let user = firebase.auth().currentUser;
        if (user.isAnonymous) {
            user.delete().then(() => {

            }).catch((error) => {
                Toast.show({
                    text: 'Could not sign out',
                    position: 'bottom'
                });
            })
        }
    }

    render() {
        return (
            <Content style={styles.sideBar}>
                <List
                    dataArray={this.state.routes}
                    renderRow={(data, index) => {
                        return (
                            <ListItem key={index} noBorder button onPress={() => this.props.navigation.navigate(data.route)}>
                                <Text style={styles.light}>{data.title}</Text>
                            </ListItem>
                        );
                    }}
                />
                <ListItem key={this.state.routes.length} noBorder button onPress={() => this.handleSignOut() }>
                    <Text style={styles.light}>Log Out</Text>
                </ListItem>
                <View style={styles.row}>
                    <Icon name='logo-facebook' onPress={ ()=>{ Linking.openURL('https://www.facebook.com/TheUWNightMarket')}} style={styles.iconWhite}/>
                    <Icon name='logo-instagram' onPress={ ()=>{ Linking.openURL('https://www.instagram.com/uwnightmarket/')} } style={styles.iconWhite}/>
                    <Icon name='logo-twitter' onPress={ ()=>{ Linking.openURL('https://twitter.com/uwnightmarket')} } style={styles.iconWhite}/>
                </View>
            </Content>
        );
    }
}
export { Sidebar };