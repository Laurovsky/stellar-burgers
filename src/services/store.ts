import { combineReducers, configureStore } from '@reduxjs/toolkit';
import ingredientSliceReducer from './slices/ingredientsSlice'
import feedsSliceReducer from './slices/feedSlice'
import orderDetailsReducer from './slices/orderDetailsSlice'

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

const rootReducer = combineReducers({
  ingredients: ingredientSliceReducer,
  feeds: feedsSliceReducer,
  orderDetails: orderDetailsReducer,
});

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
