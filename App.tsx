import React, { useState, useEffect, useCallback } from 'react';
import { GoogleGenAI, Chat, Content } from '@google/genai';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { MessageList } from './components/MessageList';
import { ChatInput } from './components/ChatInput';
import { Message } from './types';

// Declare global variables from CDN scripts
declare var DOMPurify: any;

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(theme === 'dark' ? 'light' : 'dark');
    root.classList.add(theme);
  }, [theme]);

  const initChat = useCallback(async () => {
    try {
      if (!process.env.API_KEY) {
        console.error("API_KEY environment variable not set.");
        alert("API key is not configured. Please set the API_KEY environment variable.");
        return;
      }
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const storedHistory = localStorage.getItem('chatHistory');
      let history: Content[] = [];
      if (storedHistory) {
        history = JSON.parse(storedHistory);
        const restoredMessages: Message[] = history.map((item) => ({
          role: item.role,
          text: item.parts.map(part => part.text).join(''),
        }));
        setMessages(restoredMessages);
      } else {
         setMessages([{ role: 'model', text: 'Welcome to MAFIA AI. How can I assist you today?' }]);
      }
      const chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        history: history,
      });
      setChatSession(chat);
    } catch (error) {
      console.error("Failed to initialize chat session:", error);
      alert("There was an error initializing the AI. Please check your API key and network connection.");
    }
  }, []);

  useEffect(() => {
    initChat();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveHistory = useCallback(async () => {
    if (chatSession) {
      const history = await chatSession.getHistory();
      localStorage.setItem('chatHistory', JSON.stringify(history));
    }
  }, [chatSession]);

  const sendMessage = async (inputText: string) => {
    if (!chatSession || isLoading) return;

    setIsLoading(true);
    const userMessage: Message = { role: 'user', text: inputText };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    
    try {
      const result = await chatSession.sendMessageStream({ message: inputText });
      let modelResponse = '';
      setMessages(prev => [...prev, { role: 'model', text: '...' }]);

      for await (const chunk of result) {
        modelResponse += chunk.text;
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].text = DOMPurify.sanitize(modelResponse);
          return newMessages;
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage = { role: 'model' as const, text: 'Sorry, I encountered an error. Please try again.' };
      setMessages(prev => [...prev.slice(0, -1), errorMessage]);
    } finally {
      setIsLoading(false);
      await saveHistory();
    }
  };

  const startNewChat = () => {
    localStorage.removeItem('chatHistory');
    setMessages([]);
    initChat();
  };

  return (
    <div className="flex h-screen w-full bg-[#080C10] text-[#C5C6C7] dark:bg-[#080C10] dark:text-[#C5C6C7] light:bg-[#F0F4F8] light:text-[#1E293B] overflow-hidden">
      <Sidebar startNewChat={startNewChat} isOpen={isSidebarOpen} setIsOpen={setSidebarOpen} />
      <div className="flex flex-col flex-1 w-full relative">
        <Header 
          toggleSidebar={() => setSidebarOpen(!isSidebarOpen)} 
          theme={theme} 
          setTheme={setTheme} 
        />
        <main className="flex-1 overflow-y-auto pb-24">
          <MessageList messages={messages} isLoading={isLoading} />
        </main>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#080C10] to-transparent dark:from-[#080C10] light:from-[#F0F4F8] p-4 md:px-8">
            <ChatInput onSendMessage={sendMessage} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
};

export default App;
