// // import AsyncStorage from "@react-native-async-storage/async-storage";
// // import refreshTokenApi from './api';
// // import {store} from '../Store/store';
// // import { updateAccessToken, logout } from "../Store/authSlice";

// // export const apiClient = async(
// //     url:string,
// //     options: RequestInit = {}
// // ) => {
// //     const accessToken = store.getState().auth.accessToken;

// //     const response = await fetch(url,{
// //         ...options,
// //         headers:{
// //             ...options.headers,
// //             Authorization:`Bearer ${accessToken}`,
// //             'Content-Type': 'application/json',
// //         },
// //     });

// //     if (response.status === 401){
// //         try{
// //         const refreshToken = await AsyncStorage.getItem('refereshToken');
// //         if(!refreshToken) throw new Error();
        
// //         const refreshRes = await refreshTokenApi(refreshToken);
// //         const newAccessToken = refreshRes.data.token.access.token;

// //         await AsyncStorage.setItem('accessToken', newAccessToken);
// //         store.dispatch(updateAccessToken(newAccessToken));

// //         return fetch(url,{
// //             ...options,
// //             headers:{
// //                 ...options.headers,
// //                 Authorization: `Bearer ${newAccessToken}`,
// //                 'Content-Type' : 'application/json',
// //             },
// //         });
// //     } catch {
// //         await AsyncStorage.multiRemove(['accessToken', 'refreshToken']);
// //         store.dispatch(logout());
// //         throw new Error('Session expired');
// //     }
// // }
// // return Response;
// // };

// import {store} from '../Store/store';
// import { logout } from '../Store/authSlice';
// import {navigationRef} from '../Navigation/NavigationService';
// export const apiClient = async (
//     url:string,
//     options:RequestInit
// )=>{
//     const response = await fetch(url,options);
//     if(response.status === 401){
//         store.dispatch(logout());
//         navigationRef?.current?.reset({
//             index:0,
//             routes:[{ name: 'Login'}],
//         });
//         throw new Error('Session Expired');
//     }
//     const data = await response.json();
//     if(!response.ok) {
//         throw new Error (data.message || 'Something went wrong');
//     }
//     return data;
// }