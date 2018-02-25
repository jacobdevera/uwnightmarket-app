import React, { Component } from 'react';
import { StatusBar } from 'react-native';
import { DrawerNavigator } from "react-navigation";
import { Container, Drawer, StyleProvider } from 'native-base';
import getTheme from './native-base-theme/components';
import commonColor from './native-base-theme/variables/commonColor';

import { AttendeeDrawerNav, VendorDrawerNav } from './routes';
import { AppHeader, Sidebar } from './components';
import { LandingPage } from './LandingPage';

export default class App extends Component {
   constructor() {
      super();
      this.state = {
         view: 0 // 0 = neither, 1 = attendee, 2 = vendor
      };
   }

   setView = (index) => {
      this.setState({ view: index });
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