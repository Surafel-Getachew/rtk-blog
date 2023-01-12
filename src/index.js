import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import { store } from './app/store';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { fetchUsers } from './features/users/usersSlice';
import { fetchPosts } from './features/posts/postSlice';

// rtk-query
import { extendedApiSlice } from './features/posts/postSliceQuery';

// store.dispatch(extendedApiSlice.endpoints.getPosts.initiate());
// store.dispatch(fetchPosts());
// store.dispatch(fetchUsers());

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path='/*' element={<App />} />
        </Routes>
      </Router>
    </Provider>
  </React.StrictMode>
);
