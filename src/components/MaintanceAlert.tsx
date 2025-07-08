import { AlertTriangle, Clock } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from './ui/alert';

const MaintenanceAlert = () => {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-[9999] backdrop-blur-sm">
      <div
        className="absolute inset-0 cursor-not-allowed"
        onClick={(e) => e.preventDefault()}
      />
      <Alert className="max-w-md w-full bg-white border-yellow-200 shadow-lg relative z-10">
        <AlertTriangle className="h-4 w-4 text-yellow-600" />
        <AlertTitle className="text-yellow-800 font-semibold">
          Hệ thống đang bảo trì
        </AlertTitle>
        <AlertDescription className="text-gray-700 mt-2">
          <p className="mb-2">
            Chúng tôi đang thực hiện bảo trì hệ thống để mang đến trải nghiệm
            tốt hơn cho bạn.
          </p>
          <p className="mb-3">
            Vui lòng quay lại sau ít phút. Cảm ơn sự kiên nhẫn của bạn! 🙏
          </p>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            <span>Thời gian dự kiến: 15-30 phút</span>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default MaintenanceAlert;
