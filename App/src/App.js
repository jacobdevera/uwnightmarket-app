import React, { Component } from 'react';
import { StatusBar } from 'react-native';
import { DrawerNavigator } from "react-navigation";
import { Container, Drawer, StyleProvider } from 'native-base';
import getTheme from './native-base-theme/components';
import commonColor from './native-base-theme/variables/commonColor';

import Router from './routes';
import { AppHeader, Sidebar } from './components';
import { LandingPage } from './LandingPage';

export default class App extends Component {
   constructor() {
      super();
      this.state = {
         view: 0 // 0 = neither, 1 = attendee, 2 = vendor
      };
   }
   componentDidMount() {
       console.log(this.props.navigation);
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
               <LandingPage setView={this.setView}/> :
               <Router />}
            </Container>
         </StyleProvider>
      );
   }
}