import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { getOrdersApi } from '@api';
import type { RootState } from '../store';

type ProfileOrderState = {
  orders: TOrder[];
  isLoading: boolean;
  error: string | null;
};

const initialState: ProfileOrderState = {
  orders: [],
  isLoading: false,
  error: null
};

export const profileOrdersThunk = createAsyncThunk('profileOrders/getProfileOrders', () =>
  getOrdersApi()
);

const profileOrderSlice = createSlice({
  name: 'profileOrders',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(profileOrdersThunk.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(profileOrdersThunk.fulfilled, (state, action) => {
      state.orders = action.payload;
      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(profileOrdersThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || 'Произошла ошибка';
    });
  }
});

export const selectProfileOrders = (state: RootState) => state.profileOrders.orders;
export const selectProfileOrdersIsLoading = (state: RootState) => state.profileOrders.isLoading;
export const selectProfileOrdersError = (state: RootState) => state.profileOrders.error;

export default profileOrderSlice.reducer;
