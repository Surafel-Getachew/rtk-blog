// import Counter from './features/counter/Counter';
import { Route, Routes, Navigate } from 'react-router-dom';
import './index.css';
import PostsList from './features/posts/PostsList';
import AddPostForm from './features/posts/AddPostForm';
import Layout from './components/Layout';
import SinglePost from './features/posts/SinglePost';
import EditPostForm from './features/posts/EditPostForm';
import UsersList from './features/users/UsersList';
import UserPage from './features/users/UserPage';

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route index element={<PostsList />} />

        {/* Catch all replace with 404 components */}
        <Route path='*' element={<Navigate to='/' replace />} />

        <Route path='user'>
          <Route index element={<UsersList />}></Route>
          <Route path=':userId' element={<UserPage />}></Route>
        </Route>

        <Route path='post'>
          <Route index element={<AddPostForm />} />
          <Route path=':postId' element={<SinglePost />} />
          <Route path='edit/:postId' element={<EditPostForm />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default App;
