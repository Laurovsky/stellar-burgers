import { getOrderByNumberApi } from "@api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { TOrder } from "@utils-types";
import type { RootState } from "../store";

export const getOrderByNumberThunk = createAsyncThunk(
  'orderDetails/getOrderByNumber',
  (number: number) => getOrderByNumberApi(number)
)

type OrderDetailState = { 
  order: TOrder | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: OrderDetailState = {
  order: null,
  isLoading: false,
  error: null
}

const orderDetailsSlice = createSlice({
  name: 'orderDetails',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(getOrderByNumberThunk.pending, (state) => {
      state.order = null;
      state.isLoading = true;
      state.error = null;
    })
    builder.addCase(getOrderByNumberThunk.fulfilled, (state, action) => {
      state.order = action.payload.orders[0] ?? null;
      state.isLoading = false;
      state.error = null;
    })
    builder.addCase(getOrderByNumberThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || 'Произошла ошибка';
    })
  },
})

export const selectOrderDetail = (state: RootState) =>
  state.orderDetails.order

export const selectOrderDetailIsLoading = (state: RootState) =>
  state.orderDetails.isLoading

export const selectOrderDetailError = (state: RootState) =>
  state.orderDetails.error

export default orderDetailsSlice.reducer;