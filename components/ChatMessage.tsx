import React from 'react';
import { Message } from '../types';
import { UserIcon, MafiaIcon } from './icons';

// Declare global variables from CDN scripts
declare var marked: any;
declare var DOMPurify: any;

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';

  const renderContent = (text: string) => {
    // Sanitize and parse markdown
    const rawMarkup = marked.parse(text);
    const sanitizedMarkup = DOMPurify.sanitize(rawMarkup);
    return <div className="prose prose-invert prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: sanitizedMarkup }} />;
  };

  return (
    <div className={`flex items-start gap-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-[#66FCF1] to-[#45A29E] flex items-center justify-center glow-shadow">
          <MafiaIcon className="w-5 h-5 text-black" />
        </div>
      )}
      <div 
        className={`max-w-xl px-4 py-3 rounded-2xl ${
          isUser 
            ? 'bg-[#45A29E] text-white dark:bg-[#45A29E] dark:text-white light:bg-teal-500 light:text-white rounded-br-none' 
            : 'bg-slate-800/50 dark:bg-slate-800/50 light:bg-slate-200 rounded-bl-none'
        }`}
      >
        {renderContent(message.text)}
      </div>
      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
          <UserIcon className="w-5 h-5 text-slate-300" />
        </div>
      )}
    </div>
  );
};
