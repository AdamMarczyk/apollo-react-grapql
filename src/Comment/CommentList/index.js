import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import CommentItem from '../CommentItem';
import Loading from '../../Loading';
import ErrorMessage from '../../Error';
import { ButtonUnobtrusive } from '../../Button';

import './style.css';

const GET_COMMENTS_OF_ISSUE = gql`
  query(
    $repositoryOwner: String!
    $repositoryName: String!
    $number: Int!
    $cursor: String
  ) {
    repository(name: $repositoryName, owner: $repositoryOwner) {
      issue(number: $number) {
        id
        comments(first: 1, after: $cursor) {
          edges {
            node {
              id
              bodyHTML
              author {
                login
              }
            }
          }
          pageInfo {
            endCursor
            hasNextPage
          }
        }
      }
    }
  }
`;

const Comments = ({
  repositoryOwner,
  repositoryName,
  issue,
  fetchMore
}) => (
    <div>
      <Query
        query={GET_COMMENTS_OF_ISSUE}
        variables={{
          repositoryOwner,
          repositoryName,
          number: issue.number,
        }}
      >
        {({ data, loading, error, fetchMore }) => {
          if (error) {
            return <ErrorMessage error={error} />;
          }

          const { repository } = data;

          if (loading && !repository) {
            return <Loading />;
          }

          return (
            <CommentList
              comments={repository.issue.comments}
              fetchMore={fetchMore}
            />
          );
        }}
      </Query>
    </div>
  );

const CommentList = ({ comments, fetchMore }) => (
  <div className="CommentList">
    {comments.edges.map(({ node }) => (
      <CommentItem key={node.id} comment={node} />
    ))}
    {comments.pageInfo.hasNextPage && (
      <button
        type="button"
        onClick={() =>
          fetchMore({
            /* configuration object */
          })
        }
      >
        More Comments
      </button>
    )}
  </div>
);

export default Comments;
