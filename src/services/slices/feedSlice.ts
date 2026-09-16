import { getFeedsApi } from "@api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { TOrdersData } from "@utils-types";
import type { RootState } from "../store";

export const getFeedsThunk = createAsyncThunk(
  'feeds/getFeeds',
  () => getFeedsApi()
)

type FeedsState = TOrdersData & { 
  isLoading: boolean,
  error: string | null
}

const initialState: FeedsState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isLoading: false,
  error: null
}

const feedsSlice = createSlice({
  name: 'feeds',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getFeedsThunk.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    })
    builder.addCase(getFeedsThunk.fulfilled, (state, action) => {
      state.orders = action.payload.orders;
      state.total = action.payload.total;
      state.totalToday = action.payload.totalToday;

      state.isLoading = false;
      state.error = null;
    })
    builder.addCase(getFeedsThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || 'Произошла ошибка';
    })
  }
})

export const selectFeedsOrders = (state: RootState) => 
  state.feeds.orders

export const selectFeedsTotal = (state: RootState) => 
  state.feeds.total

export const selectFeedsTotalToday = (state: RootState) => 
  state.feeds.totalToday

export const selectFeedsIsLoading = (state: RootState) => 
  state.feeds.isLoading

export const selectFeedsError = (state: RootState) => 
  state.feeds.error

export default feedsSlice.reducer;