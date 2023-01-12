import { useSelector } from 'react-redux';
import { selectPostIds, getPostsStatus, getPostsError } from './postSlice';
import PostExcerpt from './PostExcerpt';

// rtk-query
import { useGetPostsQuery } from './postSliceQuery';

const PostsList = () => {
  // rtk-query
  const {
    data: posts,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetPostsQuery('getPosts');

  // const orderedPostIds = useSelector(selectPostIds);
  // const postsStatus = useSelector(getPostsStatus);
  // const error = useSelector(getPostsError);

  let content;

  if (isLoading) {
    // if (postsStatus === 'loading') {
    content = <p>Loading...</p>;
    // } else if (postsStatus === 'succeeded') {
  } else if (isSuccess) {
    // const orderedPosts = posts
    //   .slice()
    //   .sort((a, b) => b.date.localeCompare(a.date));
    // content = orderedPosts.map((post) => <PostExcerpt post={post} />);
    content = posts.ids.map((postId) => (
      <PostExcerpt key={postId} postId={postId} />
    ));
  } else if (isError) {
    // } else if (postsStatus === 'failed') {
    content = <p>{error}</p>;
  }

  return <section>{content}</section>;
};

export default PostsList;
