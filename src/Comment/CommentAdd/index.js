import gql from 'graphql-tag';
import React from 'react';
import { useMutation } from 'react-apollo';
import Button from '../../Button';
import ErrorMessage from '../../Error';
import TextArea from '../../TextArea';


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

const CommentAdd = (props) => {
  const [value, setValue] = React.useState("");

  const onChange = value => {
    setValue(value);
  };

  const onSubmit = (event, addComment) => {
    addComment().then(() => setValue(""));

    event.preventDefault();
  };

  const { issueId } = props;
  const [addComment, { error }] = useMutation(ADD_COMMENT, {
    variables: { body: value, subjectId: issueId },
    optimisticResponse: {
      __typename: 'Mutation',
      addComment: {
        __typename: 'Comment',
        body: value,
        subjectId: issueId,
      },
    },
    update: (proxy, { data: { addComment } }) => {
      const data = proxy.readQuery({ query: ADD_COMMENT });
      data.comments.push(addComment);
      proxy.writeQuery({ query: ADD_COMMENT, data })
    }
  });

  return (
    <div>
      {error && <ErrorMessage error={error} />}

      <form onSubmit={e => onSubmit(e, addComment)}>
        <TextArea
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="Leave a comment"
        />
        <Button type="submit">Comment</Button>
      </form>
    </div>
  );
};

export default CommentAdd;
