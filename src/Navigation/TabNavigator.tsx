import * as React from 'react';
import { Text, View } from 'react-native';
// import { useNavigation, NavigationContainer } from '@react-navigation/native';
// import { Button } from '@react-navigation/elements';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from '../Screens/Home Bottom Tabs/Home';
import Fav from '../Screens/Home Bottom Tabs/Favorites';
import Chat from '../Screens/Home Bottom Tabs/Chat';
import ChatIcon from '../../assets/images//chat.svg';
import Heart from '../../assets/images//heart.svg';
import Hut from '../../assets/images/home.svg';

const Tab = createBottomTabNavigator();

export function MyTabs(){
    return(
             <Tab.Navigator
        screenOptions={({route})=>({
            headerShown:false,
            tabBarActiveTintColor:'#dc143c',
            tabBarInactiveTintColor:'#999',
            tabBarShowLabel:false,
            tabBarStyle:{
                height:50,
                paddingTop:6,
                borderTopLeftRadius:15,
                borderTopRightRadius:15,
                borderRadius:3,
                // paddingBottom:10,
                backgroundColor:'#FEE9EE',
            },
            tabBarIcon:({focused})=>{
                const color = focused ? '#dc143c' : '#BCBCBC'
                if(route.name === 'Home') {
                    return(
                        <Hut
                        width={30}
                        height={30}
                        color={color}
                        />
                    );
                 }
                 if(route.name === 'Fav') {
                    return(
                        <Heart
                        width={30}
                        height={30}
                        color={color}
                       />
                    )
                }
                if(route.name=== 'Chat') {
                return(
                    <ChatIcon
                    width={30}
                    height={30}
                    color={color}
                    />
                )
                }
                return null;
            }
        })}
        >
            <Tab.Screen name="Home" component={Home}/>
            <Tab.Screen name='Fav' component={Fav} />
            <Tab.Screen name="Chat" component={Chat} />
        </Tab.Navigator>
    )
};

export default MyTabs;