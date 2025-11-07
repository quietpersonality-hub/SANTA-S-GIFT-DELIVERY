
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ children, ...props }) => {
  return (
    <button
      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg transform transition-transform duration-150 ease-in-out hover:scale-105 active:scale-100 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-75"
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
