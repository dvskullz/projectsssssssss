import React, { useEffect, useRef, useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Animated,
  FlatList,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IMAGES } from '../../../Constants/images';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setOnboardingSeen } from '../../Store/authSlice';
import { useDispatch } from 'react-redux';
const { width } = Dimensions.get('window');

const slides = [
  {
    id: 1,
    title: 'Your Perfect Match Is\nJust A Tap Away!',
    image: IMAGES.Onboarding,
    next: IMAGES.Nextbutton1,
  },
  {
    id: 2,
    title: 'Your Next Great Love Story Starts Here!',
    image: IMAGES.Onboarding2,
    next: IMAGES.Nextbutton2,
  },
  {
    id: 3,
    title: 'Let AI Bring Your Love\nStory To Life!',
    image: IMAGES.Onboarding3,
    next: IMAGES.Nextbutton3,
  },
];

const Onboarding = ({ navigation }: any) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatlistRef = useRef<FlatList>(null);
  const buttonAnim = useRef(new Animated.Value(1)).current;
  const slidesEnd = [...slides, { id: 'end' }];
  const dispatch = useDispatch();
  useEffect(() => {
    const checkOnboarding = async () => {
      const seen = await AsyncStorage.getItem('OnboardingSeen');
      if (seen === 'true') {
    finishOnboarding();
      }
    };
    checkOnboarding();
  },[]);

  const finishOnboarding = async () => {
    await AsyncStorage.setItem('OnboardingSeen', 'true');
    dispatch(setOnboardingSeen());
  };

  const handleNext = () => {
    Animated.spring(buttonAnim, {
      toValue: 0.9,
      useNativeDriver: true,
    }).start(() => {
      buttonAnim.setValue(1);
    });
    if (currentIndex < slides.length - 1) {
      flatlistRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      finishOnboarding();
      // navigation.replace('Login');
    }
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        {currentIndex < slides.length - 1 && (
          <TouchableOpacity
            style={styles.skip}
            onPress={finishOnboarding}
          >
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        )}
        <View>
          <Animated.FlatList
            data={slidesEnd}
            ref={flatlistRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => item.id.toString()}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: false },
            )}
            onMomentumScrollEnd={e => {
              const index = Math.round(e.nativeEvent.contentOffset.x / width);
              if (index === slides.length) {
                requestAnimationFrame(() => {
                  finishOnboarding();
                });
                return;
              }
              setCurrentIndex(index);
            }}
            renderItem={({ item, index }) => {
              const inputRange = [
                (index - 1) * width,
                index * width,
                (index + 1) * width,
              ];
              const isLastSlide = currentIndex === slides.length - 1;
              const opacity = scrollX.interpolate({
                inputRange,
                outputRange: isLastSlide ? [1, 1, 1] : [0.2, 1, 0.2],
                extrapolate: 'clamp',
              });

              const scale = scrollX.interpolate({
                inputRange,
                outputRange: [0.95, 1, 0.95],
                extrapolate: 'clamp',
              });
              return (
                <Animated.View style={[styles.imageWrapper, { opacity }]}>
                  <Image source={item.image} style={styles.image} />
                </Animated.View>
              );
            }}
          />
        </View>
        <Text style={[styles.title, currentIndex === 2 && { color: '#FFF' }]}>
          {slides[currentIndex].title}
        </Text>
        <View style={styles.dots}>
          {slides.map((_, index) => {
            const inputRange = [
              (index - 1) * width,
              index * width,
              (index + 1) * width,
            ];
            const dotWidth = scrollX.interpolate({
              inputRange,
              outputRange: [5, 30, 5],
              extrapolate: 'clamp',
            });
            const isLastSlide = currentIndex === slides.length - 1;
            const backgroundColor = scrollX.interpolate({
              inputRange,
              outputRange: isLastSlide
                ? ['#FC7B72', '#ffffff', '#FC7B72']
                : ['#FC7B72', '#dc143c', '#FC7B72'],
              extrapolate: 'clamp',
            });
            return (
              <Animated.View
                key={index}
                style={[
                  styles.dot,
                  {
                    width: dotWidth,
                    backgroundColor,
                  },
                ]}
              />
            );
          })}
        </View>
        <View style={styles.bottom}>
          <Animated.View style={{ transform: [{ scale: buttonAnim }] }}>
            <TouchableOpacity onPress={handleNext}>
              <Image source={slides[currentIndex].next} style={styles.next} />
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  imageWrapper: {
    width,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '108%',
    height: '108%',
    resizeMode: 'contain',
  },
  title: {
    position: 'absolute',
    bottom: 100,
    paddingHorizontal: 20,
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    color: '#000',
  },
  dots: {
    position: 'absolute',
    bottom: 50,
    left: 24,
    flexDirection: 'row',
  },
  dot: {
    height: 4,
    backgroundColor: '#DC143C',
    borderRadius: 2,
    marginRight: 6,
  },
  bottom: {
    position: 'absolute',
    bottom: 20,
    right: 24,
  },
  next: {
    width: 64,
    height: 64,
    resizeMode: 'contain',
  },
  skip: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 10,
  },
  skipText: {
    color: '#DC143C',
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
  },
});

export default Onboarding;
