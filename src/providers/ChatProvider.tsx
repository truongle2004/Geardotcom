'use client';
import ChatPopup from '@/components/ChatPopup';

const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      {children}
      <ChatPopup />
    </div>
  );
};

export default ChatProvider;
