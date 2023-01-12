import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addNewPost } from './postSlice';
import {
  selectAllUsers,
  getUsersError,
  getUsersStatus,
  fetchUsers,
} from '../users/usersSlice';
import { useNavigate } from 'react-router-dom';

// rtk-query
import { useAddNewPostMutation } from './postSliceQuery';
import { useGetUsersQuery } from '../users/userSliceQuery';

const AddPostForm = () => {
  const dispatch = useDispatch();

  const [addNewPost, { isLoading }] = useAddNewPostMutation();

  const navigate = useNavigate();

  // const users = useSelector(selectAllUsers);
  // const usersStatus = useSelector(getUsersStatus);
  // const error = useSelector(getUsersError);

  const { users, isSuccess, isUserLoading, isError, error } = useGetUsersQuery(
    'getUser',
    {
      selectFromResult: ({ data, isLoading, isSuccess, isError }) => ({
        users: data,
        isUserLoading: isLoading,
        isError: isError,
        isSuccess,
      }),
    }
  );

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [userId, setUserId] = useState('');
  // const [addRequestStatus, setAddRequestStatus] = useState('idle');

  const onTitleChanged = (e) => setTitle(e.target.value);
  const onContentChanged = (e) => setContent(e.target.value);
  const onAuthorChanged = (e) => setUserId(e.target.value);

  const canSave =
    // [title, content, userId].every(Boolean) && addRequestStatus === 'idle';
    // below for rtk-query
    [title, content, userId].every(Boolean) && !isLoading;

  const onAddPost = async () => {
    if (canSave) {
      try {
        // setAddRequestStatus('pending');
        // dispatch(addNewPost({ title, userId, body: content })).unwrap();

        await addNewPost({ title, body: content, userId }).unwrap();

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

  // useEffect(() => {
  //   if (usersStatus === 'idle') {
  //     dispatch(fetchUsers());
  //   }
  // }, [usersStatus, dispatch]);

  let userOptions;

  // if (usersStatus === 'loading') {
  //   userOptions = <option>Loading...</option>;
  // } else if (usersStatus === 'failed') {
  //   userOptions = <option>{error}</option>;
  // } else if (usersStatus === 'succeeded') {
  //   userOptions = users.map((user) => (
  //     <option key={user.id} value={user.id}>
  //       {user.name}
  //     </option>
  //   ));
  // }

  // rtk-update
  if (isUserLoading) {
    userOptions = <option>Loading...</option>;
  } else if (isError) {
    userOptions = <option>{error}</option>;
  } else if (isSuccess) {
    // userOptions = users.map((user) => (
    //   <option key={user.id} value={user.id}>
    //     {user.name}
    //   </option>
    // ));
    // rtk-update
    userOptions = users.ids.map((userId) => (
      <option key={userId} value={userId}>
        {users?.entities[userId].name}
      </option>
    ));
  }

  return (
    <section>
      <h2>Add a New Post</h2>
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
          {userOptions}
        </select>
        <label htmlFor='postContent'>Content:</label>
        <textarea
          id='postContent'
          name='postContent'
          value={content}
          onChange={onContentChanged}
        />
        <button onClick={onAddPost} type='button' disabled={!canSave}>
          Save Post
        </button>
      </form>
    </section>
  );
};

export default AddPostForm;
