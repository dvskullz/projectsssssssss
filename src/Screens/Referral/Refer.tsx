import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image,Share } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { IMAGES } from '../../../Constants/images';
import { normalize } from '../../../Constants/Normalize';
import { RootState } from '../../Store/store';
import { useSelector } from 'react-redux';
// import Clipboard from '@react-native-community/clipboard';

const Refer = () => {
  const navigation = useNavigation<any>();
  const user = useSelector((state: RootState) => state.auth.user);
  
  const copyToClipboard = (text: string) => {
    // Clipboard.setString(text);
  };
  const onShare = async()=>{
    try{
        const result = await Share.share({
            message:
            'Check out this amazing app! Download it now: https://luvoapp.com',
            title: 'Amazing App',
        });
         if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (err) {
      console.log('failed');
    }
        
    }
  

  return (
    <View style={{ flex: 1, backgroundColor: '#fffafb' }}>
      <View style={style.customHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={'#000'} />
        </TouchableOpacity>
        <Text style={style.headerTitle}>Refer A Friend</Text>
        <View style={{ width: 4 }} />
      </View>
      <View style={{ alignItems: 'center', paddingHorizontal: 20 }}>

      <Image source={IMAGES.Refer} resizeMode="contain" style={style.image} />
      <Text style={style.imageText}>Refer & Earn </Text>
      <Text style={style.desc}>
        Share the code with a friend {'\n'}
        and eligible for {''}
        <Text style={{ fontFamily: 'Poppins-Bold', color: '#000' }}>
          ₹199 coupon{'\n'}
        </Text>
        with referal program.
      </Text>

      <View style={style.row}>
        <View style={style.boxView}>
          <Text style={style.Code}>{user?.referralCode}</Text>
        </View>
        <TouchableOpacity onPress={()=>copyToClipboard(user?.referralCode)}
            style={[style.boxView,style.boxView2]}>
        <Text  style={[style.Code,{color:'#dc143c',paddingLeft:0}]}>Copy</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onShare} style={style.shareBg}>
            <Image
            source={IMAGES.share}
            style={{ height: 25, width: 26, resizeMode: 'contain' }}
            />
        </TouchableOpacity>
        </View>
      </View>
        <Text style={style.header}>Earned Money</Text>
    </View>
  );
};

const style = StyleSheet.create({
  headerTitle: {
    textAlign: 'center',
    fontFamily: 'Poppins-Medium',
    fontSize: 17,
    padding: 18,
  },
  customHeader: {
    height: 65,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    backgroundColor: '#fffafb',
  },
  image: {
    width: 150,
    height: 160,
    alignSelf: 'center',
  },
  imageText: {
    fontSize: normalize(20),
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
    marginTop: 4,
  },
  desc: {
    marginTop: 10,
    // width: '80%',
    lineHeight: 26,
    color: '#838383',
    textAlign: 'center',
    fontSize: normalize(14),
    fontFamily: 'Poppins-Medium',
  },
  row: {
    width: '100%',
    marginVertical: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  boxView: {
    width: '55%',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 10,
    borderColor: '#EDEDED',
    justifyContent: 'center',
  },
  boxView2: {
    width: '25%',
    alignItems: 'center',
    borderColor: 'rgba(220, 20, 60, 1)'
  },
  Code:{
    paddingLeft:10,
    lineHeight:30,
    color:'#202226',
    fontSize:normalize(14),
    fontFamily:'Poppins-Medium'
  },
  shareBg:{
       width: 48,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2F4F4F',
  },
  header:{
    fontSize:normalize(16),
    fontFamily:'Poppins-SemiBold',
    paddingLeft:22,
    color:'#000'
  }

});

export default Refer;
