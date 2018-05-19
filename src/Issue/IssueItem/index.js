import React from 'react';
import { withState } from 'recompose';

import Comments from '../../Comment';
import Link from '../../Link';
import { ButtonUnobtrusive } from '../../Button';

import './style.css';

const IssueItem = ({ issue }) => (
  <div className="IssueItem">
    <ButtonUnobtrusive
      onClick={() =>
        onToggleComments()
      }
    >
      Show/Hide Comments
    </ButtonUnobtrusive>

    <div className="IssueItem-content">
      <h3>
        <Link href={issue.url}>{issue.title}</Link>
      </h3>
      <div dangerouslySetInnerHTML={{ __html: issue.bodyHTML }} />

      <Comments />
    </div>
  </div>
);

export default withState(
  'showComments',
  'onToggleComments',
  false
)(IssueItem);
