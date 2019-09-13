import React from 'react';
import './style.css';


interface IInputProps {
  children?: any;
  color?: string;
  type: string;
  value: string;
  onChange: (event: any) => void
}

const Input = ({ children, color = 'black', ...props }: IInputProps) => (
  <input className={`Input Input_${color}`} {...props}>
    {children}
  </input>
);

export default Input;
