// import React, { createContext, useEffect, useState } from 'react';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// type AuthContextType = {
//   isLoading: boolean;
//   userToken: string | null;
//   login: (token: string, refreshToken: string) => Promise<void>;
//   logout: () => Promise<void>;
// };

// export const AuthContext = createContext<AuthContextType>({
//   isLoading: true,
//   userToken: null,
//   login: async () => {},
//   logout: async () => {},
// });

// export const AuthProvider = ({ children }: any) => {
//   const [isLoading, setIsLoading] = useState(true);
//   const [userToken, setUserToken] = useState<string | null>(null);

//   useEffect(() => {
//     const bootstrap = async () => {
//       try {
//         const token = await AsyncStorage.getItem('userToken');
//         const refreshToken = await AsyncStorage.getItem('refreshToken');
        
//         if (token && refreshToken) {
//           setUserToken(token);
//         }
//       } catch (e) {
//         console.log('Restore token failed', e);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     bootstrap();
//   }, []);

//   const login = async (token: string, refreshToken: string) => {
//     console.log('login called from auth');
//     await AsyncStorage.setItem('userToken', token);
//     await AsyncStorage.setItem('refreshToken', refreshToken);
//     setUserToken(token);
//   };

//   const logout = async () => {
//     await AsyncStorage.removeItem('userToken');
//     await AsyncStorage.removeItem('refreshToken');
//     setUserToken(null);
//   };

//   return (
//     <AuthContext.Provider value={{ isLoading, userToken, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
