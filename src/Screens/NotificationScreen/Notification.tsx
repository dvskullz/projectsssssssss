import React from "react";
import {Text,View,StyleSheet, Image, TouchableOpacity} from 'react-native';
import {IMAGES} from '../../../Constants/images';
import { useNavigation } from "@react-navigation/native";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
const NotificationScreen=()=>{
    const navigation = useNavigation();
    return(
        <View style={{flex:1 , backgroundColor:'#fff'}}>
            <View style={style.customHeader}>
                <TouchableOpacity onPress={()=>navigation.goBack()} >
                <MaterialCommunityIcons
                name="arrow-left"
                size={24}
                color={'#000'}
                />
                </TouchableOpacity>
                <Text style={style.headerTitle}>Notifications</Text>
                <View style = {{width:4}}/>
            </View>
            <View style={style.headerSeperator}/>
           <Image
           source={IMAGES.Notification}
           style={style.image}
           />
            <Text style={style.text}>No Notification Founds.</Text>
            <Text style={style.desc}>Check back later for updates, messages,{'\n'} 
             <Text style={style.desc1}>   and activity alerts. </Text>
                </Text>
        </View>
    );
};

const style = StyleSheet.create({
    text:{
        fontFamily:'Poppins-SemiBold',
        fontSize:16,
        top:300,
        textAlign:'center',
        left:7
    },
    image:{
        position:'absolute',
        marginTop:310,
        alignSelf:'center'
    },
    desc:{
        fontSize:12,
        fontFamily:'Poppins-Medium',
        left:6,
        top:300,
        textAlign:'center',
        color:'#838383'
    },
    desc1:{
        fontSize:12,
        fontFamily:'Poppins-Medium',
        lineHeight:22,
        left:30,
        top:300,
        textAlign:'center'
    },
    customHeader:{
        height:65,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        paddingHorizontal:15,
        backgroundColor:"#fff"
    },
    headerTitle:{
        fontSize:17,
        padding:18,
        textAlign:'center',
        fontFamily:'Poppins-Medium'
    },
    headerSeperator:{
        height:1,
        width:'100%',
        alignSelf:'center',
        backgroundColor:'#f1f1f1',
        marginTop:-8
    }

});

export default NotificationScreen;