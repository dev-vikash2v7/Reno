
import {  combineReducers, configureStore } from '@reduxjs/toolkit';
import orderReducer from './reducers/order.reducer';
import restaurentReducer from './reducers/restaurent.reducer';
import userReducer from './reducers/user.reducer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistStore, persistReducer } from 'redux-persist';
// import { PersistPartial } from 'redux-persist/es/persistReducer';
// import storage from 'redux-persist/lib/storage';


const rootReducer =  combineReducers({
    order : orderReducer,
    restaurent : restaurentReducer,
    user : userReducer
});

// const rootReducer = (state, action) => {
//   if (action.type === 'LOGOUT') {
//       // for all keys defined in your persistConfig(s)
//       storage.removeItem('persist:root')
//       // storage.removeItem('persist:otherKey')

//       return appReducer(undefined, action);
//   }
//   return appReducer(state, action);
// };


// const persistConfig = {
//   key: 'root',
//   storage: AsyncStorage,
//   // whitelist: ['user'], // Array of reducer keys to persist
// };

// // Wrap the root reducer with persistReducer

// const persistedReducer = persistReducer(persistConfig, rootReducer);

// // Create the Redux store with persisted reducer

export const ReduxStore = configureStore({
  reducer: rootReducer,

  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    immutableCheck: false,
    serializableCheck: false,
  })
});


// Persist the store

export type RootState = ReturnType<typeof ReduxStore.getState>;
// export const persistor = persistStore(ReduxStore);
export default  ReduxStore;