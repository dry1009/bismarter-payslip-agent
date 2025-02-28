
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ChatMessageProps {
  content: string;
  isUser: boolean;
  timestamp: Date;
}

const ChatMessage = ({ content, isUser, timestamp }: ChatMessageProps) => {
  // Format time for display
  const formattedTime = new Intl.DateTimeFormat('he-IL', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(timestamp);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className={cn(
        "message",
        isUser ? "user-message" : "agent-message"
      )}
    >
      <div className="flex flex-col">
        <div className="text-sm font-medium mb-1">
          {isUser ? "אתה" : "הסוכן"}
        </div>
        <div className="whitespace-pre-wrap">{content}</div>
        <div className="text-xs text-right mt-1 opacity-70">
          {formattedTime}
        </div>
      </div>
    </motion.div>
  );
};

export default ChatMessage;
