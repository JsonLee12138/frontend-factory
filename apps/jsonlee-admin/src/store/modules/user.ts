import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    userInfo: {},
    accessToken: '',
  },
  reducers: {
    setUserInfo: (state, action) => {
      state.userInfo = action.payload
    },
    setAccessToken: (state, actions) => {
      state.accessToken = actions.payload
    },
    clearAccessToken: (state) => {
      state.accessToken = ''
    }
  }
})

// Action creators are generated for each case reducer function
export const { setUserInfo, setAccessToken } = userSlice.actions

export default userSlice.reducer
