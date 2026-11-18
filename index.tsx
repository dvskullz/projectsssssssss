import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import {
  Text,
  View,
  Modal,
  Image,
  Alert,
  Linking,
  Platform,
  Keyboard,
  AppState,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  PermissionsAndroid,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { IMAGES } from '../../styles/index';
import TextInputField from '../../components/ModalScreen/TextInputField';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { normalize } from '../../Helper/NormalizeFont';
import TypingIndicator from '../../components/ModalScreen/Typeindicator';
import ProgressIndicator from '../../components/ModalScreen/ProgressBar';
import { Config } from '../../config.tsx';
import Loader from '../../Helper/Loader';
import Video from 'react-native-video';
import LinearGradient from 'react-native-linear-gradient';
import moment from 'moment';
import { useSocket } from './SocketContext';
import { useTranslation } from 'react-i18next';
import { getAiProfileCall } from '../../Services/apiAction';
import { setActiveAiId } from '../../Store/authSlice.tsx';
import {
  Gesture,
  FlatList,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import {
  runOnJS,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { appEvents } from '../../components/AppEvent';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import NetInfo from '@react-native-community/netinfo';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { ChatMessageItem } from './ChatMessageItem.js';
import PostUnlockModal from '../../components/ModalScreen/PostUnlock.tsx';
import PlanDetailsModal from '../../components/ModalScreen/PlanDetails.tsx';

var media_Type = '';
var dataDetails: any = null;

const ChatScreen = (props: any) => {
  const flatListRef = React.createRef<FlatList>();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const safeTop = Math.min(insets.top, 20);
  const inputRef = React.useRef(null);

  const { socket, isConnected, connectSocket } = useSocket();
  const profileData = useSelector(state => state?.auth?.profileData);

  const navigation = useNavigation<any>();
  const [message, setMessage] = useState('');
  const [chatmessages, setChatMessages] = useState([]);
  const [chatMood, setChatMood] = useState('');
  const [roomId, setRoomId] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [netStatus, setNetStatus] = useState(false);
  const [imageShow, setImageShow] = useState(false);
  const [moodShow, setMoodShow] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [msgTitle, setMsgTitle] = useState('');
  const [msgType, setMsgType] = useState(null);
  const [selectType, setSelectType] = useState('');
  const [msgLimit, setMsgLimit] = useState('');
  const [replyMsg, setReplyMsg] = useState('');
  const [selectedImage, setSelectedImage] = useState();
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const [planId, setPlanId] = useState(null);
  const [postModalVisible, setPostModalVisible] = useState(false);
  const [planDetailsVisible, setPlanDetailsVisible] = useState(false);

  //pagination
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const isLoadingRef = React.useRef(false);
  const timerRef = React.useRef(null);
  const clearedRef = useRef(false);

  const [isAiOnline, setIsAiOnline] = useState(null);
  const [AiUserData, setAiUserData] = useState(props?.route?.params?.aiUserData);

  const AiUserId = props?.route?.params?.aiUserData?._id || props?.route?.params?.id;
  var profileId = profileData?.id || profileData?._id;

  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone; //Asia/Kolkata

  useFocusEffect(
    useCallback(() => {
      setTimeout(() => {
        Loader.isLoading(true);
      }, 300);
      setTimeout(() => {
        Loader.isLoading(false);
      }, 7000);
      dispatch(setActiveAiId(AiUserId));
      return () => {
        dispatch(setActiveAiId(null));
      };
    }, []),
  );

  useEffect(() => {
    const lastMessage = chatmessages[chatmessages.length - 1];
    if (lastMessage?.senderId != profileId) {
      setChatMood(lastMessage);
    }
  }, [chatmessages]);

  React.useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setNetStatus(state.isConnected);
    });

    return () => unsubscribe();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      getRatingData();
      if (socket) {
        socket.emit('init', { userId: profileId, userName: profileData?.name });
        socket.emit('start-chat', { userId: profileId, aiModelId: AiUserId });
        socket.emit("isAiOnline", { aiProfileId: AiUserId, timeZone: timeZone, userId: profileId });
        socket.on('chat-started', onChatStarted);
        socket.on('receiveMessage', onReceiveMessage);
        socket.on('typingStatus', onTyping);
        socket.on('MESSAGE_LIMIT', msgTotalLimit);
        socket.on('message_error', handleMessageError);
        socket.on('isAiOnlineStatus', handleAiStatus);
        socket.emit('isOnline', { userId: profileId });

        const unsubscribe = navigation.addListener('beforeRemove', () => {
          if (!socket) return;
          socket.off('chat-started', onChatStarted);
          socket.off('receiveMessage', onReceiveMessage);
          socket.off('typingStatus', onTyping);
          socket.off('MESSAGE_LIMIT', msgTotalLimit);
          socket.off('message_error', handleMessageError);
          socket.off('isAiOnlineStatus', handleAiStatus);

          socket.off('chatList');
          socket.off('isAllowedVoiceCall');
          socket.off('voice_allowed');
          socket.off('isAiOnline');
          clearTimer();
          clearedRef.current = false;

        });
        return unsubscribe;
      };
    }, [socket])
  );

  useEffect(() => {
    const sub = AppState.addEventListener('change', state => {
      if (state === 'active') {
        if (!isConnected) {
          connectSocket();
        } else {
          setIsTyping(false);
          if (!socket) return;
          const handleConnect = () => {
            socket.emit('init', { userId: profileId, userName: profileData?.name });
            socket.emit('start-chat', { userId: profileId, aiModelId: AiUserId });
            socket.emit('isOnline', { userId: profileId });
          };
          socket.on('connect', handleConnect);
        }
      }
    });

    return () => sub.remove();
  }, [socket]);

  // Function set up event listeners for connection status
  const onChatStarted = (data: any) => {
    if (data?.roomId) {
      setRoomId(data.roomId);
      getChats(data.roomId, 1);
    }
  };

  // Function set up event listeners for receiving messages
  const onReceiveMessage = (data: any) => {
    if (data?.aiModelId === AiUserId) {
      setChatMessages(prevMessages => {
        const isDuplicate = prevMessages.some(msg => msg._id === data._id);
        if (!isDuplicate) {
          return [...prevMessages, data];
        }
        return prevMessages; // Return previous messages if duplicate
      });
    }
  };

  // Function set up event listeners for typing status
  const onTyping = (data: any) => {
    setIsTyping(!!data?.isTyping);
  };

  // Function set up event listeners for message limit status
  const msgTotalLimit = (data: any) => {
    if (data) {
      setMsgLimit(data);
    }
  };

  // Function set up event listeners for message errors, showing appropriate modals based on error codes
  const handleMessageError = (data: any) => {
    if (!modalVisible && data?.code == 'ERR_DAILY_LIMIT_REACHED') {
      setMsgType('limit');
      setMsgTitle(data);
      setModalVisible(true);
    } else if (data?.code == 'ERR_PLAN_TIER_FORBIDDEN') {
      setMsgType('update');
      setMsgTitle(data);
      setModalVisible(true);
    }
  };

  // AI online status, updating the state and starting periodic checks if the status is online
  const handleAiStatus = (data: any) => {
    if (data?.status) {
      startEmit();
      setIsAiOnline(prev => prev !== data.status ? data.status : prev);
    };
  };

  const emitCheck = () => {
    // console.log(12345,"isAiOnline")
  }

  const startEmit = () => {
    // setTimeout(() => {
    emitCheck();
    // }, 3000);
  };

  const clearTimer = () => {
    if (timerRef?.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  //Set up event listeners for get all chat message
  const getChats = (val: string, pageVal: number) => {
    if (!socket) {
      return;
    }
    if (!socket || isLoadingRef.current || !hasMore) return;
    isLoadingRef.current = true;
    let rmId = val || roomId;
    socket.emit('get_chats', {
      userId: profileId,
      roomId: rmId,
      page: pageVal || 1,
      pageSize: 20
    });

    socket.on('chatList', (data: any) => {
      isLoadingRef.current = false;
      if (data?.meta) {
        setPage(data?.meta?.currentPage);
        setHasMore(data?.meta?.hasNext)
      }
      if (chatmessages.length == 0) {
        // FIRST LOAD (latest messages)
        setChatMessages(data?.messages);
      } else {
        // PAGINATION (prepend older messages)
        setChatMessages(prev => [...prev, ...chatmessages]);
      }
      setTimeout(() => {
        Loader.isLoading(false);
      }, 1000);
    });

  };

  //Function for check audio permssinsion before start call and navigate to call screen
  const requestAudioPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        return false;
      }
    }
    return true;
  };

  // Function to check status for voice permissions from server
  const voiceCallCheck = () => {
    Loader.isLoading(true);
    setSelectType('voice');
    setTimeout(() => { Loader.isLoading(false); }, 3000);
    socket.emit('isAllowedVoiceCall', { userId: profileId });
    socket.on('voice_allowed', (data: any) => {
      if (data?.voice_allowed) {
        handleStartCall(1)
      }
    })
  }

  // Function to check status for video permissions from server
  const videoCallCheck = () => {
    Loader.isLoading(true);
    setSelectType('video');
    setTimeout(() => { Loader.isLoading(false); }, 3000);
    socket.emit('isAllowedVideoCall', { userId: profileId });
    socket.on('video_allowed', (data: any) => {
      if (data?.video_allowed) {
        handleStartCall(2);
      }
    })
  }

  // Function to call permission check and navigate to call screen based on call type
  const handleStartCall = async (val: number) => {
    const hasPermission = await requestAudioPermission();
    if (!hasPermission) {
      Alert.alert(
        'Permission Denied',
        'Microphone access is required to make a call.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: () => Linking.openSettings() },
        ],
      );
      return;
    }
    if (val === 1) {
      navigation.navigate('AudioScreen', {
        aiData: AiUserData,
        AiUserId: AiUserId,
        roomId: roomId,
        onCallEnd: () => {
          setTimeout(() => {
            dataUpdate();
          }, 800);
        },
      });
    } else {
      navigation.navigate('VideoScreen', {
        aiData: AiUserData,
        AiUserId: AiUserId,
        roomId: roomId,
        onCallEnd: () => {
          setTimeout(() => {
            dataUpdate();
          }, 800);
        },
      });
    }
  };

  // Function to call ai profile api for ai details
  const getRatingData = async () => {
    if (!AiUserData) {
      const response = await getAiProfileCall(AiUserId, null, true);
      if (response?.data?.statusCode == 200) {
        setAiUserData(response?.data?.data || '');
      }
    }
  };

  //For update data after message send
  const updateMessageStatus = (id, sending) => {
    setChatMessages(prevMessages =>
      prevMessages.map(msg => (msg.messageId === id ? { ...msg, sending } : msg)),
    );
  };

  // Emit `send-msg` when the user sends a message
  const sendMessage = () => {
    if (!netStatus) {
      alert('Please check internet connection and try again.');
      return
    }
    if (!message) {
      alert('Please enter message.');
      return;
    }
    if (moodShow) {
      setMoodShow(false);
    }
    const messageId = Date.now().toString();
    const payload = {
      userId: profileId,
      senderId: profileId,
      userMessage: message.trim(),
      roomId: roomId,
      aiModelId: AiUserId,
      contentType: 'text',
      timeZone: timeZone,
      ...(replyMsg ? { replyChatId: replyMsg?._id } : {}),
    };

    socket.emit('sendMessage', payload);
    if (replyMsg) {
      setReplyMsg('');
    };

    setChatMessages(prevMessages => [
      ...prevMessages,
      {
        messageId: messageId,
        senderId: profileId,
        message: message.trim(),
        contentType: 'text',
        sending: true,
        status: 'sending',
        createdAt: new Date().toISOString(),
        ...(replyMsg ? {
          replyChatId: {
            _id: replyMsg?._id,
            message: replyMsg?.message,
            messageType: replyMsg?.messageType
          }
        } : {}),
      },
    ]);

    appEvents({
      eventName: 'message_sent',
      payload: {
        chat_id: messageId,
        room_id: messageId,
        message_length: message?.length,
        sender_type: 'user',
        user_id: profileId,
        user_name: profileData?.name,
      },
    });
    setMessage('');
    socket.on('messageStatus', data => {
      if (data?.status == 'delivered') {
        updateMessageStatus(messageId, false);
      } else if (data?.status == 'un_delivered') {
        let data = {
          status: 'failed',
        }
        setChatMessages(prev =>
          prev.map(msg =>
            msg.messageId === messageId
              ? { ...msg, ...data }
              : msg
          )
        );
      }
    });
    scrollToBottom();
  };

  // Function to add event 
  const appAddEvent = async () => {
    try {
      appEvents({
        eventName: 'cta_clicked',
        payload: {
          cta_name: 'AiProfileScreen',
          screen: 'ChatDetails',
          userId: profileData?.id || profileData?._id,
          userName: profileData?.name,
        },
      });
    } catch (error) { }
  };

  // Function to group chat messages by date for rendering in sections
  const groupChatsByDate = (chats: any) => {
    return chats.reduce((acc, room) => {
      const dateKey = moment(room.createdAt).format('MMM D, YYYY');
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(room);
      return acc;
    }, {});
  };

  const groupedChats = groupChatsByDate(chatmessages);

  const [highlightedId, setHighlightedId] = useState(null);

  useEffect(() => {
    if (!highlightedId) return;
    const t = setTimeout(() => setHighlightedId(null), 1200);
    return () => clearTimeout(t);
  }, [highlightedId]);

  const messageIndexMap = useMemo(() => {
    const map = {};
    chatmessages.forEach((m, index) => {
      map[m._id || m.messageId] = index;
    });
    return map;
  }, [chatmessages]);

// Funtion to focus on the message which is replyed
  const scrollToReplyMessage = (replyChatId: any) => {
    const originalIndex = messageIndexMap[replyChatId];
    if (originalIndex == null && replyChatId) {
      // if (hasMore && !isLoadingRef.current) {
      //   let val = page + 1
      //   setPage(val);
      //   getChats(roomId, val);
      // }
      flatListRef.current.scrollToIndex({
        index: chatmessages.length,
        animated: true,
        viewPosition: 0.1,
      });
    }
    else
      if (originalIndex == null || !flatListRef.current) {
        return;
      } else {
        const total = chatmessages.length;
        const reversedIndex = total - 1 - originalIndex;
        flatListRef.current.scrollToIndex({
          index: reversedIndex,
          animated: true,
          viewPosition: 0.5,
        });
      }
  };

  const onReplyPress = (replyChat: any) => {
    if (!replyChat?._id) return;
    setHighlightedId(replyChat._id);
    scrollToReplyMessage(replyChat._id);
  };

  //Header view for chat screen
  const headerCodeView = () => (
    <>
      <View style={[styles.container, { paddingTop: safeTop }]}>
        <View style={[styles.leftImg]}>
          <TouchableOpacity onPress={() => { setTimeout(() => { navigation.goBack() }, 300) }}>
            <Image
              source={IMAGES.back}
              style={{ height: 22, width: 25 }}
              resizeMode={'contain'}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.chatView}
            onPress={() => {
              media_Type = 'image';
              setSelectedImage(Config.IMAGE_URL + AiUserData?.profileImage);
              setImageShow(true);
            }}>
            <Image
              source={
                AiUserData?.profileImage
                  ? { uri: Config.IMAGE_URL + AiUserData?.profileImage }
                  : IMAGES.profileIcon
              }
              style={styles.profileCss}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={{ paddingLeft: 10, width: '54%' }}
            onPress={() => {
              navigation.navigate('AiProfileScreen', { id: AiUserId });
              appAddEvent();
            }}>
            <Text style={styles.nameTitle} numberOfLines={1}>
              {AiUserData?.name}
            </Text>
            <Text style={styles.headerTitle} numberOfLines={1}>
              {isAiOnline == 'online' && netStatus == true ? 'Online' : 'Offline'}
            </Text>
          </TouchableOpacity>

          {roomId && (
            <View style={styles.callHeaderView}>
              {isAiOnline == 'online' && netStatus == true &&
                <>
                  <TouchableOpacity onPress={() => { voiceCallCheck(); }}>
                    <Image
                      source={IMAGES.callChat}
                      style={styles.callIcon}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => { videoCallCheck(); }}>
                    <Image
                      source={IMAGES.videoChat}
                      style={styles.callIcon}
                    />
                  </TouchableOpacity>
                </>
              }
              <TouchableOpacity onPress={() => { setMoodShow(!moodShow) }}>
                <Image
                  source={IMAGES.dotMenu}
                  style={styles.callIcon}
                />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      <View style={styles.horizontalLine} />
    </>
  );

// Bottom view for chat screen with message input and send button
  const renderBottomView = () => (
    <View style={styles.bottomViewBorder}>

      {replyMsg &&
        <View style={styles.replyView}>
          <View style={styles.replyTextView}>
            <Text style={[styles.countText, { color: '#000' }]}>
              Reply To (
            </Text>
            <Text style={[styles.leftText, styles.replyText]} numberOfLines={1}>
              {typeof replyMsg === 'object' && replyMsg !== null
                ? replyMsg.messageType === 'text'
                  ? replyMsg.message
                  : replyMsg.messageType === 'image'
                  ? 'Image'
                  : replyMsg.messageType
                : ''
              }
            </Text>
            <Text style={[styles.countText, { color: '#000', paddingRight: 5, }]}>)</Text>
          </View>

          <TouchableOpacity onPress={() => { setReplyMsg(''); Keyboard.dismiss(); }}>
            <Image
              source={IMAGES.close}
              style={styles.closeIcon}
            />
          </TouchableOpacity>
        </View>
      }

      <Text style={styles.countText}>{message.length}/200 <Text style={styles.leftText}>Character left</Text></Text>

      {/* <View style={styles.msgView}> */}
      <TextInputField
        ref={inputRef}
        placeHolder={'Type Message...'}
        placeholderTextColor={'#000000'}
        value={message}
        maxLength={200}
        multiline={true}
        msgSend
        onSend={() => {console.log('onSend called with msgType:', msgType); if (msgType != null) { setModalVisible(true); } else { sendMessage(); } }}
        checkImg={styles.attachImage}
        sndDisable={!message}
        inputContainer={[styles.textInputField, { height: 'auto', maxHeight: 110, }]}
        textStyle={[styles.txtStyle, { height: 'auto', maxHeight: 110, }]}
        onChangeText={(e: any) => setMessage(e.trimStart())}
        returnKeyType="next"
        containerStyle={styles.msgView}
      />

    </View>
  );

  // Footer view for chat screen with typing indicator and reply message spacing
  const renderFooter = () => {
    return (
      <View style={{ paddingBottom: 5 }}>
        {isTyping && (
          <View style={styles.typeView}>
            <TypingIndicator />
          </View>
        )}
        {replyMsg && <View style={{ paddingBottom: 35 }} />}
      </View>
    );
  };

  // Function to handle scroll event of the chat list
  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    if (offsetY > 100) {
      setShowScrollToBottom(true);
    } else {
      setShowScrollToBottom(false);
    }
  };

  // Function to scroll to the bottom of the chat list when new messages are sent or received
  const scrollToBottom = () => {
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  // Below code is for swipe gesture to go back to previous screen
  const translateX = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onUpdate(e => {
      if (e.translationX < 0) {
        translateX.value = Math.max(e.translationX, -100);
      }
    })
    .onEnd(e => {
      translateX.value = withSpring(0);
      if (e.translationX > 150) {
        runOnJS(navigation.goBack)();
      }
    });

  const flatMessages = Object.keys(groupedChats).reduce((acc, dateLabel) => {
    acc.push({ type: 'date', label: dateLabel });
    groupedChats[dateLabel].forEach(msg => acc.push({ ...msg, type: 'msg' }));
    return acc;
  }, []);

  const ChatFreeCount = () => (
    <View style={styles.counContainer}>
      {/* Progress Bar */}
      <Text style={styles.pText}>{msgLimit?.message}</Text>
      <View style={styles.progressBarContainer}>
        <View
          style={[
            styles.progressBar,
            { width: `${msgLimit?.used * 100 / msgLimit?.limit}%` },
            msgLimit?.used > 16 && { backgroundColor: 'red' },
          ]}
        />
      </View>
    </View>
  )

  const dataUpdate = () => {
    socket.emit('get_chats', {
      userId: profileId,
      roomId: roomId,
      page: page || 1,
      pageSize: 20
    });
  };

  return (
    <SafeAreaView
      testID="chatScreen"
      style={styles.safeViewCss}
      accessibilityLabel='Chat screen of single ai profile'
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        keyboardVerticalOffset={9}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >

        {planDetailsVisible &&
          <PlanDetailsModal
            visible={planDetailsVisible}
            planId={planId}
            onClose={() => setPlanDetailsVisible(false)}
            onUpgrade={() => { setPlanDetailsVisible(false); setPostModalVisible(false); }}
          />
        }

        {postModalVisible &&
          <PostUnlockModal
            visible={postModalVisible}
            dataDetails={dataDetails}
            planType={'Photo'}
            onClose={() => setPostModalVisible(false)}
            onSelect={(e: any) => { setPlanId(e); setPlanDetailsVisible(true) }}
            onUpgrade={() => { setPostModalVisible(false); dataUpdate(); }}
          />
        }

        <GestureHandlerRootView style={{ flex: 1 }}>
          <StatusBar
            animated={true}
            backgroundColor="#FFF8F9"
            barStyle="dark-content"
          />

          <View style={styles.mainContainer}>

            {/* --------------- Header view ------------- */}
            {headerCodeView()}

            {/* -----------Ai Mood Image and progress bar ----------- */}
            {moodShow && (
              // <TouchableOpacity
              //   activeOpacity={1}
              //   onPress={() => setMoodShow(false)}
              //   style={{ height: '100%', width: '100%', backgroundColor: 'rgba(255,255,255,0)' }}
              // >
              <View style={styles.moodViewCss}>
                <ImageBackground
                  source={
                    chatMood?.aiMoodImage
                      ? { uri: chatMood?.aiMoodImage }
                      : IMAGES.demo3
                  }
                  style={[styles.card]}
                  imageStyle={{ borderRadius: 10, resizeMode: 'stretch' }}>
                  <LinearGradient
                    colors={['rgba(0, 0, 0, 0.5)', 'rgba(220, 20, 60, 1)']}
                    style={styles.overlay}
                  />
                  <View style={styles.borderView}>
                    <Text style={styles.textCss}>{chatMood?.aiMood}</Text>
                  </View>
                </ImageBackground>
                {/* AI mood progrss bar */}
                <ProgressIndicator progress={chatMood} />
                {/* Limit count progress bar */}
                {msgLimit && <ChatFreeCount />}
              </View>
              // </TouchableOpacity>
            )}

            <View style={{ flex: 1, paddingTop: 10, }}>
              {/* -----------no chat message----------- */}
              {chatmessages?.length == 0 ? (
                <GestureDetector gesture={panGesture}>
                  <View style={{ flex: 1 }}>
                    <View style={styles.blankMsg}>
                      <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                        <Image
                          source={IMAGES.lock}
                          style={styles.lockIcon}
                        />
                        <Text style={styles.blankText}>
                          {t('Messages are encrypted no one')}
                        </Text>
                      </View>
                      <Text style={styles.blankText}>
                        {' '}
                        {t('outside of this chat not even Luvo can read them')}.
                      </Text>
                    </View>
                  </View>
                </GestureDetector>
              ) : (
                <GestureDetector gesture={panGesture}>
                  <FlatList
                    ref={flatListRef}
                    inverted
                    bounces={false}
                    data={flatMessages.reverse() || []}
                    extraData={Object.keys(groupedChats)}
                    renderItem={({ item }) =>
                      item.type === 'date' ? (
                        <Text style={styles.dateHeader}>{item.label}</Text>
                      ) : (
                        <ChatMessageItem
                          item={item}
                          profileId={profileId}
                          onReply={(e: any) => {
                            setReplyMsg(e);
                            setTimeout(() => {
                              inputRef.current?.focus();
                            }, 300);
                          }}
                          globalSwipe={translateX}
                          onReplyPress={onReplyPress}   // For highlight reply msg
                          highlightedId={highlightedId} // For highlight reply msg
                          openModal={(item: any) => {
                            if (item?.meta?.isLocked) {
                              dataDetails = item; setPostModalVisible(true)
                            } else {
                              media_Type = 'image';
                              setSelectedImage(item?.mediaUrl);
                              setImageShow(true);
                            }
                          }}
                        />
                      )
                    }
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(_, index) => `chat${index}`}
                    keyboardShouldPersistTaps="handled"
                    automaticallyAdjustKeyboardInsets={true}
                    decelerationRate={'fast'}
                    initialNumToRender={1000}
                    removeClippedSubviews={true}
                    ListHeaderComponent={renderFooter}
                    contentContainerStyle={styles.chatContainer}
                    scrollEventThrottle={16}
                    onEndReachedThreshold={0.3}
                    maxToRenderPerBatch={20} // Render messages in small batches
                    windowSize={10} // Keep only 5 screens worth of messages in memory
                    onScroll={handleScroll}
                    onEndReached={() => {
                      if (hasMore && !isLoadingRef.current) {
                        let val = page + 1
                        setPage(val);
                        setTimeout(() => { getChats(roomId, val); }, 300)
                      }
                    }}
                    ListFooterComponent={
                      hasMore ? (
                        <View style={{ paddingVertical: 3, width: '100%', alignItems: 'center' }}>
                          <ActivityIndicator size="large" color={'#d2d2d2'} />
                        </View>
                      ) : null
                    }
                  />
                </GestureDetector>
              )}
            </View>

            {/* Scroll to bottom icon for scroll chat */}
            {showScrollToBottom && (
              <TouchableOpacity
                style={styles.timerView}
                onPress={() => scrollToBottom()}>
                <Image
                  source={IMAGES.dropIcon}
                  style={styles.scrollIcon}
                />
              </TouchableOpacity>
            )}

            {/* bottom input box view */}
            {renderBottomView()}

          </View>

          {/* -----------Image Full View Modal--------- */}
          <Modal
            animationType={'fade'}
            visible={imageShow}
            transparent
            onRequestClose={() => {
              setImageShow(false);
            }}>
            <SafeAreaView style={{ flex: 1 }}>
              <View style={{ backgroundColor: 'rgba(0,0,0,0.9)', height: '100%' }}>
                <TouchableOpacity
                  onPress={() => { setImageShow(!imageShow); }}
                  resizeMode="contain"
                  style={styles.crossView2}>
                  <Image source={IMAGES.crossIcon} style={styles.crossImage2} />
                </TouchableOpacity>
                {media_Type == 'video' ? (
                  <View
                    style={[
                      styles.videoContainer,
                      { backgroundColor: 'Transparent' },
                    ]}>
                    <Video
                      source={{ uri: selectedImage }}
                      style={{ height: 250, width: '100%' }}
                      resizeMode="contain"
                      controls={true}
                      playInBackground={false}
                      // paused={!isPlaying}
                      controlsStyles={{
                        hideNext: true,
                        hidePrevious: true,
                        hidePlayPause: false,
                        hideForward: false,
                        hideRewind: false,
                        hideSeekBar: false,
                        hideDuration: false,
                        hideNavigationBarOnFullScreenMode: true,
                        hideNotificationBarOnFullScreenMode: true,
                        hideSettingButton: true,
                      }}
                    />
                  </View>
                ) : (
                  <Image
                    source={{ uri: selectedImage }}
                    resizeMode="contain"
                    style={{
                      marginTop: 10,
                      width: '99%',
                      height: '90%',
                      alignSelf: 'center',
                    }}
                  />
                )}
              </View>
            </SafeAreaView>
          </Modal>

          {/* -------------Plan Modal View----------- */}
          <Modal
            animationType="none"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}>
            <View style={styles.planModalContainer}>
              <View style={styles.modalView}>
                <Image
                  source={msgType == 'update' ? IMAGES.lockPlan : IMAGES.sad}
                  style={styles.lockCss}
                />

                <Text style={styles.unlckText}>{msgTitle?.title}</Text>
                <Text style={styles.detailsText}>{msgTitle?.message}</Text>
                {/* <Text style={styles.detailsText}><Text style={styles.boldText}>Upgrade your plan </Text>To continue chatting instantly or wait 24 hours to send more messages.</Text> */}

                <View style={styles.rowViewModal}>
                  <TouchableOpacity
                    style={styles.cirView}
                    onPress={() => { setModalVisible(false); navigation.navigate('SubscriptionScreen' as never) }}>
                    <Text style={styles.planText}>View Plans</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.cirView, { backgroundColor: '#fff', borderWidth: 1 }]}
                    onPress={() => {
                      setModalVisible(false);
                      if (selectType) {
                        setMsgType(null);
                        setSelectType('');
                      }
                    }}>
                    <Text style={[styles.planText, { color: '#000' }]}>Cancel</Text>
                  </TouchableOpacity>
                </View>

              </View>
            </View>
          </Modal>

        </GestureHandlerRootView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );

};
export default ChatScreen;

const styles = StyleSheet.create({
  safeViewCss: {
    flex: 1,
    backgroundColor: '#FFF8F9',
  },
  mainContainer: {
    flex: 1,
    backgroundColor: '#FFF8F9',
  },
  container: {
    width: '100%',
    flexDirection: 'row',
    backgroundColor: '#FFF8F9',
  },
  chatContainer: {
    flexGrow: 1,
    paddingTop: 110,
    paddingBottom: 10,
    paddingHorizontal: 1,
  },
  leftImg: {
    width: '14%',
    paddingLeft: 15,
    justifyContent: 'center',
  },
  headerRow: {
    width: '80%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  chatView: {
    height: 46,
    width: 46,
    borderRadius: 46 / 2,
    alignItems: 'center',
    overflow: 'hidden',
    justifyContent: 'center',
    alignSelf: 'center'
  },
  profileCss: {
    height: '100%',
    width: '100%',
    resizeMode: 'cover',
    backgroundColor: '#d2d2d2',
  },
  nameTitle: {
    top: 2,
    color: '#022150',
    fontSize: normalize(14.5),
    textTransform: 'capitalize',
    fontFamily: 'Poppins-SemiBold',
  },
  headerTitle: {
    top: -2,
    color: '#838383',
    fontSize: normalize(11.5),
    fontFamily: 'Poppins-Medium',
    textTransform: 'capitalize',
  },
  callIcon: {
    height: 25,
    width: 25,
    marginLeft: 10,
    resizeMode: 'contain'
  },
  callHeaderView: {
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  horizontalLine: {
    height: 1,
    width: '90%',
    marginTop: 12,
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
  },
  typeView: {
    padding: 1,
    marginLeft: 5,
    marginTop: 15,
    alignSelf: 'flex-start',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    backgroundColor: 'rgba(220, 20, 60, 1)',
  },
  dateHeader: {
    paddingTop: 15,
    color: '#BCBCBC',
    textAlign: 'center',
    fontWeight: 'bold',
    fontFamily: 'Poppins-Medium',
  },
  smsText: {
    color: '#000',
    fontSize: normalize(11.5),
    fontFamily: 'Poppins-Medium',
    // textTransform: 'capitalize'
  },
  textInputField: {
    minHeight: 55,
    width: '100%',
    paddingLeft: 5,
    borderColor: 'transparent',
    alignSelf: 'center',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  txtStyle: {
    fontSize: normalize(12.5),
    fontFamily: 'Poppins-Regular',
    alignContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    color: '#000',
    paddingVertical: 2
  },
  attachImage: {
    height: 28,
    width: 28,
    top: -1,
    resizeMode: 'contain',
  },
  bottomViewBorder: {
    bottom: 0,
    width: '100%',
    position: 'absolute',
    paddingBottom: 6,
    paddingTop: 12,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    alignItems: 'center',
    borderColor: '#E4E1E1',
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30
  },
  replyView: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  replyTextView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  countText: {
    alignSelf: 'flex-start',
    paddingVertical: 2,
    fontSize: normalize(13.5),
    color: 'rgba(220, 20, 60, 1)',
    fontFamily: 'Poppins-SemiBold',
  },
  leftText: {
    fontSize: normalize(12),
    fontFamily: 'Poppins-Medium',
  },
  replyText: {
    width: 'auto',
    maxWidth: '70%',
    color: '#000',
  },
  closeIcon: {
    height: 20,
    width: 20,
    resizeMode: 'contain',
  },
  msgView: {
    minHeight: 55,
    width: '100%',
    borderWidth: 1,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 248, 249, 1)',
    borderColor: 'rgba(220, 20, 60, 0.5)',
  },
  timerView: {
    position: 'absolute',
    bottom: 120,
    right: 10,
    padding: 12,
    borderRadius: 20,
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
    backgroundColor: '#d2d2d2',
  },
  scrollIcon: {
    height: 16,
    width: 16,
    resizeMode: 'contain'
  },

  // ======>> Model CSS

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
  videoContainer: {
    height: 200,
    width: '100%',
    borderRadius: 10,
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: '50%',
  },
  //Card
  card: {
    width: 180,
    height: 88,
    margin: 10,
    marginLeft: 15,
    borderRadius: 10,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 10,
  },
  moodViewCss: {
    width: '90%',
    paddingBottom: 10,
    borderRadius: 10,
    alignSelf: 'center',
    backgroundColor: '#fff',
    // iOS shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    // Android shadow
    elevation: 10,
    // Important: allows shadow to appear outside
    overflow: 'visible',
  },
  borderView: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderStyle: 'dashed', // Creates a dotted/dashed border
    borderRadius: 10, // Adjust for rounded corners
    alignItems: 'center',
    justifyContent: 'center',
    margin: 20,
    padding: 10,
    height: 70,
    width: '88%',
  },
  textCss: {
    fontSize: normalize(14),
    fontWeight: 'bold',
    color: '#FFF2F4',
    textAlign: 'center',
    position: 'absolute',
    paddingHorizontal: 10,
    textTransform: 'capitalize',
  },
  blankMsg: {
    padding: 20,
    width: '90%',
    marginTop: 10,
    borderRadius: 10,
    alignSelf: 'center',
    backgroundColor: '#FFF2F5',
    justifyContent: 'center',
  },
  blankText: {
    fontSize: normalize(12.5),
    color: '#838383',
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
  },
  lockIcon: {
    height: 15,
    width: 15,
    marginRight: 7,
    resizeMode: 'contain',
  },
  //Call modal
  overlay2: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  modalContainer: {
    backgroundColor: '#FFF8F9',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 25,
  },
  title: {
    fontWeight: '600',
    marginBottom: 12,
    color: '#000',
    textAlign: 'center',
    fontSize: normalize(16),
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  optionText: {
    marginLeft: 15,
    color: '#000',
    fontWeight: '600',
    fontSize: normalize(13.5),
  },
  cancelBtn: {
    marginTop: 10,
    alignItems: 'center',
    paddingVertical: 12,
  },
  cancelText: {
    color: '#d00',
    fontWeight: '600',
    fontSize: normalize(14),
  },
  //Plan modal
  planModalContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },
  modalView: {
    width: '90%',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: '#FFF8F9',
  },
  lockCss: {
    height: 54,
    width: 54,
    resizeMode: 'contain'
  },
  unlckText: {
    fontSize: normalize(16),
    color: '#000',
    textAlign: 'center',
    fontWeight: '600',
    marginVertical: 12,
  },
  boldText: {
    color: '#000',
    fontFamily: 'Poppins-SemiBold',
  },
  detailsText: {
    fontSize: normalize(13),
    color: '#000',
    textAlign: 'center',
    marginBottom: 10,
    marginHorizontal: 25,
    fontFamily: 'Poppins-Regular',
  },
  rowViewModal: {
    width: '100%',
    marginTop: 10,
    marginBottom: 5,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  cirView: {
    height: 42,
    width: '42%',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(220, 20, 60, 1)',
  },
  planText: {
    top: 1.5,
    color: '#fff',
    fontSize: normalize(15),
    fontFamily: 'Poppins-Medium',
  },
  //Plan Progress
  counContainer: {
    marginTop: 10,
    borderRadius: 16,
    padding: 15,
    width: '90%',
    alignSelf: 'center',
    backgroundColor: '#FFE7EC',
  },
  pText: {
    paddingBottom: 3,
    color: '#022150',
    fontSize: normalize(10),
    fontFamily: 'Poppins-Medium',
  },
  progressBarContainer: {
    height: 8,
    width: '100%',
    borderRadius: 5,
    overflow: 'hidden',
    backgroundColor: '#E5E5E5',
  },
  progressBar: {
    height: '100%',
    borderRadius: 5,
    backgroundColor: '#FF6A00',
  },
});


