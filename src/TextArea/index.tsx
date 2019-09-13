import React from 'react';
import './style.css';


interface ITextAreaProps {
  children?: any;
}

const TextArea = ({ children, ...props }: ITextAreaProps) => (
  <textarea className={`TextArea`} {...props}>
    {children}
  </textarea>
);

export default TextArea;
