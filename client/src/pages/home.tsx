import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Mic, Send, MicOff, Plus, Paperclip, Image, Code, Database, Lightbulb, MoreHorizontal, ArrowUp, Wand2 } from "lucide-react";
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

          {/* Input Form - Match exact GPT layout */}
          <form onSubmit={handleSubmit} className="relative">
            <div className="relative bg-white border border-gray-200 rounded-3xl shadow-sm hover:shadow-md transition-all duration-200 ease-out focus-within:shadow-md focus-within:border-gray-200">
              <div className="flex items-center px-4 py-2 min-h-[52px] transition-all duration-200 ease-out">
                {/* Plus Button with Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 mr-3 hover:bg-gray-100 flex-shrink-0"
                    >
                      <Plus size={16} className="text-gray-500" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-64">
                    <DropdownMenuItem>
                      <Paperclip className="mr-3 h-4 w-4" />
                      <span>Add photos & files</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Wand2 className="mr-3 h-4 w-4" />
                      <span>Agent mode</span>
                      <span className="ml-auto text-xs bg-gray-100 px-2 py-1 rounded">NEW</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Database className="mr-3 h-4 w-4" />
                      <span>Deep research</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Image className="mr-3 h-4 w-4" />
                      <span>Create image</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Lightbulb className="mr-3 h-4 w-4" />
                      <span>Think longer</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <MoreHorizontal className="mr-3 h-4 w-4" />
                      <span>More</span>
                      <svg className="ml-auto h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8.59 16.59L13.17 12L8.59 7.41L10 6l6 6-6 6-1.41-1.41z"/>
                      </svg>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <Input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask anything"
                  className="flex-1 border-0 bg-transparent text-base placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0"
                  style={{ 
                    fontSize: '16px',
                    lineHeight: '36px',
                    height: '36px',
                    padding: '0',
                    verticalAlign: 'middle'
                  }}
                />
                
                <div className="flex items-center gap-2 ml-3">
                  {/* Microphone Button */}
                  <Button
                    type="button"
                    onClick={toggleVoice}
                    size="sm"
                    variant="ghost"
                    className={`h-7 w-7 p-0 rounded-full transition-colors flex-shrink-0 ${
                      isListening 
                        ? "bg-red-500 hover:bg-red-600 text-white" 
                        : "hover:bg-gray-100 text-gray-500"
                    }`}
                  >
                    {isListening ? <MicOff style={{width: "1.1rem", height: "1.1rem"}} /> : (
                      <svg width="1.1rem" height="1.1rem" viewBox="0 0 24 24" fill="currentColor" style={{width: "1.1rem", height: "1.1rem"}}>
                        <path d="M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
                        <path d="M19 10v1a7 7 0 0 1-14 0v-1" fill="none" stroke="currentColor" strokeWidth="2"/>
                        <path d="M12 18v4" fill="none" stroke="currentColor" strokeWidth="2"/>
                        <path d="M8 22h8" fill="none" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                    )}
                  </Button>

                  {/* Dynamic send/voice button - LOCKED FUNCTIONALITY */}
                  {message.trim() ? (
                    <Button
                      type="submit"
                      size="sm"
                      className="h-7 w-7 p-0 bg-black hover:bg-gray-800 text-white rounded-full flex-shrink-0"
                    >
                      <ArrowUp size={14} />
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      size="sm"
                      className="h-7 w-7 p-0 rounded-full transition-colors flex-shrink-0 bg-gray-200 hover:bg-gray-300 text-gray-600"
                    >
                      <svg width="1.1rem" height="1.1rem" viewBox="0 0 24 24" fill="currentColor" style={{width: "1.1rem", height: "1.1rem"}}>
                        <rect x="6" y="10" width="1.5" height="4" rx="0.75"/>
                        <rect x="9.25" y="8" width="1.5" height="8" rx="0.75"/>
                        <rect x="12.5" y="6" width="1.5" height="12" rx="0.75"/>
                        <rect x="15.75" y="8" width="1.5" height="8" rx="0.75"/>
                      </svg>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}