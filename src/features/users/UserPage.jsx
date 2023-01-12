import { useSelector } from 'react-redux';
import { selectUserById } from '../users/usersSlice';
import { selectPostByUser } from '../posts/postSlice';
import { Link, useParams } from 'react-router-dom';

// rtk-query
import { useGetPostByUserIdQuery } from '../posts/postSliceQuery';
import { useGetUsersQuery } from './userSliceQuery';

const UserPage = () => {
  const { userId } = useParams();
  // const user = useSelector((state) => selectUserById(state, Number(userId)));

  // update to rtk query
  const { user } = useGetUsersQuery('getUser', {
    selectFromResult: ({ data }) => ({
      user: data?.entities[userId],
    }),
  });

  // const postsForUser = useSelector((state) =>
  //   selectPostByUser(state, Number(userId))
  // );

  // update to rtk-query
  const {
    data: postsForUser,
    isLoading,
    isError,
    error,
    isSuccess,
  } = useGetPostByUserIdQuery(userId);

  // const postTitles = postsForUser.map((post) => (
  //   <li key={post.id}>
  //     <Link to={`/post/${post.id}`}>{post.title}</Link>
  //   </li>
  // ));

  let content;

  if (isLoading) {
    content = <p>Loading...</p>;
  } else if (isSuccess) {
    const { ids, entities } = postsForUser;

    content = ids.map((id) => (
      <li key={id}>
        <Link to={`/post/${id}`}>{entities[id].title}</Link>
      </li>
    ));
  } else if (isError) {
    content = <p>{error}</p>;
  }

  return (
    <section>
      <h2>{user?.name}</h2>

      {/* <ol>{postTitles}</ol> */}
      {/* below is update to rtk-query */}
      <ol>{content}</ol>
    </section>
  );
};

export default UserPage;
