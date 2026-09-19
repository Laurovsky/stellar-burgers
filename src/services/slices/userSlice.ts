import { getUserApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import type { RootState } from '../store';

type UserState = {
  user: TUser | null;
  isLoading: boolean;
  error: string | null;
};

const initialState: UserState = {
  user: null,
  isLoading: false,
  error: null
};

export const getUserThunk = createAsyncThunk('user/getUser', () =>
  getUserApi()
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(getUserThunk.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getUserThunk.fulfilled, (state, action) => {
      state.user = action.payload.user;
      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(getUserThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || 'Произошла ошибка';
    });
  }
});

export const selectUser = (state: RootState) => state.user.user;

export const selectUserIsLoading = (state: RootState) => state.user.isLoading;

export const selectUserError = (state: RootState) => state.user.error;

export default userSlice.reducer;
