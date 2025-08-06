import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mic, Send, MicOff, Wand2 } from "lucide-react";
import Sidebar from "@/components/sidebar";
import { useConversationStore } from "@/store/conversation";

export default function HomePage() {
  const [, setLocation] = useLocation();
  const [message, setMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  const { startNewConversation } = useConversationStore();

  const generateChatName = (userMessage: string): string => {
    // Simple smart naming based on key words
    const msg = userMessage.toLowerCase();
    
    if (msg.includes("document") || msg.includes("write") || msg.includes("create")) {
      if (msg.includes("travel")) return "Document for Travel";
      if (msg.includes("business") || msg.includes("work")) return "Business Document";
      if (msg.includes("report")) return "Report Creation";
      return "Document Creation";
    }
    
    if (msg.includes("analysis") || msg.includes("analyze")) {
      if (msg.includes("data")) return "Data Analysis";
      if (msg.includes("market")) return "Market Analysis";
      return "Analysis Task";
    }
    
    if (msg.includes("help") || msg.includes("assist")) {
      return "General Assistance";
    }
    
    if (msg.includes("code") || msg.includes("program") || msg.includes("develop")) {
      if (msg.includes("website") || msg.includes("web")) return "Web Development";
      if (msg.includes("app")) return "App Development";
      return "Coding Task";
    }
    
    if (msg.includes("plan") || msg.includes("schedule")) {
      if (msg.includes("travel") || msg.includes("trip")) return "Travel Planning";
      if (msg.includes("event")) return "Event Planning";
      return "Planning Task";
    }
    
    // Extract key words for generic naming
    const words = msg.split(" ").filter(word => 
      word.length > 3 && 
      !["with", "that", "this", "would", "could", "should", "like", "want", "need", "help", "please"].includes(word)
    );
    
    if (words.length >= 2) {
      return words.slice(0, 2).map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(" ");
    }
    
    return "New Chat";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Generate smart chat name
    const chatName = generateChatName(message);
    
    // Start new conversation with the message
    const conversationId = startNewConversation(chatName, message);
    
    // Navigate to chat view
    setLocation(`/chat/${conversationId}`);
  };

  const toggleVoice = () => {
    setIsListening(!isListening);
    // Voice functionality would be implemented here
  };

  return (
    <div className="flex h-screen bg-white">
      <Sidebar />
      
      {/* Main Content - Full Width Without Activity Panel */}
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-2xl">
          {/* Welcome Message */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-medium text-gray-900 mb-2">
              What can I do for you?
            </h1>
          </div>

          {/* Input Form - Copy exact styling from command-bar */}
          <form onSubmit={handleSubmit} className="relative">
            <div className="relative bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow focus-within:shadow-md focus-within:border-gray-200">
              <div className="flex items-center px-4 py-3 gap-3">
                <Input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask anything"
                  className="flex-1 border-0 bg-transparent text-base placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
                
                {/* Tools Button */}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1 text-gray-500 hover:text-gray-700 h-8 px-2"
                >
                  <Wand2 size={16} />
                  <span className="text-sm">Tools</span>
                </Button>

                {/* Divider */}
                <div className="w-px h-6 bg-gray-200" />

                {/* Voice Button */}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={toggleVoice}
                  className={`h-8 w-8 p-0 ${isListening ? 'text-red-500 hover:text-red-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  {isListening ? <MicOff size={20} className="w-5 h-5" /> : <Mic size={20} className="w-5 h-5" />}
                </Button>

                {/* Send Button - Only show when there's text */}
                {message.trim() && (
                  <Button
                    type="submit"
                    size="sm"
                    className="h-8 w-8 p-0 bg-gray-900 hover:bg-gray-800 text-white ml-1"
                  >
                    <Send size={16} />
                  </Button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}