import { combineReducers, configureStore } from '@reduxjs/toolkit'
import authSlice from './slice/authSlice.js'
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import postSlice from './slice/postSlice.js'
import socketSlice from './slice/socketSlice.js'
import chatSlice from './slice/chatSlice.js'
import rtnSlice from './slice/rtnSlice.js'


const persistConfig = {
  key: 'root',
  version: 1,
  storage,
}

const rootReducer = combineReducers({
  auth:authSlice,
  post:postSlice,
  socketio:socketSlice,
  chat:chatSlice,
  realTimeNotification: rtnSlice
  
})

const persistedReducer = persistReducer(persistConfig, rootReducer)


export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

export default store