import React, { Component } from "react";
import { DrawerNavigator } from "react-navigation";

import { MyOrders, VendorsFood } from "./attendee-pages";
import { Sidebar } from "./components";

export default DrawerNavigator(
  {
    MyOrders: { screen: MyOrders },
    VendorsFood: { screen: VendorsFood }
  },
  {
    contentComponent: props => <Sidebar {...props} />
  }
);