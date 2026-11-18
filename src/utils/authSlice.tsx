import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  profileData: {},
  authExpire: '',
  homeData: [],
  notificationCount: '',
  activeChatAIId: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setProfileDetails: (state, action) => {
      state.profileData = action.payload;
    },
    setAuthExpire: (state, action) => {
      state.authExpire = action.payload;
    },
    setHomeData: (state, action) => {
      state.homeData = action.payload;
    },
    setNtyData: (state, action) => {
      state.notificationCount = action.payload;
    },
    setActiveAiId: (state, action) => {
      state.activeChatAIId = action.payload;
    },
    clearRedux: () => initialState, // poora state reset ho jayega
  },
});

export const {
  setProfileDetails,
  setAuthExpire,
  setHomeData,
  setNtyData,
  setActiveAiId,
  clearRedux,
} = authSlice.actions;

export default authSlice.reducer;
