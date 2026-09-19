import { getUserApi, TRegisterData, updateUserApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import type { RootState } from '../store';

type UserState = {
  user: TUser | null;
  isLoading: boolean;
  isUpdating: boolean;
  loadError: string | null;
  updateError: string | null;
};

const initialState: UserState = {
  user: null,
  isLoading: false,
  isUpdating: false,
  loadError: null,
  updateError: null
};

export const getUserThunk = createAsyncThunk('user/getUser', () =>
  getUserApi()
);

export const updateUserThunk = createAsyncThunk(
  'user/updateUser',
  (user: Partial<TRegisterData>) => updateUserApi(user)
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(getUserThunk.pending, (state) => {
      state.isLoading = true;
      state.loadError = null;
    });
    builder.addCase(getUserThunk.fulfilled, (state, action) => {
      state.user = action.payload.user;
      state.isLoading = false;
      state.loadError = null;
    });
    builder.addCase(getUserThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.loadError = action.error.message || 'Произошла ошибка';
    });
    builder.addCase(updateUserThunk.pending, (state) => {
      state.isUpdating = true;
      state.updateError = null;
    });
    builder.addCase(updateUserThunk.fulfilled, (state, action) => {
      state.user = action.payload.user;
      state.isUpdating = false;
      state.updateError = null;
    });
    builder.addCase(updateUserThunk.rejected, (state, action) => {
      state.isUpdating = false;
      state.updateError = action.error.message || 'Не удалось обновить профиль';
    });
  }
});

export const selectUser = (state: RootState) => state.user.user;

export const selectUserIsLoading = (state: RootState) => state.user.isLoading;

export const selectUserIsUpdating = (state: RootState) => state.user.isUpdating;

export const selectUserError = (state: RootState) => state.user.loadError;

export const selectUpdateUserError = (state: RootState) => state.user.updateError;

export default userSlice.reducer;
