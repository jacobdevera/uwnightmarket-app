import React, { Component } from 'react';
import {
   StatusBar
} from 'react-native';

import { Drawer, StyleProvider } from 'native-base';
import getTheme from './native-base-theme/components';
import commonColor from './native-base-theme/variables/commonColor';
import { AppHeader, Sidebar, LandingPage } from './components';

export default class App extends Component {
   closeDrawer = () => {
      this.drawer._root.close();
      StatusBar.setHidden(false);
   };
   openDrawer = () => {
      this.drawer._root.open();
      StatusBar.setHidden(true);
   };
   render() {
      return (
         <StyleProvider style={getTheme(commonColor)}>
            <Drawer
               ref={(ref) => { this.drawer = ref; }}
               content={<Sidebar />}
               onClose={() => this.closeDrawer()} >
               <AppHeader openDrawer={this.openDrawer.bind(this)}>
                  UW Night Market
               </AppHeader>
               <LandingPage />
            </Drawer>
         </StyleProvider>
      );
   }
}