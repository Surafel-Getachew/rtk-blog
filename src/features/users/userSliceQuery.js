import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from '@reduxjs/toolkit';

import { apiSlice } from '../api/apiSlice';

const userAdapter = createEntityAdapter({});

const initialState = userAdapter.getInitialState();

export const extendedApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => '/users',
      transformResponse: (responseData) => {
        return userAdapter.setAll(initialState, responseData);
      },
      providesTags: (result, error, arg) => [
        ...result.ids.map((id) => ({ type: 'User', id })),
      ],
    }),
  }),
});

export const { useGetUsersQuery } = extendedApiSlice;

// const usersSlice = createSlice({
//   name: 'users',
//   initialState,
//   reducers: {
//     addUser: () => {},
//   },
//   extraReducers(build) {
//     build.addCase(fetchUsers.pending, (state, action) => {
//       state.status = 'loading';
//     });
//     build.addCase(fetchUsers.fulfilled, (state, action) => {
//       state.status = 'succeeded';
//       state.users = action.payload;
//     });
//     build.addCase(fetchUsers.rejected, (state, action) => {
//       state.error = action.error.message;
//     });
//   },
// });
