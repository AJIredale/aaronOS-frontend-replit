import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import CommandBar from "@/components/command-bar";
import AaronIcon from "@/components/aaron-icon";
import { useSocket } from "@/hooks/use-socket";
import { useConversationStore } from "@/store/conversation";
import { formatDistanceToNow } from "date-fns";

export default function ChatPanel() {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, isTyping, addMessage } = useConversationStore();
  const { lastMessage } = useSocket();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (lastMessage && lastMessage.type === "message") {
      addMessage(lastMessage.message);
    }
  }, [lastMessage, addMessage]);

  const handleClearChat = () => {
    useConversationStore.getState().clearMessages();
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Chat Header */}
      <div className="p-6 border-b border-gray-200 bg-white flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Conversation with Aaron</h2>
            <p className="text-sm text-gray-500">Autonomous AI agent ready to help</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearChat}
              className="text-gray-700 hover:bg-gray-100"
            >
              Clear Chat
            </Button>
            <Button
              size="sm"
              className="bg-[var(--aaron-accent)] hover:bg-blue-600 text-white"
            >
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <Card className="p-8 max-w-md text-center">
              <AaronIcon size={48} className="mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Welcome to Aaron</h3>
              <p className="text-gray-600">
                I'm your AI OS orchestration agent. Ask me anything or give me a task to work on.
              </p>
            </Card>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start gap-4 ${
              message.role === "user" ? "justify-end" : ""
            }`}
          >
            {message.role === "assistant" && (
              <div className="w-8 h-8 rounded-full bg-[var(--aaron-dark)] flex items-center justify-center flex-shrink-0">
                <AaronIcon size={20} className="text-white" />
              </div>
            )}
            
            <div className={`flex-1 flex flex-col ${message.role === "user" ? "items-end" : ""}`}>
              <div
                className={`rounded-xl p-4 max-w-3xl ${
                  message.role === "user"
                    ? "bg-[var(--aaron-accent)] text-white"
                    : "bg-gray-50 text-gray-900"
                }`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
              </div>
              <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                {message.role === "user" ? (
                  <>
                    <span>{formatDistanceToNow(message.timestamp || new Date(), { addSuffix: true })}</span>
                    <span>•</span>
                    <span>You</span>
                  </>
                ) : (
                  <>
                    <span>Aaron</span>
                    <span>•</span>
                    <span>{formatDistanceToNow(message.timestamp || new Date(), { addSuffix: true })}</span>
                  </>
                )}
              </div>
            </div>

            {message.role === "user" && (
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-medium text-gray-600">U</span>
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-[var(--aaron-dark)] flex items-center justify-center flex-shrink-0 aaron-shimmer">
              <AaronIcon size={20} className="text-white animate-pulse" />
            </div>
            <div className="flex-1">
              <div className="bg-gray-50 rounded-xl p-4 max-w-3xl">
                <div className="typing-indicator">
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                </div>
                <span className="ml-3 text-sm text-gray-500">Aaron is thinking...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Command Input */}
      <div className="flex-shrink-0">
        <CommandBar />
      </div>
    </div>
  );
}
