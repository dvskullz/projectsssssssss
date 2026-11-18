import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Heart from '../src/assets/images/favicon.png';
import User from '../src/assets/images/user.png';
import {IMAGES} from '../../../Constants/images'
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Fav = () => {
const navigation = useNavigation();
  return (

    <View style={{flex:1,backgroundColor:'#fffafb'}}>
    <View style={styles.customHeader}>
      <TouchableOpacity onPress={()=> navigation.goBack()}>
        <MaterialCommunityIcons
        name='arrow-left'
        size={24}
        color={'#000'}
        />
      </TouchableOpacity>
      <Text style = {styles.headerTitle}>Favourites</Text>
      <View style={{width:4}}/>
    </View>
      <View style={styles.headerSeperator}/>
        <Image 
        source={IMAGES.User} 
        style={styles.image}
        />
        <View>
      <Text style={styles.text}>No Favourites yet </Text>
      <Text style={styles.desc}>Start exploring and tap ❤️ 
      <Text style={styles.desc1}> on the Profiles{'\n'}  that catch your eye. </Text>    
      </Text>                         
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    textAlign: 'center',
    top: 300,
  },
  desc:{
  fontSize: 12,
    //   marginBottom: 18,
      fontFamily: 'Poppins-Medium',
      // color: '#555353',
      lineHeight: 22,
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
      left: 6,
      top: 300,
      textAlign:'center'
},
     container: {
    flex: 1,
    // width: '100%',
    // maxWid th: 390,
    paddingHorizontal: 15,
    // top: 125,
    paddingTop: 125,
    // justifyContent:'center',
    // padding: 'auto',
  },
  image:{
    // width:100,
    // height:100,
    position:'absolute',
    top:300,
    // left:140,
    alignSelf:'center'
},
heart:{
  // left:12
  // 
  marginTop:10,
    width:12,
    height:12 ,
    left:70,
    // right:20
    // top:40
},
headerTitle:{
  fontSize:17,
  padding:18,
  textAlign:'center',
  fontFamily:'Poppins-Medium'
},
customHeader:{
    height:64,
    flexDirection:'row',
    justifyContent:'space-between',
    paddingHorizontal:15,
    backgroundColor:'#fffafb',
    alignItems:'center'
},
headerSeperator:{
  height:1,
  width:'100%',
  alignSelf:'center',
  backgroundColor:'#f1f1f1',
  marginTop:-8
}
});

export default Fav;
