import { combineReducers, configureStore, Tuple } from '@reduxjs/toolkit';
import loadingReducer from '@/store/modules/loading.ts';
import userReducer from './modules/user.ts';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import encrypt from './persistTransforms/encrypt.ts';
import stateReconciler from './stateReconciler.ts';
import menuReducer from './modules/menu.ts';

const rootReducer = combineReducers({
  loading: loadingReducer,
  user: userReducer,
  menu: menuReducer,
});

const persistConfig = {
  key: import.meta.env.VITE_PERSIST_CACHE_KEY,
  whitelist: ['user'],
  storage,
  transforms: [encrypt<typeof rootReducer>()],
  stateReconciler,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    new Tuple(...getDefaultMiddleware({ serializableCheck: false })),
});

export const storeUseType = configureStore({
  reducer: rootReducer,
});

export const persistor = persistStore(store);

export default store;
