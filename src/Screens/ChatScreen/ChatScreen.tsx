import React, { useState, useRef, useEffect, useCallback } from 'react';
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

import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { Socket } from 'socket.io-client';
import NetInfo from '@react-native-community/netinfo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { connectSocket } from '../../Services/server';
import { RootState } from '../../Store/store';
import { IMAGES } from '../../../Constants/images';
import Send from '../../assets/images/sf.svg';
import Phone from '../../assets/images/phone.svg';
import Miss from '../../assets/images/callMissed.svg';
import VideoChat from '../../assets/images/videoChat.svg';
import Close from '../../assets/images/close.svg';
import Lock from '../../assets/images/lock.svg';
import TypingIndicator from '../../Components/Modals/TypingIndicator';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import { GestureHandlerRootView } from 'react-native-gesture-handler';


const ChatScreen = ({ route }: any) => {
  const Max_length = 200;

    const [inputHeight, setInputHeight] = useState(40);
  const { receiverId, aiName, aiImage } = route.params;
  const navigation = useNavigation<any>();
  const { accessToken } = useSelector((state: RootState) => state.auth);
  const { id, name } = useSelector((state: RootState) => state.auth.user);
  const socketRef = useRef<Socket | null>(null);
  const flatListRef = useRef<FlatList>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isAiOnline, setIsAiOnline] = useState<string | null>(null);
  const [replyTo, setReplyTo] = useState<any | null>(null);
  const [netStatus, setNetStatus] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const[loading,setLoading] = useState(false)
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const BASE_URL = 'https://luvo.blr1.cdn.digitaloceanspaces.com/luvo/';
   const [msgType, setMsgType] = useState(null);
   const [msgTitle,setMsgTitle] =useState('');
  const resolveImageUri = (path?: string) => {

    if (!path) return null;
    if (path.startsWith('http')) return path;
    return BASE_URL + path;

  };
    const swipeRef = React.useRef<any>(null);
  

  const imageUri = resolveImageUri(aiImage);

  

  useEffect(() => {

    if (!socketRef.current) {
      socketRef.current = connectSocket(accessToken);
    }
    return () => {
      socketRef.current?.disconnect();
    };
  }, [accessToken]);


  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setNetStatus(state.isConnected ?? false);
    });
    return unsubscribe;

  }, []);

  

  useFocusEffect(
    useCallback(() => {
      if (!socketRef.current) return;
      const socket = socketRef.current;
      const initChatSession = () => {

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
        if (data?.roomId) {
          setRoomId(data.roomId);
          getChats(data.roomId);

        }

      };

      const handleReceiveMessage = (data: any) => {
        if (data?.aiModelId === receiverId) {
          setMessages(prev => {
            const exists = prev.some(msg => msg._id === data._id);
            if (exists) return prev;
            return [...prev, data];

          });

        }

      };

      const handleTyping = (data: any) => {
        setIsTyping(!!data?.isTyping);

      };

      const handleAiStatus = (data: any) => {
        setIsAiOnline(data?.status);

      };

      socket.on('connect', initChatSession);
      socket.on('chat-started', handleChatStarted);
      socket.on('receiveMessage', handleReceiveMessage);
      socket.on('typingStatus', handleTyping);
      socket.on('isAiOnlineStatus', handleAiStatus);

       socket.onAny((event, data) => {
      console.log('Event from server', event, data);
    });

      if (socket.connected) initChatSession();

      return () => {

        socket.off('connect', initChatSession);
        socket.off('chat-started', handleChatStarted);
        socket.off('receiveMessage', handleReceiveMessage);
        socket.off('typingStatus', handleTyping);
        socket.off('isAiOnlineStatus', handleAiStatus);

      };

    }, [receiverId, id])

  );

  //  const handleMessageError= (data:any) => {
  //     if(!modalVisible && data?.code === 'ERR_DAILY_LIMIT_REACHED' ){
  //       setMsgType('limit');
  //       setMsgTitle(data);
  //       setModalVisible(true);
  //     } else if (data?.code === 'ERR_PLAN_TIER_FORBIDDEN'){
  //       setMsgType('update');
  //       setMsgTitle(data);
  //       setModalVisible(true);
  //     }
  //   };

  const getChats = (roomId: string) => {
    if (!socketRef.current) return;
    const socket = socketRef.current;
    socket.emit('get_chats', {

      userId: id,
      roomId: roomId,
      page: 1,
      pageSize: 20,

    });

    socket.once('chatList', (data: any) => {
      if (data?.messages) {
        setMessages(data.messages);

      }

    });

  };


  const handleSend = () => {

    if (!input.trim()) return;
    if (!socketRef.current ||!roomId) return;
    const socket = socketRef.current;
    const payload = {
      userId: id,
      senderId: id,
      userMessage: input.trim(),
      roomId: roomId,
      aiModelId: receiverId,
      contentType: 'text',
      timeZone: timeZone,
      ...(replyTo ? { replyChatId: replyTo?._id || replyTo?.messageId } : {}),
    };
    console.log('Emitting Message',payload)
    socket.emit('sendMessage', payload);

    const localMessage = {
      messageId: Date.now().toString(),
      senderId: id,
      message: input.trim(),
      contentType: 'text',
      createdAt: new Date().toISOString(),
      ...(replyTo
        ? {
            replyChatId: {
              _id: replyTo?._id || replyTo?.messageId,
              message: replyTo?.message,
              messageType: replyTo?.messageType || 'text',
            },
          }
        : {}),

    };

    setMessages(prev => [...prev, localMessage]);
    setInput('');
    setReplyTo(null);
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 200);

  };
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };



  const renderMessage = ({ item,index }: any) => {
    const showDate =
      index === 0 ||
      new Date(messages[index - 1].createdAt).toDateString() !==
        new Date(item.createdAt).toDateString();
    const isMe = item.senderId === id;
    const replyObj = item?.replyChatId;
    const replyId =
      typeof replyObj === 'object'
        ? replyObj?._id || replyObj?.messageId
        : replyObj;
    const repliedMessage =
      replyId
        ? messages.find(
            m =>
              String(m?._id || m?.messageId || m?.id) === String(replyId),
          )
        : null;
    const replyPreviewText =
      typeof replyObj === 'object' && replyObj?.message
        ? replyObj.message
        : repliedMessage?.message || 'Replied message';

      const renderLeftActions = () => {
        return <View style={{ width: 1 }} />;
      };
    
      const renderRightAction = () => {
        return <View style={{ width: 1 }} />;
      };
    
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
      <>
                  {showDate && (
                    <View style={styles.dateContainer}>
                      <Text style={styles.dateText}>{formatDate(item.createdAt)}</Text>
                    </View>
                  )}
                   </>
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


      <View style={[
        styles.messageRow,
        isMe ? styles.myRow : styles.otherRow
      ]}>
        <View style={[
          styles.bubble,
          isMe ? styles.myBubble : styles.otherBubble
        ]}>
          {replyObj ? (
            <View
              style={[
                styles.replyPreview,
                isMe ? styles.myReplyPreview : styles.otherReplyPreview,
              ]}
            >
              <Text
                style={[
                  styles.replyPreviewText,
                  isMe ? styles.myReplyText : styles.otherReplyText,
                ]}
                numberOfLines={1}
              >
                {replyPreviewText}
              </Text>
            </View>
          ) : null}
          <Text style={{ color: isMe ? '#000' : '#fff'  , fontFamily:'Poppins-Medium'}}>
            {item.message}
          </Text>
        </View>
      </View>
        </Swipeable>
</GestureHandlerRootView>
    );

  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fffafb' }}>


      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} />
        </TouchableOpacity>
        <View style={styles.profileSection}>
          <TouchableOpacity onPress={() => setShowImageModal(true)}>
            <Image
              source={imageUri ? { uri: imageUri } : IMAGES.pfp}
              style={styles.avatar}
            />
          </TouchableOpacity>
           <TouchableOpacity onPress={() => navigation.goBack()}>
                      <Text style={styles.name}>{aiName}</Text>
                      <Text style={styles.status} numberOfLines={1}>
                        {isAiOnline == 'online' ? 'online' : 'offline'}
                      </Text>
                    </TouchableOpacity>
        </View>
<TouchableOpacity>
          <Phone width={18} height={18} style={styles.iconSpacing} />
        </TouchableOpacity>
        <TouchableOpacity>
          <VideoChat width={24} height={24} style={styles.iconSpacing1} />
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

      </View>

<View style={{flex:1}}>
  { loading && (
<View>
  <ActivityIndicator size={'large'} color={'#ccc'} />
  </View>
  )}

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        overScrollMode='never'
        keyExtractor={(item, index) =>
          item._id || item.messageId || index.toString()
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 5, paddingBottom: 80 }}
  ListHeaderComponent={() => (
          <View style={styles.encryptionContainer}>
            <Text style={styles.encryptionText}>
              <Lock style={styles.lockIcon} width={15} height={15} />
              {'  '}Messages are encrypted. No one{'\n'} outside of this chat
              not even Luvo{'\n'}can read them.{' '}
            </Text>
          </View>
        )}
        ListFooterComponent={()=>(
          <View style={{paddingBottom:40}}>
            {isTyping && <TypingIndicator/>}
          </View>
        )}
        />
        </View>
<View style={styles.inputWrapper}>
      {replyTo && (
        <View style={styles.replyContainer}>
          <View style={{ flex: 1 }}>
            <Text>
              <Text style={styles.replyLabel}>Reply To </Text>
              <Text style={{ fontFamily: 'Poppins-Regular' }}>
                ({String(replyTo?.message || '').slice(0, 25)}...)
              </Text>
            </Text>
          </View>
          <TouchableOpacity onPress={() => setReplyTo(null)}>
            <Close width={20} />
          </TouchableOpacity>
        </View>
      )}

 <Text style={styles.charText}>
          {input.length}/{Max_length}{' '}
          <Text style={{ fontFamily: 'Poppins-Regular', fontSize:12 }}>
            Characters left{' '}
          </Text>
        </Text>

      <View style={styles.inputRow}>

        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Type message..."
          style={styles.input}
          maxLength={200}
            autoCapitalize='none'
            textBreakStrategy="highQuality"
               textAlignVertical="top"
            multiline={true}
            onContentSizeChange={e => {
              const newHeight = e.nativeEvent.contentSize.height;
              if (newHeight !== inputHeight) {
                setInputHeight(Math.min(120, Math.max(40, newHeight)));
              }
            }}
          
        />
        <TouchableOpacity onPress={handleSend}>
          <Send color={input ? '#dc143c' : '#ccc'}  />
        </TouchableOpacity>
      </View>
          </View>

      <Modal visible={showImageModal} transparent>
        <View style={styles.imageModal}>
          <TouchableOpacity
            style={{ position: 'absolute', top: 60, right: 20 }}
            onPress={() => setShowImageModal(false)}
          >
            <MaterialCommunityIcons name="close" size={28} color="#fff" />
          </TouchableOpacity>
          <Image

            source={imageUri ? { uri: imageUri } : IMAGES.pfp}
            style={{ width: '100%', height: '70%' }}
            resizeMode="contain"

          />
        </View>
      </Modal>
    </SafeAreaView>

  );

};

export default ChatScreen;

const styles = StyleSheet.create({

  header: {
      height: 75,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    backgroundColor: '#fffafb',
  },

  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 15,
    flex:1
  },

  avatar: {
    width: 45,
    height: 45,
    borderRadius: 50,
    marginRight: 10,

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

  name: {
   top: 2,
    color: '#022150',
    fontSize: 16,
    textTransform: 'capitalize',
    fontFamily: 'Poppins-SemiBold',
    // fontSize: 17,
    padding: 4,
    paddingTop: 5,
    textAlign: 'center',
  },

  status: {
    top: -2,
    color: '#838383',
    fontSize: 11.5,
    fontFamily: 'Poppins-Medium',
    textTransform: 'capitalize',
    marginLeft:5
  },

  messageRow: {
    marginBottom: 12,
    flexDirection: 'row',
  },

  myRow: {
    justifyContent: 'flex-end',
    alignSelf:'flex-end'
  },

  otherRow: {
    justifyContent: 'flex-start',
    alignSelf:'flex-start'
  },

  bubble: {
    maxWidth: '75%',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 18,
  },

  myBubble: {
    backgroundColor: '#fff',
    borderBottomEndRadius:4

  },

  otherBubble: {
    backgroundColor: '#dc143c',
     borderBottomStartRadius: 4,

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
  },inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d03444',
    borderRadius: 15,
    paddingHorizontal: 15,
    // height: 50,
    backgroundColor: '#f6e0e516',
  },
 charText: {
    color: '#dc143c',
    fontSize: 15,
    marginBottom: 7,
    fontFamily: 'Poppins-SemiBold',
  },
  inputContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#eee',

  },

  input: {

    flex: 1,
    marginRight: 10,
    maxHeight: 120,

  },

  imageModal: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',

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
  replyPreview: {
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 8,
    marginBottom: 6,
  },
  myReplyPreview: {
    backgroundColor: '#dc143c',
    alignSelf: 'flex-start',
  },
  otherReplyPreview: {
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
  },
  replyPreviewText: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
  },
  myReplyText: {
    color: '#fff',
  },
  otherReplyText: {
    color: '#000',
  },
  replyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  replyLabel: {
    fontSize: 14,
    color: '#000000',
    fontFamily: 'Poppins-SemiBold',
  },

});

