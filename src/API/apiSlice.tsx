// // // import { createAsyncThunk } from '@reduxjs/toolkit';
// // import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
// // import { setCredentials, logOut } from '../Store/authSlice';

// // const baseQuery = fetchBaseQuery({
// //     baseUrl: 'https://luvo-api.apikart.co/v1/user/auth/login',
// //     credentials:'include',
// //     prepareHeaders:(headers,{getState}) =>{
// //         const token = getState().auth.token
// //         if(token){
// //             headers.set
// //         }
// //     }
// // })


// import {createApi} from '@reduxjs/toolkit/query/react';
// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const axiosBaseQuery = 
// () =>
//      async({url, method, data}:any)=>{
//         try{
//             const token = await AsyncStorage.getItem('accessToken');
//             var headers = {'Content-Type: 'application/json'};
//             const result = await axios({
//                 url:'https://luvo-api.apikart.co/v1/user/auth/login'
//             })
//         }
//      }