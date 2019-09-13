import React from 'react';

interface ILinkProps {
  children?: any;
}

const Link = ({ children, ...props }: ILinkProps) => (
  <a {...props} target="_blank">
    {children}
  </a>
);

export default Link;
