import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import CommandBar from "@/components/command-bar";
import AaronIcon from "@/components/aaron-icon";
import { useSocket } from "@/hooks/use-socket";
import { useConversationStore, type ActivityIndicator } from "@/store/conversation";
import { useQuoteStore } from "@/store/quote";
import { formatDistanceToNow } from "date-fns";
import { Quote, Brain, Wrench, CheckCircle, Clock, ChevronRight } from "lucide-react";
import aaronLogo from "@assets/Asset 14@4x_1754418674283.png";

export default function ChatPanel() {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, activities, isTyping, addMessage } = useConversationStore();
  const { setQuote } = useQuoteStore();
  const { lastMessage } = useSocket();
  const [showQuoteButton, setShowQuoteButton] = useState(false);
  const [selectedText, setSelectedText] = useState("");
  const [selectedMessageId, setSelectedMessageId] = useState("");
  const [quoteButtonPosition, setQuoteButtonPosition] = useState({ x: 0, y: 0 });

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

  const handleTextSelection = (messageId: string) => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim().length > 0) {
      const selectedText = selection.toString().trim();
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      
      setSelectedText(selectedText);
      setSelectedMessageId(messageId);
      setQuoteButtonPosition({
        x: rect.left + (rect.width / 2),
        y: rect.top - 40
      });
      setShowQuoteButton(true);
    } else {
      setShowQuoteButton(false);
    }
  };

  const handleQuote = () => {
    if (selectedText && selectedMessageId) {
      setQuote(selectedText, selectedMessageId);
      setShowQuoteButton(false);
      setSelectedText("");
      setSelectedMessageId("");
      // Clear selection
      window.getSelection()?.removeAllRanges();
    }
  };

  useEffect(() => {
    const handleClickOutside = () => {
      setShowQuoteButton(false);
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="flex-1 flex flex-col">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-200 bg-white flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-medium text-gray-900" style={{ fontSize: '0.95rem' }}>Aaron</h2>
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
              <h3 className="font-medium text-gray-900 mb-1 text-2xl">Hi AJ, what can I handle for you?</h3>
            </div>
          </div>
        )}

        <div className="max-w-[770px] mx-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div className="max-w-2xl">
                {/* Show quoted text for user messages */}
                {message.role === "user" && message.metadata?.quotedText && (
                  <div className="mb-2 opacity-60">
                    <div className="pl-3 border-l-2 border-gray-300 text-sm text-gray-600 italic">
                      "{message.metadata.quotedText}"
                    </div>
                  </div>
                )}
                
                <div
                  className={`rounded-2xl p-3 select-text ${
                    message.role === "user"
                      ? "bg-[#f5f6f8] text-black"
                      : "bg-white text-black"
                  }`}
                  onMouseUp={() => {
                    if (message.role === "assistant") {
                      setTimeout(() => handleTextSelection(message.id), 10);
                    }
                  }}
                >
                  <p className="whitespace-pre-wrap" style={{ fontSize: '0.95rem', lineHeight: '1.5' }}>{message.content}</p>
                </div>
              </div>
            </div>
          ))}
          
          {/* Activity Indicators */}
          {activities.map((activity) => (
            <div key={activity.id} className="flex justify-start">
              <div className={`mb-4 p-3 rounded-2xl border max-w-md ${
                activity.type === "thinking" ? "bg-purple-50 border-purple-200" :
                activity.type === "working" ? "bg-orange-50 border-orange-200" :
                activity.type === "completed" ? "bg-green-50 border-green-200" :
                activity.type === "progress" ? "bg-blue-50 border-blue-200" :
                "bg-gray-50 border-gray-200"
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  {activity.type === "thinking" && <Brain size={16} className="text-purple-500" />}
                  {activity.type === "working" && <Clock size={16} className="text-orange-500 animate-pulse" />}
                  {activity.type === "completed" && <CheckCircle size={16} className="text-green-500" />}
                  {activity.type === "progress" && <Wrench size={16} className="text-blue-500" />}
                  <span className="font-medium text-sm">{activity.title}</span>
                  {activity.type !== "progress" && <ChevronRight size={14} className="text-gray-400" />}
                </div>
                
                {activity.subtitle && (
                  <p className="text-xs text-gray-600 mb-2">{activity.subtitle}</p>
                )}
                
                {activity.progress && (
                  <div className="space-y-1">
                    {activity.progress.map((item, index) => (
                      <div key={index} className="flex items-center gap-2 text-xs">
                        {item.completed ? (
                          <CheckCircle size={12} className="text-green-500" />
                        ) : (
                          <Clock size={12} className="text-gray-400" />
                        )}
                        <span className={item.completed ? "text-green-700" : "text-gray-600"}>
                          {item.name.replace(/_/g, " ")}
                        </span>
                        <ChevronRight size={10} className="text-gray-400 ml-auto" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {isTyping && (
          <div className="max-w-[770px] mx-auto">
            <div className="flex justify-start">
              <div className="bg-white rounded-lg p-3 max-w-2xl">
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

      {/* Quote Button */}
      {showQuoteButton && (
        <div
          className="fixed z-50 bg-white text-black rounded-xl px-3 py-2 shadow-lg border border-gray-200 flex items-center gap-2 cursor-pointer hover:bg-gray-50 transition-colors"
          style={{
            left: quoteButtonPosition.x - 40,
            top: quoteButtonPosition.y,
          }}
          onClick={handleQuote}
        >
          <Quote size={14} className="text-black" />
          <span className="text-sm font-medium">Quote</span>
        </div>
      )}

      {/* Command Input */}
      <div className="flex-shrink-0">
        <CommandBar />
      </div>
    </div>
  );
}
