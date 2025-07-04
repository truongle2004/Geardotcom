'use client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import useDialogStore from '@/store/dialogStore';
import { logout } from '@/utils/auth';
import { AlertTriangle, LogOut } from 'lucide-react';

const DialogLogout = () => {
  const handleLogout = () => {
    logout();
  };
  const { isOpenDialogProfileLogout, setIsOpenDialogProfileLogout } =
    useDialogStore();
  return (
    <Dialog
      open={isOpenDialogProfileLogout}
      onOpenChange={setIsOpenDialogProfileLogout}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="flex flex-col items-center gap-2">
          <AlertTriangle className="text-yellow-500" size={40} />
          <DialogTitle>Thoát khỏi tài khoản?</DialogTitle>
          <DialogDescription className="text-center">
            Bạn có chắc chắn muốn đăng xuất không? Bạn sẽ cần đăng nhập lại để
            tiếp tục sử dụng.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-center gap-2">
          <DialogClose asChild>
            <Button variant="outline">Huỷ</Button>
          </DialogClose>
          <Button variant="destructive" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" /> Đăng xuất
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DialogLogout;
