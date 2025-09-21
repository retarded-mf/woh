
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  icon?: React.ReactNode;
}

// This is a reusable UI component for creating consistent "widgets" on the dashboard.
// Educational note: Building a library of common, reusable components like this is a fundamental
// practice in modern frontend development. It reduces code duplication and ensures visual consistency.
const Card: React.FC<CardProps> = ({ children, className = '', title, icon }) => {
  return (
    <div className={`bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-4 md:p-6 h-full flex flex-col ${className}`}>
      {title && (
        <h2 className="text-lg font-semibold text-cyan-400 mb-4 flex items-center">
          {icon && <span className="mr-2">{icon}</span>}
          {title}
        </h2>
      )}
      <div className="flex-grow">
        {children}
      </div>
    </div>
  );
};

export default Card;
