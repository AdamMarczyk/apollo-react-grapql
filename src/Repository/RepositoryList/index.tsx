import React, { Fragment } from 'react';
import FetchMore from '../../FetchMore';
import Issues from '../../Issue';
import RepositoryItem from '../RepositoryItem';
import '../style.css';


const getUpdateQuery = (entry: any) => (
  previousResult: any,
  { fetchMoreResult }: any,
) => {
  if (!fetchMoreResult) {
    return previousResult;
  }

  return {
    ...previousResult,
    [entry]: {
      ...previousResult[entry],
      repositories: {
        ...previousResult[entry].repositories,
        ...fetchMoreResult[entry].repositories,
        edges: [
          ...previousResult[entry].repositories.edges,
          ...fetchMoreResult[entry].repositories.edges,
        ],
      },
    },
  }
};

interface IRepositoryListProps {
  repositories: {
    edges: [{
      node: {
        id: string;
        name: string;
        url: string;
        descriptionHTML: string;
        primaryLanguage: {
          name: string,
        };
        owner: {
          url: string,
          login: string,
        };
        stargazers: {
          totalCount: number;
        }
        watchers: {
          totalCount: number;
        };
        viewerSubscription: string;
        viewerHasStarred: boolean;
      }
    }],
    pageInfo: {
      hasNextPage: boolean;
      endCursor: number;
    }
  };
  loading: boolean;
  fetchMore: any;
  entry: any;
}

const RepositoryList = ({
  repositories,
  loading,
  fetchMore,
  entry
}: IRepositoryListProps) => (
    <Fragment>
      {repositories.edges.map(({ node }) => (
        <div key={node.id} className="RepositoryItem">
          <RepositoryItem {...node} />
          <Issues
            repositoryName={node.name}
            repositoryOwner={node.owner.login}
          />
        </div>
      ))};

    <FetchMore
        loading={loading}
        hasNextPage={repositories.pageInfo.hasNextPage}
        variables={{
          cursor: repositories.pageInfo.endCursor,
        }}
        updateQuery={getUpdateQuery(entry)}
        fetchMore={fetchMore}
      >
        Repositories
    </FetchMore>
    </Fragment>
  );

export default RepositoryList;
