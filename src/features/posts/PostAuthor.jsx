import { useSelector } from 'react-redux';
import { selectAllUsers } from '../users/usersSlice';
import { Link } from 'react-router-dom';

// rtk-query update
import { useGetUsersQuery } from '../users/userSliceQuery';

const PostAuthor = ({ userId }) => {
  // const users = useSelector(selectAllUsers);
  // const author = users.find((user) => user.id === userId);

  const { author } = useGetUsersQuery('getUsers', {
    selectFromResult: ({ data }) => ({
      author: data?.entities[userId],
    }),
  });

  return (
    <span>
      by{' '}
      {author ? (
        <Link to={`/user/${userId}`}>{author.name}</Link>
      ) : (
        'Unknown author'
      )}
    </span>
  );
};

export default PostAuthor;
