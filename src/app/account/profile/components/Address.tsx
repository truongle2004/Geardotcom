import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPinHouse, Plus } from 'lucide-react';

const Address = () => {
  return (
    <Card className="flex-1">
      <CardHeader className="flex flex-row justify-between">
        <CardTitle className="flex items-center gap-2 prfile-header-title">
          <MapPinHouse className="profile-icon" />
          Số địa chỉ
        </CardTitle>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Thêm địa chỉ mới
        </Button>
      </CardHeader>
    </Card>
  );
};

export default Address;
