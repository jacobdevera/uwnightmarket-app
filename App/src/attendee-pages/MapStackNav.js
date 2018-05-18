import { StackNavigator } from "react-navigation";

import VendorFood from './VendorFood';
import { Map } from './Map';

const MapStackNav = StackNavigator(
    {
        MapView: { screen: Map },
        VendorView: { 
            screen: VendorFood, 
            navigationOptions: ({navigation}) => ({
                drawerLockMode: 'locked-closed'
            })
        }
    },
    {
        headerMode: 'none'
    }
);

export { MapStackNav }