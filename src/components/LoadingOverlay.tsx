'use client';

import React from 'react';
import Loader from './Loader';

const LoadingOverlay = () => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex items-center justify-center pointer-events-auto">
      <Loader />
    </div>
  );
};

export default LoadingOverlay;
