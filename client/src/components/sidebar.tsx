import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useConversationStore } from "@/store/conversation";
import AaronIcon from "@/components/aaron-icon";
import { useAgentState } from "@/hooks/use-agent-state";
import { MessageSquare, Settings, Plus, User, CreditCard, HelpCircle, Search, Edit, MoreHorizontal, Edit2, Archive, Trash2 } from "lucide-react";
import aaronOSLogo from "@assets/aaron OS Logo Light New@4x_1754411629245.png";

export default function Sidebar() {
  const { agentStatus } = useAgentState();
  const [showSettings, setShowSettings] = useState(false);
  const [activeTab, setActiveTab] = useState("account");
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
      <div className="px-4 py-3 space-y-1">
        <button 
          onClick={handleNewChat}
          className="w-full flex items-center gap-3 py-1.5 px-2 text-gray-300 hover:text-white transition-colors rounded-lg"
          style={{
            '--hover-bg': 'rgb(37 46 59)'
          } as any}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgb(37 46 59)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <div className="w-4 h-4 rounded-full border border-current flex items-center justify-center">
            <Plus size={10} />
          </div>
          <span className="text-sm">New Task</span>
        </button>
        <button 
          className="w-full flex items-center gap-3 py-1.5 px-2 text-gray-300 hover:text-white transition-colors rounded-lg"
          style={{
            '--hover-bg': 'rgb(37 46 59)'
          } as any}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgb(37 46 59)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <Search size={16} />
          <span className="text-sm">Search Chat</span>  
        </button>
      </div>

      {/* Chat History */}
      <div className="flex-1 px-4 pb-4 overflow-y-hidden hover:overflow-y-auto slim-scrollbar">
        <div className="space-y-1">
          {chatHistory.map((chat) => (
            <div
              key={chat.id}
              className="group flex items-center rounded-lg transition-colors relative"
              style={{
                '--hover-bg': 'rgb(37 46 59)'
              } as any}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgb(37 46 59)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <button
                onClick={() => handleChatSelect(chat)}
                className="flex-1 text-left text-sm text-white font-normal truncate"
                style={{ padding: '0.4rem' }}
              >
                {chat.title}
              </button>
              
              <div className="opacity-0 group-hover:opacity-100 transition-opacity pr-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 hover:bg-gray-600"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreHorizontal size={14} className="text-gray-400" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem className="flex items-center gap-2">
                      <Edit2 size={14} />
                      Rename
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center gap-2">
                      <Archive size={14} />
                      Archive
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center gap-2 text-red-600">
                      <Trash2 size={14} />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* User Profile */}
      <div className="p-4 border-t border-gray-700">
        <Dialog open={showSettings} onOpenChange={setShowSettings}>
          <DialogTrigger asChild>
            <Button 
              variant="ghost" 
              className="w-full justify-start gap-2 text-gray-300 hover:text-white"
              style={{
                '--hover-bg': 'rgb(37 46 59)'
              } as any}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgb(37 46 59)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <User size={16} />
              AJ Wilson
            </Button>
          </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Profile & Settings</DialogTitle>
              </DialogHeader>
              <div className="flex">
                {/* Settings Sidebar */}
                <div className="w-48 pr-6 border-r border-gray-200">
                  <div className="space-y-1">
                    <button 
                      onClick={() => setActiveTab("account")}
                      className={`w-full text-left px-3 py-2 text-sm font-medium rounded-lg ${
                        activeTab === "account" ? "text-gray-900 bg-gray-100" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      }`}
                    >
                      Account
                    </button>
                    <button 
                      onClick={() => setActiveTab("settings")}
                      className={`w-full text-left px-3 py-2 text-sm rounded-lg ${
                        activeTab === "settings" ? "text-gray-900 bg-gray-100" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      }`}
                    >
                      Settings
                    </button>
                    <button 
                      onClick={() => setActiveTab("usage")}
                      className={`w-full text-left px-3 py-2 text-sm rounded-lg ${
                        activeTab === "usage" ? "text-gray-900 bg-gray-100" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      }`}
                    >
                      Usage
                    </button>
                    <button 
                      onClick={() => setActiveTab("help")}
                      className={`w-full text-left px-3 py-2 text-sm rounded-lg ${
                        activeTab === "help" ? "text-gray-900 bg-gray-100" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      }`}
                    >
                      Help
                    </button>
                  </div>
                </div>

                {/* Settings Content */}
                <div className="flex-1 pl-6">
                  {activeTab === "account" && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Account</h3>
                        <div className="space-y-4">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-[var(--aaron-dark)] rounded-full flex items-center justify-center">
                              <User size={32} className="text-white" />
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">AJ Wilson</div>
                              <div className="text-sm text-gray-500">aj@example.com</div>
                              <div className="text-xs text-[var(--aaron-accent)] mt-1">Core Plan</div>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 mt-6">
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-gray-700">First Name</label>
                              <input type="text" defaultValue="AJ" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-gray-700">Last Name</label>
                              <input type="text" defaultValue="Wilson" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Email</label>
                            <input type="email" defaultValue="aj@example.com" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "settings" && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Settings</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-sm font-medium text-gray-700">Enable notifications</div>
                              <div className="text-xs text-gray-500">Get notified when tasks complete</div>
                            </div>
                            <input type="checkbox" className="toggle" defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-sm font-medium text-gray-700">Auto-save conversations</div>
                              <div className="text-xs text-gray-500">Automatically save chat history</div>
                            </div>
                            <input type="checkbox" className="toggle" defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-sm font-medium text-gray-700">Dark mode</div>
                              <div className="text-xs text-gray-500">Use dark interface theme</div>
                            </div>
                            <input type="checkbox" className="toggle" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "usage" && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Usage & Credits</h3>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-600">Monthly Credits</span>
                            <span className="text-sm font-medium">1,247 / 2,500</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-[var(--aaron-accent)] h-2 rounded-full" style={{width: '49.88%'}}></div>
                          </div>
                          <div className="text-xs text-gray-500 mt-2">Resets in 12 days</div>
                          
                          <div className="grid grid-cols-3 gap-4 mt-4">
                            <div className="text-center">
                              <div className="text-lg font-semibold text-gray-900">156</div>
                              <div className="text-xs text-gray-500">Tasks Completed</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-semibold text-gray-900">2.4s</div>
                              <div className="text-xs text-gray-500">Avg Response</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-semibold text-gray-900">98.2%</div>
                              <div className="text-xs text-gray-500">Success Rate</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "help" && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Help & Support</h3>
                        <div className="space-y-2">
                          <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                            <div className="font-medium text-sm">Documentation</div>
                            <div className="text-xs text-gray-500">Learn how to use AaronOS effectively</div>
                          </button>
                          <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                            <div className="font-medium text-sm">Contact Support</div>
                            <div className="text-xs text-gray-500">Get help from our team</div>
                          </button>
                          <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                            <div className="font-medium text-sm">Feature Requests</div>
                            <div className="text-xs text-gray-500">Suggest improvements to AaronOS</div>
                          </button>
                          <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                            <div className="font-medium text-sm">Keyboard Shortcuts</div>
                            <div className="text-xs text-gray-500">Learn productivity shortcuts</div>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
