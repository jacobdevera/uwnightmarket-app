import React, { Component } from 'react';
import { Alert, StatusBar, Platform, Linking, SafeAreaView } from 'react-native';
import { DrawerNavigator } from "react-navigation";
import { Container, Drawer, StyleProvider, Root } from 'native-base';
import getTheme from './native-base-theme/components';
import commonColor from './native-base-theme/variables/commonColor';

import { AttendeeDrawerNav, VendorDrawerNav } from './routes';
import { AppHeader, Sidebar } from './components';
import { LandingPage } from './LandingPage';
import { LoginForm } from './vendor-pages';

import firebase from 'firebase';
import FCM, { FCMEvent, RemoteNotificationResult, WillPresentNotificationResult, NotificationType, 
    NotificationActionType, NotificationActionOption, NotificationCategoryOption } from 'react-native-fcm';
import { registerKilledListener } from "./Listeners";
import { API_KEY } from './FirebaseConstants';

export const Views = {
    INITIAL: 0,
    LOGIN: 1,
    ATTENDEE: 2,
    VENDOR: 3
}

export const Status = {
    READY: "READY",
    NOT_READY: "NOT READY",
    PICKED_UP: "PICKED UP",
    CANCELED: "CANCELED"
}

export const limits = {
    quantity: 7,
    orders: 2,
    orderAge: 120000,
    orderCooldown: 30000,
    queue: 15
}

export const filters = ['food', 'beverage', 'hot', 'cold', 'savory', 'sweet', 'spicy', 'available'];

export const ErrorToken = () => {
    Alert.alert(
        'Please allow for notifications',
        'This is needed for vendors to notify you when your order is ready.',
        [
            { text: 'OK', style: 'cancel' },
            { text: 'Open Settings', onPress: () => { 
                Linking.openURL('app-settings:').catch((err) => {
                console.log(err);
              });
            }}
        ]
    );
}
registerKilledListener();

export default class App extends Component {
    constructor(props) {
        super(props);
        // improper timer handling on Android
        console.ignoredYellowBox = ['Setting a timer', 'Remote', 'source.uri'];
        this.state = {
            view: 0,
            loggedIn: null
        };
    }

    componentWillMount() {
        if (!firebase.apps.length) {
            firebase.initializeApp({
                apiKey: API_KEY,
                authDomain: "uwnightmarket-90946.firebaseapp.com",
                databaseURL: "https://uwnightmarket-90946.firebaseio.com",
                storageBucket: "uwnightmarket-90946.appspot.com",
                messagingSenderId: "119944110578"
            });
        }

        FCM.getInitialNotification().then(notif => {
            console.log("INITIAL NOTIFICATION", notif)
        });

        firebase.auth().onAuthStateChanged(async (user) => {
            if (user) {
                let newView = user.isAnonymous ? Views.ATTENDEE : Views.VENDOR;
                if (user.isAnonymous) {
                    try {
                        await FCM.requestPermissions();
                    } catch (e) {
                        console.log(e);
                        ErrorToken();
                    }
                }
                this.setState({ view: newView, loggedIn: true });
            } else {
                this.setState({ view: Views.INITIAL, loggedIn: false });
            }
        });

        this.notificationListener = FCM.on(FCMEvent.Notification, notif => {
            console.log("Notification", notif);
            if (notif.local_notification) {
                return;
            }
            if (notif.opened_from_tray) {
                return;
            }

            if (Platform.OS === 'ios') {
                switch (notif._notificationType) {
                    case NotificationType.Remote:
                        notif.finish(RemoteNotificationResult.NewData) //other types available: RemoteNotificationResult.NewData, RemoteNotificationResult.ResultFailed
                        break;
                    case NotificationType.NotificationResponse:
                        notif.finish();
                        break;
                    case NotificationType.WillPresent:
                        notif.finish(WillPresentNotificationResult.All) //other types available: WillPresentNotificationResult.None
                        break;
                }
            }
            this.showLocalNotification(notif);
        });
    }

    componentWillUnmount() {
        this.notificationListener.remove();
    }

    showLocalNotification = (notif) => {
        FCM.presentLocalNotification({
            title: notif.title,
            body: notif.body,
            priority: "high",
            click_action: notif.click_action,
            show_in_foreground: true,
            local: true
        });
    }

    setView = (index) => {
        this.setState({ view: index });
        console.log("Set view to" + index);
    };

    render() {
        return (
            <StyleProvider style={getTheme(commonColor)}>
                <Root>
                    <Container>
                        {this.state.view === Views.INITIAL ?
                            <LandingPage setView={this.setView} /> : this.state.view === Views.ATTENDEE ?
                                <AttendeeDrawerNav screenProps={{ state: this.state, setView: this.setView }} /> : this.state.view === Views.LOGIN ?
                                    <LoginForm setView={this.setView} /> :
                                    <VendorDrawerNav screenProps={{ state: this.state, setView: this.setView }} />}
                    </Container>
                </Root>
            </StyleProvider>
        );
    }
}