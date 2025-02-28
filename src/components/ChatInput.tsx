
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SendHorizontal } from "lucide-react";
import { useState, FormEvent, useEffect, useRef } from "react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const ChatInput = ({ onSendMessage, isLoading }: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message);
      setMessage("");
      
      // התמקד בשדה הקלט מחדש לאחר שליחת ההודעה
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);
    }
  };

  useEffect(() => {
    const handleVisualViewportResize = () => {
      // Scroll the page to make the input visible when the keyboard opens
      if (inputRef.current) {
        inputRef.current.scrollIntoView({ behavior: 'smooth' });
      }
      
      // זיהוי אם המקלדת פתוחה
      if (window.visualViewport) {
        const heightDiff = window.innerHeight - window.visualViewport.height;
        setIsKeyboardOpen(heightDiff > 150);
      }
    };

    // Modern browsers support visualViewport API
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleVisualViewportResize);
    }

    // התמקד בשדה הקלט במסך המגע
    const handleTouchStart = () => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: true });

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleVisualViewportResize);
      }
      document.removeEventListener('touchstart', handleTouchStart);
    };
  }, []);

  // ממקד את תיבת הטקסט אחרי שינוי מצב הטעינה
  useEffect(() => {
    if (!isLoading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isLoading]);

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex items-center gap-2 ${isKeyboardOpen ? 'p-2' : 'p-3'} transition-all duration-200`}
    >
      <Button
        type="submit"
        size="icon"
        disabled={isLoading || !message.trim()}
        className="shrink-0"
      >
        <SendHorizontal className="h-5 w-5" />
      </Button>
      <Input
        ref={inputRef}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="הקלד/י הודעה..."
        className="flex-1 text-right"
        dir="rtl"
        disabled={isLoading}
        onFocus={() => setIsKeyboardOpen(true)}
        onBlur={() => {
          // השהה מעט את ההחלפה כדי לא ליצור קפיצות מיותרות
          setTimeout(() => setIsKeyboardOpen(false), 300);
        }}
      />
    </form>
  );
};

export default ChatInput;
