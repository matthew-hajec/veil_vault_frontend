import React from 'react';

const Button = ({
  children,
  onClick,
  isLoading = false,
  disabled = false,
  type = 'button',
  className = '',
  ...props
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`flex items-center justify-center px-2 py-1 rounded-sm text-sm transition
        ${disabled || isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-opacity-90'}
        ${className}`}
      {...props}
    >
      {isLoading ? (
        <svg
          className="animate-spin h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
          ></path>
        </svg>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
