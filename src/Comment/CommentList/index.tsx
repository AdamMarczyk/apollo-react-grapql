import gql from 'graphql-tag';
import React, { Fragment } from 'react';
import { useQuery } from 'react-apollo';
import ErrorMessage from '../../Error';
import FetchMore from '../../FetchMore';
import Loading from '../../Loading';
import CommentAdd from '../CommentAdd';
import CommentItem from '../CommentItem';
import './style.css';



export const GET_COMMENTS_OF_ISSUE = gql`
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

const updateQuery = (previousResult: any, { fetchMoreResult }: any) => {
  if (!fetchMoreResult) {
    return previousResult;
  }

  return {
    ...previousResult,
    repository: {
      ...previousResult.repository,
      issue: {
        ...previousResult.repository.issue,
        ...fetchMoreResult.repository.issue,
        comments: {
          ...previousResult.repository.issue.comments,
          ...fetchMoreResult.repository.issue.comments,
          edges: [
            ...previousResult.repository.issue.comments.edges,
            ...fetchMoreResult.repository.issue.comments.edges,
          ],
        },
      },
    },
  };
};

interface ICommentsProps {
  repositoryOwner: string;
  repositoryName: string;
  issue: {
    number: string;
  };
}

const Comments = ({
  repositoryOwner,
  repositoryName,
  issue,
}: ICommentsProps) => {
  const { loading, error, data, fetchMore } = useQuery(GET_COMMENTS_OF_ISSUE, {
    variables: {
      repositoryOwner,
      repositoryName,
      number: issue.number,

    },
    notifyOnNetworkStatusChange: true,
  });
  if (error) {
    return <ErrorMessage error={error} />;
  }

  const { repository } = data || {};

  if (loading && !repository) {
    return <Loading />;
  }

  return (
    <Fragment>
      <CommentList
        comments={repository.issue.comments}
        loading={loading}
        fetchMore={fetchMore}
      />
      <CommentAdd issueId={repository.issue.id} />
    </Fragment>

  );
};

interface ICommentListProps {
  comments: {
    edges: [
      {
        node: {
          id: number;
          author: {
            login: string;
          },
          bodyHTML: string;
        }
      }
    ],
    pageInfo: {
      hasNextPage: boolean;
      endCursor: number;
    }
  };
  loading: boolean;
  fetchMore: any;
}

const CommentList = ({
  comments,
  loading,
  fetchMore,
}: ICommentListProps) => (
    <div className="CommentList">
      {comments.edges.map(({ node }) => (
        <CommentItem key={node.id} comment={node} />
      ))}
      <FetchMore
        loading={loading}
        hasNextPage={comments.pageInfo.hasNextPage}
        variables={{
          cursor: comments.pageInfo.endCursor,
        }}
        updateQuery={updateQuery}
        fetchMore={fetchMore}
      >
        Comments
    </FetchMore>
    </div>
  );

export default Comments;
