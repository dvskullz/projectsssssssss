import React, { useEffect, useState } from 'react';
import { Text,View,StyleSheet, TouchableOpacity, ActivityIndicator, FlatList, Image,Dimensions } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../Store/store';
import { getGifts } from '../../API/auth';
import {IMAGES} from '../../../Constants/images';

const GiftTab=()=>{

    const accessToken = useSelector((state:RootState)=>state.auth.accessToken);
    const BASE_URL = 'https://luvo.blr1.cdn.digitaloceanspaces.com/luvo/';
    
    const [loading,isLoading] = useState(true);
    const [gifts,setGifts] = useState<any[]>([]);
    
    const resolveImageUri = (path?: string) => {
        if (!path) return null;
        if (path.startsWith('http')) return path;
        return BASE_URL + path;
    };

    const screenWidth = Dimensions.get('window').width;
    const spacing = 2;
    const imageSize = (screenWidth-spacing * 4) / 3;

    // console.log(accessToken)
    const fetchGifts = async()=>{
        if(!accessToken) return;
        try{
            isLoading(true);
            const data = await getGifts(accessToken);
            // console.log('gifts', data.data.docs);
            setGifts(data?.data?.docs || []);
        }catch(error){
            console.log('Error',error);
        }finally{
            isLoading(false);
        }
    };
    useEffect(()=>{
        if(accessToken){
          fetchGifts();
        }
    },[accessToken]);
    if(loading){
        return(
            <View style={style.loaderContainer}>
                <ActivityIndicator size={'large'} color={'#dc143c'} />
            </View>
        );
    }
    if(gifts.length === 0){
        return (
            <View style={{flex:1}}>
            <Text style={style.text}> No gifts are available. {'\n'}
            <Text style={style.desc}>we couldn't find anything.</Text>
            </Text>
            </View>
        )
    }return(
         <View style={{flex:1 , backgroundColor:'#fffafb'}}>
            <FlatList
            contentContainerStyle={{paddingBottom:120}}
            data={gifts}
            numColumns={3}
            keyExtractor={(item) => item._id}
            renderItem={({item})=>{
                const imageUrl = resolveImageUri(item.image);
                const screenWidth = Dimensions.get('window').width;
                const spacing = 2;
                const imageSize = (screenWidth-spacing * 4 ) / 3;
                return(

                <View 
                style={{
                    width:imageSize,
                    height:imageSize * 1.2,
                    margin:spacing,
                    overflow:'hidden'
                }}>
                    
                    <Image
                     source={imageUrl ? { uri: imageUrl } : IMAGES.Euser}
                    // source={{uri: imageUrl}}
                    resizeMode='cover'
                    style={{
                        width:'100%',
                        height:'100%'
                    }}
                    />
                    </View>
                )
            }}
            />
            <View style={style.submitWrapper}>
            <TouchableOpacity
            style={style.button}>
                <Text style={style.buttonText}>Send Gifts</Text>
            </TouchableOpacity>
            </View>
         </View>
    );
};

const style= StyleSheet.create({
    text:{
        textAlign:'center',
        fontFamily:'Poppins-Medium',
        fontSize:16,
        top:200
    },

    desc:{
        textAlign:'center',
        fontSize:12,
        top:200
    },
    button:{
    backgroundColor:'#dc143c',
    paddingVertical:12,
    borderRadius:6,
    alignItems:'center',
    width:'65%',
    alignSelf:'center',
    },
    loaderContainer:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#fffafb'
    },
    buttonText:{
        color:'#fff',
        fontSize:16,
        fontFamily:'Poppins-SemiBold'
    },
    submitWrapper:{
        position:'absolute',
        marginTop:350,
        left:16,
        right:16,
        zIndex:10,
        flex:1
    }
})
export default GiftTab;