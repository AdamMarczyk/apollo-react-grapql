import React, { ReactNode } from 'react';
import { ButtonUnobtrusive } from '../Button';
import Loading from '../Loading';
import './style.css';

interface IFetchMoreProps {
  loading: boolean;
  hasNextPage: boolean;
  variables: any;
  updateQuery: any;
  fetchMore: any;
  children: ReactNode[] | ReactNode;
}

const FetchMore = ({
  loading,
  hasNextPage,
  variables,
  updateQuery,
  fetchMore,
  children,
}: IFetchMoreProps) => (
    <div className="FetchMore">
      {loading ? (
        <Loading />
      ) : (
          hasNextPage &&
          <ButtonUnobtrusive
            className="FetchMore-button"
            onClick={() =>
              fetchMore({
                variables,
                updateQuery
              })
            }
          >
            More {children}
          </ButtonUnobtrusive>
        )}
    </div>
  );

export default FetchMore;
