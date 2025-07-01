'use client';
import { useEffect, useState } from 'react';
import { SideBarTypeEnum } from '@/enums/enums';
import LeftSideBar from './components/LeftSideBar';
import RightSidebar from './components/RightSidebar';

const ProfilePage = () => {
  const [typeSidebar, setTypeSidebar] = useState(SideBarTypeEnum.ACCOUNT_INFO);
  const handleSetTypeRightSidebar = (type: SideBarTypeEnum) => {
    setTypeSidebar(type);
  };

  const [isOpenDialogLogout, setIsOpenDialogLogout] = useState(false);
  const onOpenChange = (open: boolean) => {
    setIsOpenDialogLogout(open);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-6">
          <LeftSideBar
            handleSetRightSidebarType={handleSetTypeRightSidebar}
            onOpenChangeDialogLogout={onOpenChange}
          />
          <RightSidebar
            sidebarType={typeSidebar}
            onOpenChange={onOpenChange}
            onOpenDialogLogout={isOpenDialogLogout}
          />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
