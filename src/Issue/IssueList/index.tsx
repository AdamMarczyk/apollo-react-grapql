import gql from 'graphql-tag';
import React from 'react';
import { ApolloConsumer, useQuery } from 'react-apollo';
import { withState } from 'recompose';
import { ButtonUnobtrusive } from '../../Button';
import ErrorMessage from '../../Error';
import Loading from '../../Loading';
import IssueItem from '../IssueItem';
import './style.css';

const GET_ISSUES_OF_REPOSITORY = gql`
  query(
    $repositoryOwner: String!,
    $repositoryName: String!,
    $issueState: IssueState!
  ) {
    repository(name: $repositoryName, owner: $repositoryOwner) {
      issues(first: 5, states: [$issueState]) {
        edges {
          node {
            id
            number
            state
            title
            url
            bodyHTML
          }
        }
      }
    }
  }
`;

const ISSUE_STATES = {
  NONE: 'NONE',
  OPEN: 'OPEN',
  CLOSED: 'CLOSED',
};

const TRANSITION_LABELS = {
  [ISSUE_STATES.NONE]: 'Show Open Issues',
  [ISSUE_STATES.OPEN]: 'Show Closed Issues',
  [ISSUE_STATES.CLOSED]: 'Hide Issues',
};

const TRANSITION_STATE = {
  [ISSUE_STATES.NONE]: ISSUE_STATES.OPEN,
  [ISSUE_STATES.OPEN]: ISSUE_STATES.CLOSED,
  [ISSUE_STATES.CLOSED]: ISSUE_STATES.NONE,
};

const isShow = (issueState: string) => issueState !== ISSUE_STATES.NONE;

const prefetchIssues = (
  client: any,
  repositoryOwner: string,
  repositoryName: string,
  issueState: string,
) => {
  const nextIssueState = TRANSITION_STATE[issueState];

  if (isShow(nextIssueState)) {
    client.query({
      query: GET_ISSUES_OF_REPOSITORY,
      variables: {
        repositoryOwner,
        repositoryName,
        issueState: nextIssueState,
      },
    });
  }
};

interface IIssuesProps {
  repositoryOwner: string;
  repositoryName: string;
  issueState: string;
  onChangeIssueState: any;
}

const Issues = ({
  repositoryOwner,
  repositoryName,
  issueState,
  onChangeIssueState,
}: IIssuesProps) => {
  const { loading, error, data } = useQuery(GET_ISSUES_OF_REPOSITORY, {
    variables: {
      repositoryOwner,
      repositoryName,
      issueState,
    },
  });

  const renderIssueList = () => {
    if (error) {
      return <ErrorMessage error={error} />;
    }

    const { repository } = data || {};

    if (loading && !repository) {
      return <Loading />;
    }

    return (
      <IssueList
        repositoryOwner={repositoryOwner}
        repositoryName={repositoryName}
        issues={repository.issues}
      />
    );
  }

  return (
    <div className="Issues">
      <IssueFilter
        repositoryOwner={repositoryOwner}
        repositoryName={repositoryName}
        issueState={issueState}
        onChangeIssueState={onChangeIssueState}
      />
      {isShow(issueState) && renderIssueList()}
    </div>
  )
};

interface IIssueListProps {
  repositoryOwner: string;
  repositoryName: string;
  issues: {
    edges: [
      {
        node: {
          id: string;
        }
      }
    ]
  }
}

const IssueList = ({
  repositoryOwner,
  repositoryName,
  issues
}: IIssueListProps) => (
    <div className="IssueList">
      {issues.edges.map(({ node }) => (
        <IssueItem
          key={node.id}
          repositoryOwner={repositoryOwner}
          repositoryName={repositoryName}
          issue={node}
        />
      ))}
    </div>
  );

interface IIssueFilterProps {
  issueState: string;
  onChangeIssueState: any;
  repositoryOwner: string;
  repositoryName: string;
}

const IssueFilter = ({
  issueState,
  onChangeIssueState,
  repositoryOwner,
  repositoryName,
}: IIssueFilterProps) => (
    <ApolloConsumer>
      {client => (
        <ButtonUnobtrusive
          onClick={() =>
            onChangeIssueState(TRANSITION_STATE[issueState])
          }
          onMouseOver={() => prefetchIssues(
            client,
            repositoryOwner,
            repositoryName,
            issueState,
          )}
        >
          {TRANSITION_LABELS[issueState]}
        </ButtonUnobtrusive>
      )}
    </ApolloConsumer>
  );


export default withState(
  'issueState',
  'onChangeIssueState',
  ISSUE_STATES.NONE,
)(Issues);
