
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
        
        // Force focus after a short delay
        setTimeout(() => {
          inputRef.current?.focus();
        }, 50);
      }
    };

    // Modern browsers support visualViewport API
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleVisualViewportResize);
    }

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleVisualViewportResize);
      }
    };
  }, []);

  // ממקד את תיבת הטקסט אחרי שינוי מצב הטעינה
  useEffect(() => {
    if (!isLoading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isLoading]);

  // Auto-focus when component mounts
  useEffect(() => {
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 500);
  }, []);

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2 p-3"
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
      />
    </form>
  );
};

export default ChatInput;
