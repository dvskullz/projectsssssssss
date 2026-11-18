import React,{useState,useRef} from "react";
import {View,Image,Dimensions, FlatList,Text, StyleSheet,Share, TouchableOpacity} from 'react-native';
import Video from "react-native-video";
import { useRoute, useNavigation } from "@react-navigation/native";
const {height,width} = Dimensions.get('window');
// import UnLike from '../src/assets/images/postunlike.svg';
// import Like from '../src/assets/images/PostLike.svg';
import Comment from '../../assets/images/ReelComment.svg';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
const BASE_URL = 'https://luvo.blr1.cdn.digitaloceanspaces.com/luvo/';
//  import Demo from '../src/assets/images/demo.svg';
import Heart from '../../assets/images/ReelunLike.svg'
import Demo from '../../assets/images/ReeLike.svg'
import Send from '../../assets/images/send.svg'
import Slider from '@react-native-community/slider';
import { IMAGES } from "../../../Constants/images";


export default function VideoDetails(){
    const route = useRoute<any>();
    const{videos,index,profile,item} = route.params;
    const [currentIndex,setCurrentIndex] = useState(index);
    
    const navigation = useNavigation();

    const VideoCard = ({item,index,currentIndex, profile}:any) => {
        const videoUrl= item?.media?.[0]?.url;
        const VideoRef = useRef<any>(null);
        const [currentTime, setCurrentTime] = useState(0);
        const [duration,setDuration] = useState(0);
        const [isSliding, setIsSliding] = useState(false);
        const [liked,setLiked] = useState(item.isLiked);
        const[likes,setLikes] = useState(item.likesCount);
        
        const resolveImageUri = (path? :string)=>{
            if(!path) return null;
            if(path.startsWith('https'))return path;
            return BASE_URL + path
        }
        
        const handleProgress=(data:any)=>{
            if(!isSliding){
                setCurrentTime(data.currentTime);
            }
        };
        const handleLoad = (data:any) =>{
            setDuration(data.duration);
        };

        const mediaItem = item?.media?.[0];
        const imageUri = mediaItem?.url || mediaItem?.thumbnail;
        const profileImage = resolveImageUri(profile?.profileImage)

        const handleLike = () =>{
            if(liked){
                setLikes((prev:number) => prev - 1 );
            }else {
                setLikes((prev: number)=> prev + 1);
            }
            setLiked(!liked);
        }
        const share = async ()=>{
            try{
                const videoUrl = item?.media?.[0]?.url;
                if(!videoUrl){
                    return;
                }
                console.log('sharing');
                await Share.share({
                    message:`Check out this video ${videoUrl}`
                })
            }catch(error){

            }
        };
    return(
        <View style={style.container}>
        <Video
        ref={VideoRef}
        source={{uri:videoUrl}}
        resizeMode='cover'
        style={style.video}
        onProgress={handleProgress}
        onLoad={handleLoad}
        repeat
        controls
        paused={currentIndex !==index}
        />
        <TouchableOpacity 
        style={style.backbtn}
        onPress={()=>navigation.goBack()}>
        <MaterialCommunityIcons
            size={26}
            color={'#fff'}
            name="arrow-left"
        />
        </TouchableOpacity>

        <View style={style.rightContainer}>
            <TouchableOpacity onPress={handleLike}>
            {liked ? (
                // <Heart/>
                <Demo width={35} height={35} color ='#dc143c'/>
            ):(
                <Heart width={35} height={35} color ='#bcbcbc'/>
            )}
            <Text style={style.countText}>{likes}</Text>
            </TouchableOpacity>

            <TouchableOpacity>
            <Comment width ={35} height={35} fill = '#FFF' />
            <Text style={style.countText}>
                {item.commentsCount}
            </Text>
            <TouchableOpacity onPress={share}>
            <Send width={35} height={35} />
            <Text style={{color:'#fff', textAlign:'center'}}>Share</Text>
            </TouchableOpacity>
            </TouchableOpacity>
        </View>

            <View style={style.bottomContainer}>
                <View style={style.userRow}>
{profileImage?(
    <Image
    source={{uri:profileImage}}
    style={style.avatar}
    />
    ):(
        <Image source={IMAGES.Euser}
        style={style.avatar}
        />
    )}
                <Text style={style.username}>{profile?.name}</Text>
               </View>

                {item?.caption ? (
                    <Text style={{color:'#fff'}} >
                        {item?.caption}
                    </Text>
                ):null}
            </View>
            <View style={style.sliderContainer}>
                <Slider
                style={{ height:-4}}
            minimumValue={0}
            maximumValue={duration}
            value={currentTime}
            minimumTrackTintColor="#dc143c"
            maximumTrackTintColor="#ffffff"
            thumbTintColor="transparent"
            // thumbImage={false}
            onSlidingStart={()=>setIsSliding(true)}
            onSlidingComplete={(value)=>{
                VideoRef.current?.seek(value);
                setCurrentTime(value);
                setIsSliding(false);
            }}
    />
            </View>

        </View>
        
    );
  };

     const onViewRef = useRef(({viewableItems}:any)=>{
            if(viewableItems.length > 0){
                setCurrentIndex(viewableItems[0].index);
            }
        });
    const viewConfigRef = useRef ({
        viewAreaCoveragePercentThreshold: 80,
    });
  return(
    <View style={{flex:1}}>
        <FlatList
        data={videos}
        renderItem={({item,index})=>(
            <VideoCard
            item={item}
            index={index}
            currentIndex={currentIndex}
            profile={profile}
        />
        )}
        keyExtractor={(item)=>item._id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        initialScrollIndex={index}
        getItemLayout={(data,index)=>({
            length:height,
            offset:height * index,
            index,
        })}
        onViewableItemsChanged={onViewRef.current}
        viewabilityConfig={viewConfigRef.current}
        />
    </View>
  );
};

const style = StyleSheet.create({
    container:{
        height:height,
        width:width,
        backgroundColor:'black',
        // flex:1,
        overflow:'hidden'
    },
    userRow:{
        flexDirection:'row',
        alignItems:'center'
    },
    avatar:{
        width: 35,
        height:35,
        borderRadius:50,
        borderColor:'#dc143c',
        borderWidth:1
    
    },
username:{
    fontFamily:'Poppins-Medium',
    fontSize:14,
    color:'#fff',
    right : -5,
    textAlign:'center'
},
    backbtn:{
        position:'absolute',
        top:30,
        left:15,
        zIndex:10
    },
    video:{
        height:"62%",
        width:"100%",
        marginTop:140,
        // aspectRatio:3/4,

        alignSelf:'center',
        position:'absolute'
    },
    rightContainer:{
        position:'absolute',
        right:12,
        marginTop:300,
        alignSelf:'center'
    },
    countText:{
        color:'#FFF', 
        fontFamily:'Poppins-Medium',
         fontSize:16,
         textAlign:'center',
         marginBottom:12
    },
    bottomContainer:{
        position:'absolute',
        bottom:65,
        left:12,
        right:100
    }, 
    sliderContainer:{
        position:'absolute',
        bottom:32,
        left:0,
        right:0
    }
    
})