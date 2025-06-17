import { AlertCircleIcon } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const NoDataAlert = () => {
  return (
    <Alert className='flex items-center justify-center min-h-screen'>
      <AlertCircleIcon />
      <AlertTitle>Oops! No data found.</AlertTitle>
      <AlertDescription>
        <p>Looks like there’s nothing here right now.</p>
        <ul className="list-inside list-disc text-sm mt-2">
          <li>Try changing your filters</li>
          <li>Double-check your search terms</li>
          <li>Or refresh and try again</li>
        </ul>
      </AlertDescription>
    </Alert>
  );
};

export default NoDataAlert;
