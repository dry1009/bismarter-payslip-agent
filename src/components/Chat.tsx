
import { useEffect, useRef, useState } from "react";
import { sendMessage } from "@/services/chatService";
import ChatHeader from "./ChatHeader";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import { toast } from "sonner";
import { Button } from "./ui/button";

interface Message {
  content: string;
  isUser: boolean;
  timestamp: Date;
}

interface SuggestionTopic {
  name: string;
  questions: string[];
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Define suggestion topics with questions
  const suggestionTopics: SuggestionTopic[] = [
    {
      name: "שכר",
      questions: [
        "כמה היתה המשכורת שלי החודש?",
        "כמה קיבלתי בחודש הקודם?",
        "למה תוספת סכום מסוים מהשכר שלי?",
      ]
    },
    {
      name: "ניכויים",
      questions: [
        "איך מחושב שכר הנטו שלי?",
        "מה גובה הניכויים בתלוש האחרון?",
        "למה יש ניכוי חדש בתלוש שלי?"
      ]
    },
    {
      name: "הטבות",
      questions: [
        "אילו הטבות כלולות בתלוש שלי?",
        "האם אני זכאי להחזרי נסיעות?",
        "כיצד מחושבות שעות נוספות?"
      ]
    }
  ];

  // Scroll to bottom whenever messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Add viewport height fix for mobile
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

  // Handle keyboard on mobile
  useEffect(() => {
    const handleFocusAndScroll = () => {
      // Force scroll to bottom when input is focused
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

  // Improved keyboard handling for mobile
  useEffect(() => {
    const handleVisualViewportResize = () => {
      if (window.visualViewport) {
        // Check if the keyboard is open by comparing viewport height with window height
        const isKeyboardOpen = window.visualViewport.height < window.innerHeight;
        
        if (isKeyboardOpen) {
          // Scroll to the last message when keyboard opens
          scrollToBottom();
          
          // Add a class to the body when keyboard is open
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
      // Ensure we scroll to bottom after loading completes
      setTimeout(scrollToBottom, 100);
    }
  };

  const handleSuggestionClick = (question: string) => {
    handleSendMessage(question);
  };

  return (
    <div className="flex flex-col h-full w-full bg-gray-50">
      <ChatHeader />
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto px-4 pb-4" 
        dir="rtl"
      >
        <div className="max-w-3xl mx-auto space-y-4 pt-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-4 pt-12">
              <div className="w-16 h-16 mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <span className="text-2xl">👋</span>
              </div>
              <h2 className="text-xl font-semibold mb-2 text-gray-800">ברוך הבא טילור</h2>
              <p className="text-gray-500 max-w-sm mb-8">
                כאן תוכל לשאול כל שאלה שתרצה לגבי תלושי השכר שלך
              </p>
              
              {/* Suggestion boxes by topic */}
              <div className="w-full max-w-3xl">
                {suggestionTopics.map((topic, topicIndex) => (
                  <div key={topicIndex} className="mb-6">
                    <h3 className="text-md font-medium text-gray-700 mb-3">{topic.name}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {topic.questions.map((question, questionIndex) => (
                        <button
                          key={questionIndex}
                          onClick={() => handleSuggestionClick(question)}
                          className="bg-gray-900 text-white hover:bg-gray-800 transition-colors text-right p-4 rounded-xl border border-gray-800"
                        >
                          {question}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
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
      <div className="w-full border-t bg-white">
        <div className="max-w-3xl mx-auto">
          <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
};

export default Chat;
