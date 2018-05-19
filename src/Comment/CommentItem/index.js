import React from 'react';

import Link from '../../Link';

import './style.css';

const CommentItem = ({ comment }) => (
  <div className="CommentItem">
    <div className="CommentItem-content">
      <h3>
        <Link href={comment.url}>{comment.title}</Link>
      </h3>
      <div dangerouslySetInnerHTML={{ __html: comment.bodyHTML }} />
    </div>
  </div>
);

export default CommentItem;
