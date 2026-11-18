import React, { useState } from "react";
import { Text,View,StyleSheet,Image, Dimensions, TouchableOpacity,ActivityIndicator } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import Photo from '../../assets/images/LockPost.svg';
import { SafeAreaView } from "react-native-safe-area-context";
import UnlockPhoto from "../../Components/Modals/UnlockPhoto";
const Base_URL = 'https://luvo.bl31.cdn.digitaloceanspaces.com/luvi/';
const screenWidth = Dimensions.get('window').width;
const spacing = 2;
const imageSize = (screenWidth-spacing *4)/3;
const PostTab = ({profile,loading}:any)=>{
    
    const [unlockModal, setUnlockModal] = useState(false);
    const [selectedPost, setSelectedPost] = useState<any>(null);
    // const posts = profile?.imagePosts || [];
    const navigation = useNavigation<any>();
    const resolveImageUri = (path?: string) =>{
        if(!path) return null;
        if(path.startsWith('http')) return path;
    return Base_URL + path ;
    };
    

// console.log("Images in post tab ", posts);
// console.log('yes', posts.length);
// console.log('First Post', posts[0]);
if(loading){
    return(
        <View style={style.loaderContainer}>
            <ActivityIndicator size={'large'} color={'#dc143c'}/>
        </View>
    );
}
const posts = profile?.imagePosts || [];

if(posts.length ===0){
    return (
    <View style = {style.empty}>
        <Photo  style={style.icon}width={30} height={30}/>
        <Text style={style.noPost}>No Posts are Available</Text>
        <Text style={style.desc}>we couldn't find anything here.</Text>
    </View>
    );
}else{
    // console.log(profile)
    // console.log
return(
        <SafeAreaView style={{flex:1, backgroundColor:'#fffafb'}}>
        <FlatList
        data={posts}
        numColumns={3}
        keyExtractor={(item)=>item._id}
        showsVerticalScrollIndicator={false}
    //  initialScrollIndex={index}
        renderItem={({item,index})=> {
           const mediaItem = item?.media?.[0];
            const isLocked = mediaItem?.access?.allow === false;
            

           if(!mediaItem) return null;
          

           const imageUri = isLocked
           ?mediaItem.thumbnail
           : mediaItem.url || mediaItem.thumbnail;
          
           return (
            <TouchableOpacity
            onPress={()=>{
                if(isLocked){
                    setSelectedPost(item);
                    setTimeout(()=>{
                        setUnlockModal(true);

                    },0);
                }else{
                navigation.navigate('Posts',{
                posts:posts,
                index:index,
                profile:profile,
            })
        }
    }}
        >
           <View style={style.imageWrapper}>
            <Image
               source={{ uri: imageUri }}
               style={style.image}
               resizeMode="cover"
            //    onLoadStart}
               />
               {isLocked && (
                <View style={style.lockOverlay}>
                <Photo width={24} />
                </View>
               )}
               </View>
        </TouchableOpacity>
            );
        }}
        />
        <UnlockPhoto
        visible={unlockModal}
        onClose={()=>setUnlockModal(false)}
        postData={selectedPost}
        />
        </SafeAreaView>
        );
        }
    }
     
const style = StyleSheet.create({
    text:{
        fontFamily:'Poppins-Medium',
        textAlign:'center',
        fontSize:18
    },
    lockOverlay:{
        position:'absolute',
        top:0,
        left:0,
        right:0,
        bottom:0,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#00000086'
    },
    image:{
        width:"100%",
        // aspectRatio:1,
        height:"100%"
    },
    empty:{
        flex:1,
        justifyContent:'center',
        alignItems:'center'
        
    },
    loaderContainer:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#fffafb', 
     } ,
    imageWrapper:{
        width:imageSize,
        height:imageSize * 1.4,
        margin:spacing,
        overflow:'hidden',
        // borderRadius:6
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
    icon:{
        alignSelf:'center',

    }
});

export default PostTab;
