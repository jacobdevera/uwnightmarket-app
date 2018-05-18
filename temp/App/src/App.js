import React, { Component } from 'react';
import { Alert, Platform, Linking } from 'react-native';
import { Container, StyleProvider, Root, Spinner } from 'native-base';
import getTheme from './native-base-theme/components';
import commonColor from './native-base-theme/variables/commonColor';
import firebase from 'firebase';
import FCM, { FCMEvent, RemoteNotificationResult, WillPresentNotificationResult, NotificationType } from 'react-native-fcm';

import { AttendeeDrawerNav, VendorDrawerNav } from './routes';
import { LandingPage } from './LandingPage';
import { LoginForm } from './vendor-pages';
import { registerKilledListener } from "./Listeners";
import { firebaseConfig } from './FirebaseConstants';
import { config } from './styles';
import NavigationService from './utils/NavigationService';

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
    queue: 30
}

export const filters = ['food', 'beverage', 'hot', 'cold', 'savory', 'sweet', 'spicy', 'available'];

export const errorToken = () => {
    Alert.alert(
        'Please allow for notifications',
        'This is needed for vendors to notify you when your order is ready.',
        [
            { text: 'Later', style: 'cancel' },
            { text: 'Open Settings', onPress: () => { 
                Linking.openURL('app-settings:').catch(err => console.log(err));
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
            loggedIn: false,
            initialNotif: null,
            checkingLogin: true
        };
    }

    clearInitialNotif = () => {
        this.setState({ initialNotif: null })
    }

    componentWillMount() {
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }

        firebase.auth().onAuthStateChanged(async (user) => {
            if (user) {
                let newView = user.isAnonymous ? Views.ATTENDEE : Views.VENDOR;
                if (user.isAnonymous) {
                    await FCM.requestPermissions().catch((e) => {
                        console.log(e);
                        errorToken();
                    });
                }
                FCM.getInitialNotification().then(notif => {
                    console.log("INITIAL NOTIFICATION ", notif)
                    this.setState({ initialNotif: notif, view: newView, loggedIn: true, checkingLogin: false });
                });
            } else {
                this.setState({ view: Views.INITIAL, loggedIn: false, checkingLogin: false });
            }
        });

        this.notificationListener = FCM.on(FCMEvent.Notification, notif => {
            console.log("Notification", notif);
            if (notif.local_notification) {
                return;
            }
            if (notif.opened_from_tray) {
                console.log('opened from tray')
                this.setState({ initialNotif: notif, view: Views.ATTENDEE });
                if (notif.status === Status.READY)
                    NavigationService.navigate('Map', { vendorId: notif.vendorId });
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

    setView = (index) => { this.setState({ view: index }); }

    render() {
        const { view, checkingLogin } = this.state;
        return (
            <StyleProvider style={getTheme(commonColor)}>
                <Root>
                    <Container style={{ backgroundColor: 'white' }}>
                        {checkingLogin ? 
                            <Spinner style={{ marginTop: 'auto', marginBottom: 'auto' }} color={config.colorPrimary}/> 
                        : view === Views.INITIAL ?
                            <LandingPage setView={this.setView} /> 
                        : view === Views.ATTENDEE ?
                            <AttendeeDrawerNav 
                                ref={navigatorRef => {
                                    NavigationService.setTopLevelNavigator(navigatorRef);
                                }}
                                screenProps={{ state: this.state, setView: this.setView, clearInitialNotif: this.clearInitialNotif }} /> 
                        : view === Views.LOGIN ?
                            <LoginForm setView={this.setView} /> 
                        :
                            <VendorDrawerNav screenProps={{ state: this.state, setView: this.setView }} />}
                    </Container>
                </Root>
            </StyleProvider>
        );
    }
}