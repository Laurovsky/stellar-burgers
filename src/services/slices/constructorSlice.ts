import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TConstructorIngredient, TIngredient } from "@utils-types"
import type { RootState } from "../store";

type ConstructorState = {
    bun: TIngredient | null;
    ingredients: TConstructorIngredient[];
};

const initialState: ConstructorState = {
    bun: null,
    ingredients: [],
};

export const constructorSlice = createSlice({
    name: 'constructor',
    initialState,
    reducers: {
        setBun(state, action: PayloadAction<TIngredient>) {
            state.bun = action.payload
        },
        addIngredients(state, action: PayloadAction<TConstructorIngredient>) {
            state.ingredients.push(action.payload)
        },
    },
})

export const selectBun = (state: RootState) =>
    state.constructor.bun
export const selectConstructorIngredients = (state: RootState) =>
    state.constructor.ingredients

export const { setBun, addIngredients } = constructorSlice.actions;
export default constructorSlice.reducer

