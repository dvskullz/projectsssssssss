import React from 'react';
import {
  View,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { Text } from 'react-native-paper';
import Vid from '../../assets/images/noVideo.svg';
import Video from 'react-native-video';
import VideoIcon from '../../assets/images/Reelsicon.svg'

const screenWidth = Dimensions.get('window').width;
const spacing = 2;
const imageSize = (screenWidth - spacing * 4) / 3;

const VideoTab = ({ profile, loading }: any) => {
  const navigation = useNavigation<any>();
  const videos = profile?.videoPosts || [];
 
  // console.log('videotab', videos)

  
  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#dc143c" />
      </View>
    );
  }

  if (!videos.length) {
    return (
      <View style={styles.empty}>
        <Vid width={30} height={30} />
        <Text style={styles.noPost}>
          No Videos are Available
        </Text>
        <Text style={styles.desc}>
          We couldn't find anything here.
        </Text>
      </View>
    );
  }

  const renderItem = ({ item, index }: any) => {
    const thumbnail = item?.media?.[0]?.thumbnail;
  
  return (
    <TouchableOpacity
    onPress={() =>
      navigation.navigate('VideoDetails', {
        videos,
        index,
        profile,
        item
      })
    }
    >
        <View style={styles.videoWrapper}>
          <Image
            source={{ uri: thumbnail }}
            style={styles.thumbnail}
            resizeMode="cover"
            />
          <View style={styles.videoIconContainer}>
            <VideoIcon width={25} height={25}  />
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  
  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={videos}
        renderItem={renderItem}
        keyExtractor={item => item._id}
        numColumns={3}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews
        maxToRenderPerBatch={6}
        windowSize={7}
      />
    </View>
  );
};

export default VideoTab;

const styles = StyleSheet.create({
  thumbnail: {
    width: '100%',
    height: '100%',
  },
videoIconContainer:{
 position:'absolute',
 top:6,
//  right:6,
 padding:4,
 borderRadius:20,
//  backgroundColor:'#ffffff'
},
  videoWrapper: {
    width: imageSize,
    height: imageSize * 1.4,
    margin: spacing,
    overflow: 'hidden',
    borderRadius: 8,
    // flex:1``
  },

  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fffafb',
  },
  noPost:{
    fontFamily:'Poppins-SemiBold',
    fontSize:20,
    textAlign:'center'
  },
  desc:{
    textAlign:'center',
    fontSize:12,
    fontFamily:'Poppins-Medium'
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fffafb',
  },
});
