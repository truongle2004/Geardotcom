'use client';
import { TabProfileEnum } from '@/enums/enums';
import { useSearchParams } from 'next/navigation';
import AccountInfo from './AccountInfo';
import Address from './Address';
import DialogAddress from './DialogAddress';
import DialogLogout from './DialogLogout';
import ManageOrder from './ManageOrder';
import ViewHistory from './ViewHistory';

const RightSidebar = () => {
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());
  const tab = params.get('tab') || TabProfileEnum.ACCOUNT_INFO.toString();

  return (
    <>
      {tab === TabProfileEnum.ACCOUNT_INFO.toString() && <AccountInfo />}
      {tab === TabProfileEnum.ADDRESS.toString() && <Address />}
      {tab === TabProfileEnum.VIEW_HISTORY.toString() && <ViewHistory />}
      {tab === TabProfileEnum.MANAGE_ORDER.toString() && <ManageOrder />}
      <DialogAddress />
      <DialogLogout />
    </>
  );
};

export default RightSidebar;
