import { createSlice } from '@reduxjs/toolkit';
import { UserState } from '@/types/store_modules/user.ts';

const initState: UserState = {
  userInfo: {},
  accessToken: ''
}

export const userSlice = createSlice({
  name: 'user',
  initialState: initState,
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
