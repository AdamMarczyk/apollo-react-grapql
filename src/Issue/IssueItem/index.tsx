import React from 'react';
import { ApolloConsumer } from 'react-apollo';
import { withState } from 'recompose';
import { ButtonUnobtrusive } from '../../Button';
import Comments from '../../Comment';
import { GET_COMMENTS_OF_ISSUE } from '../../Comment/CommentList';
import Link from '../../Link';
import './style.css';



const prefetchComments = (repositoryOwner: string, repositoryName: string, number: number, client: any) => {
  client.query({
    query: GET_COMMENTS_OF_ISSUE,
    variables: {
      repositoryOwner,
      repositoryName,
      number
    },
  });
};

interface IIssueItemProps {
  showComments: boolean;
  onToggleComments: (fn: Function) => void;
  repositoryOwner: string;
  repositoryName: string;
  issue: {
    number: any;
    url: string;
    title: string;
    bodyHTML: string;
  };
}

const IssueItem = ({
  showComments,
  onToggleComments,
  repositoryOwner,
  repositoryName,
  issue,
}: any) => (
    <div className="IssueItem">
      <ApolloConsumer>
        {client => (
          <ButtonUnobtrusive
            onClick={() =>
              onToggleComments(() => !showComments)
            }
            onMouseOver={() => prefetchComments(
              repositoryOwner,
              repositoryName,
              issue.number,
              client
            )}
          >
            {showComments
              ? 'Hide'
              : 'Show'
            } Comments
          </ButtonUnobtrusive>
        )}
      </ApolloConsumer>
      <div className="IssueItem-content">
        <h3>
          <Link href={issue.url}>{issue.title}</Link>
        </h3>
        <div dangerouslySetInnerHTML={{ __html: issue.bodyHTML }} />
        {showComments &&
          <Comments
            repositoryOwner={repositoryOwner}
            repositoryName={repositoryName}
            issue={issue}
          />
        }
      </div>
    </div >
  );

export default withState(
  'showComments',
  'onToggleComments',
  false
)(IssueItem);
