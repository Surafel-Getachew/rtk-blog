import { Link } from 'react-router-dom';
import PostAuthor from './PostAuthor';
import ReactionsButton from './ReactionsButton';
import React from 'react';
import { useSelector } from 'react-redux';
import { selectPostById } from './postSlice';

// rtk-query
import { useGetPostsQuery } from './postSliceQuery';

const PostExcerpt = ({ postId }) => {
  // const post = useSelector((state) => selectPostById(state, postId));
  
  // update to rtk-query
  const { post } = useGetPostsQuery('getPosts', {
    selectFromResult: ({ data }) => ({
      post: data?.entities[postId],
    }),
  });
  return (
    <article>
      <h3>{post.title}</h3>
      <p className='excerpt'>{post.body.substring(0, 75)}</p>
      <p className='postCredit'>
        <Link to={`/post/${post.id}`}>View Post</Link>
        <PostAuthor userId={post.userId} />
        <span>
          {' '}
          &nbsp; <i>{post.date ? post.date : '-- -- --'}</i>
        </span>
      </p>
      <ReactionsButton post={post} />
    </article>
  );
};

export default React.memo(PostExcerpt);
// export default React.memo(PostExcerpt); // this allows the component to no re-reder if the props (post) doesn't change
