"use client";

import { useState, useEffect, useRef } from 'react';
import { Send, Plus, Loader2, Stethoscope, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar } from '@/components/ui/avatar';

interface Message {
  role: 'user' | 'assistant' | 'error';
  content: string;
}

const WELCOME_MESSAGE = "Hello! I am a doctor here to help you with your symptoms. Please describe your symptoms to me.";
const ERROR_MESSAGE = "Sorry, there was an error processing your request. Please check your connection and try again.";

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_API_URL || !process.env.NEXT_PUBLIC_API_KEY) {
      setMessages([{ role: 'error', content: 'API configuration is missing. Please check your environment variables.' }]);
      return;
    }
    setMessages([{ role: 'assistant', content: WELCOME_MESSAGE }]);
  }, []);

  const scrollToBottom = () => {
    if (scrollAreaRef.current && messagesEndRef.current) {
      const scrollArea = scrollAreaRef.current;
      const messagesEnd = messagesEndRef.current;
      
      // Use requestAnimationFrame for smoother scrolling
      requestAnimationFrame(() => {
        messagesEnd.scrollIntoView({ behavior: 'smooth', block: 'end' });
        scrollArea.scrollTo({
          top: scrollArea.scrollHeight,
          behavior: 'smooth'
        });
      });
    }
  };

  // Enhanced auto-scroll effect
  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Focus input after AI response
  useEffect(() => {
    if (!isLoading && messages.length > 0 && messages[messages.length - 1].role === 'assistant') {
      inputRef.current?.focus();
    }
  }, [isLoading, messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, conversationId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data || !data.answer) {
        throw new Error('Invalid response format');
      }

      if (data.conversation_id) {
        setConversationId(data.conversation_id);
      }

      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.answer
      }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        role: 'error', 
        content: ERROR_MESSAGE
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const startNewChat = () => {
    setMessages([{ role: 'assistant', content: WELCOME_MESSAGE }]);
    setConversationId('');
    inputRef.current?.focus();
  };

  return (
    <Card className="w-full">
      <div className="flex flex-col h-[600px]">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-700">Medical Consultation</h2>
          <Button variant="ghost" size="sm" onClick={startNewChat}>
            <Plus className="h-4 w-4 mr-2" />
            New Chat
          </Button>
        </div>

        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`flex items-start space-x-2 max-w-[80%] ${
                    message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}
                >
                  {message.role === 'assistant' ? (
                    <Avatar className="w-10 h-10 flex flex-col items-center justify-center bg-blue-500">
                      <Stethoscope className="h-4 w-4 text-white mb-0.5" />
                      <div className="text-white text-[10px] leading-none font-medium">Doctor</div>
                    </Avatar>
                  ) : message.role === 'error' ? (
                    <Avatar className="w-10 h-10 flex flex-col items-center justify-center bg-red-500">
                      <AlertCircle className="h-4 w-4 text-white mb-0.5" />
                      <div className="text-white text-[10px] leading-none font-medium">Error</div>
                    </Avatar>
                  ) : (
                    <Avatar className="w-8 h-8 flex items-center justify-center bg-green-500">
                      <div className="text-white text-xs font-medium">You</div>
                    </Avatar>
                  )}
                  <div
                    className={`rounded-lg p-3 ${
                      message.role === 'user'
                        ? 'bg-blue-500 text-white'
                        : message.role === 'error'
                        ? 'bg-red-50 text-red-600 border border-red-200'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-center space-x-2">
                  <Avatar className="w-10 h-10 flex flex-col items-center justify-center bg-blue-500">
                    <Stethoscope className="h-4 w-4 text-white mb-0.5" />
                    <div className="text-white text-[10px] leading-none font-medium">Doctor</div>
                  </Avatar>
                  <div className="bg-gray-100 rounded-lg p-3">
                    <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} /> {/* Invisible element to scroll to */}
          </div>
        </ScrollArea>

        <form onSubmit={handleSubmit} className="p-4 border-t">
          <div className="flex space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe your symptoms..."
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
              ref={inputRef}
            />
            <Button type="submit" disabled={isLoading || !input.trim()}>
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </Button>
          </div>
        </form>
      </div>
    </Card>
  );
}