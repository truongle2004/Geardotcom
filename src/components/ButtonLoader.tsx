import { Loader } from 'lucide-react';

const ButtonLoader = () => {
  return (
    <div className="text-center flex flex-row gap-2 items-center">
      <Loader className="animate-spin" />
      <p>loading...</p>
    </div>
  );
};

export default ButtonLoader;
