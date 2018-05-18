import React, { Fragment } from 'react';
import RepositoryItem from '../RepositoryItem';
import '../style.css';

const RepositoryList = ({ repositories, fetchMore }) => (
  <Fragment>
    {repositories.edges.map(({ node }) => (
      <div key={node.id} className="RepositoryItem">
        <RepositoryItem {...node} />
      </div>
    ))};
    {repositories.pageInfo.hasNextPage && (
      <button
        type="button"
        onClick={() =>
          fetchMore({
            /* */
          })
        }
      >
        More Repositories
      </button>
    )}
  </Fragment>
);
export default RepositoryList;
