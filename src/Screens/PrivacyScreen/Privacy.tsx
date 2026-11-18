import React from "react";
import {Text,View,StyleSheet, TouchableOpacity} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Arrow from '../../assets/images/arrow-right.svg';
import { useNavigation } from "@react-navigation/native";
const Privacy =()=>{
    const navigation = useNavigation<any>();

    return(
        <View style={{flex:1, backgroundColor:'#fffafb'}}>
        <View style={style.header}>
            <TouchableOpacity onPress={()=> navigation.goBack()}>
        <MaterialCommunityIcons
        name="arrow-left"
        size={24}
        color={'#000'}
        />
            </TouchableOpacity>
        <Text style={style.headerTitle}>Privacy and Security</Text>
        <View style={{width:4}}/>
        </View>
          
          <View style={style.switchRow}>
            <TouchableOpacity style={style.rowItem} onPress={()=> navigation.navigate('Password')}>
                <Text style={style.Text}>Change Password</Text>
                <Arrow/>
            </TouchableOpacity>
          </View>

          <View style={style.switchRow}>
            <TouchableOpacity style={style.rowItem}>
                <Text style={style.Text}>Data Preferences</Text>
                <Arrow/>
            </TouchableOpacity>
          </View>


        </View>
    )
};

const style = StyleSheet.create({
    switchRow:{
        flexDirection:'row',
        justifyContent:'space-between',
        paddingHorizontal:12,
        marginBottom:8,
        marginTop:20
    },
    rowItem:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        width:'100%'
    },
    Text:{
        fontFamily:'Poppins-Medium',
        fontSize:16
    },
    header:{
        height:65,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        paddingHorizontal:15,
        backgroundColor:'#fffafb'
    },
    headerTitle:{
        fontSize:17,
        padding:18,
        textAlign:'center',
        fontFamily:'Poppins-Medium'
    }
});

export default Privacy;