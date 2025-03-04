
import { cn } from "@/lib/utils";
import { memo } from "react";
import ReactMarkdown from "react-markdown";

interface ChatMessageProps {
  content: string;
  isUser: boolean;
  timestamp?: Date;
  isTyping?: boolean;
}

const ChatMessage = memo(({
  content,
  isUser,
  isTyping
}: ChatMessageProps) => {
  return (
    <div className={cn("flex w-full animate-message-appear mb-4", 
      isUser ? "justify-start" : "justify-end")}>
      <div className={cn("max-w-[80%] rounded-2xl px-4 py-2 shadow-sm", 
        isUser ? "bg-chat-user text-white" : "bg-chat-assistant text-gray-800")}>
        {isTyping ? (
          <p className="text-sm md:text-base text-right" dir="rtl">
            <span className="flex gap-1 items-center justify-end">
              <span className="mr-1">מכין תשובה</span>
              <span className="animate-bounce delay-100">.</span>
              <span className="animate-bounce delay-200">.</span>
              <span className="animate-bounce delay-300">.</span>
            </span>
          </p>
        ) : isUser ? (
          <p className="text-sm md:text-base text-right" dir="rtl">
            {content}
          </p>
        ) : (
          <div className="markdown-content text-sm md:text-base text-right dense-markdown" dir="rtl">
            <ReactMarkdown components={{
              p: ({ children }) => <p className="mb-0.5 last:mb-0">{children}</p>,
              h1: ({ children }) => <h1 className="text-xl font-bold mb-0.5 mt-0.5">{children}</h1>,
              h2: ({ children }) => <h2 className="text-lg font-bold mb-0.5 mt-0.5">{children}</h2>,
              h3: ({ children }) => <h3 className="text-md font-bold mb-0.5 mt-0.5">{children}</h3>,
              ul: ({ children }) => <ul className="mb-0.5 pr-2 list-disc space-y-0">{children}</ul>,
              ol: ({ children }) => <ol className="mb-0.5 pr-2 list-decimal space-y-0">{children}</ol>,
              li: ({ children }) => <li className="mb-0 py-0 leading-tight">{children}</li>,
              strong: ({ children }) => <strong className="font-bold">{children}</strong>,
              em: ({ children }) => <em className="italic">{children}</em>,
              blockquote: ({ children }) => (
                <blockquote className="border-r-4 border-gray-300 pr-2 py-0.5 my-0.5 text-gray-600">
                  {children}
                </blockquote>
              ),
              code: ({ children }) => <code className="bg-gray-100 px-1 rounded">{children}</code>,
              pre: ({ children }) => (
                <pre className="bg-gray-100 p-1.5 rounded my-0.5 overflow-x-auto rtl:text-left ltr:text-left">
                  {children}
                </pre>
              ),
              table: ({ children }) => (
                <div className="overflow-x-auto my-0.5 rounded shadow-sm">
                  <table className="w-full border-collapse text-left">{children}</table>
                </div>
              ),
              thead: ({ children }) => <thead className="bg-gray-50">{children}</thead>,
              tbody: ({ children }) => <tbody>{children}</tbody>,
              tr: ({ children }) => (
                <tr className="border-b border-gray-200 hover:bg-gray-50/50">
                  {children}
                </tr>
              ),
              th: ({ children }) => (
                <th className="px-1 py-0.5 text-gray-700 font-medium border-b border-gray-200">
                  {children}
                </th>
              ),
              td: ({ children }) => <td className="px-1 py-0.5 border-gray-200">{children}</td>
            }}>
              {content}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
});

ChatMessage.displayName = "ChatMessage";
export default ChatMessage;
