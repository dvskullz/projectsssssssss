// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const api = axios.create({
//     baseURL: 'https://luvo-api.apikart.co/v1/user/auth/login',
//     });

//     api.interceptors.request.use(async config=>{
//         const token = await AsyncStorage.getItem('accessToken');
//         if(token){
//             config.headers.Authorization = `Bearer ${token}`

//         }
//         return config;
//     });

//     export default api;




// import axios from 'axios';

// const axiosInstance = axios.create({
//     baseURL: 'https://luvo-api.apikart.co/v1/user/auth/login',
//     timeout:15000,
// });

// export default axiosInstance ;