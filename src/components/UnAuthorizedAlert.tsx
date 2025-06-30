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
          <DialogTitle>Yêu cầu đăng nhập</DialogTitle>
          <DialogDescription>
            Bạn cần đăng nhập để thực hiện yêu cầu này
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Bỏ qua
          </Button>
          <Button onClick={handleLogin}>Đăng nhập</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UnAuthorizedAlert;
