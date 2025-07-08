'use client';
import type { Message } from '@/types';
import { MessageCircle, Minimize2, Send, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import {
  ChatBubble,
  ChatBubbleAvatar,
  ChatBubbleMessage
} from './ui/chat/chat-bubble';
import { ChatInput } from './ui/chat/chat-input';
import { ChatMessageList } from './ui/chat/chat-message-list';

const ChatPopup: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 2,
      variant: 'received',
      avatar: 'AI',
      message:
        '“ĐỪNG TỰ CHỌN – ĐỂ GEARDOTCOM LO!” | Phân vân không biết chọn gì? | GEARDOTCOM giúp bạn chọn theo nhu cầu: Game – Đồ họa – Học tập – Làm việc | NHẮN TIN NGAY để được tư vấn FREE & nhận nhiều ưu đãi!',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = (): void => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = (
    e:
      | React.MouseEvent<HTMLButtonElement>
      | React.KeyboardEvent<HTMLInputElement>
  ): void => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: messages.length + 1,
      variant: 'sent',
      avatar: 'US',
      message: inputValue.trim(),
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputValue('');

    // Simulate AI response
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const aiResponse: Message = {
        id: messages.length + 2,
        variant: 'received',
        avatar: 'AI',
        message:
          "Thank you for your message! I'm here to help you with any questions you might have.",
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      handleSendMessage(e);
    }
  };

  const toggleChat = (): void => {
    setIsOpen(!isOpen);
    setIsMinimized(false);
  };

  const minimizeChat = (): void => {
    setIsMinimized(true);
  };

  const restoreChat = (): void => {
    setIsMinimized(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setInputValue(e.target.value);
  };

  return (
    <>
      {/* Chat Toggle Button */}
      {!isOpen && (
        <button
          onClick={toggleChat}
          className="fixed bottom-6 right-6 z-50
                     bg-blue-600 hover:bg-blue-700 text-white
                     w-14 h-14 rounded-full shadow-lg
                     flex items-center justify-center
                     transition-all duration-200 ease-in-out
                     hover:scale-110 active:scale-95"
        >
          <MessageCircle size={24} />
        </button>
      )}

      {/* Chat Popup */}
      {isOpen && (
        <div
          className={`fixed bottom-6 right-6 w-96 z-50
                     bg-white dark:bg-gray-900
                     border border-gray-200 dark:border-gray-700
                     rounded-2xl shadow-2xl overflow-hidden
                     transition-all duration-300 ease-in-out
                     ${isMinimized ? 'h-16' : 'h-[32rem]'}`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <MessageCircle size={16} />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Chat Assistant</h3>
                <p className="text-xs text-blue-100">Online</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={isMinimized ? restoreChat : minimizeChat}
                className="p-1 hover:bg-white hover:bg-opacity-10 rounded transition-colors"
              >
                <Minimize2 size={16} />
              </button>
              <button
                onClick={toggleChat}
                className="p-1 hover:bg-white hover:bg-opacity-10 rounded transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Chat Content */}
          {!isMinimized && (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-hidden">
                <ChatMessageList className="h-80 overflow-y-auto p-4 space-y-4">
                  {messages.map((msg: Message) => (
                    <ChatBubble key={msg.id} variant={msg.variant}>
                      <ChatBubbleAvatar fallback={msg.avatar} />
                      <ChatBubbleMessage
                        variant={msg.variant}
                        className="text-sm"
                      >
                        {msg.message}
                      </ChatBubbleMessage>
                    </ChatBubble>
                  ))}

                  {/* Typing Indicator */}
                  {isTyping && (
                    <ChatBubble variant="received">
                      <ChatBubbleAvatar fallback="AI" />
                      <ChatBubbleMessage isLoading />
                    </ChatBubble>
                  )}

                  <div ref={messagesEndRef} />
                </ChatMessageList>
              </div>

              {/* Input */}
              <div className="border-t border-gray-200 dark:border-gray-700 p-4">
                <div className="flex space-x-2">
                  <ChatInput
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className="flex-1 text-sm"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim()}
                    className="p-2 bg-blue-600 text-white rounded-lg
                             hover:bg-blue-700 disabled:bg-gray-300
                             disabled:cursor-not-allowed transition-colors
                             flex items-center justify-center"
                  >
                    <Send size={16} />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default ChatPopup;
