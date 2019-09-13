import React, { ReactNode } from 'react';
import './style.css';

interface IButtonProps {
  children?: ReactNode[] | ReactNode;
  className?: string;
  color?: string;
  type?: "button" | "submit" | "reset" | undefined;
  onClick?: () => void;
  onMouseOver?: () => void;
}

const Button = ({
  children,
  className,
  color = 'black',
  type = 'button',
  ...props
}: IButtonProps) => (
    <button
      className={`${className} Button Button_${color}`}
      type={type}
      {...props}
    >
      {children}
    </button>
  );

const ButtonUnobtrusive = ({
  children,
  className,
  type = 'button',
  ...props
}: IButtonProps) => (
    <button
      className={`${className} Button_unobtrusive`}
      type={type}
      {...props}
    >
      {children}
    </button>
  );

export { ButtonUnobtrusive };

export default Button;
