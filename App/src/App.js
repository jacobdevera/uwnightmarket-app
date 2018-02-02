import React, { Component } from 'react';
import {
   StatusBar
} from 'react-native';

import { Drawer, StyleProvider } from 'native-base';
import getTheme from './native-base-theme/components';
import commonColor from './native-base-theme/variables/commonColor';
import { AppHeader, Sidebar, LandingPage } from './components';

export default class App extends Component {
   constructor() {
      super();
      this.state = {
         view: 0 // 0 = neither, 1 = attendee, 2 = vendor
      };
   }
   closeDrawer = () => {
      this.drawer._root.close();
      StatusBar.setHidden(false);
   };
   openDrawer = () => {
      this.drawer._root.open();
      StatusBar.setHidden(true);
   };
   setView = (index) => {
      this.setState({ view: index });
      console.log("Set view to" + index);
   };
   render() {
      return (
         <StyleProvider style={getTheme(commonColor)}>
            <Drawer
               ref={(ref) => { this.drawer = ref; }}
               content={<Sidebar />}
               onClose={() => this.closeDrawer()} >
               <AppHeader openDrawer={() => this.openDrawer()}>
                  UW Night Market
               </AppHeader>
               <LandingPage setView={this.setView}/>
            </Drawer>
         </StyleProvider>
      );
   }
}