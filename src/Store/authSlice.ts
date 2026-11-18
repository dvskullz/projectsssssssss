import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginApi, registerApi,verifyOtpApi } from '../API/auth';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  loading: boolean;
  isLoggedIn: boolean;
  onboardingSeen: boolean;
  user:any|null;
  hascompletedPreference: boolean;
}

 const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  loading: true, 
  isLoggedIn: false,
  onboardingSeen: false,
  user:null,
  hascompletedPreference:false,
};

export const loginThunk = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }) => {
    const res = await loginApi(email, password);
    return {
      accessToken: res.data.tokens.access.token,
      refreshToken: res.data.tokens.refresh.token,
      user:res.data.user,
    };
  }
);


export const VerifyOtpThunk =  createAsyncThunk(
  'auth/verify-email-otp',
  async( {id,otp}: {id: string, otp: string},
    thunkAPI) =>
    {
      try{
        const res = await verifyOtpApi({
          id,
          otp,
          otpType:"email",
        });

        // console.log('FULL OTP RESPONE', res.data);
        return {
          accessToken:res.data.tokens.access.token,
          refreshToken:res.data.tokens.refresh.token,
          user:res.data.user,
        };
      }catch(err:any){
        return thunkAPI.rejectWithValue(err.message);
      }
    }
);

export const registerThunk = createAsyncThunk(
  'auth/register',
  async(
    payload:{
    name:string;
    email:string;
    password:string;
    phone:string;
    confirmPassword:string;
    gender:string;
    dob:string;
    fcmToken:string;
  },
  thunkAPI
  )=>{
    const res = await registerApi(payload);
    // console.log('register payload:', payload);
    // console.log('Register api response', res);
    // const accessToken = res.tokens.access.token;
    // const refreshToken = res.tokens.refresh.token;  
    // console.log('AT:', accessToken);
    // console.log('RT:', res.statusCode);
    return{
      id:res.data.id,
      statusCode:res.statusCode,
      Message: res.message
      // refreshToken:res.tokens.refresh.token,
      // accessToken:res.tokens.access.token,
    };
  }
);



const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    restoreToken: (
      state,
      action: PayloadAction<{
        accessToken: string | null;
        refreshToken: string | null;
        user:any| null;
        hascompletedPreference?: boolean;
      }>
    ) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    //   state.onboardingSeen = action.payload.onboardingSeen;
      state.user=action.payload.user;
      state.hascompletedPreference =
        action.payload.hascompletedPreference ?? !!action.payload.accessToken;
      state.isLoggedIn = !!action.payload.accessToken;
      state.loading = false; 
    },
    setHasCompletedPreference:(state,action) =>{
      state.hascompletedPreference = action.payload;
      AsyncStorage.setItem(
        'hascompletedPreference',
        JSON.stringify(action.payload)
      );
    },

setOnboardingSeen: (state) => {
  state.onboardingSeen = true;
  AsyncStorage.setItem('onboardingSeen', 'true');
},
setLoggedIn: (
  state) => {
  state.isLoggedIn = true;
  state.loading = false;
},

logout: (state) => {
  state.accessToken = null;
  state.refreshToken = null;
  state.isLoggedIn = false;
  state.user= null;
  state.hascompletedPreference = false;
  AsyncStorage.multiRemove([
    'accessToken',
    'refreshToken',
    'User',
    'user',
    'hascompletedPreference',
  ]);
},
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.user=action.payload.user;
        state.isLoggedIn = true;
        state.hascompletedPreference = true;

    AsyncStorage.setItem('accessToken', action.payload.accessToken);
    AsyncStorage.setItem('refreshToken', action.payload.refreshToken);
    AsyncStorage.setItem('User', JSON.stringify(action.payload.user));
    AsyncStorage.setItem('hascompletedPreference', JSON.stringify(true));

  })
  .addCase(loginThunk.rejected, (state) => {
    state.loading = false;
  })
  .addCase(registerThunk.pending, (state) =>{
    // state.loading = true;
  })
  .addCase(registerThunk.fulfilled,(state,action)=>{
    state.loading = false;
    // console.log('Redux register fulfilled', action.payload);
    // state.accessToken= action.payload.accessToken;
    // state.refreshToken = action.payload.refreshToken;
    // state.isLoggedIn = true;
    //  AsyncStorage.setItem('accessToken', action.payload.accessToken);
    // AsyncStorage.setItem('refreshToken', action.payload.refreshToken);
  })
  .addCase(registerThunk.rejected,(state)=>{
    state.loading=false;
  })
  .addCase(VerifyOtpThunk.fulfilled,(state,action)=>{
    state.accessToken = action.payload.accessToken;
    state.refreshToken=action.payload.refreshToken;
    state.user = action.payload.user;
    state.isLoggedIn=true;
    state.hascompletedPreference = false;
    state.loading=false;

    AsyncStorage.setItem('accessToken', action.payload.accessToken);
    AsyncStorage.setItem('refreshToken', action.payload.refreshToken);
    AsyncStorage.setItem('User', JSON.stringify(action.payload.user));
    AsyncStorage.setItem('hascompletedPreference', JSON.stringify(false));
  })

  },
});

export const {
  restoreToken,
  setOnboardingSeen,
  setLoggedIn,
  logout,
  setHasCompletedPreference
} = authSlice.actions;

export default authSlice.reducer;
