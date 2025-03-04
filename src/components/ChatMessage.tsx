
import { cn } from "@/lib/utils";
import { memo } from "react";
import ReactMarkdown from "react-markdown";

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
        "flex w-full animate-message-appear mb-3",
        isUser ? "justify-start" : "justify-end"
      )}
    >
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-5 py-3 shadow-sm",
          isUser
            ? "bg-chat-user text-white bg-gradient-to-br from-indigo-500 to-indigo-600"
            : "bg-white text-gray-800 border border-gray-100"
        )}
      >
        {isTyping ? (
          <p className="text-sm md:text-base whitespace-pre-wrap text-right" dir="rtl">
            <span className="flex gap-1 items-center justify-end">
              <span className="mr-1 font-medium">מכין תשובה</span>
              <span className="animate-bounce delay-100">.</span>
              <span className="animate-bounce delay-200">.</span>
              <span className="animate-bounce delay-300">.</span>
            </span>
          </p>
        ) : isUser ? (
          <p className="text-sm md:text-base whitespace-pre-wrap text-right leading-relaxed" dir="rtl">
            {content}
          </p>
        ) : (
          <div className="markdown-content text-sm md:text-base text-right compact-markdown leading-relaxed" dir="rtl">
            <ReactMarkdown
              components={{
                p: ({ children }) => <p className="mb-1 last:mb-0 text-gray-800">{children}</p>,
                h1: ({ children }) => <h1 className="text-xl font-bold mb-1 mt-1 text-gray-900">{children}</h1>,
                h2: ({ children }) => <h2 className="text-lg font-bold mb-1 mt-1 text-gray-900">{children}</h2>,
                h3: ({ children }) => <h3 className="text-md font-bold mb-1 mt-1 text-gray-900">{children}</h3>,
                ul: ({ children }) => <ul className="mb-1 pr-4 list-disc space-y-0">{children}</ul>,
                ol: ({ children }) => <ol className="mb-1 pr-4 list-decimal space-y-0">{children}</ol>,
                li: ({ children }) => <li className="mb-0">{children}</li>,
                strong: ({ children }) => <strong className="font-semibold text-gray-900">{children}</strong>,
                em: ({ children }) => <em className="italic">{children}</em>,
                blockquote: ({ children }) => (
                  <blockquote className="border-r-4 border-indigo-200 pr-3 py-0.5 my-1 text-gray-600 bg-gray-50 rounded-sm">
                    {children}
                  </blockquote>
                ),
                code: ({ children }) => <code className="bg-gray-100 px-1.5 py-0.5 rounded-md text-sm font-mono text-indigo-600">{children}</code>,
                pre: ({ children }) => (
                  <pre className="bg-gray-50 p-3 rounded-lg my-1 overflow-x-auto rtl:text-left ltr:text-left whitespace-pre border border-gray-100 text-sm">
                    {children}
                  </pre>
                ),
                table: ({ children }) => (
                  <div className="overflow-x-auto my-1 rounded-lg shadow-sm border border-gray-100">
                    <table className="w-full border-collapse text-left">{children}</table>
                  </div>
                ),
                thead: ({ children }) => <thead className="bg-gray-50">{children}</thead>,
                tbody: ({ children }) => <tbody>{children}</tbody>,
                tr: ({ children }) => <tr className="border-b border-gray-100 hover:bg-gray-50/50">{children}</tr>,
                th: ({ children }) => (
                  <th className="px-3 py-2 text-gray-700 font-medium border-b border-gray-100">{children}</th>
                ),
                td: ({ children }) => <td className="px-3 py-2 border-gray-100">{children}</td>,
              }}
            >
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
