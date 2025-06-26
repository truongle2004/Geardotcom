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
import { login } from '@/utils/auth';
import type { FC } from 'react';

interface AddToCartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UnAuthorizedAlert: FC<AddToCartModalProps> = ({ isOpen, onClose }) => {
  const handleLogin = () => {
    login();
  };

  const handleCancel = () => {
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

export default UnAuthorizedAlert;
