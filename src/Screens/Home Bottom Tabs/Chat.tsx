import React from 'react';
import { Text,View,StyleSheet, Image, TouchableOpacity } from 'react-native';
import {IMAGES} from '../../../Constants/images';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Chat = ()=>{
    const navigation=useNavigation();
    return(
        <View style ={{flex:1, backgroundColor:'#fffafb'}}>
            <View style={styles.customHeader}>
                <TouchableOpacity onPress={()=>navigation.goBack()}>
                <MaterialCommunityIcons
                name='arrow-left'
                size={24}
                color={'#000'}
                />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Chats</Text>
                <View style={{width:4}}/>
            </View>
            <View style={styles.headerSeperator}/>
        {/* <View style={styles.container}>  */}
            <Image
            source={IMAGES.Chat}
            style={styles.image}
            />
            <View>
            <Text style={styles.text1}>No Chats Yet </Text>
            <Text style={styles.desc}>Start exploring and tap on the profiles{'\n'}
            <Text style={styles.desc1}> to start chatting</Text>                                   
                </Text>
            {/* <Text style={styles.text}>Active</Text> */}
            {/* <Text style={styles.text1}>Message</Text> */}
            </View>
         </View>
    
    )
};

const styles = StyleSheet.create({
    desc:{
     fontSize: 12,
    //   marginBottom: 18,
      fontFamily: 'Poppins-Medium',
      // color: '#555353',
    //   lineHeight: 22,
      left: 6,
      top: 300, 
      textAlign:'center'
    },
    desc1:{
     fontSize: 12,
    //   marginBottom: 18,
      fontFamily: 'Poppins-Medium',
      // color: '#555353',
      lineHeight: 22,
      left: 30,
      top: 300, 
      textAlign:'center'
    },
    container:{
    top:20
    // justifyContent:'center',
    },
    text1:{
    fontFamily:'Poppins-SemiBold',
    fontSize:16,
    top:300,
    textAlign:'center'
    
    },
    image:{
        // width:100,
        // height:0,
        position:'absolute',
        top:300,
        alignItems:'center',
        // left:140
        alignSelf:'center'
    },
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
headerSeperator:{
    height:1,
    width:'100%',
    alignSelf:'center',
    backgroundColor:'#f1f1f1',
    marginTop:-8
}
})

export default Chat;
