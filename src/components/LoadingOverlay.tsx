'use client';

import React from 'react';

const LoadingOverlay = () => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex items-center justify-center pointer-events-auto">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-white border-solid" />
    </div>
  );
};

export default LoadingOverlay;
