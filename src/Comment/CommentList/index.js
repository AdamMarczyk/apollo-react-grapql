import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import CommentItem from '../CommentItem';
import Loading from '../../Loading';
import ErrorMessage from '../../Error';
import { ButtonUnobtrusive } from '../../Button';

import './style.css';

const Comments = () => (
  <div>
    Comments:
    <CommentItem />
  </div>
);

export default Comments;
