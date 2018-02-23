import React, { Component } from 'react';
import { StatusBar } from 'react-native';
import { DrawerNavigator } from "react-navigation";
import { Container, Drawer, StyleProvider } from 'native-base';
import getTheme from './native-base-theme/components';
import commonColor from './native-base-theme/variables/commonColor';

import { AttendeeDrawerNav, VendorDrawerNav } from './routes';
import { AppHeader, Sidebar } from './components';
import { LandingPage } from './LandingPage';
import firebase from 'firebase';


export default class App extends Component {
   constructor() {
      super();
      this.state = {
         view: 0, // 0 = neither, 1 = attendee, 2 = vendor
         loggedIn: null
      };
   }

   componentWillMount() {
    firebase.initializeApp({
      apiKey: "AIzaSyD9oIu2WqxmvQOrIlPQ-7GQRKZJgKamSk4",
      authDomain: "uwnightmarket-90946.firebaseapp.com",
      databaseURL: "https://uwnightmarket-90946.firebaseio.com",
      storageBucket: "uwnightmarket-90946.appspot.com",
      messagingSenderId: "119944110578"
    });

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ loggedIn: true });
      } else {
        this.setState({ loggedIn: false });
      }
    });
  }

   setView = (index) => {
      this.setState({ view: index });
      console.log("Set view to" + index);
   };
   render() {
      return (
         <StyleProvider style={getTheme(commonColor)}>
            <Container>
               {this.state.view === 0 ?
               <LandingPage setView={this.setView} /> : this.state.view === 1 ?
               <AttendeeDrawerNav screenProps={{ state: this.state, setView: this.setView }} /> :
               <VendorDrawerNav screenProps={{ state: this.state, setView: this.setView }} />}
            </Container>
         </StyleProvider>
      );
   }
}