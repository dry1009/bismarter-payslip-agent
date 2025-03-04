import { useEffect, useRef, useState } from "react";
import { sendMessage, Message, getChatHistory, saveChatHistory, resetConversation } from "@/services/chatService";
import ChatHeader from "./ChatHeader";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import { toast } from "sonner";

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedMessages = getChatHistory();
    if (storedMessages.length > 0) {
      setMessages(storedMessages);
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      saveChatHistory(messages);
    }
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    const setViewHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    setViewHeight();
    window.addEventListener('resize', setViewHeight);
    window.addEventListener('orientationchange', setViewHeight);

    return () => {
      window.removeEventListener('resize', setViewHeight);
      window.removeEventListener('orientationchange', setViewHeight);
    };
  }, []);

  useEffect(() => {
    const handleFocusAndScroll = () => {
      setTimeout(() => {
        window.scrollTo(0, document.body.scrollHeight);
        scrollToBottom();
      }, 300);
    };

    const inputElements = document.querySelectorAll('input');
    inputElements.forEach(input => {
      input.addEventListener('focus', handleFocusAndScroll);
    });

    return () => {
      inputElements.forEach(input => {
        input.removeEventListener('focus', handleFocusAndScroll);
      });
    };
  }, []);

  useEffect(() => {
    const handleVisualViewportResize = () => {
      if (window.visualViewport) {
        const isKeyboardOpen = window.visualViewport.height < window.innerHeight;
        
        if (isKeyboardOpen) {
          scrollToBottom();
          
          document.body.classList.add('keyboard-open');
        } else {
          document.body.classList.remove('keyboard-open');
        }
      }
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleVisualViewportResize);
    }

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleVisualViewportResize);
      }
      document.body.classList.remove('keyboard-open');
    };
  }, []);

  const handleSendMessage = async (content: string) => {
    if (content.trim() === "") return;

    const userMessage: Message = {
      content,
      role: "user",
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await sendMessage(content, messages);
      
      const agentMessage: Message = {
        content: response,
        role: "agent",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, agentMessage]);
    } catch (error) {
      console.error("Error in chat exchange:", error);
      toast.error("אירעה שגיאה בתקשורת עם הסוכן");
    } finally {
      setIsLoading(false);
      setTimeout(scrollToBottom, 100);
    }
  };

  const handleResetChat = () => {
    resetConversation();
    setMessages([]);
    toast.success("הצ'אט אופס בהצלחה", {
      position: "top-center",
      duration: 2000,
      className: "rtl-toast",
      style: {
        direction: "rtl"
      },
      closeButton: false,
      icon: "🔄",
      style: {
        background: "white",
        color: "#4b5563",
        border: "1px solid #e5e7eb"
      },
      actionIcon: "✓",
    });
  };

  return (
    <div className="flex flex-col h-full w-full bg-gray-50">
      <ChatHeader onReset={handleResetChat} />
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto px-4 pb-4" 
        dir="rtl"
      >
        <div className="max-w-3xl mx-auto space-y-4 pt-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-8 pt-16">
              <div className="w-16 h-16 mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <span className="text-2xl">👋</span>
              </div>
              <h2 className="text-xl font-semibold mb-2 text-gray-800">ברוך הבא טילור</h2>
              <p className="text-gray-500 max-w-sm">
                כאן תוכלי לשאול כל שאלה שתרצי לגבי תלושי השכר שלך
              </p>
            </div>
          ) : (
            messages.map((message, index) => (
              <ChatMessage
                key={index}
                content={message.content}
                isUser={message.role === "user"}
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
      <div className="w-full border-t bg-white">
        <div className="max-w-3xl mx-auto">
          <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
};

export default Chat;
