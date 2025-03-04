
import { useEffect, useRef, useState } from "react";
import { sendMessage, Message, getChatHistory, saveChatHistory, resetConversation } from "@/services/chatService";
import ChatHeader from "./ChatHeader";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import { toast } from "sonner";

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
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

  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Handle keyboard visibility using visualViewport API
  useEffect(() => {
    const handleVisualViewportResize = () => {
      if (!window.visualViewport) return;
      
      const isKeyboardVisible = window.visualViewport.height < window.innerHeight - 50;
      
      if (isKeyboardVisible) {
        // Calculate keyboard height
        const keyboardHeight = window.innerHeight - window.visualViewport.height;
        
        // Set keyboard height as a CSS variable
        document.documentElement.style.setProperty('--keyboard-height', `${keyboardHeight}px`);
        document.documentElement.style.setProperty('--keyboard-offset', `${keyboardHeight}px`);
        
        // Add class to body
        document.body.classList.add('keyboard-visible');
        
        // Set state for components that need it
        setKeyboardHeight(keyboardHeight);
        
        // Make sure to scroll to bottom when keyboard opens
        setTimeout(() => scrollToBottom("auto"), 100);
      } else {
        // Reset when keyboard closes
        document.body.classList.remove('keyboard-visible');
        setKeyboardHeight(0);
      }
    };

    // Fix for iOS initial scroll
    setTimeout(() => scrollToBottom("auto"), 100);

    // Detect keyboard
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleVisualViewportResize);
    }

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleVisualViewportResize);
      }
      document.body.classList.remove('keyboard-visible');
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
      setTimeout(() => scrollToBottom("smooth"), 100);
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
        direction: "rtl",
        background: "white",
        color: "#4b5563",
        border: "1px solid #e5e7eb"
      },
      closeButton: false,
      icon: "🔄",
      showProgress: true
    });
  };

  return (
    <div className="flex flex-col h-full w-full bg-gray-50">
      <ChatHeader onReset={handleResetChat} />
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto px-4 pb-4 chat-container" 
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
      <div className="w-full border-t bg-white input-container">
        <div className="max-w-3xl mx-auto">
          <ChatInput 
            onSendMessage={handleSendMessage} 
            isLoading={isLoading} 
            keyboardHeight={keyboardHeight}
          />
        </div>
      </div>
    </div>
  );
};

export default Chat;
