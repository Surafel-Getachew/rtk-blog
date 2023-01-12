import {
  createSlice,
  nanoid,
  createAsyncThunk,
  createSelector,
  createEntityAdapter,
} from '@reduxjs/toolkit';
import moment from 'moment';
import axios from 'axios';

const POSTS_URL = 'https://jsonplaceholder.typicode.com/posts';

const postAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.date.localeCompare(a.date),
});

const initialState = postAdapter.getInitialState({
  status: 'idle', // "idle","loading",error,"succeded"
  error: null,
  count: 0,
});

// const initialState = {
//   posts: [],
//   status: 'idle', // "idle","loading",error,"succeded"
//   error: null,
//   count: 0,
// };

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  const res = await axios.get(POSTS_URL);
  return res.data;
});

export const addNewPost = createAsyncThunk(
  'posts/addNewPost',
  async (initialPost) => {
    const res = await axios.post(POSTS_URL, initialPost);
    return res.data;
  }
);

export const updatePost = createAsyncThunk(
  'posts/updatePost',
  async (initialPost) => {
    const { id } = initialPost;
    const res = await axios.put(`${POSTS_URL}/${id}`, initialPost);
    return res.data;
  }
);

export const deletePost = createAsyncThunk(
  'posts/deletePost',
  async (initialPost) => {
    const { id } = initialPost;
    try {
      const res = await axios.delete(`${POSTS_URL}/${id}`);
      if (res?.status === 200) return initialPost;
      return `${res.status}: ${res.statusText}`;
    } catch (error) {
      return error.message;
    }
  }
);

const postSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    addPost: {
      reducer(state, action) {
        state.posts.push(action.payload);
      },
      prepare(title, content, userId) {
        return {
          payload: {
            id: nanoid(),
            title,
            content,
            userId,
            date: moment().fromNow(),
            reactions: {
              thumbsup: 0,
              wow: 0,
              heart: 0,
              rocket: 0,
              coffe: 0,
              thumbsdown: 0,
            },
          },
        };
      },
    },
    reactionAdd(state, action) {
      const { postId, reaction } = action.payload;
      // const existingPost = state.posts.find((post) => postId === post.id);
      const existingPost = state.entities[postId];
      if (existingPost) {
        existingPost.reactions[reaction] += 1;
      }
    },
    increaseCount(state, action) {
      state.count += 1;
    },
  },
  extraReducers(build) {
    build.addCase(fetchPosts.pending, (state, action) => {
      state.status = 'loading';
    });
    build.addCase(fetchPosts.fulfilled, (state, action) => {
      state.status = 'succeeded';
      const loadedPosts = action.payload.map((post) => {
        post.date = moment('2022-12-28 12:00:00').fromNow();
        post.reactions = {
          thumbsup: 0,
          thumbsdown: 0,
          wow: 0,
          heart: 0,
          rocket: 0,
          coffe: 0,
        };
        return post;
      });
      // Add any fetched posts to the array
      // state.posts = state.posts.concat(loadedPosts);
      postAdapter.upsertMany(state, loadedPosts);
    });
    build.addCase(fetchPosts.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.error.message;
    });
    build.addCase(addNewPost.fulfilled, (state, action) => {
      action.payload.userId = Number(action.payload.userId);
      action.payload.date = moment(new Date()).fromNow();
      action.payload.reactions = {
        thumbsup: 0,
        thumbsdown: 0,
        wow: 0,
        heart: 0,
        rocket: 0,
        coffe: 0,
      };
      // state.posts.push(action.payload);
      postAdapter.addOne(state, action.payload);
    });
    build.addCase(updatePost.fulfilled, (state, action) => {
      if (!action.payload?.id) {
        console.log('Update could not be complete');
        console.log(action.payload);
        return;
      }
      // const { id } = action.payload;
      action.payload.date = moment(new Date()).fromNow();
      // const posts = state.posts.filter((post) => post.id !== id);
      // state.posts = [...posts, action.payload];
      postAdapter.upsertOne(state, action.payload);
    });
    build.addCase(deletePost.fulfilled, (state, action) => {
      if (!action.payload?.id) {
        console.log('Delete could not be completed');
        console.log(action.payload);
        return;
      }
      const { id } = action.payload;
      // const posts = state.posts.filter((post) => post.id !== id);
      // state.posts = posts;
      postAdapter.removeOne(state, id);
    });
  },
});

// export const selectAllPost = (state) => state.posts.posts;
// export const selectPostById = (state, postId) =>
//   state.posts.posts.find((post) => post.id === postId);

export const {
  selectAll: selectAllPost,
  selectById: selectPostById,
  selectIds: selectPostIds,
  // pass in a selector that returns the posts slice of state
} = postAdapter.getSelectors((state) => state.posts);

export const getPostsStatus = (state) => state.posts.status;
export const getPostsError = (state) => state.posts.error;

export const selectPostByUser = createSelector(
  [selectAllPost, (state, userId) => userId],
  (posts, userId) => posts.filter((post) => post.userId === userId)
);

export const getCount = (state) => state.posts.count;
export const { addPost, increaseCount, reactionAdd } = postSlice.actions;
export default postSlice.reducer;
