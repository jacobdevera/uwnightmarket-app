import React, { Component } from 'react';
import { StatusBar } from 'react-native';
import { DrawerNavigator } from "react-navigation";
import { Container, Drawer, StyleProvider, Root } from 'native-base';
import getTheme from './native-base-theme/components';
import commonColor from './native-base-theme/variables/commonColor';

import { AttendeeDrawerNav, VendorDrawerNav } from './routes';
import { AppHeader, Sidebar } from './components';
import { LandingPage } from './LandingPage';
import LoginForm from './vendor-pages/LoginForm';

import firebase from 'firebase';

export const Views = {
    INITIAL: 0,
    LOGIN: 1,
    ATTENDEE: 2,
    VENDOR: 3
}

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            view: 0, // 0 = neither, 1 = login, 2 = attendee, 3 = vendor
            loggedIn: null
        };
    }

    componentWillMount() {
        if (!firebase.apps.length) {
            firebase.initializeApp({
                apiKey: "AIzaSyD9oIu2WqxmvQOrIlPQ-7GQRKZJgKamSk4",
                authDomain: "uwnightmarket-90946.firebaseapp.com",
                databaseURL: "https://uwnightmarket-90946.firebaseio.com",
                storageBucket: "uwnightmarket-90946.appspot.com",
                messagingSenderId: "119944110578"
            });
        }

        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                let newView = user.isAnonymous ? Views.ATTENDEE : Views.VENDOR;
                this.setState({ view: newView, loggedIn: true });
            } else {
                this.setState({ view: Views.INITIAL, loggedIn: false });
            }
        });
    }

    addUserToDatabase = (user) => {
        let userData = {
            userId: user.uid,
            name: '',
            desc: '',
            img: '',
            menu: [
                { 
                    name: '',
                    price: 0,
                    traits: ['food']
                },
                { 
                    name: '',
                    price: 0,
                    traits: ['food']
                },
                { 
                    name: '',
                    price: 7,
                    traits: ['food']
                }
            ]
        }

        let newUserRef = firebase.database().ref('users/' + user.uid);
        newUserRef.set(userData);
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
                        {this.state.view === 0 ?
                        <LandingPage setView={this.setView} /> : this.state.view === Views.ATTENDEE ?
                        <AttendeeDrawerNav screenProps={{ state: this.state, setView: this.setView }} /> : this.state.view === Views.LOGIN ?
                        <LoginForm setView={this.setView} addUserToDatabase={this.addUserToDatabase}/> :
                        <VendorDrawerNav screenProps={{ state: this.state, setView: this.setView }} />}
                    </Container>
                </Root>
            </StyleProvider>
        );
    }
}