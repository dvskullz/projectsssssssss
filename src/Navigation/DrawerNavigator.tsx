import React from "react";
import {createDrawerNavigator} from '@react-navigation/drawer';
import MyTabs from "./TabNavigator";
import {MS, NotificationSettings}from '../../Constants/screens'
import MyProfile from "../Screens/MyProfile/MyProfile";
import MyTransaction from "../Screens/My Transactions/MyTransaction";
import Custom from "./custom";
import { Dimensions } from "react-native";
import Language from "../Screens/LanguageSettings/LanguageSetting";
import Refer from "../Screens/Referral/Refer";
// import NotificationScreen from "../src/Screens/Notification";
import Privacy from "../Screens/PrivacyScreen/Privacy";
import Subscription from "../Screens/Monetization & Subscription Screen/MS";


const { width } = Dimensions.get('window');

const Drawer = createDrawerNavigator();

const DrawerNavigator = ()=>{
    return(
        <Drawer.Navigator
        drawerContent={(props)=> <Custom{...props} />}
        screenOptions={{
            headerShown:false,
            drawerType:'front',
            drawerPosition:'left',
            
            drawerStyle:{
                width:width
            },
            // overlayColor:'#fff1f4',
        }}
        >
            <Drawer.Screen name="HomeDrawer" component={MyTabs}/>
            <Drawer.Screen name='MS' component={Subscription}/>
            <Drawer.Screen name='MyProfile' component={MyProfile}/>
            <Drawer.Screen name='MyTransaction' component={MyTransaction}/>
            <Drawer.Screen name='Language' component={Language} />
            <Drawer.Screen name='Refer' component={Refer} />
            {/* <Drawer.Screen name="Notification" component={NotificationScreen}  options={{headerShown:true, title:'    Notification', headerStyle:{backgroundColor:'#FFF1F4'}}} /> */}
            <Drawer.Screen name="Privacy" component={Privacy} />
            <Drawer.Screen name='NotificationSettings' component={NotificationSettings}/>
        </Drawer.Navigator>
    );
};

export default DrawerNavigator;
