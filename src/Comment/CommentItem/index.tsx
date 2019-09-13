import React from 'react';
import './style.css';


interface ICommentProps {
  comment: {
    author: {
      login: string;
    },
    bodyHTML: string;
  };
}

const Comment = ({ comment }: ICommentProps) => (
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
