import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  users: [],
  status: 'idle',
  error: 'null',
};

const USERS_URL = 'https://jsonplaceholder.typicode.com/users';

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  const res = await axios.get(USERS_URL);
  return res.data;
});

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    addUser: () => {},
  },
  extraReducers(build) {
    build.addCase(fetchUsers.pending, (state, action) => {
      state.status = 'loading';
    });
    build.addCase(fetchUsers.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.users = action.payload;
    });
    build.addCase(fetchUsers.rejected, (state, action) => {
      state.error = action.error.message;
    });
  },
});

export default usersSlice.reducer;
export const selectUserById = (state, userId) =>
  state.users.users.filter((user) => user.id === userId);
export const selectAllUsers = (state) => state.users.users;
export const getUsersStatus = (state) => state.users.status;
export const getUsersError = (state) => state.users.error;
export const { addUser } = usersSlice.actions;
