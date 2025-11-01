import React, { useEffect, useRef } from 'react';
import { Message } from '../types';
import { ChatMessage } from './ChatMessage';

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
}

const TypingIndicator = () => (
  <div className="flex items-center space-x-2">
    <div className="w-2 h-2 bg-[#45A29E] rounded-full animate-pulse"></div>
    <div className="w-2 h-2 bg-[#45A29E] rounded-full animate-pulse delay-75"></div>
    <div className="w-2 h-2 bg-[#45A29E] rounded-full animate-pulse delay-150"></div>
  </div>
);

export const MessageList: React.FC<MessageListProps> = ({ messages, isLoading }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages, isLoading]);

  return (
    <div className="px-4 md:px-8 py-4 space-y-6">
      {messages.map((message, index) => (
        <ChatMessage key={index} message={message} />
      ))}
      {isLoading && messages[messages.length-1]?.role === 'user' && (
        <div className="flex justify-start">
            <div className="p-4 rounded-lg bg-slate-800/50 dark:bg-slate-800/50 light:bg-slate-200">
                <TypingIndicator />
            </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};
