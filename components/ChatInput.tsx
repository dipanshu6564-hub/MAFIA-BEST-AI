import React, { useState, useRef, useEffect } from 'react';
import { SendIcon } from './icons';

interface ChatInputProps {
  onSendMessage: (input: string) => void;
  isLoading: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="flex items-end w-full p-2 rounded-xl bg-slate-900/50 dark:bg-slate-900/50 light:bg-white/80 backdrop-blur-lg border border-[#45A29E]/50 dark:border-[#45A29E]/50 light:border-slate-300 shadow-lg glow-shadow">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask MAFIA AI anything..."
          className="flex-1 bg-transparent border-none focus:ring-0 resize-none max-h-48 p-2 placeholder:text-slate-500 dark:placeholder:text-slate-500 light:placeholder:text-slate-400 text-[#C5C6C7] dark:text-[#C5C6C7] light:text-slate-800"
          rows={1}
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="ml-2 flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-[#66FCF1] text-black transition-all duration-300 disabled:bg-slate-600 disabled:cursor-not-allowed hover:bg-white hover:shadow-[0_0_15px_#66FCF1]"
          aria-label="Send message"
        >
          <SendIcon className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
};
