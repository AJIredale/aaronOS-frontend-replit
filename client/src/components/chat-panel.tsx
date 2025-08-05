import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import CommandBar from "@/components/command-bar";
import AaronIcon from "@/components/aaron-icon";
import { useSocket } from "@/hooks/use-socket";
import { useConversationStore } from "@/store/conversation";
import { formatDistanceToNow } from "date-fns";
import aaronLogo from "@assets/Asset 14@4x_1754418674283.png";

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
      <div className="p-4 border-b border-gray-200 bg-white flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-medium text-gray-900" style={{ fontSize: '15px' }}>Aaron</h2>
            <p className="text-xs text-gray-500">AI OS Agent</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearChat}
            className="text-gray-600 hover:bg-gray-50 text-xs"
          >
            Clear
          </Button>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <AaronIcon size={40} className="mx-auto mb-3 text-gray-400" />
              <h3 className="font-medium text-gray-900 mb-1" style={{ fontSize: '15px' }}>Good afternoon</h3>
              <p className="text-gray-500 text-sm">How can I help you today?</p>
            </div>
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
                className={`rounded-lg p-3 max-w-3xl ${
                  message.role === "user"
                    ? "bg-[#f5f6f8] text-black"
                    : "bg-white text-black"
                }`}
              >
                <p className="whitespace-pre-wrap" style={{ fontSize: '15px', lineHeight: '1.5' }}>{message.content}</p>
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
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
              <img src={aaronLogo} alt="Aaron" className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <div className="bg-white rounded-lg p-3 max-w-3xl">
                <div className="flex items-center gap-2">
                  <img src={aaronLogo} alt="Aaron" className="w-4 h-4" />
                  <span className="text-sm text-gray-700">Aaron is thinking...</span>
                </div>
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
