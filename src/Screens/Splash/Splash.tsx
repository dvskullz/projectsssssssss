import React, { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IMAGES } from '../../../Constants/images';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { restoreToken,setOnboardingSeen } from '../../Store/authSlice';
const Splash = () => {
  const dispatch = useDispatch<any>();

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const onboardingSeen = await AsyncStorage.getItem('OnboardingSeen');
        const accessToken = await AsyncStorage.getItem('accessToken');
        const refreshToken = await AsyncStorage.getItem('refreshToken');
        const userString = await AsyncStorage.getItem('User');
        const user = userString ? JSON.parse(userString) : null;

    if (onboardingSeen === 'true') {
      dispatch(setOnboardingSeen());
    }

    if (accessToken && refreshToken) {
      dispatch(
        restoreToken({
          accessToken,
          refreshToken,
          user,
        })
      );
    }
  } catch (e) {
    console.log('Splash bootstrap error:', e);
  }
};
bootstrap();
  });

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <Image source={IMAGES.Logo} style={styles.logo} resizeMode="contain" />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DC143C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 220,
    height: 220,
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    color: '#fff',
    fontWeight: '700',
    letterSpacing: 1,
    fontFamily: 'Poppins-Bold',
  },
});

export default Splash;
