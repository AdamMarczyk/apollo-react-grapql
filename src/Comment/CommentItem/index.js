import React from 'react';

import './style.css';

const Comment = ({ comment }) => (
  <div className="CommentItem">
    {comment.author
      ? <div>{comment.author.login}:</div>
      : <div>Deleted user</div>
    }
    &nbsp;
    <div dangerouslySetInnerHTML={{ __html: comment.bodyHTML }} />
  </div>
);

export default Comment;
