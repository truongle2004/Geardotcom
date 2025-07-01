import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Package } from 'lucide-react';

const ManageOrder = () => {
  return (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 prfile-header-title">
          <Package className="profile-icon" />
          Quản lí đơn hàng
        </CardTitle>
      </CardHeader>
    </Card>
  );
};

export default ManageOrder;
