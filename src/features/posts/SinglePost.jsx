import { Link } from 'react-router-dom';
import { selectPostById, getPostsStatus } from './postSlice';
import { useSelector } from 'react-redux';
import PostAuthor from './PostAuthor';
import ReactionsButton from './ReactionsButton';
import { useParams } from 'react-router-dom';

// rtk-query
import { useGetPostsQuery } from './postSliceQuery';

const SinglePost = () => {
  const { postId } = useParams();

  const { post, isLoading } = useGetPostsQuery('getPosts', {
    selectFromResult: ({ data, isLoading, isError, error }) => ({
      post: data?.entities[postId],
      isLoading,
    }),
  });

  // const post = useSelector((state) => selectPostById(state, Number(postId)));
  // const postStatus = useSelector(getPostsStatus);

  // if (postStatus === 'loading') {
  //   return <p>Loading...</p>;
  // }

  // if (!post) {
  //   return (
  //     <section>
  //       <h2>Post not found!</h2>
  //     </section>
  //   );
  // }

  // rtk-update
  if (isLoading) return <p>Loading...</p>;

  if (!post)
    return (
      <section>
        <h2>Post not found!</h2>
      </section>
    );

  return (
    <article>
      <h3>{post.title}</h3>
      <p>{post.body}</p>
      <p className='postCredit'>
        <Link to={`/post/edit/${postId}`}>Edit Post</Link>
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

export default SinglePost;
