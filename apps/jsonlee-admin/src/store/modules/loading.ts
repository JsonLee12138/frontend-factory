import { createSlice } from '@reduxjs/toolkit';
import { LoadingState } from '@/types/store_modules/loading.ts';

const initState: LoadingState = {
  loading: true
}
export const loadingSlice = createSlice({
  name: 'loading',
  initialState: initState,
  reducers: {
    setLoading: state => {
      state.loading = true
    },
    clearLoading: state => {
      state.loading = false
    }
  }
})

// Action creators are generated for each case reducer function
export const { setLoading, clearLoading } = loadingSlice.actions

export default loadingSlice.reducer
