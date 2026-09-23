import { getIngredientsApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';
import type { RootState } from '../store';

export const getIngredientsThunk = createAsyncThunk(
  'ingredients/getIngredients',
  () => getIngredientsApi()
);

type IngredientsState = {
  ingredients: TIngredient[];
  isLoading: boolean;
  error: string | null;
};

const initialState: IngredientsState = {
  ingredients: [],
  isLoading: false,
  error: null
};

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getIngredientsThunk.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getIngredientsThunk.fulfilled, (state, action) => {
      state.ingredients = action.payload;
      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(getIngredientsThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || 'Произошла ошибка';
    });
  }
});

export const selectIngredients = (state: RootState) =>
  state.ingredients.ingredients;

export const selectIngredientsLoading = (state: RootState) =>
  state.ingredients.isLoading;

export const selectIngredientsError = (state: RootState) =>
  state.ingredients.error;

export default ingredientsSlice.reducer;
