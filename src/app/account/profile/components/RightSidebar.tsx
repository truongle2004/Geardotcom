'use client';
import { useEffect, useState, type FC } from 'react';
import { SideBarTypeEnum } from '@/enums/enums';
import AccountInfo from './AccountInfo';
import Address from './Address';
import ViewHistory from './ViewHistory';
import ManageOrder from './ManageOrder';
import DialogLogout from './DialogLogout';

interface Props {
  sidebarType: SideBarTypeEnum;
  onOpenDialogLogout: boolean;
  onOpenChange: (open: boolean) => void;
}

const RightSidebar: FC<Props> = ({
  sidebarType,
  onOpenChange,
  onOpenDialogLogout
}) => {
  return (
    <>
      {sidebarType === SideBarTypeEnum.ACCOUNT_INFO && <AccountInfo />}
      {sidebarType === SideBarTypeEnum.ADDRESS && <Address />}
      {sidebarType === SideBarTypeEnum.VIEW_HISTORY && <ViewHistory />}
      {sidebarType === SideBarTypeEnum.MANAGE_ORDER && <ManageOrder />}
      <DialogLogout open={onOpenDialogLogout} onOpenChange={onOpenChange} />
    </>
  );
};

export default RightSidebar;
