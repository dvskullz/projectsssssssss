import { useRoute, useNavigation } from '@react-navigation/native';
import React, { useEffect, useState,useContext } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SnackbarContext } from '../../Components/Snackbar';

import { IMAGES } from '../../../Constants/images';
import ProfileTabs from '../../Navigation/ProfileTabs';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../Store/store';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getProfileById } from '../../API/auth';
import { logout } from '../../Store/authSlice';
import UnLike from '../../assets/images/favunlike.svg';
import Like from '../../assets/images/PostLike.svg';
// import Heart from '../src/assets/images/tst.svg';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

type Tone = {
  _id: string;
  name: string;
};

type Profile = {
  _id: string;
  name: string;
  age: number;
  profileImage?: string;
  preferredToneDetails: Tone[];
  tierLabel: string;
  isFavourtie: boolean;
  aiModelId:number;
};
const BASE_URL = 'https://luvo.blr1.cdn.digitaloceanspaces.com/luvo/';

const ProfileDetails = () => {

  const route = useRoute<any>();
  const { UserId, profileData,aiModelId} = route.params || {};
  const intro = profileData?.introMessage?.trim();
  const [activeTab, setActiveTab] = useState<'grid' | 'video' | 'gifts'>(
    'grid',
  );
  const {showSuccess,showError} = useContext(SnackbarContext);
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  const [profile, setProfile] = useState<any>(null);
  const [loading, isLoading] = useState(true);
  const [isFavourite,setIsFavourite] = useState(profileData?.isFavourite || false);
  const [likeLoading, setLikeLoading] = useState(false);
  useEffect(() => {
    fetchProfile();
  }, []);
  // console.log('access:', accessToken);
  // console.log(aiModelId)
  // console.log('ID:', UserId);
  const fetchProfile = async () => {
    if (!accessToken) return;
    try {
      isLoading(true);
      const data = await getProfileById(UserId, accessToken);
      // console.log('full res:', data.data);
      // console.log('Images', data.data.imagePosts);
      // console.log('Rating', data.data.averageRating)
      setProfile(data?.data);
    } catch (error: any) {
      const message = error?.message ?? '';
      const statusCode = error?.statusCode;
      const isProfileFetchError =
        statusCode === 401 ||
        statusCode === 403 ||
        message === 'Failed to fetch the profile';

      if (isProfileFetchError) {
      showError('Session Expired.Please Log in again.')
        dispatch(logout());
        return;
      }
      console.log('Profile Fetch Error', error);
    } finally {
      isLoading(false);
    }
  };
  // console.log('1',profileData);
  // profile data is the data I passed from the home screen and home api 
  // whereas the profile is data im fetching from the api (ai profile)
  //it contains imagePosts, videoPosts etc.
  // console.log('2',profile)
  // if(!profile) return null;

  // if(loading){
  //   return (
  //     <View>
  //       <ActivityIndicator size={'large'} color={'#dc143c'} />
  //       </View>
  //   );
  // }
  // console.log(profile);

  const resolveImageUri = (path?: string) => {
    if (!path) {
      return null;
    }

    if (path.startsWith('http')) return path;
    return BASE_URL + path;
  };

  // console.log('tier', profileData.tierLabel);
  const imageUri = resolveImageUri(profileData?.profileImage);
  const rating = profile?.averageRating;
  // console.log('rating', profileData.averageRating);
  // console.log('data', profileData);
  // console.log('pro', profile);
  // console.log('images', profileData.gallery)

  const toggleLike = async () =>{
    if(likeLoading) return ;
    try{
      setLikeLoading(true);

      await new Promise <void>(resolve => setTimeout(resolve,1200));

      const newValue = !isFavourite;
      setIsFavourite(newValue);
      // setIsFavourite((prev)=>{
      //   const newValue = !prev;
      setTimeout(()=>{
        if(newValue){
            showSuccess(`${profileData?.name} added to favourites`);
          }else{
            showSuccess(`${profileData?.name} remove from Favourites`);
      }
    },0);  
    return newValue;
}catch (error){
  console.log("Something went wrong");
}
finally{
  setLikeLoading(false);
}
  };
const handleMessage =()=>{
  navigation.navigate("ChatScreen",{
    receiverId: profileData._id,
    aiName: profileData.name,
    aiImage: profileData.profileImage,
    aiModelId: aiModelId,
    userID:profileData._id
  });
};
  
// console.log(profileData._id);
// console.log(prof)
  return (
    // // <View style={{flex:1 , backgroundColor:'#FFF1f4'}}>
    // {/* // const resolveImageUri = (path)=>{ */}
    // {/* // if(path){ */}
    // {/* // return null; */}
    // {/* // } */}
    // {/* //if(path.startwith('https')) return path; */}
    // {/* // }> */}
    // <SafeAreaView style={{ flex:1,backgroundColor: '#fffffxf'}} edges={['top', 'bottom']}>
      
      <GestureHandlerRootView style={{flex:1,}} >
       <View style={styles.customHeader}>
       <TouchableOpacity onPress={()=>navigation.goBack()}>
        <MaterialCommunityIcons
        name='arrow-left'
        size={24}
        color='#000'
        />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Profile Details</Text>
      <View style={{width:4}} />
    </View>
    <View style={styles.headerSeperator}/>

    <View style={styles.container}> 
      <View style={styles.headerSection}>
        <Image
          source={imageUri ? { uri: imageUri } : IMAGES.pfp}
          style={styles.avatar}
        />
        <View style={styles.nameSection}>
          <Text style={styles.name}>
            {profileData?.name}, {profileData?.age}
          </Text>
          
        <TouchableOpacity 
        style={styles.like}
        onPress={()=>toggleLike()}
        activeOpacity={0.9}
        disabled={likeLoading}
>
  {isFavourite ?(
    <Like width={18} height={18} fill="#dc143c"/>
  ):(
  <UnLike width={18} height={18} fill="#999"/>
  )}
        </TouchableOpacity>
          <View style={styles.ratingRow}>
            <View style={styles.ratingBox}>
              <Text style={styles.star}>
                <Image
                source={IMAGES.rating}
                style={styles.mess}
                resizeMode='cover'
                />
              </Text>
              <Text style={styles.ratingText}>
                {Number(rating || 0).toFixed(1)}
              </Text>
            </View>
            <View style={styles.messageBox}>
                <Image
                source={IMAGES.Message}
                style={styles.message}
                resizeMode='cover'
                />
                <TouchableOpacity onPress={handleMessage}>
                <Text style={styles.messageText}> Message</Text> 
                </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.intro}
          // numberOfLines={2}
          >{intro}</Text>
        </View>
      </View>
      <View style={{flex:1,  backgroundColor:'#fff1f4'}}>
        <ProfileTabs profile={profile} loading={loading}/>
      </View>
      {likeLoading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size={'large'} color="#dc143c" />
          </View>
      )}
     </View>
     </GestureHandlerRootView>
  );
};

export default ProfileDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fffafb',
  },
  headerSection: {
    flexDirection: 'row',
    padding: 15,
    // <bottom:-5></bottom:-5>
  },
  headerSeperator:{
    height:1,
    width:'95%',
    alignSelf:'center',
    backgroundColor:'#f1f1f1',
    marginTop:-8,
    // marginBottom:2
  },
  loaderContainer:{
    position:'absolute',
    top:0,
    left:0,
    right:0,
    bottom:0,
    justifyContent:'center',
    alignSelf:'center',
    zIndex:100,
    backgroundColor:'#1f1f1f40'
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 50,
  },
  nameSection: {
    flex: 1,
    marginLeft: 15,
    // marginBottom:-5,
  },
  name: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
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
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  ratingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5A623',
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderRadius: 25,
    marginTop:-10
  },
  star: {
    marginRight: 4,
    color:'#784949'
  },
     like:{
    position:'absolute',
    top:7,
    right:12,
    // textAlign:'center'
    alignItems:'center'
    // padding:8,
    // borderRadius:20
  },
  ratingText: {
    color: '#fff',
    top:2.5,
    // fontWeight: '600',
    fontFamily:'Poppins-Regular',
  },
  messageBox: {
    marginLeft: 12,
    flexDirection:'row',
    // backgroundColor: '#EAEAEA',
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderRadius: 25,
    alignItems:'center',
    borderColor:'#EAEAEA',
    borderWidth:1,
    marginTop:-10
  },
  mess:{
    // top:3,
    width:15,
    height:15

  },
  message:{
   width:15,
    height:15 ,
    top:-1
  },
  messageText: {
    fontSize: 13,
    // fontWeight: '500',
    fontFamily:'Poppins-Regular',
    // textAlign:'center',
    color:'#a6a6a6'
    
  },
  intro: {
    marginTop: 8,  
    fontSize: 14,
    color: '#777',
    fontFamily:'Poppins-Regular',
    // textAlignVertical:'center',
    // textAlign:'right'
    left:6,
    marginBottom:-18,
    // flex:1
  },
});
