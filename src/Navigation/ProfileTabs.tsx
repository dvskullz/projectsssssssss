import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
// import Video from '../src/assets/images/post1.svg';
import {View} from 'react-native';
import Grid from '../../assets/images/grid4.svg';
import Gift from '../../assets/images/idk.svg';
import PostTab from "../Screens/AI Profile/PostTab";
import VideoTab from "../Screens/AI Profile/VideoTab";
import GiftTab from "../Screens/GiftScreen/GiftTab";
import Video from '../../assets/images/t2.svg'

const Tab = createMaterialTopTabNavigator();
// const color = backgroundColor ? "#dc143c" 
 export default function ProfileTabs({profile,loading}:any){
    return(
        <View style={{flex:1}}>
        <Tab.Navigator
       
        screenOptions={{
        tabBarGap:-2,  
        lazy:true,
        animationEnabled:true,  
        swipeEnabled:true,
        tabBarShowLabel:false,
        tabBarShowIcon:true,
        tabBarActiveTintColor:'#dc143c',
        tabBarInactiveTintColor:'#999',
           
        tabBarIndicatorStyle:{
        backgroundColor:'#dc143c',
        height:2.5,
        // width:120,
        },
        tabBarStyle:{
        backgroundColor:'#fffafb'  
        },
    sceneStyle:{
    backgroundColor:'#fffafb',
    flex:1
},
         
        }}
        >
        <Tab.Screen 
        name="Post"
        options={{
            tabBarIcon:({color}) =>(
            <Grid width={24} height={24} color={color} fill={color} stroke={color} />
              ),
            }}
            >
            {()=> <PostTab profile={profile} loading={loading}/>}
            </Tab.Screen>
            {/* {()=> <PostTab imagePosts={profile?.imagePosts}/>} */}
            <Tab.Screen
            name="Video" 
             options={{
                tabBarIcon:({color})=>(
                    <Video width={24} height={24} color={color}  stroke={color} />
                    ),
                    }} 
                    >
                    {()=> <VideoTab profile={profile} loading={loading}/>}
            </Tab.Screen>
             
            <Tab.Screen
            name="Gift"
            component={GiftTab}
            options={{
                tabBarIcon:({color}) =>(
                    <Gift width={26} height={26} color={color} fill={color} stroke={color}/>
                ),
            }}
            /> 
        </Tab.Navigator>
        </View>
    );
};
