// import React from 'react';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import Onboarding from '../Screens/Onboarding';
// import Login from '../Screens/Login';
// import Register from '../Screens/Register';
// import Forgot from '../Screens/Forgot';
// import ResetPassword from '../Screens/ResetPassword';
// import Verification from '../Screens/Verification';

// const Stack = createNativeStackNavigator();

// const AuthStack = ({initialRoute = 'Login'}) => {
//     return(
//         <Stack.Navigator initialRouteName={initialRoute} screenOptions={{headerShown:false}}>
//             {/* <Stack.Screen name="Onboarding" component={Onboarding} /> */}
//             <Stack.Screen name="Login" component={Login} />
//             <Stack.Screen name="Forgot" component={Forgot} />
//             <Stack.Screen name="Register" component={Register} />
//                <Stack.Screen name ="Verification" component={Verification} />
//       <Stack.Screen name ="ResetPassword" component={ResetPassword} />

//         </Stack.Navigator>
//    );
// };

// export default AuthStack