import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import { RootState } from '../Store/store';
import { StyleSheet } from 'react-native';
;


import {
  ChatScreen,
  Onboarding,
  ProfileDetails,
  PostDetails,
  VideoDetails,
  DrawerNavigator
  , NotificationScreen,
  Splash,
  Login,
  Register,
  Forgot,
  ResetPassword,
  Verification,
  Preference,
  PlanBenefits,
  EditProfile
}
  from '../../Constants/screens'
import Password from '../Screens/ChangePassword/Password';
const Stack = createNativeStackNavigator();

const Navigator = () => {
  const { isLoggedIn, loading, onboardingSeen, hascompletedPreference } =
    useSelector((state: RootState) => state.auth);

  if (loading) {
    return <Splash />;
  }

  //   return (
  //     <Stack.Navigator screenOptions={{ headerShown: false }}>
  //       {!onboardingSeen ? (
  //         <Stack.Screen name="Onboarding" component={Onboarding} />
  //       ) : !isLoggedIn ? (
  //         <Stack.Group>
  //           <Stack.Screen name="Login" component={Login} />
  //           <Stack.Screen name="Register" component={Register} />
  //           <Stack.Screen name="Forgot" component={Forgot} />
  //           <Stack.Screen name="Verification" component={Verification} />
  //           <Stack.Screen name="ResetPassword" component={ResetPassword} />
  //         </Stack.Group>
  //       ) : (
  //         <Stack.Group>
  //           <Stack.Screen name="MyTabs" component={DrawerNavigator} />
  //           <Stack.Screen name="Preference" component={Preference} />
  //           {/* <Stack.Screen name="DrawerNavigator" component={DrawerNavigator}/> */}
  //           {/* <Stack.Screen name="Favorites" component={Fav} /> */}
  //           <Stack.Screen name="NotificationScreen" component={NotificationScreen} />
  //           <Stack.Screen name="MyProfile" component={MyProfile} />
  //           <Stack.Screen name="MS" component={MS} />
  //           <Stack.Screen name="Refer" component={Refer}/>
  //           <Stack.Screen name="ProfileDetails" component={ProfileDetails} options={{headerShown:true,title:'Profile Details',headerTitleStyle:{fontFamily:'Poppins-Medium', fontSize:16},headerStyle:{backgroundColor:'#fff1f4'},headerTitleAlign:'center'}}/>
  //           <Stack.Screen name="Posts" component={Posts} options={{headerShown:true,title:'Posts', headerTitleStyle:{fontFamily:'Poppins-SemiBold', fontSize:16},headerStyle:{backgroundColor:'#fff1f4'},headerTitleAlign:'center'}} />
  //        <Stack.Screen name="VideoDetails" component={VideoDetails} />
  //        </Stack.Group>
  //       )}
  //     </Stack.Navigator>
  //   );
  // };

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!onboardingSeen ? (
        <Stack.Screen name="Onboarding" component={Onboarding} />
      ) : !isLoggedIn ? (
        <Stack.Group>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen name="Forgot" component={Forgot} />
          <Stack.Screen name="Verification" component={Verification} />
          <Stack.Screen name="ResetPassword" component={ResetPassword} />
        </Stack.Group>
      ) : isLoggedIn && !hascompletedPreference ? (
        <Stack.Group>
          <Stack.Screen name="Preference" component={Preference} />
        </Stack.Group>
      ) : (
        <Stack.Group>
          <Stack.Screen name="MainApp" component={DrawerNavigator} />
          <Stack.Screen name="Notification" component={NotificationScreen} />
          <Stack.Screen name="ProfileDetails" component={ProfileDetails} />
          <Stack.Screen name="Posts" component={PostDetails} />
          <Stack.Screen name="VideoDetails" component={VideoDetails} />
          <Stack.Screen name="ChatScreen" component={ChatScreen} />
          <Stack.Screen name='PlanBenefits' component={PlanBenefits} />
          <Stack.Screen name='EditProfile' component={EditProfile} />
          <Stack.Screen name='Password' component={Password} />
        </Stack.Group>
      )}
    </Stack.Navigator>
  );
};

const style = StyleSheet.create({
  header: {
    fontFamily: 'Poppins-Medium',
  },
});

export default Navigator;
