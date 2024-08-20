import { configureStore } from '@reduxjs/toolkit'
import loadingReducer from '@/store/modules/loading.ts';

export default configureStore({
  reducer: {
    loading: loadingReducer
  }
})
