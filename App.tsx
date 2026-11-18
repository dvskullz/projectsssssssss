import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar, useColorScheme} from 'react-native';
import { Provider, useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import store from './src/Store/store';
import Navigator from './src/Navigation/Navigator';
import { restoreToken } from './src/Store/authSlice';
import {PaperProvider} from 'react-native-paper';
import { SnackbarProvider } from './src/Components/Snackbar';
import {NotificationSettings, Password, TypingIndicator } from './Constants/screens';
import {UnlockModal,FeedbackModal, UnlockPhoto, PlanModal} from './Constants/screens';
import MyTransaction from './src/Screens/My Transactions/MyTransaction';
import Language from './src/Screens/LanguageSettings/LanguageSetting';
import  Switch from './src/Components/ToggleSwtitch';

const AppContent = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const bootstrap = async () => {
      const accessToken = await AsyncStorage.getItem('accessToken');
      const refreshToken = await AsyncStorage.getItem('refreshToken');
      // const onboardingSeen =(await AsyncStorage.getItem('onboardingSeen')) === 'true';
        const userString =
        (await AsyncStorage.getItem('User')) ??
        (await AsyncStorage.getItem('user'));
        const user = userString ? JSON.parse(userString): null;
        const hascompletedPreferenceString = await AsyncStorage.getItem(
          'hascompletedPreference'
        );
        const hascompletedPreference =
          hascompletedPreferenceString !== null
            ? JSON.parse(hascompletedPreferenceString)
            : undefined;

    dispatch(
    restoreToken({
      accessToken,
      refreshToken,
      user,
      hascompletedPreference,
    })
  );
};
bootstrap();
  }, []);
  return <Navigator />;
};

const App = () => {
const isDarkMode = useColorScheme() === 'dark';
  return (
    
    <Provider store={store}>
    <PaperProvider>
    <SnackbarProvider>
    <NavigationContainer >
    <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
    <AppContent/>
    </NavigationContainer>
    </SnackbarProvider>
    </PaperProvider>
    </Provider>
  
  );
};

export default App;
