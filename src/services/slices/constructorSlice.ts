import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient } from '@utils-types';
import type { RootState } from '../store';
import { createOrderThunk } from './orderSlice';

type ConstructorState = {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[];
};

const initialState: ConstructorState = {
  bun: null,
  ingredients: []
};

export const constructorSlice = createSlice({
  name: 'constructor',
  initialState,
  reducers: {
    setBun(state, action: PayloadAction<TIngredient>) {
      state.bun = action.payload;
    },
    addIngredients(state, action: PayloadAction<TConstructorIngredient>) {
      state.ingredients.push(action.payload);
    },
    removeIngredient(state, action: PayloadAction<string>) {
      state.ingredients = state.ingredients.filter(
        (item) => item.id !== action.payload
      );
    },
    moveIngredientUp(state, action: PayloadAction<number>) {
      const index = action.payload;

      if (index === 0) return;

      const previousIngredient = state.ingredients[index - 1];
      state.ingredients[index - 1] = state.ingredients[index];
      state.ingredients[index] = previousIngredient;
    },
    moveIngredientDown(state, action: PayloadAction<number>) {
      const index = action.payload;

      if (index === state.ingredients.length - 1) return;

      const previousIngredient = state.ingredients[index + 1];
      state.ingredients[index + 1] = state.ingredients[index];
      state.ingredients[index] = previousIngredient;
    }
  },
  extraReducers(builder) {
    builder.addCase(createOrderThunk.fulfilled, (state) => {
      state.bun = null;
      state.ingredients = [];
    });
  }
});

export const selectBun = (state: RootState) => state.burgerConstructor.bun;
export const selectConstructorIngredients = (state: RootState) =>
  state.burgerConstructor.ingredients;

export const {
  setBun,
  addIngredients,
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown
} = constructorSlice.actions;
export default constructorSlice.reducer;
