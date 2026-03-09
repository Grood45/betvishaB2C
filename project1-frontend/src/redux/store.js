import { combineReducers, compose } from 'redux';
import { configureStore } from "@reduxjs/toolkit";
// Remove thunk
import themeReducer from './reducer';
import { websiteReducer } from './switch-web/reducer';
import { authReducer } from './auth-redux/reducer';
import persistStore from 'redux-persist/es/persistStore';
import storage from "redux-persist/lib/storage";
import persistReducer from 'redux-persist/es/persistReducer';
import {
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'

// Combine reducers
const rootReducer = combineReducers({
  theme: themeReducer,
  website: websiteReducer,
  auth: authReducer
});
// Compose enhancers
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const persistConfig = {
  key: 'rootData',
  storage,
}
// Create Redux store without middleware
const persistedReducer = persistReducer(persistConfig,rootReducer);
const store = configureStore({reducer : persistedReducer, middleware: (getDefaultMiddleware) =>
  getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
    },
  }),});
export const persistor = persistStore(store)

export default store;
