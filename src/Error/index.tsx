import { ApolloError } from 'apollo-client';
import React from 'react';
import './style.css';


interface IErrorMessageProps {
  error: ApolloError | undefined;
}

const ErrorMessage = ({ error }: IErrorMessageProps) => (
  <div className="ErrorMessage">
    <small>{error && error.toString()}</small>
  </div>
);

export default ErrorMessage;
