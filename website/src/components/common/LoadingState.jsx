import React from 'react';

const LoadingState = ({ label = 'Loading...', fullHeight = false }) => {
  return (
    <div className={`flex items-center justify-center ${fullHeight ? 'min-h-[70vh]' : 'min-h-[240px]'}`}>
      <div className="text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
        <p className="mt-3 text-sm font-medium text-slate-600 dark:text-slate-300">{label}</p>
      </div>
    </div>
  );
};

export default LoadingState;
