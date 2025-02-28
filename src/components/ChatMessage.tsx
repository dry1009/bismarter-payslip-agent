
import { cn } from "@/lib/utils";
import { memo } from "react";

interface ChatMessageProps {
  content: string;
  isUser: boolean;
  timestamp?: Date;
  isTyping?: boolean;
}

const ChatMessage = memo(({ content, isUser, isTyping }: ChatMessageProps) => {
  return (
    <div
      className={cn(
        "flex w-full animate-message-appear mb-4",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-2 shadow-sm",
          isUser
            ? "bg-chat-user text-white"
            : "bg-chat-assistant text-gray-800"
        )}
      >
        <p className="text-sm md:text-base whitespace-pre-wrap" dir="rtl">
          {isTyping ? (
            <span className="flex gap-1 items-center justify-end">
              <span className="mr-1">מכין תשובה</span>
              <span className="animate-bounce delay-300">.</span>
              <span className="animate-bounce delay-200">.</span>
              <span className="animate-bounce delay-100">.</span>
            </span>
          ) : (
            content
          )}
        </p>
      </div>
    </div>
  );
});

ChatMessage.displayName = "ChatMessage";

export default ChatMessage;
