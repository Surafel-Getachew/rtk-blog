import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { selectPostById } from './postSlice';
import { selectAllUsers } from '../users/usersSlice';
// import { updatePost, deletePost } from './postSlice';

// for rtk-query
import { useUpdatePostMutation, useDeletePostMutation } from './postSliceQuery';
import { useGetPostsQuery } from './postSliceQuery';
import { useGetUsersQuery } from '../users/userSliceQuery';

const EditPostForm = () => {
  const { postId } = useParams();
  const navigate = useNavigate();

  const [updatePost, { isLoading }] = useUpdatePostMutation();
  const [deletePost] = useDeletePostMutation();

  // const post = useSelector((state) => selectPostById(state, Number(postId)));
  // const users = useSelector(selectAllUsers);
  // rtk-query update

  const { users } = useGetUsersQuery('getUsers', {
    selectFromResult: ({ data }) => ({
      users: data,
    }),
  });

  // rtk-query
  const {
    post,
    isLoading: isLoadingPosts,
    isSuccess,
  } = useGetPostsQuery('getPosts', {
    selectFromResult: ({ data, isLoading, isSuccess }) => ({
      post: data?.entities[postId],
      isLoading,
      isSuccess,
    }),
  });

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [userId, setUserId] = useState('');
  // const [addRequestStatus, setAddRequestStatus] = useState('idle');

  // rtk-update

  useEffect(() => {
    if (isSuccess) {
      setTitle(post.title);
      setContent(post.body);
      setUserId(post.userId);
    }
  }, [isSuccess, post?.title, post?.body, post?.userId]);

  const dispatch = useDispatch();

  if (!post) {
    return (
      <section>
        <h2>Post not found! </h2>
      </section>
    );
  }

  const onTitleChanged = (e) => setTitle(e.target.value);
  const onContentChanged = (e) => setContent(e.target.value);
  const onAuthorChanged = (e) => setUserId(Number(e.target.value));

  const canSave =
    // [title, content, userId].every(Boolean) && addRequestStatus === 'idle';
    // below for rtk-query
    [title, content, userId].every(Boolean) && !isLoading;

  const onEditPost = async () => {
    if (canSave) {
      try {
        // setAddRequestStatus('pending');
        // dispatch(
        //   updatePost({
        //     id: postId,
        //     title,
        //     userId,
        //     body: content,
        //     reactions: post.reactions,
        //   })
        // ).unwrap();

        await updatePost({
          id: post.id,
          title,
          body: content,
          userId,
        }).unwrap();

        setTitle('');
        setContent('');
        setUserId('');
        navigate(`/post/${postId}`);
      } catch (error) {
        console.log('Failed to save the post', error);
      } finally {
        // setAddRequestStatus('idle');
      }
    }
  };
  const onDeletePost = async () => {
    if (canSave) {
      try {
        // setAddRequestStatus('pending');
        // unwrap helps with allowing to use try catch
        // dispatch(
        //   deletePost({
        //     id: Number(postId),
        //   })
        // ).unwrap();

        // below is an update for using rtk-query
        await deletePost({ id: post.id }).unwrap();

        setTitle('');
        setContent('');
        setUserId('');
        navigate('/');
      } catch (error) {
        console.log('Failed to save the post', error);
      } finally {
        // setAddRequestStatus('idle');
      }
    }
  };
  // const usersOption = users.map((user) => (
  //   <option key={user.id} value={user.id}>
  //     {user.name}
  //   </option>
  // ));
  // update rtk-query
  const usersOption = users.ids.map((userId) => (
    <option key={userId} value={userId}>
      {users?.entities[userId].name}
    </option>
  ));
  return (
    <section>
      <h2>Edit Post</h2>
      <form>
        <label htmlFor='postTitle'>Post Title:</label>
        <input
          type='text'
          id='postTitle'
          name='postTitle'
          value={title}
          onChange={onTitleChanged}
        />
        <label htmlFor='postAuthor'>Author:</label>
        <select id='postAuthor' value={userId} onChange={onAuthorChanged}>
          <option value=''></option>
          {usersOption}
        </select>
        <label htmlFor='postContent'>Content:</label>
        <textarea
          id='postContent'
          name='postContent'
          value={content}
          onChange={onContentChanged}
        />
        <button onClick={onEditPost} type='button' disabled={!canSave}>
          Edit Post
        </button>
        <button
          className='deleteButton'
          onClick={onDeletePost}
          type='button'
          disabled={!canSave}
        >
          Delete Post
        </button>
      </form>
    </section>
  );
};

export default EditPostForm;
