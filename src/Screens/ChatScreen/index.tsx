import React, { useState, useRef, useEffect } from 'react';
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  Image,
  TextInput,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { useNavigation,useFocusEffect } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { IMAGES } from '../../../Constants/images'
import { SafeAreaView } from 'react-native-safe-area-context';
import Send from '../src/assets/images/sf.svg';
import Phone from '../src/assets/images/phone.svg';
import Miss from '../src/assets/images/callMissed.svg';
import VideoChat from '../src/assets/images/videoChat.svg';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Close from '../src/assets/images/close.svg';
import Lock from '../src/assets/images/lock.svg';
// import socket from '../Server/server';
import { RootState } from '../../Store/store';
import { connectSocket } from '../../Services/server';
import { useSelector } from 'react-redux';
import { Socket } from 'socket.io-client';
import NetInfo from '@react-native-community/netinfo';
import UnlockModal from '../../Components/Modals/UnlockModal';
import TypingIndicator from '../../Components/Modals/TypingIndicator';

const ChatScreen = ({ route }: any) => {

  const { receiverId, aiName, aiImage, aiModelId,profile } = route.params;
  const navigation = useNavigation<any>();
  const [input, setInput] = useState('');

  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const {id,name} = useSelector((state: RootState) => state.auth.user);

  const [msgType, setMsgType] = useState(null);
  const [msgTitle,setMsgTitle] =useState('');
  const [showImageModal, setShowImageModal] = useState(false);
  const [inputHeight, setInputHeight] = useState(40);
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [roomId,setRoomId] = useState<string|null>(null);
  const [netStatus, setNetStatus] = useState(false);
  const [isTyping,setIsTyping] = useState(false);
  const [msgLimit, setMsgLimit] = useState('');
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const [modalVisible, setModalVisible] = useState(false);

  const [page,setPage]= useState(1);
  const [hasMore,setHasMore] = useState(true);
  const isLoadingRef = React.useRef(false);
  const timerRef = React.useRef(null);
  const clearedRef = useRef(false);
  const [isAiOnline, setIsAiOnline] = useState<string | null>(null);
    const Max_length = 200;

  const BASE_URL = 'https://luvo.blr1.cdn.digitaloceanspaces.com/luvo/';

  type Message = {
    id: string;
    _id?: string;
    text: string;
    sender: 'me' | 'other';
    type: 'text' | 'call';
    duration?: string;
    replyTo: string | null;
    createdAt: string;
  };
  const resolveImageUri = (path?: string) => {
    if (!path) {
      return null;
    }
    if (path.startsWith('http')) return path;
    return BASE_URL + path;
  };
  const imageUri = resolveImageUri(aiImage);
  // console.log(receiverId);

    // console.log(userID)

  const flatListRef = useRef<FlatList>(null);
  const shouldScrollAfterSendRef = useRef(false);

  const scrollToBottom = () => {
    flatListRef.current?.scrollToEnd({ animated: true });
  };

  const swipeRef = React.useRef<any>(null);
  const socketRef = useRef<Socket | null>(null);

  // React.useEffect(()=>{
  //   const unsubscribe = NetInfo.addEventListener(state =>{
  //     setNetStatus);
  //   })
  // })
  console.log(name,id,receiverId);

  socketRef.current = connectSocket(accessToken);
  const socket = socketRef.current;

  useFocusEffect (
    React.useCallback(()=>{

      console.log(timeZone);

    if(!socket) return;
    const initChatSession = () => {
      console.log('socket connected', socket.id);
      socket.emit('init', {
        userId: id,
        userName: name,
      });
      socket.emit('start-chat', {
        userId: id,
        aiModelId: receiverId,
      });
      socket.emit('isAiOnline', {
        aiProfileId: receiverId,
        timeZone: timeZone,
        userId: id,
      });
    };

    const handleChatStarted = (data: any) => {
      // console.log('Room created', data?.roomId);
      if (data?.roomId) {
        setRoomId(data.roomId);
        getChats(data.roomId, 1);
      }
    };
    const handleAiOnlineStatus = (data: any) => {
        setIsAiOnline(data?.status);
          };

    const handleReceiveMessage = (data: any) => {
      console.log('Message from server', data);
      if (data?.aiModelId === receiverId) {
        setMessages(prevMessages => {
          const incomingId = data?._id ?? data?.id;
          const isDuplicate = prevMessages.some(
            msg => (msg._id ?? msg.id) === incomingId
          );
          if (isDuplicate) return prevMessages;
          return [...prevMessages, data];
        });
      }
    };

    const handleMessageError= (data:any) => {
      if(!modalVisible && data?.code === 'ERR_DAILY_LIMIT_REACHED' ){
        setMsgType('limit');
        setMsgTitle(data);
        setModalVisible(true);
      } else if (data?.code === 'ERR_PLAN_TIER_FORBIDDEN'){
        setMsgType('update');
        setMsgTitle(data);
        setModalVisible(true);
      }
    };

    socket.on('connect', initChatSession);
    socket.on('chat-started', handleChatStarted);
    socket.on('receiveMessage', handleReceiveMessage);
    socket.on('typingStatus', onTyping);
    socket.on('isAiOnlineStatus', handleAiOnlineStatus);
    socket.on('isAiOnline', handleAiOnlineStatus);
    socket.on('MESSAGE_LIMIT', msgTotalLimit);
    socket.on('message_error', handleMessageError);

    socket.onAny((event, data) => {
      console.log('Event from server', event, data);
    });

    if (socket.connected) {
      initChatSession();
    }

    return () =>{
      socket.off('connect', initChatSession);
      socket.off('chat-started', handleChatStarted);
      socket.off('receiveMessage', handleReceiveMessage);
      socket.off('isAiOnlineStatus', handleAiOnlineStatus);
      socket.off('isAiOnline', handleAiOnlineStatus);
      socket.off('MESSAGE_LIMIT', msgTotalLimit);
      socket.off('message_error', handleMessageError);

      socket.offAny();
    };
  },[accessToken, id, name, receiverId, timeZone])
);

  // const handleSend = () => {
  //   if (!input.trim()) return;
  //   console.log('Sending Message',input,roomId);

  //   const newMessage: Message = {
  //     id: Date.now().toString(),
  //     text: input,
  //     sender: 'me',
  //     type: 'text',
  //     replyTo: replyTo?.id || null,
  //     createdAt: new Date().toISOString(),
  //   };

  //    if(!socketRef.current || !roomId) return;
  //   socketRef.current.emit('sendMessage',{
  //     userId:id,
  //     senderId:id,
  //     userMessage:input,
  //     roomId:roomId,
  //     aiModelId:aiModelId,
  //     contentType:'text',
  //     timeZone: INtl.DateTimeFormat().resolvedOptions().timeZone
  //   }

  // );
  //   setInput("");

  //   shouldScrollAfterSendRef.current = true;
  //   setMessages(prev => [...prev, newMessage]);
  //   setInput('');
  //   setReplyTo(null);
  //   setInputHeight(40);
  // };

  const onTyping = (data:any)=>{
    setIsTyping(!!data?.isTyping);
  };

  const msgTotalLimit = (data:any)=>{
    if(data){
      setMsgLimit(data);
    }
  };

  const handleSend = ()=>{
        if(!socket) return;

if(!input.trim()) return;
if(!socketRef.current || !roomId){
  console.log('socket or room id missing ');
  return;
}

const payload = {
  userId:id,
  senderId:id,
  userMessage:input.trim(),
  roomId:roomId,
  aiModelId:receiverId,
  contentType:'text',
  timeZone: timeZone,
  // ...(replyTo ? {replyChatId:replyTo?.id} : {}),
};

console.log('Emitting Message:', payload);
socket.emit('sendMessage',payload);

setMessages(prevMessages => [
  ...prevMessages,
  {
    id: Date.now().toString(),
    text:input,
    sender:'me',
    type:"text",
    replyTo: null,
    createdAt: new Date().toISOString(),
  }
])
setInput('');
socketRef.current.on('messageStatus', data =>{
  if(data?.status == 'delivered'){
    setMessages(messages);
  }else if (data?.status == 'un_delivered'){
    let data = {
      status:'failed'
    }
    setMessages(prev =>
      prev.map(msg =>
        msg.id === id
        ? {...msg, ...data}
        : msg
      )
    )
  }
})
  }

  // useEffect(() => {
  //   if (!shouldScrollAfterSendRef.current) return;
  //   requestAnimationFrame(() => {
  //     scrollToBottom();
  //     shouldScrollAfterSendRef.current = false;
  //   });

  // }, [messages.length]);

  const getChats =(val:string, pageVal: number)=>{
    const socket = socketRef.current;
    if(!socket){
      return;
    }
    if(!socket || isLoadingRef.current || !hasMore) return;
    isLoadingRef.current = true;
    let rmId = val || roomId;
    socket.emit('get_chats',{
      userId:id,
      roomId:rmId,
      page:pageVal || 1,
      pageSize:20
    });

    socket.on('chatList',(data:any)=>{
      isLoadingRef.current = false;
      if(data?.meta){
        setPage(data?.meta?.currentPage);
        setHasMore(data?.meta?.hasNext)
      }
      if(messages.length == 0){
        setMessages(data?.messages);
      }else{
        setMessages(prev => [...prev, ...messages]);
      }
      setTimeout(()=>{
        <ActivityIndicator></ActivityIndicator>
      },1000);
    });

  };

  const renderLeftActions = () => {
    return <View style={{ width: 1 }} />;
  };

  const renderRightAction = () => {
    return <View style={{ width: 1 }} />;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const renderMessage = ({ item, index }: any) => {
    const showDate =
      index === 0 ||
      new Date(messages[index - 1].createdAt).toDateString() !==
        new Date(item.createdAt).toDateString();
    const isMe = item.sender === 'me';
    const repliedMessage = messages.find(m => m.id === item.replyTo);

    // if(item.type === 'call'){
    //   return (
    //     <View style={style.container}>
    //     <Phone width={18} height={18} />
    //     <Text>{item.text}</Text>
    //     <Text>{item.duration}</Text>
    //     </View>
    //   );
    // }

    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Swipeable
          ref={swipeRef}
          friction={2}
          overshootFriction={5}
          leftThreshold={15}
          rightThreshold={15}
          renderLeftActions={!isMe ? renderLeftActions : undefined}
          renderRightActions={isMe ? renderRightAction : undefined}
          onSwipeableWillOpen={direction => {
            if (direction === 'right') {
              setReplyTo(item);
              swipeRef.current?.close();
            }
            if (direction === 'left') {
              setReplyTo(item);
              swipeRef.current?.close();
            }
          }}
        >
          <>
            {showDate && (
              <View style={style.dateContainer}>
                <Text style={style.dateText}>{formatDate(item.createdAt)}</Text>
              </View>
            )}
             </>
            <View
              style={[
                style.messageRow,
                isMe ? style.myMessageRow : style.OtherMessageRow,
              ]}
            >
              {item.type === 'call' ? (
                <View style={style.CallWrapper}>
                  <View style={style.CallRow}>
                    <Miss width={40} height={40} />
                    <View style={{ marginLeft: 10 }}>
                      <Text style={style.callTitle}>{item.text}</Text>
                      {item.duration && (
                        <Text style={style.callDuration}>{item.duration}</Text>
                      )}
                    </View>
                  </View>
                </View>
              ) : (
                <View
                  style={[
                    style.MessageBubble,
                    isMe ? style.myBubble : style.otherBubble,
                  ]}
                >
                  {repliedMessage && (
                    <View
                      style={[
                        style.replyPreview,
                        isMe ? style.myReplyPreview : style.otherReplyPreview,
                      ]}
                    >
                      {/* <View style={style.replyBar}/> */}
                      <View>
                        <Text
                          // numberOfLines={2}
                          style={[
                            style.replyPreviewText,
                            isMe ? style.myReplyText : style.otherReplyText,
                          ]}
                        >
                          {repliedMessage.text}
                        </Text>
                      </View>
                    </View>
                  )}
                  <Text
                    style={[
                      style.messageText,
                      isMe ? { color: '#000' } : { color: '#fff' },
                    ]}
                  >
                    {item.text}
                  </Text>
                </View>
              )}
            </View>
        </Swipeable>
      </GestureHandlerRootView>
    );
  };

  //fff9fa
  //fffafb

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#9b5966' }}>
      <View style={style.customHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={'#000'} />
        </TouchableOpacity>

        <View style={style.profileSection}>
          <TouchableOpacity onPress={() => setShowImageModal(true)}>
            <Image
              source={imageUri ? { uri: imageUri } : IMAGES.pfp}
              style={style.avatar}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={style.headerTitle}>{aiName}</Text>
            <Text style={style.Status} numberOfLines={1}>
              {isAiOnline == 'online' ? 'online' : 'offline'}
            </Text>
          </TouchableOpacity>

        </View>

        {/* <View style={style.rightIcons}> */}

        <TouchableOpacity>
          <Phone width={18} height={18} style={style.iconSpacing} />
        </TouchableOpacity>
        <TouchableOpacity>
          <VideoChat width={24} height={24} style={style.iconSpacing1} />
        </TouchableOpacity>
        <View>
          <TouchableOpacity>
            <MaterialCommunityIcons
              name="dots-vertical"
              size={25}
              color={'#0c1f67'}
              style={{ marginTop: 5, marginRight: -9 }}
            />
          </TouchableOpacity>
        </View>
        {/* </View> */}
        {/* <View style={{ width: 4 }} /> */}
      </View>

      {/* <View style={style.headerSeperator} /> */}

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={item => item.id}
        renderItem={renderMessage}
        onContentSizeChange={() => {
          if (shouldScrollAfterSendRef.current) {
            scrollToBottom();
          }
        }}

        showsVerticalScrollIndicator={false}
        // inverted
        style={{ flex: 1 }}
        overScrollMode="never"
        ListHeaderComponent={() => (
          <View style={style.encryptionContainer}>
            <Text style={style.encryptionText}>
              <Lock style={style.lockIcon} width={15} height={15} />
              {'  '}Messages are encrypted. No one{'\n'} outside of this chat
              not even Luvo{'\n'}can read them.{' '}
            </Text>
          </View>
        )}
        ListFooterComponent={()=>(
          <View style={{paddingBottom:30}}>
            {isTyping && <TypingIndicator/>}
          </View>
        )}
        // ListFooterComponent={()=>(
        //   // <View style={{paddingBottom: 85}}>
        //   //   {isTyping && (
        //   //     <View style={style.typing}>
        //   //     <Text>Typing...</Text>
        //   //       </View>
        //   //   )}
        //   // </View>
        // )}
        contentContainerStyle={{
          paddingBottom:90,
          paddingHorizontal: 5,
          // paddingTop: 2,
        }}
      />

      <View style={style.inputWrapper}>
        {replyTo && (
          <View style={style.replyContainer}>
            <View style={{ flex: 1 }}>
              <Text>
                <Text style={style.replyLabel}>Reply To {''}</Text>
                <Text style={{ fontFamily: 'Poppins-Regular' }}>
                  ({replyTo.text.slice(0, 25)}...){' '}
                </Text>
              </Text>
            </View>

            <TouchableOpacity onPress={() => setReplyTo(null)}>
              <View>
                <Close width={20} />
              </View>
            </TouchableOpacity>
          </View>
        )}

        <Text style={style.charText}>
          {input.length}/{Max_length}{' '}
          <Text style={{ fontFamily: 'Poppins-Regular' }}>
            Characters left{' '}
          </Text>
        </Text>

        <View style={style.inputRow}>
          <TextInput
            style={[
              style.textInput,
              {
                height: Math.max(40, inputHeight),
              },
            ]}
            placeholder="Type Message..."
            placeholderTextColor={'#000'}
            value={input}
            onChangeText={setInput}
            maxLength={200}
            autoCapitalize='none'
            textBreakStrategy="highQuality"
            onContentSizeChange={e => {
              const newHeight = e.nativeEvent.contentSize.height;
              if (newHeight !== inputHeight) {
                setInputHeight(Math.min(120, Math.max(40, newHeight)));
              }
            }}
            textAlignVertical="top"
            multiline={true}
          />

          <TouchableOpacity onPress={handleSend} disabled={!input.trim()}>
            <Send color={input.trim() ? '#d03444' : '#ed9cb3'} />
          </TouchableOpacity>
        </View>
      </View>
      <Modal visible={showImageModal} transparent animationType="fade">
        <View style={style.imageModalContainer}>
          <TouchableOpacity
            style={style.close}
            onPress={() => setShowImageModal(false)}
          >
            <MaterialCommunityIcons name="close" size={28} color={'#999'} />
          </TouchableOpacity>
          <Image
            source={imageUri ? { uri: imageUri } : IMAGES.Euser}
            style={style.fullImage}
            resizeMode="contain"
          />
        </View>
      </Modal>
      {/* <UnlockModal
      /> */}
    </SafeAreaView>
  );
};

const style = StyleSheet.create({
  customHeader: {
    height: 75,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    backgroundColor: '#fffafb',
  },
  iconSpacing: {
    marginRight: 10,
    marginTop: 5,
  },
  iconSpacing1: {
    marginRight: 6,
    marginTop: 5,
    marginLeft: 6,
  },
  headerTitle: {
      top: 2,
    color: '#022150',
    fontSize: 16,
    textTransform: 'capitalize',
    fontFamily: 'Poppins-SemiBold',
    // fontSize: 17,
    padding: 4,
    paddingTop: 5,
    textAlign: 'center',
    // fontFamily: 'Poppins-SemiBold',
  },
  Status:{
    top: -2,
    color: '#838383',
    fontSize: 11.5,
    fontFamily: 'Poppins-Medium',
    textTransform: 'capitalize',
    marginLeft:5
  },
  headerSeperator: {
    height: 1,
    width: '95%',
    alignSelf: 'center',
    backgroundColor: '#f1f1f1',
    // marginTop: 0.5,
  },
  rightIcons: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginRight: -14,
    marginTop: 5,
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 50,
    // marginTop:60
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: 15,
  },
  charText: {
    color: '#dc143c',
    fontSize: 13,
    marginBottom: 7,
    fontFamily: 'Poppins-SemiBold',
  },
  charText1: {
    color: '#dc143c',
    fontSize: 13,
    marginBottom: 7,
  },
  typing:{
    padding:1,
    marginLeft:5,
    marginTop:15,
    alignSelf:'flex-start',
    borderTopLeftRadius:10,
    borderTopRightRadius:10,
    borderBottomRightRadius:10,
    backgroundColor:'#ff1'
  },
  inputWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingBottom: 7,
    paddingTop: 15,
    borderWidth: 1,
    borderTopEndRadius: 30,
    borderTopStartRadius: 30,
    borderColor: '#ede7e7',
    // marginBottom:30,
    backgroundColor: '#fff',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d03444',
    borderRadius: 15,
    paddingHorizontal: 15,
    // height: 50,
    backgroundColor: '#f6e0e516',
  },
  sendButton: {
    // marginLeft:-70
  },
  messageRow: {
    marginBottom: 12,
    flexDirection: 'row',
  },
  myMessageRow: {
    justifyContent: 'flex-end',
    alignSelf: 'flex-end',
  },
  OtherMessageRow: {
    justifyContent: 'flex-start',
    alignSelf: 'flex-start',
  },
  MessageBubble: {
    maxWidth: '75%',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 18,
  },
  CallBubble: {
    maxWidth: '85%',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
  },
  myBubble: {
    backgroundColor: '#ffffff',
    borderBottomEndRadius: 4,
  },
  otherBubble: {
    backgroundColor: '#dc143c',
    borderBottomStartRadius: 4,
  },
  messageText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#333',
  },
  textInput: {
    // flexDirection: 'row',
    // alignItems: 'center',
    // borderWidth: 1,
    // borderColor: '#d03444',
    // borderRadius: 15,
    // paddingHorizontal: 15,
    // height: 50,
    // backgroundColor: '#f6e0e516',
    flex: 1,

    maxHeight: 120,
  },
  container: {
    // alignSelf:'center',
    backgroundColor: '#f3f3f3',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 20,
    marginVertical: 10,
    // alignItems:'center'
  },
  CallWrapper: {
    alignItems: 'center',
    // marginVertical:15,
  },
  CallRow: {
    marginHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: '#fef5f7',
    borderBottomEndRadius: 4,
  },
  callTitle: {
    fontSize: 14,
    color: '#10164a',
    fontFamily: 'Poppins-Medium',
  },
  callDuration: {
    fontSize: 12,
    marginTop: 2,
    fontFamily: 'Poppins-Regular',
    marginRight: 25,
    color: '#10164a',
  },
  close: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
  },
  fullImage: {
    width: '100%',
    height: '70%',
  },
  imageModalContainer: {
    flex: 1,
    backgroundColor: '#101010f2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  replyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // paddingHorizontal:1,
    // paddingVertical:6,
    // borderBottomWidth:0.5,
    // borderColor:'#ddd'
  },
  replyLabel: {
    fontSize: 14,
    color: '#000000',
    fontFamily: 'Poppins-SemiBold',
  },
  dateContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  dateText: {
    fontSize: 13,
    fontFamily: 'Poppins-Medium',
    color: '#999',
  },
  replyPreview: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 6,
    marginBottom: 6,
    // borderBottomEndRadius:2
  },
  // replyBar:{
  //   width:4,
  //   backgroundColor:'#dc143c',
  //   marginRight:6,
  //   borderRadius:2
  // },
  replyPreviewText: {
    flex: 1,
    fontSize: 12,
    color: '#333',
    fontFamily: 'Poppins-SemiBold',
    // marginVertical:16
  },
  replyTextContainer: {
    flex: 1,
  },
  otherReplyPreview: {
    backgroundColor: '#ffff',
    borderBottomEndRadius: 2,
    borderRadius: 18,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  otherReplyText: {
    color: '#333',
  },
  myReplyPreview: {
    backgroundColor: '#dc143c',
    borderBottomLeftRadius: 1,
    borderRadius: 18,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  myReplyText: {
    color: '#ffffff',
  },

  encryptionContainer: {
    alignSelf: 'center',
    backgroundColor: '#fef5f7',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginVertical: 10,
    maxWidth: '80%',
    flexDirection: 'row',

    // alignItems:'center'
  },
  encryptionText: {
    fontSize: 12,
    color: '#838383',
    textAlign: 'center',
    flex: 1,
    fontFamily: 'Poppins-Regular',
  },
  lockIcon: {
    marginRight: 6,
    marginLeft: 4,
  },
});

export default ChatScreen;
