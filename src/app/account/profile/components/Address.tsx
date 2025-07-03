'use client';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import useDialogStore from '@/store/dialogStore';
import { MapPinHouse, Plus } from 'lucide-react';

const Address = () => {
  const { setIsOpenDialogProfileAddress } = useDialogStore();
  return (
    <Card className="flex-1">
      <CardHeader className="flex flex-row justify-between">
        <CardTitle className="flex items-center gap-2 prfile-header-title">
          <MapPinHouse className="profile-icon" />
          Số địa chỉ
        </CardTitle>
        <Button onClick={() => setIsOpenDialogProfileAddress(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Thêm địa chỉ mới
        </Button>
      </CardHeader>
    </Card>
  );
};

export default Address;
