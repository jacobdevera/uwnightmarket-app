import React from "react";
import { DrawerNavigator } from "react-navigation";

import { MyOrders, VendorNavigator, Map, Games, Merchandise, EventInfo, Donate } from "./attendee-pages";
import { VendorHome, VendorOrders, VendorMenu } from "./vendor-pages";
import { Sidebar } from "./components";

const AttendeeDrawerNav = DrawerNavigator(
    {
        MyOrders: { screen: MyOrders },
        VendorNavigator: { screen: VendorNavigator },
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

const VendorDrawerNav = DrawerNavigator(
    {
        VendorHome: { screen: VendorHome },
        VendorsFood: { screen: VendorNavigator },
        VendorOrders: { screen: VendorOrders },
        Map: { screen: Map },
        VendorMenu: { screen: VendorMenu }
    },
    {
        contentComponent: props => <Sidebar {...props} />
    }
);

export { AttendeeDrawerNav, VendorDrawerNav }