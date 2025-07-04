import React, { FC } from 'react';

type Size = 'sm' | 'md' | 'lg';

interface Props {
  size?: Size;
}

const Loader: FC<Props> = ({ size }) => {
  return (
    <div
      className={`${size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-6 h-6' : 'w-8 h-8'} border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin`}
    />
  );
};

export default Loader;
