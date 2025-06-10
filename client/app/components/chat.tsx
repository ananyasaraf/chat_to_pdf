'use client';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Bot, Send, FileText, MessageSquare } from "lucide-react";
import { useRef, useEffect, useState } from "react";

interface Document {
  name: string;
  // Add other document properties as needed
}

interface IMessage {
  role: 'assistant' | 'user';
  content: string;
  documents?: string[];
  timestamp?: Date;
  isLoading?: boolean;
}

const ChatComponent: React.FC = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [currentDocument, setCurrentDocument] = useState<Document | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendChatMsg = async () => {
    if (!message.trim()) return;

    const userMessage: IMessage = {
      role: 'user',
      content: message,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);

    try {
      // Add temporary loading message
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '',
        isLoading: true
      }]);

      const res = await fetch(`http://localhost:8000/chat?message=${encodeURIComponent(message)}`);
      if (!res.ok) { 
        throw new Error(`Server error: ${res.status}`);
      }

      const data = await res.json();
      
      // Replace loading message with actual response
      setMessages(prev => [
        ...prev.slice(0, -1),
        {
          role: 'assistant',
          content: data.chatResponse,
          timestamp: new Date(),
          documents: data.documents
        }
      ]);
    } catch (err) {
      console.error("Error:", err);
      // Replace loading message with error
      setMessages(prev => [
        ...prev.slice(0, -1),
        {
          role: 'assistant',
          content: 'Sorry, there was an error processing your request. Please try again.',
          timestamp: new Date()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickQuestion = (question: string) => {
    setMessage(question);
    // Auto-focus the input after setting the question
    setTimeout(() => {
      const input = document.querySelector('input') as HTMLInputElement;
      input?.focus();
    }, 0);
  };

  const formatTime = (date?: Date) => {
    if (!date) return '';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col items-center w-full h-full p-4 relative">
      {/* Header with document info */}
      <div className="w-full max-w-4xl flex items-center justify-between mb-4 pb-4 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/20 rounded-lg">
            <FileText className="text-blue-400" size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Chat with PDF</h1>
            {currentDocument && (
              <p className="text-xs text-gray-400 truncate max-w-xs">
                {currentDocument.name}
              </p>
            )}
          </div>
        </div>
        <button 
          className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
          onClick={() => {
            setMessages([]);
            setCurrentDocument(null);
          }}
        >
          New Chat
        </button>
      </div>

      {/* Messages Area */}
      <div
        className="flex-1 w-full max-w-4xl overflow-y-auto px-4 space-y-6 scroll-smooth"
        id="chat-box"
      >
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8">
            <div className="bg-gray-800 p-6 rounded-full mb-4">
              <MessageSquare className="text-blue-400" size={32} />
            </div>
            <h3 className="text-xl font-semibold mb-2">How can I help you today?</h3>
            <p className="text-gray-400 max-w-md">
              Ask questions about your PDF document or request summaries of specific sections.
            </p>
            <div className="grid grid-cols-2 gap-3 mt-6 w-full max-w-md">
              <button 
                onClick={() => handleQuickQuestion("Summarize the key points of this document")}
                className="bg-gray-800 hover:bg-gray-700 p-3 rounded-lg text-sm text-left transition-colors"
              >
                Summarize key points
              </button>
              <button 
                onClick={() => handleQuickQuestion("What are the main findings in this document?")}
                className="bg-gray-800 hover:bg-gray-700 p-3 rounded-lg text-sm text-left transition-colors"
              >
                Main findings
              </button>
              <button 
                onClick={() => handleQuickQuestion("List the key statistics mentioned")}
                className="bg-gray-800 hover:bg-gray-700 p-3 rounded-lg text-sm text-left transition-colors"
              >
                Key statistics
              </button>
              <button 
                onClick={() => handleQuickQuestion("Explain the methodology used")}
                className="bg-gray-800 hover:bg-gray-700 p-3 rounded-lg text-sm text-left transition-colors"
              >
                Methodology
              </button>
            </div>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`px-4 py-3 rounded-xl max-w-xs md:max-w-md lg:max-w-2xl text-sm whitespace-pre-wrap transition-all ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none hover:bg-blue-500'
                    : 'bg-gray-800 text-gray-100 rounded-bl-none hover:bg-gray-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  {msg.role === 'assistant' ? (
                    <div className="flex items-center gap-2">
                      <Bot className="text-blue-400" size={16} />
                      <span className="text-xs text-blue-400">PDF Assistant</span>
                    </div>
                  ) : (
                    <span className="text-xs text-blue-200">You</span>
                  )}
                  <span className="text-xs text-gray-400">
                    {formatTime(msg.timestamp)}
                  </span>
                </div>
                
                {msg.isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce"></div>
                    <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                ) : (
                  msg.content
                )}

                {msg.documents && msg.documents.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-gray-700">
                    <p className="text-xs text-gray-400 mb-1">References:</p>
                    <div className="text-xs text-blue-400 space-y-1">
                      {msg.documents.map((doc, i) => (
                        <p key={i} className="truncate">• {doc}</p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="w-full max-w-4xl pt-4 pb-6">
        <div className="relative flex items-center gap-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendChatMsg()}
            placeholder="Ask something about the PDF..."
            className="flex-1 rounded-xl border-gray-700 bg-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 pr-12"
            disabled={isLoading}
          />
          <button
            onClick={handleSendChatMsg}
            disabled={!message.trim() || isLoading}
            className={`absolute right-2 p-2 rounded-lg transition-all ${
              message.trim() && !isLoading
                ? 'text-blue-400 hover:text-blue-300 hover:bg-blue-500/20'
                : 'text-gray-500'
            }`}
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Send size={20} />
            )}
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          PDF Assistant may produce inaccurate information about people, places, or facts.
        </p>
      </div>
    </div>
  );
};

export default ChatComponent;