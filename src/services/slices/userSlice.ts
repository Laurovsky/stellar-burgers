import {
  getUserApi,
  loginUserApi,
  refreshToken,
  TLoginData,
  TRegisterData,
  updateUserApi
} from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import type { RootState } from '../store';
import { setCookie } from '../../utils/cookie';

type UserState = {
  user: TUser | null;
  isLoading: boolean;
  isUpdating: boolean;
  refreshToken: string | null;
  accessToken: string | null;
  loadError: string | null;
  updateError: string | null;
  loginError: string | null;
};

const initialState: UserState = {
  user: null,
  isLoading: false,
  isUpdating: false,
  refreshToken: null,
  accessToken: null,
  loadError: null,
  updateError: null,
  loginError: null
};

export const getUserThunk = createAsyncThunk('user/getUser', () =>
  getUserApi()
);

export const updateUserThunk = createAsyncThunk(
  'user/updateUser',
  (user: Partial<TRegisterData>) => updateUserApi(user)
);

export const loginUserThunk = createAsyncThunk(
  'user/loginUser',
  async (data: TLoginData) => {
    const response = await loginUserApi(data);
    setCookie('accessToken', response.accessToken);
    return response;
  }
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
    builder.addCase(loginUserThunk.pending, (state) => {
      state.isLoading = true;
      state.loginError = null;
    });
    builder.addCase(loginUserThunk.fulfilled, (state, action) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isLoading = false;
    });
    builder.addCase(loginUserThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.loginError = action.error.message || 'Ошибка авторизации';
    });
  }
});

export const selectUser = (state: RootState) => state.user.user;

export const selectUserIsLoading = (state: RootState) => state.user.isLoading;

export const selectUserIsUpdating = (state: RootState) => state.user.isUpdating;

export const selectUserError = (state: RootState) => state.user.loadError;

export const selectUpdateUserError = (state: RootState) =>
  state.user.updateError;

export const selectLoginError = (state: RootState) => state.user.loginError;

export default userSlice.reducer;
