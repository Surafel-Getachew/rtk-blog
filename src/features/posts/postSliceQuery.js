import { nanoid, createSelector, createEntityAdapter } from '@reduxjs/toolkit';
import moment from 'moment';
import { apiSlice } from '../api/apiSlice';

const postAdapter = createEntityAdapter({
  // sortComparer: (a, b) => b.date.localeCompare(a.date),
});

const initialState = postAdapter.getInitialState();

export const extendedApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPosts: builder.query({
      query: () => '/posts',
      transformResponse: (responseData) => {
        const loadedPosts = responseData.map((post) => {
          if (!post?.date) {
            post.date = moment(new Date()).fromNow();
          }
          if (!post?.reactions) {
            post.reactions = {
              thumbsup: 0,
              wow: 0,
              heart: 0,
              rocket: 0,
              coffe: 0,
              thumbsdown: 0,
            };
          }
          return post;
        });
        return postAdapter.setAll(initialState, loadedPosts);
      },
      providesTags: (result, error, arg) => [
        { type: 'Post', id: 'LIST' },
        ...result.ids.map((id) => ({ type: 'Post', id })),
      ],
    }),
    getPostByUserId: builder.query({
      query: (userId) => `/posts/?userId=${userId}`,
      transformResponse: (responseData) => {
        const loadedPosts = responseData.map((post) => {
          if (!post?.date) {
            post.data = moment(new Date()).fromNow();
          }
          if (!post?.reactions) {
            post.reactions = {
              thumbsup: 0,
              wow: 0,
              heart: 0,
              rocket: 0,
              coffe: 0,
              thumbsdown: 0,
            };
          }
          return post;
        });
        return postAdapter.setAll(initialState, loadedPosts);
      },
      providesTags: (result, error, arg) => [
        ...result.ids.map((id) => ({ type: 'Post', id })),
      ],
    }),
    addNewPost: builder.mutation({
      query: (initialPost) => ({
        url: '/posts',
        method: 'POST',
        body: {
          ...initialPost,
          userId: Number(initialPost.userId),
          date: moment(new Date()).fromNow(),
          // date: new Date().toISOString(),
          reactions: {
            thumbsup: 0,
            wow: 0,
            heart: 0,
            rocket: 0,
            coffe: 0,
            thumbsdown: 0,
          },
        },
      }),
      invalidatesTags: [{ type: 'Post', id: 'LIST' }],
    }),
    updatePost: builder.mutation({
      query: (initialPost) => ({
        url: `/posts/${initialPost.id}`,
        method: 'PUT',
        body: {
          ...initialPost,
          // date: new Date().toISOString(),
          date: moment(new Date()).fromNow(),
        },
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Post', id: arg.id }],
    }),
    deletePost: builder.mutation({
      query: ({ id }) => ({
        url: `/posts/${id}`,
        method: 'DELETE',
        body: { id },
      }),
      invalidatesTags: (result, error, args) => [{ type: 'Post', id: args.id }],
    }),
    addReaction: builder.mutation({
      query: ({ postId, reactions }) => ({
        url: `posts/${postId}`,
        method: 'PATCH',
        // In a real app, we'd probably need to base this on user ID somehow
        // so that a user can't do the same reaction more than once
        body: { reactions },
      }),
      async onQueryStarted(
        { postId, reactions },
        { dispatch, queryFulfilled }
      ) {
        // `updateQueryData` requires the endpoint name and cache key arguments,
        // so it knows which piece of cache state to update
        const patchResult = dispatch(
          // updateQueryData takes three arguments: the name of the endpoint to update, the same cache key value used to identify the specific cached data, and a callback that updates the cached data.
          extendedApiSlice.util.updateQueryData(
            'getPosts',
            'getPosts',
            (draft) => {
              // The `draft` is Immer-wrapped and can be "mutated" like in createSlice
              const post = draft.entities[postId];
              if (post) post.reactions = reactions;
            }
          )
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
  }),
});

export const {
  useGetPostsQuery,
  useGetPostByUserIdQuery,
  useAddNewPostMutation,
  useDeletePostMutation,
  useUpdatePostMutation,
  useAddReactionMutation,
} = extendedApiSlice;

// returns the query result object
export const selectPostResult = extendedApiSlice.endpoints.getPosts.select();

// Creates memoized selector
const selectPostsData = createSelector(
  selectPostResult,
  (postResult) => postResult.data // normalized state object with ids and entites
);

export const {
  selectAll: selectAllPost,
  selectById: selectPostById,
  selectIds: selectPostIds,
  // pass in a selector that returns the posts slice of state
} = postAdapter.getSelectors((state) => selectPostsData(state) ?? initialState);
