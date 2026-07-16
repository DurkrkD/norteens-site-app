import React from "react";
import ReactMarkdown from "react-markdown";

export default function MessageBubble({ message }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0 mr-2 mt-0.5">
          <span className="text-xs font-heading font-semibold text-primary-foreground">N</span>
        </div>
      )}
      <div
        className={`max-w-[80%] px-4 py-2.5 rounded-[18px] text-sm leading-relaxed ${
          isUser
            ? "bg-primary text-primary-foreground rounded-br-md"
            : "bg-card text-foreground border border-border rounded-bl-md"
        }`}
      >
        {isUser ? (
          <p>{message.content}</p>
        ) : (
          <ReactMarkdown
            components={{
              p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
              a: ({ children, href }) => (
                <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary underline">
                  {children}
                </a>
              ),
            }}
          >
            {message.content || ""}
          </ReactMarkdown>
        )}
      </div>
    </div>
  );
}