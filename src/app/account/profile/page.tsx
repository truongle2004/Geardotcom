'use client';
import { useEffect } from 'react';
import LeftSideBar from './components/LeftSideBar';
import RightSidebar from './components/RightSidebar';

const ProfilePage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [window.location.pathname]);

  return (
    <div className=" bg-gray-50 p-4  mb-10 pt-20 main-content">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-6">
          <LeftSideBar />
          <RightSidebar />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
