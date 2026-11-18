import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList,
} from 'react-native';
import { IMAGES } from '../../../Constants/images';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from '../../Store/store';
// import { getuserDatauserData } from '../../API/auth';
import { normalize } from '../../../Constants/Normalize';
import moment from 'moment';
import { IMAGE_URL } from '../../../Constants/images';
import { Config } from '../../config';
import { getToneList } from '../../API/auth';

const MyProfile = () => {
  
  const navigation = useNavigation<any>();
  const [toneList, setToneList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);

  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const user = useSelector((state: RootState) => state.auth.user);

  const resolveImageUri = (path?: string) => {
    if (!path) {
      return null;
    }

    if (path.startsWith('http')) return path;
    
    return IMAGE_URL + path;
  };
  
  const getProfileImageSource = (path?: string) => {
    const imageUri = resolveImageUri(path);
    return imageUri ? { uri: imageUri } : IMAGES.Euser;
  };
  
  
    // let userData= user;
    // console.log('userData',user);
    
  
  const fetchuserData = async () => {
    if (!accessToken) return null;

    try {
      setLoading(true);
      const res = await getToneList(accessToken);
      setToneList(res?.data?.docs);
    } catch (err) {
      console.log('CANT GET THE userData userData', err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (accessToken ) {
      fetchuserData();
    }
  }, [accessToken]);

  const profileImageUri = resolveImageUri(user?.profileImage);
  const profileImageSource = getProfileImageSource(user?.profileImage);

  return (
    // <ImageBackground
    // source={IMAGES.MyProfile}
    // style={style.background}
    // resizeMode='cover'
    // >
    <View style={{ flex: 1, backgroundColor: '#fffafb' }}>
      <View style={style.customHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={style.headerTitle}>My Profile</Text>
        <View style={{ width: 4 }} />
      </View>
     
      
     
      <ScrollView 
      style={style.container}
      overScrollMode='never'
      scrollEventThrottle={16}
      showsVerticalScrollIndicator={false}
      nestedScrollEnabled={true}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => {
            if (profileImageUri) {
              setShowImageModal(true);
            }
          }}
        >
        <Image source={profileImageSource} resizeMode="contain" style={style.pfp} />
        </TouchableOpacity>

        <View style={style.nameRow}>
          <Text style={style.name}>{user?.name}</Text>
        </View>

        <Text style={style.bioText}>
          {user?.bio?.length > 150 ? user?.bio.slice(0, 150) : user?.bio}
        </Text>

        <Text style={style.titleText}>Email</Text>
        <View style={style.inputBox}>
          <Text style={style.semi}>{user?.email}</Text>
        </View>
        <Text style={style.titleText}>Mobile Number</Text>
        <View style={style.inputBox}>
          <Text style={style.semi}>
            {user?.countryCode} {user?.phone}
          </Text>
        </View>

        <View style={style.rowView}>
          <View style={{ width: '40%' }}>
            <Text style={style.titleText}>Gender</Text>
            <View style={[style.inputBox, { flexDirection: 'row' }]}>
              <Text style={style.semi}>{user?.gender}</Text>
            </View>
          </View>

          <View style={{ width: '50%' }}>
            <Text style={style.titleText}>DOB</Text>
            <View style={style.inputBox}>
              <Text style={style.semi}>
                {moment(user?.dob).format('D MMM YYYY') || ''}
              </Text>
            </View>
          </View>
        </View>

        <Text style={style.titleText}>Preference Gender</Text>
        <View style={{width:'40%'}}>
            <View style={[style.inputBox,{flexDirection:'row'}]}>
                <Text style={style.semi}>{user?.preference?.gender}
                </Text>
            </View>
        </View>
        <Text style={style.titleText}>Preferences</Text>
        <FlatList
          data={toneList || []}
          numColumns={2}
          testID='toneList'
          contentContainerStyle={{ paddingTop: 5, paddingBottom:20 }}
          columnWrapperStyle={style.columCss}
          renderItem={({ item }) => (
            <View style={{ flex: 1 }}>
              <View style={[style.inputBox2]}>
                <Image
                  source={
                    item?.image
                      ? { uri: Config.IMAGE_URL + item?.image }
                      : IMAGES.Euser
                  }
                  style={style.iconCss}
                />
                <Text style={[style.semi, { flex: 1 }]}>{item?.name}</Text>
              </View>
            </View>
          )}
        />

      
      </ScrollView>
      <Modal
        visible={showImageModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowImageModal(false)}
      >
             <View style={style.imageModal}>
               <TouchableOpacity
                 style={{ position: 'absolute', top: 60, right: 20 }}
                 onPress={() => setShowImageModal(false)}
               >
                 <MaterialCommunityIcons name="close" size={28} color="#fff" />
               </TouchableOpacity>
               <Image
                 source={profileImageUri ? { uri: profileImageUri } : IMAGES.Euser}
                 style={{ width: '100%', height: '70%' }}
                 resizeMode="contain"
               />
             </View>
           </Modal>
      {/* </View> */}
      <TouchableOpacity style={style.button} onPress={()=>navigation.navigate('EditProfile')}>
        <Text style={style.buttonText}>Edit Profile</Text>
      </TouchableOpacity>
      
    </View>

  );
};

const style = StyleSheet.create({
  background: {
    flexGrow: 1,
  },
   imageModal: {
    flex: 1,
    backgroundColor: '#101010f2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container:{
    flexGrow:1,
    paddingHorizontal:20,
    backgroundColor:'#fffafb'
  },
  customHeader: {
    height: 65,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    backgroundColor: '#fffafb',
  },
  headerTitle: {
    fontSize: 17,
    padding: 18,
    textAlign: 'center',
    fontFamily: 'Poppins-Medium',
  },
  pfp: {
    // alignItems:'center',
    alignSelf: 'center',
    width: 100,
    height: 100,
    borderRadius:100 / 2
  },
  nameRow: {
    justifyContent: 'center',
    width: '100%',
    marginTop: 15,
    alignItems: 'center',
    flexDirection: 'row',
  },
  name: {
    color: '#000',
    lineHeight: 38,
    fontSize: normalize(24),
    fontFamily: 'Poppins-Bold',
    textTransform: 'capitalize',
  },
  inputBox: {
    width: '100%',
    padding: 15,
    marginTop: 7,
    borderRadius: 10,
    backgroundColor: '#fff3f376',
  },
  bioText: {
    marginTop: 5,
    width: '85%',
    color: '#838383',
    fontSize: normalize(12),
    fontFamily: 'Poppins-Regular',
    lineHeight: 18,
    textAlign: 'center',
    alignSelf: 'center',
    textTransform: 'capitalize',
  },
  semi: {
    fontSize: normalize(14),
    color: '#000',
    lineHeight: 21,
    fontFamily: 'Poppins-Medium',
  },
  titleText: {
    marginTop: 20,
    fontSize: normalize(14),
    color: '#202226',
    fontFamily: 'Poppins-SemiBold',
    lineHeight: 20,
  },
  rowView: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button:{
    backgroundColor:'#dc143c',
    paddingVertical: 8,
    borderRadius:8,
    alignItems:'center',
    width:'65%',
    alignSelf:'center'
  },
  buttonText:{
    color:"#fff",
    fontSize:16,
    fontFamily:'Poppins-SemiBold'
  },
  iconCss: {
    height: 19,
    width: 20,
    marginRight: 10,
    resizeMode: 'contain',
  },
  columCss:{ 
    gap: 10, 
    paddingTop: 8,
    paddingHorizontal: 5, 
   },
  inputBox2: {
    flexDirection: 'row',
    width: '100%',
    paddingVertical: 15,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: '#fff3f376',
  },

  modalView: {
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.97)',
  },
  crossView2: {
    width: 30,
    height: 30,
    top: 10,
    right: 10,
    alignSelf: 'flex-end',
  },
  crossImage2: {
    height: 25,
    width: 25,
    zIndex: 999,
    tintColor: '#fff',
  },
  imageCss: {
    width: '95%',
    height: '85%',
    alignSelf: 'center',
  },
});

export default MyProfile;
