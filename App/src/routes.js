import React, { Component } from "react";
import { DrawerNavigator } from "react-navigation";

import { MyOrders, VendorsFood, Map, Games, Merchandise, EventInfo, Donate } from "./attendee-pages";
import { Sidebar } from "./components";

export default DrawerNavigator(
    {
        MyOrders: { screen: MyOrders },
        VendorsFood: { screen: VendorsFood },
        Map: { screen: Map },
        Games: { screen: Games },
        Merchandise: { screen: Merchandise },
        EventInfo: { screen: EventInfo },
        Donate: { screen: Donate }
    },
    {
        contentComponent: props => <Sidebar {...props} />
    }
);