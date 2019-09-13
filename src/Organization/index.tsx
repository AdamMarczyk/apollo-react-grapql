import gql from 'graphql-tag';
import React from 'react';
import { useQuery } from 'react-apollo';
import ErrorMessage from '../Error';
import Loading from '../Loading';
import RepositoryList, { REPOSITORY_FRAGMENT } from '../Repository';


const GET_REPOSITORIES_OF_ORGANIZATION = gql`
  query($organizationName: String!, $cursor: String) {
    organization(login: $organizationName) {
      repositories(first: 5, after: $cursor) {
        edges {
          node {
            ...repository
          }
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
  }
  ${REPOSITORY_FRAGMENT}
`;

interface IOrganizationProps {
  organizationName: string;
}

const Organization = ({ organizationName }: IOrganizationProps) => {
  const { loading, error, data, fetchMore } = useQuery(GET_REPOSITORIES_OF_ORGANIZATION, {
    variables: {
      organizationName
    },
    notifyOnNetworkStatusChange: true,
    skip: !organizationName
  });

  if (error) {
    return <ErrorMessage error={error} />;
  }

  const { organization } = data || {};

  if (loading && !organization) {
    return <Loading />;
  }

  return (
    <RepositoryList
      loading={loading}
      repositories={organization.repositories}
      fetchMore={fetchMore}
      entry={'organization'}
    />
  );
};


export default Organization;
