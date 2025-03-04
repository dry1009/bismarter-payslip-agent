
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

  // Auto-focus when component mounts or loading stops
  useEffect(() => {
    if (!isLoading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isLoading]);

  // Auto-focus when component mounts
  useEffect(() => {
    // Detect iOS device and add a class to the body
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    if (isIOS) {
      document.body.classList.add('ios');
    }
    
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 500);
    
    return () => {
      document.body.classList.remove('ios');
    };
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
        autoComplete="off"
      />
    </form>
  );
};

export default ChatInput;
