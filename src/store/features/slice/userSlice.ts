import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { ProfileProps, RegisterDataProps } from 'src/services/types';
import { getProfile, registration } from 'src/store/api';
import { RootStore } from 'src/store/store';

export interface StateType {
  access: string;
  isLoading: boolean;
  error: string | null | unknown;
  loggedIn: boolean;
  profile: ProfileProps | null;
  loading: boolean;
  isProfileOpen: boolean;
}

const initialState: StateType = {
  access: '',
  isLoading: false,
  error: null,
  loggedIn: false,
  profile: null,
  loading: false,
  isProfileOpen: true,
};

export const fetchRegisterUser = createAsyncThunk(
  'fetch/user',
  async ({ email, password }: RegisterDataProps) => {
    const response = await registration({ email, password });
    return response;
  }
);
export const fetchGetProfile = createAsyncThunk('fetch/profile', async () => {
  const response = await getProfile();
  return response;
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setLoggedIn(state, action) {
      state.access = action.payload;
      state.loggedIn = true;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setIsProfileOpen(state, action) {
      state.isProfileOpen = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRegisterUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchRegisterUser.fulfilled, (state, action) => {
        state.access = action.payload.access;
        state.error = null;
        state.loggedIn = true;
      })
      .addCase(fetchRegisterUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(fetchGetProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchGetProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(fetchGetProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export const { setLoggedIn, setLoading, setIsProfileOpen } = userSlice.actions;
export const userReducer = userSlice.reducer;
export const selectUsers = (state: RootStore) => state.user;
