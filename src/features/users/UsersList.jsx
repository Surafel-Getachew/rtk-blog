import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { selectAllUsers } from './usersSlice';

// rtk-query update
import { useGetUsersQuery } from './userSliceQuery';

const UsersList = () => {
  // const users = useSelector(selectAllUsers);

  // rtk-query update
  const {
    data: users,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetUsersQuery('getUsers');

  let content;

  if (isLoading) {
    content = <p>Loading...</p>;
  } else if (isError) {
    content = <p>{error}</p>;
  } else if (isSuccess) {
    content = (
      // <ul>
      //   {users.map((user) => (
      //     <li key={user.id}>
      //       <Link to={`/user/${user.id}`}>{user.name}</Link>
      //     </li>
      //   ))}
      // </ul>
      // update rtk-query
      <ul>
        {users.ids.map((userId) => (
          <li key={userId}>
            <Link to={`/user/${userId}`}>{users?.entities[userId].name}</Link>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <section>
      <h2>Users</h2>
      <div>{content}</div>
    </section>
  );
};

export default UsersList;
