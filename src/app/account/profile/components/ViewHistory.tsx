import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { History } from 'lucide-react';
import Link from 'next/link';

const ViewHistory = () => {
  return (
    <Card className="flex flex-col flex-1">
      <CardHeader className="flex flex-row justify-between">
        <CardTitle className="flex items-center gap-2 prfile-header-title">
          <History className="profile-icon" />
          Sản phẩm đã xem
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col items-center justify-center">
        <p className="text-xl">Quý khách chưa xem sản phẩm nào</p>
        <Link href="/products">
          <Button variant="outline" className="mt-10">
            Tiếp tục mua hàng
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default ViewHistory;
