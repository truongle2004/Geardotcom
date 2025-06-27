import {
  Monitor,
  Newspaper,
  Wrench,
  Home,
  RefreshCcw,
  ShieldCheck
} from 'lucide-react';

const SubHeader = () => {
  return (
    <div className="w-full h-12 flex items-center justify-between px-40  border-b border-b-gray-500 border-t border-t-gray-500">
      <div className="flex items-center gap-2 subheader-item">
        <Monitor className="w-4 h-4" />
        <span>Build PC tặng màn 240Hz</span>
      </div>

      <div className="flex items-center gap-1 subheader-item">
        <Newspaper className="w-4 h-4" />
        <span>Tin Công Nghệ</span>
      </div>
      <div className="flex items-center gap-1 subheader-item">
        <Wrench className="w-4 h-4" />
        <span>Dịch vụ</span>
      </div>
      <div className="flex items-center gap-1 subheader-item">
        <Home className="w-4 h-4" />
        <span>Dịch vụ kỹ thuật tại nhà</span>
      </div>
      <div className="flex items-center gap-1 subheader-item">
        <RefreshCcw className="w-4 h-4" />
        <span>Thu cũ đổi mới</span>
      </div>
      <div className="flex items-center gap-1 subheader-item">
        <ShieldCheck className="w-4 h-4" />
        <span>Tra cứu bảo hành</span>
      </div>
    </div>
  );
};

export default SubHeader;
