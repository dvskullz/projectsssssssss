import React from "react";
import {Text,View,StyleSheet, TouchableOpacity} from 'react-native';
import { useNavigation } from "@react-navigation/native";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const EditProfile=()=>{
    const navigation = useNavigation<any>();

    return(
  <View style={{flex:1, backgroundColor:'#fffafb'}}>
<View style={style.customHeader}>
    <TouchableOpacity onPress={()=>navigation.goBack()}>
        <MaterialCommunityIcons
        name="arrow-left"
        size={24}
        color={'#000'}
        />
    </TouchableOpacity>
        <Text>Edit Profile</Text>
        <View style={{width:4}}/>
</View>
        </View>
    )
};

const style=StyleSheet.create({
    customHeader:{
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
    },
    
    
})
export default EditProfile;