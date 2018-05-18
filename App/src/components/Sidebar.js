import React, { Component } from 'react';
import { Alert, View, Linking, ScrollView } from 'react-native';
import { List, ListItem, Text, Icon, Toast } from 'native-base';
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
                { route: 'VendorOrders', title: 'Orders - Active', props: { active: true } },
                { route: 'VendorOrders', title: 'Orders - Completed', props: { active: false } },
                { route: 'VendorMenu', title: 'Menu' },
                { route: 'VendorSalesSummary', title: 'Sales Summary' },
                { route: 'Map', title: 'Map' },
            ];
        }
        this.setState({ routes: routes });
    }

    handleSignOut = async (index) => {
        if (index === 0) {
            let user = firebase.auth().currentUser;
            if (user.isAnonymous) { // is attendee
                this.props.screenProps.setView(Views.INITIAL);
            } else {
                firebase.auth().signOut().catch((error) => {
                    this.signOutError(error);
                });
            }
        }
    }

    deleteUserOrders = (user) => {
        let updates = {};
        let orderRef = firebase.database().ref(`/user-orders/${user.uid}`).orderByKey();
        return new Promise((resolve) => {
            orderRef.once('value').then((snapshot) => {
                if (snapshot.val()) {
                    let promises = [];
                    Object.keys(snapshot.val()).forEach((key) => {
                        promises.push(firebase.database().ref(`/orders/${key}`).once('value').then((orderSnapshot) => {
                            let order = orderSnapshot.val();
                            updates[`/user-orders/${order.userId}/${key}`] = null;
                            updates[`/vendor-orders/${order.vendorId}/orders/${key}`] = null;
                            updates[`/orders/${key}`] = null;
                        }))
                    })
                    Promise.all(promises).then((responses) => {
                        firebase.database().ref().update(updates).then((response) => {
                            resolve(true);
                        }).catch((error) => this.signOutError(error))
                    })
                } else { 
                    resolve(true);
                }
            }).catch((error) => {
                this.signOutError(error);
            });
        });
    }

    signOutError = (error) => { 
        Toast.show({
            text: `Could not sign out: ${error}`,
            position: 'bottom'
        });
        throw new Error(error);
    }

    render() {
        return (
            <View style={styles.sideBar}>
                <ScrollView>
                    <List
                        dataArray={this.state.routes}
                        renderRow={(data, index) => {
                            return (
                                <ListItem key={index} noBorder button onPress={() => {
                                    this.props.navigation.navigate({ routeName: data.route, params: data.props });
                                    this.props.navigation.setParams(data.props);
                                    if (data.route === 'VendorNavigator')
                                        this.props.navigation.popToTop();
                                }}>
                                    <Text style={[styles.light, styles.bold]}>{data.title}</Text>
                                </ListItem>
                            );
                        }}
                    />
                    <ListItem key={this.state.routes.length} noBorder button onPress={() => {
                        if (firebase.auth().currentUser.isAnonymous)
                            Alert.alert(
                                'Sign out?',
                                'Your orders will be saved.',
                                [
                                    { text: 'Cancel', style: 'cancel' },
                                    { text: 'Sign Out', onPress: () => this.handleSignOut(0) },
                                ]
                            );
                        else
                            this.handleSignOut(0);
                        }}     
                    >
                        <Text style={[styles.light, styles.bold]}>Log Out</Text>
                    </ListItem>
                </ScrollView>
                <View style={[styles.row, { flex: 1, alignItems: 'flex-end', marginBottom: 16 }]}>
                    <Icon name='logo-facebook' onPress={ ()=>{ Linking.openURL('https://www.facebook.com/TheUWNightMarket')} } style={styles.iconWhite}/>
                    <Icon name='logo-instagram' onPress={ ()=>{ Linking.openURL('https://www.instagram.com/uwnightmarket/')} } style={styles.iconWhite}/>
                    <Icon name='logo-twitter' onPress={ ()=>{ Linking.openURL('https://twitter.com/uwnightmarket')} } style={styles.iconWhite}/>
                </View>
            </View>
        );
    }
}
export { Sidebar };