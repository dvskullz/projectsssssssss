import React from "react";
import {View,Text,StyleSheet} from 'react-native';
import normalize from '../../../Constants/Normalize';

const ProgressIndicator= ({progress})=>{
    const progressPercent = Math.round(progress?.likeabilityScore || 0 * 1);

    return (
        <View style={style.container}>
            <View style={style.labelContainer}>
                <Text style={style.labelInactive}>10%</Text>
                <Text style={style.labelActive}>{progressPercent}%</Text>
                <Text style={style.labelInactive}>100%</Text>
            </View>

            <View style={style.progressBarContainer}>
            <View 
            style = {[
                style.progressBar,
                {width: `${progressPercent}%`},
                progressPercent < 31 && { backgroundColor:'#dc143c'},  
            ]}/>
            </View>

            {progess?.likeabilityScore && <Text style={style.message}>{progess?.likeabilityMesage || ''}</Text>}
        </View>
    );
};

const style = StyleSheet.create({
    container:{
        backgroundColor:'#ffe7ec',
        borderRadius:15,
        padding:15,
        width:'90%',
        alignSelf:'center',
    },
    labelContainer:{
        flexDirection:'row',
        justifyContent:'space-between',
        width:'100%',
        marginBottom:5,
    },
    labelInactive:{
        color:'#000D33',
        fontSize:normalize(11),
        fontFamily:'Poppins-SemiBold',
    },
    labelActive:{
        color:'#000D33',
        fontSize:normalize(11),
        fontFamily:'Poppins-SemiBold'
    },
    progressBarContainer:{
        width:'100%',
        height:8,
        backgroundColor:'#e5e5e5',
        borderRadius:5,
        overflow:'hidden',
    },
    progressBar:{
        height:'100%',
        backgroundColor:'#4caf50',
        borderRadius:5
    },
    message:{
        marginTop:10,
        fontSize:normalize(10),
        color:'#022150',
        fontFamily:'Poppins-Medium'
    }
});
export default ProgressIndicator;