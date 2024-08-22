import { combineReducers, configureStore, Tuple } from '@reduxjs/toolkit';
import loadingReducer from '@/store/modules/loading.ts';
import userReducer from './modules/user.ts';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'
import encrypt from './persistTransforms/encrypt.ts';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';

const persistConfig = {
  key: 'root',
  whitelist: ['user'],
  storage,
  transforms: [encrypt],
  stateReconciler: autoMergeLevel2,
}

const rootReducer = combineReducers({
  loading: loadingReducer,
  user: userReducer,
})

const persistedReducer = persistReducer(persistConfig, rootReducer as any)

const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware => new Tuple(...getDefaultMiddleware({serializableCheck: false}))
});

export const persistor = persistStore(store);

export default store;
