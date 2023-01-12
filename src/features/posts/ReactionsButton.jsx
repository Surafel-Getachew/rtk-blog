import { useDispatch } from 'react-redux';
import { reactionAdd } from './postSlice';

// rtk-query update
import { useAddReactionMutation } from './postSliceQuery';

const reactionEmoji = {
  thumbsup: '👍🏼',
  thumbsdown: '👎🏼',
  heart: '🖤',
  wow: '😲',
  rocket: '🚀',
  coffe: '☕️',
};

const ReactionsButton = ({ post }) => {
  // const dispatch = useDispatch();
  const [addReaction] = useAddReactionMutation();

  const reactionButtons = Object.entries(reactionEmoji).map(([name, emoji]) => {
    return (
      <button
        key={name}
        type='button'
        className='reactionButton'
        onClick={() => {
          // dispatch(reactionAdd({ postId: post.id, reaction: name }));
          // below is rtk-query update
          const newValue = post.reactions[name] + 1;
          addReaction({
            postId: post.id,
            reactions: { ...post.reactions, [name]: newValue },
          });
        }}
      >
        {emoji} {post.reactions[name]}
      </button>
    );
  });
  return <div>{reactionButtons}</div>;
};

export default ReactionsButton;
