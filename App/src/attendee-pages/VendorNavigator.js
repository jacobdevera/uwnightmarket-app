import { StackNavigator } from "react-navigation";

import VendorFood from './VendorFood';
import VendorList from './VendorList'

const VendorNavigator = StackNavigator(
    {
        VendorList: { screen: VendorList },
        VendorFood: { 
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

export { VendorNavigator }