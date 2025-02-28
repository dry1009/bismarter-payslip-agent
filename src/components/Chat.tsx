
import { useEffect, useRef, useState } from "react";
import { sendMessage } from "@/services/chatService";
import ChatHeader from "./ChatHeader";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import { toast } from "sonner";

interface Message {
  content: string;
  isUser: boolean;
  timestamp: Date;
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom whenever messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Add viewport height fix for mobile and prevent scrolling
  useEffect(() => {
    const setViewHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    // Prevent bounce scrolling on iOS
    const preventBounce = (e: TouchEvent) => {
      if (chatContainerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
        const isAtTop = scrollTop <= 0;
        const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;

        if ((isAtTop && e.touches[0].clientY > 0) || 
            (isAtBottom && e.touches[0].clientY < 0)) {
          e.preventDefault();
        }
      }
    };

    // Fix for iOS visual viewport issues
    const fixIOSKeyboard = () => {
      // Wait for the keyboard to fully open
      setTimeout(() => {
        window.scrollTo(0, 0);
        document.body.scrollTop = 0;
      }, 300);
    };

    setViewHeight();
    window.addEventListener('resize', setViewHeight);
    window.addEventListener('orientationchange', setViewHeight);
    
    // Prevent document scrolling on mobile
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.height = '100%';

    // Focus handling for input fields
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      input.addEventListener('focus', fixIOSKeyboard);
    });

    return () => {
      window.removeEventListener('resize', setViewHeight);
      window.removeEventListener('orientationchange', setViewHeight);
      
      // Clean up event listeners
      inputs.forEach(input => {
        input.removeEventListener('focus', fixIOSKeyboard);
      });
    };
  }, []);

  const handleSendMessage = async (content: string) => {
    if (content.trim() === "") return;

    // Add user message
    const userMessage: Message = {
      content,
      isUser: true,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Send message to API and get response
      const response = await sendMessage(content);
      
      // Add agent response
      const agentMessage: Message = {
        content: response,
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, agentMessage]);
    } catch (error) {
      console.error("Error in chat exchange:", error);
      toast.error("אירעה שגיאה בתקשורת עם הסוכן");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[100dvh] max-h-[100dvh] overflow-hidden bg-gray-50 fixed inset-0">
      <ChatHeader />
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto px-4 pb-4 relative" 
        dir="rtl"
      >
        <div className="max-w-3xl mx-auto space-y-4 pt-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-8 pt-16">
              <div className="w-16 h-16 mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <span className="text-2xl">👋</span>
              </div>
              <h2 className="text-xl font-semibold mb-2 text-gray-800">ברוך הבא לצ'אט</h2>
              <p className="text-gray-500 max-w-sm">
                כאן תוכל לשאול כל שאלה שתרצה לגבי השכר שלך
              </p>
            </div>
          ) : (
            messages.map((message, index) => (
              <ChatMessage
                key={index}
                content={message.content}
                isUser={message.isUser}
              />
            ))
          )}
          
          {isLoading && (
            <ChatMessage
              content=""
              isUser={false}
              isTyping={true}
            />
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className="w-full border-t bg-white relative z-10">
        <div className="max-w-3xl mx-auto">
          <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
};

export default Chat;
