import { orderBurgerApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { RootState } from '../store';

type OrderState = {
  orderRequest: boolean;
  orderModalData: TOrder | null;
  orderError: string | null;
};

const initialState: OrderState = {
  orderRequest: false,
  orderModalData: null,
  orderError: null
};

export const createOrderThunk = createAsyncThunk(
  'order/createOrder',
  (ingredients: string[]) => orderBurgerApi(ingredients)
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    closeModal(state) {
      state.orderModalData = null;
    }
  },
  extraReducers(builder) {
    builder.addCase(createOrderThunk.pending, (state) => {
      state.orderRequest = true;
      state.orderError = null;
    });
    builder.addCase(createOrderThunk.fulfilled, (state, action) => {
      state.orderModalData = {
        ...action.payload.order,
        ingredients: action.meta.arg
      };
      state.orderRequest = false;
      state.orderError = null;
    });
    builder.addCase(createOrderThunk.rejected, (state, action) => {
      state.orderRequest = false;
      state.orderError = action.error.message || 'Ошибка создания заказа';
    });
  }
});

export const selectOrderRequest = (state: RootState) =>
  state.order.orderRequest;

export const selectOrderModalData = (state: RootState) =>
  state.order.orderModalData;

export const selectOrderError = (state: RootState) => state.order.orderError;

export const { closeModal } = orderSlice.actions;

export default orderSlice.reducer;
