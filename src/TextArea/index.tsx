import React from 'react';
import './style.css';


interface ITextAreaProps {
  children?: any;
  value: string;
  onChange: any;
  placeholder: string;
}

const TextArea = ({ children, ...props }: ITextAreaProps) => (
  <textarea className={`TextArea`} {...props}>
    {children}
  </textarea>
);

export default TextArea;
