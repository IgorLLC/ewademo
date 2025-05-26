import React from 'react';

export interface ErrorMessageProps {
  message: string;
  className?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, className = '' }) => {
  return (
    <div className={`bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative ${className}`} role="alert">
      <span className="block sm:inline">{message}</span>
    </div>
  );
};

export default ErrorMessage;
