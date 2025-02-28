
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SendIcon } from "lucide-react";
import { motion } from "framer-motion";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const ChatInput = ({ onSendMessage, isLoading }: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (message.trim() === "" || isLoading) return;
    
    onSendMessage(message);
    setMessage("");
    
    // Focus back on textarea after sending
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }, 10);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="relative p-4 border-t bg-background"
    >
      <form onSubmit={handleSubmit} className="relative">
        <Textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="הקלד הודעה..."
          className="pr-12 py-4 resize-none min-h-[60px] max-h-[200px] rounded-xl"
          disabled={isLoading}
        />
        <Button
          type="submit"
          size="icon"
          className="absolute bottom-2 left-2 rounded-full w-10 h-10"
          disabled={message.trim() === "" || isLoading}
        >
          {isLoading ? (
            <div className="h-5 w-5 animate-pulse rounded-full bg-primary-foreground/70" />
          ) : (
            <SendIcon className="h-5 w-5 transform -rotate-180" />
          )}
        </Button>
      </form>
    </motion.div>
  );
};

export default ChatInput;
