import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useConversationStore } from "@/store/conversation";
import AaronIcon from "@/components/aaron-icon";
import { useAgentState } from "@/hooks/use-agent-state";
import { MessageSquare, Settings, Plus, User, CreditCard, HelpCircle, Search, Edit } from "lucide-react";
import aaronOSLogo from "@assets/aaron OS Logo Light New@4x_1754411629245.png";

export default function Sidebar() {
  const { agentStatus } = useAgentState();
  const [showSettings, setShowSettings] = useState(false);
  const { clearMessages, setCurrentConversation } = useConversationStore();

  const chatHistory = [
    { 
      id: 1, 
      title: "Build React Dashboard", 
      lastMessage: "Dashboard complete with analytics...",
      demoMessages: [
        { role: "user", content: "Create a React dashboard with analytics charts and user management" },
        { role: "assistant", content: "I'll create a comprehensive React dashboard with analytics charts, user management, and modern UI components." }
      ]
    },
    { 
      id: 2, 
      title: "Create Google Sheets Automation", 
      lastMessage: "Automated data scraping and sheet updates...",
      demoMessages: [
        { role: "user", content: "Build a system to scrape product data from websites and automatically update Google Sheets" },
        { role: "assistant", content: "I'll create a web scraping automation that collects product data and updates your Google Sheets in real-time." }
      ]
    },
    { 
      id: 3, 
      title: "Mobile App Development", 
      lastMessage: "React Native app with authentication...",
      demoMessages: [
        { role: "user", content: "Develop a mobile app for task management with user authentication" },
        { role: "assistant", content: "I'll build a React Native task management app with secure authentication and offline capabilities." }
      ]
    },
    { 
      id: 4, 
      title: "Database Migration", 
      lastMessage: "Successfully migrated to PostgreSQL...",
      demoMessages: [
        { role: "user", content: "Help me migrate my MySQL database to PostgreSQL with zero downtime" },
        { role: "assistant", content: "I'll guide you through a zero-downtime migration from MySQL to PostgreSQL with data validation." }
      ]
    },
    { 
      id: 5, 
      title: "API Integration", 
      lastMessage: "Connected payment and email services...",
      demoMessages: [
        { role: "user", content: "Integrate Stripe payments and SendGrid email service into my app" },
        { role: "assistant", content: "I'll integrate Stripe for payments and SendGrid for email notifications with proper error handling." }
      ]
    },
  ];

  const handleNewChat = () => {
    clearMessages();
    setCurrentConversation("new-" + Date.now());
  };

  const handleChatSelect = (chat: any) => {
    clearMessages();
    setCurrentConversation(chat.id.toString());
    // Add demo messages for the selected chat
    chat.demoMessages.forEach((msg: any, index: number) => {
      setTimeout(() => {
        useConversationStore.getState().addMessage({
          id: `demo-${chat.id}-${index}`,
          conversationId: chat.id.toString(),
          role: msg.role,
          content: msg.content,
          timestamp: new Date(),
          metadata: {}
        });
      }, index * 100);
    });
  };

  return (
    <div className="w-64 bg-[var(--aaron-dark)] text-white flex flex-col border-r border-gray-800">
      {/* Logo Section */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <img 
            src={aaronOSLogo} 
            alt="AaronOS" 
            className="h-6 w-auto"
          />
        </div>
      </div>

      {/* Navigation Options */}
      <div className="p-4 space-y-3">
        <button 
          onClick={handleNewChat}
          className="w-full flex items-center gap-3 text-gray-300 hover:text-white transition-colors"
        >
          <Edit size={16} />
          <span className="text-sm">New Task</span>
        </button>
        <button className="w-full flex items-center gap-3 text-gray-300 hover:text-white transition-colors">
          <Search size={16} />
          <span className="text-sm">Search Chat</span>  
        </button>
      </div>

      {/* Chat History */}
      <div className="flex-1 px-4 pb-4 overflow-y-hidden hover:overflow-y-auto slim-scrollbar">
        <div className="space-y-2">
          {chatHistory.map((chat) => (
            <button
              key={chat.id}
              onClick={() => handleChatSelect(chat)}
              className="w-full text-left p-3 rounded-lg hover:bg-gray-700 transition-colors group"
            >
              <div className="flex items-start gap-2">
                <MessageSquare size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="text-sm text-white font-medium truncate">
                    {chat.title}
                  </div>
                  <div className="text-xs text-gray-400 truncate mt-1">
                    {chat.lastMessage}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
      
      {/* User Profile */}
      <div className="p-4">
        <div className="w-full space-y-2">
          <Dialog open={showSettings} onOpenChange={setShowSettings}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 text-gray-300 hover:text-white hover:bg-gray-700"
              >
                <Settings size={16} />
                Settings
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <div className="flex">
                {/* Settings Sidebar */}
                <div className="w-48 border-r pr-4">
                  <div className="space-y-1">
                    <Button variant="ghost" className="w-full justify-start text-sm">
                      <User className="mr-2 h-4 w-4" />
                      Account
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-sm bg-gray-100">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-sm">
                      <CreditCard className="mr-2 h-4 w-4" />
                      Usage
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-sm">
                      <HelpCircle className="mr-2 h-4 w-4" />
                      Help
                    </Button>
                  </div>
                </div>

                {/* Settings Content */}
                <div className="flex-1 pl-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Account Settings</h3>
                      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                          <User className="text-white" size={24} />
                        </div>
                        <div>
                          <div className="font-medium">Demo User</div>
                          <div className="text-sm text-gray-500">user@aaronos.com</div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">AaronOS Pro</h4>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm">Monthly credits</span>
                          <span className="text-sm font-medium">0 / 15,000</span>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm">Free credits</span>
                          <span className="text-sm">133</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Add-on credits</span>
                          <span className="text-sm">10,575</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">Daily refresh credits</h4>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Refresh to 300 at 01:00 every day</span>
                          <span className="text-sm font-medium">0</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <div className="bg-gray-700 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">U</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-white text-sm font-medium">Demo User</div>
                <div className="text-gray-400 text-xs truncate">user@aaronos.com</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
