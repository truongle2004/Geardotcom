import {
  Monitor,
  Newspaper,
  Wrench,
  Home,
  RefreshCcw,
  ShieldCheck
} from 'lucide-react';

const SubHeader = () => {
  const menuItems = [
    {
      icon: Monitor,
      text: 'Build PC tặng màn 240Hz',
      highlight: true
    },
    {
      icon: Newspaper,
      text: 'Tin Công Nghệ'
    },
    {
      icon: Wrench,
      text: 'Dịch vụ'
    },
    {
      icon: Home,
      text: 'Dịch vụ kỹ thuật tại nhà'
    },
    {
      icon: RefreshCcw,
      text: 'Thu cũ đổi mới'
    },
    {
      icon: ShieldCheck,
      text: 'Tra cứu bảo hành'
    }
  ];

  return (
    <div className="w-full bg-gradient-to-r from-slate-50 to-gray-50 border-y border-gray-200 shadow-sm">
      {/* Desktop View */}
      <div
        className="hidden lg:flex items-center justify-between px-4 xl:px-40"
        style={{ height: '48px' }}
      >
        {menuItems.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <div
              key={index}
              className={`
                flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer
                transition-all duration-200 ease-in-out hover:bg-white hover:shadow-md
                group relative overflow-hidden
                ${
                  item.highlight
                    ? 'text-blue-600 bg-blue-50 hover:bg-blue-100'
                    : 'text-gray-700 hover:text-blue-600'
                }
              `}
            >
              <IconComponent
                className={`w-4 h-4 transition-transform duration-200 group-hover:scale-110 ${
                  item.highlight
                    ? 'text-blue-600'
                    : 'text-gray-600 group-hover:text-blue-600'
                }`}
              />
              <span className="text-sm font-medium whitespace-nowrap">
                {item.text}
              </span>

              {/* Hover effect underline */}
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></div>
            </div>
          );
        })}
      </div>

      {/* Mobile/Tablet View - Horizontal Scroll */}
      <div className="lg:hidden overflow-x-auto scrollbar-hide">
        <div className="flex items-center gap-1 px-4 h-12 min-w-max">
          {menuItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div
                key={index}
                className={`
                  flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer
                  transition-all duration-200 ease-in-out hover:bg-white hover:shadow-md
                  group relative overflow-hidden whitespace-nowrap
                  ${
                    item.highlight
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600'
                  }
                `}
              >
                <IconComponent
                  className={`w-4 h-4 transition-transform duration-200 group-hover:scale-110 ${
                    item.highlight
                      ? 'text-blue-600'
                      : 'text-gray-600 group-hover:text-blue-600'
                  }`}
                />
                <span className="text-sm font-medium">{item.text}</span>

                {/* Hover effect underline */}
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Custom scrollbar styles */}
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default SubHeader;
