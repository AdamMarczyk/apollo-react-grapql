import React from 'react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

import Button from '../../Button';
import TextArea from '../../TextArea';
import ErrorMessage from '../../Error';

const ADD_COMMENT = gql`
  mutation($subjectId: ID!, $body: String!) {
    addComment(input: { subjectId: $subjectId, body: $body }) {
      commentEdge {
        node {
          body
        }
      }
    }
  }
`;

class CommentAdd extends React.Component {
  state = {
    value: '',
  };

  onChange = value => {
    this.setState({ value });
  };

  onSubmit = (event, addComment) => {
    addComment().then(() => this.setState({ value: '' }));

    event.preventDefault();
  };

  render() {
    const { value } = this.state;
    const { issueId } = this.props;
    return (
      <Mutation
        mutation={ADD_COMMENT}
        variables={{ body: value, subjectId: issueId }}
        optimisticResponse={{
          __typename: 'Mutation',
          addComment: {
            __typename: 'Comment',
            body: value,
            subjectId: issueId,
          },
        }}
        update={(proxy, { data: { addComment } }) => {
          const data = proxy.readQuery({ query: ADD_COMMENT });
          data.comments.push(addComment);
          proxy.writeQuery({ query: ADD_COMMENT, data })
        }
        }
      >
        {(addComment, { data, loading, error }) => (
          <div>
            {error && <ErrorMessage error={error} />}

            <form onSubmit={e => this.onSubmit(e, addComment)}>
              <TextArea
                value={value}
                onChange={e => this.onChange(e.target.value)}
                placeholder="Leave a comment"
              />
              <Button type="submit">Comment</Button>
            </form>
          </div>
        )}
      </Mutation>
    );
  }
};

export default CommentAdd;
