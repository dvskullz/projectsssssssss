import React, { useContext, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { IMAGES } from '../../../Constants/images';
import { ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../Store/store';
import Bell from '../../assets/images/nobell.svg';
import LinearGradient from 'react-native-linear-gradient';
import Demo from '../../assets/images/demo.svg';
import { SnackbarContext } from '../../Components/Snackbar';
import { homeApi } from '../../API/auth';
import { logout } from '../../Store/authSlice';
import { UseDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { AppDispatch } from '../../Store/store';
import NotificationScreen from '../NotificationScreen/Notification';
import { DrawerActions } from '@react-navigation/native';
import { IMAGE_URL } from '../../../Constants/images';
// import Close from '../../assets/images/close.svg';
// import DropDown from '../src/assets/images/dropDown.svg';
// import DropUp from '../src/assets/images/dropUp.svg';


type Tone = {
  _id: string;
  name: string;
};

type ApiProfile = {
  _id: number;
  name: string;
  age: number;
  profileImage?: string;
  preferredToneDetails: Tone[];
  tierLabel: string;
  tierBgColor: string;
  tierTextColor: string;
  isFavourite: boolean;
  llmModel:number;
  introMessage?:string;
};

const Home = () => {
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

  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const user = useSelector((state: RootState) => state.auth.user);
  
// console.log(user);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) {
      return 'Good Morning!';
    } else if (hour < 17) {
      return 'Good Afternoon!';
    } else {
      return 'Good Evening';
    }
  };

  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<any>();
  const { showSuccess, showError } = useContext(SnackbarContext);
  const [liked, setLiked] = React.useState<number[]>([]);
  const [profiles, setProfiles] = React.useState<ApiProfile[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [greeting, setGreeting] = React.useState(getGreeting());
  const [expanded, setExpanded] = React.useState<number[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setGreeting(getGreeting());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (accessToken) {
      fetchHome();
    }
  }, [accessToken]);

  const fetchHome = async () => {
    if (!accessToken) return;

    try {
      setLoading(true);
      // console.log('Home AccessToken', accessToken)
      const res = await homeApi(accessToken);
      // console.log('FUll Response', res);
      // console.log('DOCS:', res.data.docs);
      // console.log('[Home] Image URL normalization enabled');
      setProfiles(res?.data?.docs ?? []);
      res.data.docs?.forEach((doc: ApiProfile, index: number) => {
        const resolved = resolveImageUri(doc?.profileImage);
  //     //   console.log(
  //     //     `[Home][${index}] raw="${doc?.profileImage ?? ''}" -> ${
  //     //       resolved ?? 'fallback: IMAGES.Mia'
  //     //     }`,
  //     //   );
      });
      setProfiles(res.data.docs);
    } catch (error: any) {
      showError(error);
      if (error.statusCode === 401) {
        showError('Session Expired. Please Login Again');
        dispatch(logout());
      }
    } finally {
      setLoading(false);
    }
  };


  const toggleExpand = (id:number)=>{
    setExpanded(prev => prev.includes(id)
  ? prev.filter(item=> item !== id)
  : [...prev,id]
);
  };


  const toggleLike = (id: number, Name: string) => {
    const isLiked = liked.includes(id);

    setLiked(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id],
    );
    if (isLiked) {
      showSuccess(`${Name} remove from favourites`);
    } else {
      showSuccess(`${Name} added to favourites`);
    }
  };
  const ProfileimageUri = resolveImageUri(user?.profileImage);

  // console.log(profiles);
// console.log(profiles)

  const handleProfilePress = (profile: ApiProfile) => {
    navigation.navigate('ProfileDetails', {
      UserId: profile._id,
      profileData: profile,
      aiModelId: profile.llmModel
    });
  };

  const renderItem = ({ item }: { item: ApiProfile }) => {
    const tones = item.preferredToneDetails || [];
    const isExpanded = expanded.includes(item._id);
    const visibleTones = isExpanded ? tones: tones.slice(0,3);

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => handleProfilePress(item)}
      >
        <View style={styles.card}>
          <Image
            source={getProfileImageSource(item.profileImage)}
            style={styles.cardImage}
            resizeMode="cover"
          />
          <LinearGradient
            colors={['#00000000', '#000000']}
            style={styles.gradient}
          />

          {item.tierLabel && item.tierLabel !== 'Free' && (
            <View
              style={[
                styles.badge,

                { backgroundColor: item.tierBgColor || '#ff4d4d' },
              ]}
            >
              <Text
                style={[
                  styles.badgeText,

                  { color: item.tierTextColor || '#fff' },
                ]}
              >
                {item.tierLabel}
              </Text>
            </View>
          )}
          <TouchableOpacity
            style={styles.like}
            onPress={() => toggleLike(item._id, item.name)}
            activeOpacity={0.9}
          >
            <Demo
              width={50}
              height={50}
              color={liked.includes(item._id) ? '#dc143c' : '#BCBCBC'}
            />
          </TouchableOpacity>
          <View style={styles.overlay}>
            <Text style={styles.name}>
              {item.name}, {item.age}
            </Text>
            <Text style={styles.intro}>
              {item.introMessage}
            </Text>
            <View style={styles.tagContainer}>
              <View style={styles.topRow}>
            <View style={styles.tagRow}>
              {visibleTones?.map(tone => (
                <View key={tone._id} style={styles.tag}>
                  <Text style={styles.tagText}>{tone.name}</Text>
                </View>
              ))}
              </View>
              {tones.length > 3 && (
                <TouchableOpacity
                style={styles.dropdown}
                onPress={()=> toggleExpand(item._id)}>
                {/* <View > */}
                  <Text style={[styles.tagText, {color:'#dc143c'}]}>
                    {isExpanded ? "▲" : "▼"}
                  </Text>
                {/* </View> */}
                </TouchableOpacity>
              )}
                </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fffafb'}}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          >
            <Image
              source={
                ProfileimageUri
                  ? {
                      uri: ProfileimageUri,
                    }
                  : IMAGES.Euser
              }
              style={styles.avatar}
            />
          </TouchableOpacity>
          <Text style={styles.greeting}>
            {getGreeting()}
            {'\n'}
            {'\n'}
          </Text>
          <Text style={styles.Username}>{user?.name}</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Notification')}>
            <Bell width={30} height={30} style={styles.bell} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.headerSeparator} />

      <View style={{ flex: 1 }}>
        {/* <ScrollView showsVerticalScrollIndicator={false}>
          {profiles.map(profile => (
            <TouchableOpacity
              key={profile._id}
              activeOpacity={0.9}
              onPress={() => handleProfilePress(profile)}
            >
              <View key={profile._id} style={styles.card}>
                <Image
                  source={getProfileImageSource(profile.profileImage)}
                  style={styles.cardImage}
                  resizeMode="cover"
                />
                <LinearGradient
                  colors={['#00000000', '#000000cc']}
                  style={styles.gradient}
                />
                {profile.tierLabel && profile.tierLabel !== 'Free' && (
                  <View
                    style={[
                      styles.badge,
                      { backgroundColor: profile.tierBgColor || '#ff4d4d' },
                    ]}
                  >
                    <Text
                      style={[
                        styles.badgeText,
                        { color: profile.tierTextColor || '#fff' },
                      ]}
                    >
                      {profile.tierLabel}
                    </Text>
                  </View>
                )}
                <TouchableOpacity
                  style={styles.like}
                  onPress={() => toggleLike(profile._id, profile.name)}
                  activeOpacity={0.9}
                >
                  <Demo
                    width={50}
                    height={50}
                    // fill={liked.includes(item.id) ? '#dc143c' : '#100b0b'}
                    color={liked.includes(profile._id) ? '#dc143c' : '#BCBCBC'}
                    // style={{tintColor:liked ? 'white': '#BCBCBC'}}
                  />
                </TouchableOpacity>
                <View style={styles.overlay}>
                  <Text style={styles.name}>
                    {profile.name}, {profile.age}
                  </Text>
                  <View style={styles.tagRow}>
                    {profile.preferredToneDetails?.map((tone: any) => (
                      <View key={tone._id} style={styles.tag}>
                        <Text style={styles.tagText}>{tone.name}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>aaaaaaaaaaaaaaaaaaa
            </TouchableOpacity>
          ))}
        </ScrollView> */}
        {loading && (
        <View style={styles.loaderOverlay}>
          <ActivityIndicator size={'large'} color="#dc143c" />
        </View>
      )}
        <FlatList
        data={profiles}
        keyExtractor={(item)=> item._id.toString()}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{flexGrow:1}}
        overScrollMode='never'
        ListEmptyComponent={
          !loading ?(
            <View style={styles.emptyContainer}>
              <Image
              source={IMAGES.emptyHome}
              style={styles.image}
              />
              <Text style={styles.Emptytext}>Profile Not Found</Text>
              <Text style={styles.desc}>We couldn't find any AI profiles at the{'\n'}moment. This might be due to a loading{'\n'}issue.Try refreshing the page.
              </Text>
              </View>
          ):null
        }         
        />
      </View>
      
    </View>
  );
};

const styles = StyleSheet.create({
  // text: {
  //   fontFamily: 'Poppins-Bold',
  //   fontSize: 32,
  //   textAlign: 'center',
  //   top: 400,
  // },
  intro:{
    fontSize:12,
    color:'#C8C8C8',
    fontFamily:'Poppins-Medium',
    top:-5,
    maxWidth:'92%',
    marginBottom:5,
    marginHorizontal:6,
    // marginVertical:10,
    // textAlign:'left'
    // lineHeight:8

  },
  background: {
    flex: 1,
  },
  image:{
    position:'absolute',
    top:200,
    alignSelf:'center'
  },
  desc:{
    fontSize:12,
    fontFamily:'Poppins-Medium',
    lineHeight:22,
    left:6,
    top:15,
    textAlign:'center',
    color:'#838383'
  },
  emptyContainer:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    paddingHorizontal:30
  },
  Emptytext:{
    fontFamily:'Poppins-SemiBold',
    fontSize:16,
    textAlign:'center',
    top:20

  },
  container: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    top: -15,
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    // borderBottomWidth:
    justifyContent: 'space-between',

    // borderRadius:1,
    // height:1,
    // backgroundColor:'#f0f0f0'
    left: -2,
  },
  avatar: {
    width: 55,
    height: 55,
    borderRadius: 52,
    // marginRight:12,
    top: 24,
    left: -8,
  },
  greeting: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    top: 28,
    color: '#838383',
    left: 9,
  },
  like: {
    position: 'absolute',
    top: 6,
    right: 15,
    padding: 8,
    borderRadius: 20,
  },
  Username: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    top: 55,
    left: 65,
    position: 'absolute',
  },
  bell: {
    
    position: 'absolute',
    left: 120,    
      alignSelf: 'flex-end',
    top: 10,

  },
  name: {
    fontSize: 27,
    color: '#fff',
        fontFamily: 'Poppins-Bold',
    left: 5,
    // marginTop: 12,
  },
  card: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 15,
  },
  cardImage: {
    alignSelf: 'center',
    width: '95%',
    height: 470,
    borderRadius: 20,
  },
  overlay: {
    position: 'absolute',
    bottom: 5,
    left: 18,
    right:18,
    // paddingBottom:5
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    alignSelf: 'center',
    height: 220,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    width: '95%',
  },
  tag: {
    backgroundColor: '#483f3f99',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    // marginRight:1,
    // right: -2,
    // position:'absolute'
  },
  //  moreTag:{
  //   backgroundColor:'#483f3f99',
  //   paddingHorizontal:15,
  //   paddingVertical:4,
  //   borderRadius:20,
  //   marginRight:5,
  //       columnGap:6,

  //   // marginTop:5,
  //   right:-4
  // },

  tagRow: {
    flexDirection: 'row',
    // marginTop: 8,
    marginBottom:8,
    flexWrap:'wrap',
      rowGap:10,
    columnGap:10,
    maxWidth:'85%'
  },
  tagText: {
    color: '#fff',
    fontSize: 13,
    fontFamily: 'Poppins-Bold',
  },
  badge: {
    position: 'absolute',
    top: 15,
    left: 22,
    backgroundColor: '#ff4d4d',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  badgeText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
  },
  loaderOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    backgroundColor: '#ffffff91',
  },
  headerSeparator: {
    height: 1,
    width: '92%',
    alignSelf: 'center',
    backgroundColor: '#f1f1f1',
    marginTop: -18,
    marginBottom: 12,
  },
  tagContainer:{
    marginTop:3
  },
  topRow:{
    flexDirection:'row',
    alignItems:'flex-start',
    justifyContent:'space-between'
  },
  dropdown:{
    backgroundColor:'#483f3f99',
    paddingHorizontal:10,
    paddingVertical:6,
    borderRadius:20,
    marginLeft:6
  }
});
export default Home;
