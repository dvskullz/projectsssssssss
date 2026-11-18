import React, { useState, useRef, useEffect } from 'react';

import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Share
} from 'react-native';

import { useRoute, useNavigation} from '@react-navigation/native';
import UnLike from '../../assets/images/postunlike.svg';
import Like from '../../assets/images/PostLike.svg';
import Comment from '../../assets/images/comments.svg';
const { height,width } = Dimensions.get('window');
const BASE_URL = 'https://luvo.blr1.cdn.digitaloceanspaces.com/luvo/';
import ShareIcon from '../../assets/images/share.svg';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IMAGES } from '../../../Constants/images';


export default function PostDetails() {
  const route = useRoute<any>();
  const { posts, index, profile } = route.params;
  const navigation = useNavigation();
  const flatListRef = useRef<FlatList>(null);
  
  const renderItem = ({ item }: any) => {
    return <PostCard item={item} profile={profile} />;
  };

  return (
    <SafeAreaView style={{flex:1}}>
      <View style={styles.customHeader}> 
    <TouchableOpacity onPress={()=> navigation.goBack()}>
    <MaterialCommunityIcons
    name='arrow-left'
    size={24}
    color="#000"
    />  
    </TouchableOpacity>
    <Text style={styles.headerTitle}>Posts</Text>
    <View style ={{width:24}}/>
    </View>
 
 <View style={styles.headerSeperator} />
    <FlatList
      // ref={flatListRef}
      data={posts}
      renderItem={renderItem}
      keyExtractor={item => item._id}
      showsVerticalScrollIndicator={false}
      initialScrollIndex={index}
      // pagingEnabled={true}
      // initialScrollIndex={index}
      // onScrollToIndexFailed={index}
      initialNumToRender={4}
      windowSize={5}
      removeClippedSubviews={false}
      getItemLayout={(data, index) => ({
        length: itemHeight,
        offset: itemHeight * index,
        index
      })}
    />
    </SafeAreaView>
  );
}

const PostCard = ({ item, profile }: any) => {
  const [liked, setLiked] = useState(item.isLiked);
  const navigation = useNavigation();
  const [likes, setLikes] = useState(item.likesCount);
  const resolveImageUri = (path?: string) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return BASE_URL + path;
  };

  const mediaItem = item?.media?.[0];
  const imageUri = mediaItem?.url || mediaItem?.thumbnail;
  const profileImage = resolveImageUri(profile?.profileImage);
  
  const handleLike = () => {
    if (liked) {
      setLikes((prev: number) => prev - 1);
    } else {
      setLikes((prev: number) => prev + 1);
    }
    setLiked(!liked);
  };
  // console.log('post',item);
  // console.log('psot',profile);

  // so profile is the whole data fetching from the api 
  // item is like the specific posts from the profile data.

  const share = async()=>{
    try{
      const mediaItem = item?.media?.[0];
      const url = mediaItem?.url || mediaItem?.thumbnail;
      const fullUrl = url?.startsWith('http')
      ? url
      :BASE_URL + url;
      await Share.share({
        
        message:`Check out this Image: ${fullUrl}`,
      });
    }catch(error){
      // alert(error.message);
    }

  }
  return (
  

    <View style={styles.container}>
      <View style={styles.profileRow}>
        <View style={styles.userInfo}>
        {profileImage?(
          <Image 
          source={{uri:profileImage}}
          style={styles.avatar}
          />
        ):(
          <Image
          source={IMAGES.Euser}
          style={styles.avatar}
          />
        )}
        {/* <Image source={{ uri: profileImage }} style={styles.avatar} /> */}
        <Text style={styles.username}>{profile?.name}</Text>
        </View>
        <TouchableOpacity onPress={share} >
          <ShareIcon
          width={23}
          height={23}
          style={styles.share}
          />
        </TouchableOpacity>
        </View>

      <Image
        source={{ uri: imageUri }}
        style={styles.image}
        resizeMode="cover"
      />

      <View style={styles.actionRow}>
        <TouchableOpacity onPress={handleLike}>
          {liked ? (
            <Like width={24} height={24} fill="#dc143c" />
          ) : (
            <UnLike width={24} height={24} />
          )}
        </TouchableOpacity>
        <Text style={styles.countText}>{likes}</Text>
        <TouchableOpacity style={{ marginLeft: 20 }}>
          <Comment width={24} height={24} fill="#000" />
        </TouchableOpacity>
        <Text style={styles.countText}>{item.commentsCount}</Text>
      </View>

      <Text style={styles.captionContainer}>
        <Text style={styles.username}>{profile?.name} </Text>
        <Text style={styles.caption}>{item?.caption}</Text>
      </Text>
    </View>
  );
};
const itemHeight = height * 0.6 + 160;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // height:height,
    backgroundColor: '#fffafb',
    // justifyContent:'space-around'
    // justifyContent:'flex-end'
  },
  headerSeperator:{
    height:1,
    width:'100%',
    alignSelf:'center',
    backgroundColor:'#f1f1f1',
    marginTop:-8
  },

  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'space-between',
    paddingHorizontal: 15,
    paddingVertical: 5,
    backgroundColor: '#fffafb',
    // marginTop:3.5
  },
  userInfo:{
    flexDirection:'row',
    alignItems:'center'
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },

  username: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 13,
  },

  image: {
    width: width,
    // height: height * 0.6,
    aspectRatio:4/5
    // flex:1
  },
  share:{
    // position:'absolute',
    // alignSelf:'flex-end',
    // alignSelf:'center',
    // left:120,
    // top:-10,
    // margin:10,
    // marginLeft:165,
    // marginBottom:25
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginTop: 10,
  },

  countText: {
    marginLeft: 6,
    fontFamily: 'Poppins-Regular',
  },

  captionContainer: {
    marginTop: 12,
    paddingHorizontal: 15,
    paddingBottom: 12,
  },
  caption: {
    fontFamily: 'Poppins-Regular',
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
    fontSize:16,
    fontFamily:'Poppins-Medium'
  }
});

