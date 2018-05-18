import React from "react";
import { DrawerNavigator, StackNavigator } from "react-navigation";

import { MyOrders, VendorNavigator, Map, Games, Merchandise, EventInfo, Donate, VendorFood, MapStackNav } from "./attendee-pages";
import { VendorHome, VendorOrders, VendorMenu, VendorSalesSummary } from "./vendor-pages";
import { Sidebar } from "./components";

const AttendeeDrawerNav = DrawerNavigator(
    {
        MyOrders: { screen: MyOrders },
        VendorNavigator: { screen: VendorNavigator },
        Map: { screen: MapStackNav },
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
        VendorOrders: { screen: VendorOrders },
        Map: { screen: MapStackNav },
        VendorMenu: { screen: VendorMenu },
        VendorSalesSummary: { screen: VendorSalesSummary }
    },
    {
        contentComponent: props => <Sidebar {...props} />
    }
);

export { AttendeeDrawerNav, VendorDrawerNav }