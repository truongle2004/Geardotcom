'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { TabProfileEnum } from '@/enums/enums';
import useDialogStore from '@/store/dialogStore';
import { Eye, LogOut, MapPin, Settings, ShoppingBag, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const ROOT_PATH = '/account/profile?tab=';

const LeftSideBar = () => {
  const { setIsOpenDialogProfileLogout } = useDialogStore();

  return (
    <Card className="lg:w-80 h-fit">
      <CardContent className="p-6">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <Image
              src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8YXZhdGFyfGVufDB8fDB8fA%3D%3D&w=1000&q=80"
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
              width={100}
              height={100}
            />
            <div className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-1">
              <Settings className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="text-center">
            <h3 className="font-semibold text-lg">Thomas Anderson</h3>
            <p className="text-sm text-gray-500">Khách hàng thân thiết</p>
          </div>
        </div>

        <nav className="mt-8 space-y-2">
          <Link
            href={`${ROOT_PATH}${TabProfileEnum.ACCOUNT_INFO}`}
            scroll={true}
          >
            <Button variant="ghost" className="w-full justify-start text-left">
              <User className="w-4 h-4 mr-3" />
              Thông tin tài khoản
            </Button>
          </Link>
          <Link href={`${ROOT_PATH}${TabProfileEnum.ADDRESS}`} scroll={true}>
            <Button variant="ghost" className="w-full justify-start text-left">
              <MapPin className="w-4 h-4 mr-3" />
              Sổ địa chỉ
            </Button>
          </Link>
          <Link
            href={`${ROOT_PATH}${TabProfileEnum.MANAGE_ORDER}`}
            scroll={true}
          >
            <Button variant="ghost" className="w-full justify-start text-left">
              <ShoppingBag className="w-4 h-4 mr-3" />
              Đơn hàng của tôi
            </Button>
          </Link>
          <Link
            href={`${ROOT_PATH}${TabProfileEnum.VIEW_HISTORY}`}
            scroll={true}
          >
            <Button variant="ghost" className="w-full justify-start text-left">
              <Eye className="w-4 h-4 mr-3" />
              Sản phẩm đã xem
            </Button>
          </Link>
          <Link href={`${ROOT_PATH}${TabProfileEnum.LOGOUT}`} scroll={true}>
            <Button
              variant="ghost"
              className="w-full justify-start text-left text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={() => setIsOpenDialogProfileLogout(true)}
            >
              <LogOut className="w-4 h-4 mr-3" />
              Đăng xuất
            </Button>
          </Link>
        </nav>
      </CardContent>
    </Card>
  );
};

export default LeftSideBar;
