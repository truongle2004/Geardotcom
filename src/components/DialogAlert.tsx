'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { login } from '@/utils/auth';
import type { FC } from 'react';

interface AddToCartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DialogAuthAlert: FC<AddToCartModalProps> = ({ isOpen, onClose }) => {
  const { toast } = useToast();

  const handleLogin = () => {
    toast({
      title: 'Redirecting to login',
      description: "You'll be taken to the login page shortly.",
      duration: 3000
    });
    login();
  };

  const handleCancel = () => {
    toast({
      title: 'Action cancelled',
      description: 'You need to log in to add items to your cart.',
      variant: 'destructive',
      duration: 3000
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Login required</DialogTitle>
          <DialogDescription>
            You need to be logged in to do this action.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleLogin}>Go to Login</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DialogAuthAlert;
