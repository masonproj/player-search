import React, { useState } from 'react';

const BugAlert = () => {
  const [dismissed, setDismissed] = useState(false);

  const handleDismiss = () => {
    setDismissed(true);
  };

  if (dismissed) {
    return null; // Hide the alert if it has been dismissed
  }

  return (
    <div className="bg-red-100 text-red-800 p-4 mb-4 rounded">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <svg
            className="w-5 h-5 mr-2"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12zm1-8a1 1 0 11-2 0 1 1 0 012 0zm-1 4a1 1 0 100-2 1 1 0 000 2z"
              clipRule="evenodd"
            />
          </svg>
          <span>This site is currently in a buggy or experimental state.</span>
        </div>
        <button
          className="text-red-600 hover:text-red-800 font-semibold focus:outline-none"
          onClick={handleDismiss}
        >
          Dismiss
        </button>
      </div>
    </div>
  );
};

export default BugAlert;
