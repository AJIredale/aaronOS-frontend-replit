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
  const [userMenuOpen, setUserMenuOpen] = useState(false);
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
            style={{ height: "1.8rem", width: "auto" }}
          />
        </div>
      </div>

      {/* Navigation Options */}
      <div className="px-4 py-3 space-y-1">
        <button 
          onClick={handleNewChat}
          className="w-full flex items-center gap-3 py-1.5 px-2 text-gray-300 hover:text-white transition-all duration-200 ease-in-out rounded-lg hover:bg-[rgb(37,46,59)] hover:scale-[1.02]"
        >
          <div className="w-4 h-4 rounded-full border border-current flex items-center justify-center transition-all duration-200 ease-in-out">
            <Plus size={10} />
          </div>
          <span className="text-sm">New Task</span>
        </button>
        <button 
          className="w-full flex items-center gap-3 py-1.5 px-2 text-gray-300 hover:text-white transition-all duration-200 ease-in-out rounded-lg hover:bg-[rgb(37,46,59)] hover:scale-[1.02]"
        >
          <Search size={16} className="transition-all duration-200 ease-in-out" />
          <span className="text-sm">Search Chat</span>  
        </button>
      </div>

      {/* Divider and Recent Work Label */}
      <div className="px-4">
        <div className="border-t border-gray-700 opacity-30 mb-3"></div>
        <div className="mb-3">
          <span className="text-xs text-gray-500 font-medium">Recent Work</span>
        </div>
      </div>

      {/* Chat History */}
      <div className="flex-1 px-4 pb-4 overflow-y-hidden hover:overflow-y-auto slim-scrollbar">
        <div className="space-y-1">
          {chatHistory.map((chat) => (
            <div
              key={chat.id}
              className="group flex items-center rounded-lg transition-all duration-200 ease-in-out relative hover:bg-[rgb(37,46,59)] hover:scale-[1.01]"
            >
              <button
                onClick={() => handleChatSelect(chat)}
                className="flex-1 text-left text-sm text-white font-normal truncate py-2 pl-2 pr-1 transition-all duration-200 ease-in-out"
              >
                {chat.title}
              </button>
              
              <div className="opacity-0 group-hover:opacity-100 transition-opacity pr-2 flex items-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 hover:bg-gray-600 flex items-center justify-center transition-all duration-200 ease-in-out hover:scale-110"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreHorizontal size={14} className="text-gray-400 transition-all duration-200 ease-in-out" />
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
        <DropdownMenu open={userMenuOpen} onOpenChange={setUserMenuOpen}>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              className="w-full justify-between gap-3 text-white hover:text-white rounded-lg border-0 px-3 focus:outline-none focus:ring-0 focus:border-0 transition-all duration-200 ease-in-out"
              style={{
                paddingTop: "1.5rem",
                paddingBottom: "1.5rem", 
                minHeight: "50px",
                backgroundColor: "transparent"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "rgb(37, 46, 59)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center transition-all duration-200 ease-in-out hover:bg-blue-400">
                  <User size={16} className="text-white" />
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium">User</span>
                  <span className="text-xs text-gray-300">user@aaronos.com</span>
                </div>
              </div>
              <svg 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                className={`text-gray-400 transition-transform duration-200 ease-in-out ${userMenuOpen ? 'rotate-180' : 'rotate-0'}`}
              >
                <polyline points="6,9 12,15 18,9"/>
              </svg>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align="start" 
            side="top"
            className="w-64 mb-2 bg-white rounded-xl shadow-lg border border-gray-200"
          >
            <DropdownMenuItem 
              onClick={() => setShowSettings(true)}
              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg cursor-pointer transition-all duration-200 ease-in-out hover:scale-[1.02]"
            >
              <Settings size={18} className="text-gray-500 transition-all duration-200 ease-in-out" />
              <span className="text-sm font-medium">Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg cursor-pointer transition-all duration-200 ease-in-out hover:scale-[1.02]">
              <div className="w-[18px] h-[18px] flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-500 transition-all duration-200 ease-in-out">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                  <line x1="8" y1="21" x2="16" y2="21"/>
                  <line x1="12" y1="17" x2="12" y2="21"/>
                </svg>
              </div>
              <span className="text-sm font-medium">System</span>
            </DropdownMenuItem>
            <div className="border-t border-gray-200 my-1" />
            <DropdownMenuItem className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer transition-all duration-200 ease-in-out hover:scale-[1.02]">
              <div className="w-[18px] h-[18px] flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-500 transition-all duration-200 ease-in-out">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16,17 21,12 16,7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
              </div>
              <span className="text-sm font-medium">Sign out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Dialog open={showSettings} onOpenChange={setShowSettings}>
          <DialogContent className="max-w-5xl h-[600px] overflow-hidden">
              <DialogHeader>
                <DialogTitle>Profile & Settings</DialogTitle>
              </DialogHeader>
              <div className="flex h-full items-start">
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
                      onClick={() => setActiveTab("connected")}
                      className={`w-full text-left px-3 py-2 text-sm rounded-lg ${
                        activeTab === "connected" ? "text-gray-900 bg-gray-100" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      }`}
                    >
                      Connected apps
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
                <div className="flex-1 pl-6 overflow-y-auto flex flex-col">
                  {activeTab === "account" && (
                    <div className="space-y-6 flex-1" style={{ alignSelf: 'flex-start', width: '100%' }}>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Account</h3>
                        <div className="space-y-4">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-[var(--aaron-dark)] rounded-full flex items-center justify-center">
                              <User size={32} className="text-white" />
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">AJ Iredale</div>
                              <div className="text-sm text-gray-500">ajeiredale@gmail.com</div>
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
                              <input type="text" defaultValue="Iredale" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Email</label>
                            <input type="email" defaultValue="ajeiredale@gmail.com" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "settings" && (
                    <div className="space-y-6 flex-1" style={{ alignSelf: 'flex-start', width: '100%' }}>
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
                    <div className="space-y-6 flex-1" style={{ alignSelf: 'flex-start', width: '100%' }}>
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

                  {activeTab === "connected" && (
                    <div className="space-y-6 flex-1" style={{ alignSelf: 'flex-start', width: '100%' }}>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Connected apps</h3>
                        
                        {/* Search bar */}
                        <div className="mb-6">
                          <input 
                            type="text" 
                            placeholder="Search apps..." 
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        
                        {/* Connected Apps List */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white text-sm font-medium">G</div>
                              <div>
                                <div className="font-medium text-sm">Google Drive</div>
                                <div className="text-xs text-gray-500">Access and manage files from Google Drive</div>
                              </div>
                            </div>
                            <Button variant="outline" size="sm">Connect</Button>
                          </div>
                          
                          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white text-sm font-medium">O</div>
                              <div>
                                <div className="font-medium text-sm">Microsoft OneDrive</div>
                                <div className="text-xs text-gray-500">Sync files from your OneDrive account</div>
                              </div>
                            </div>
                            <Button variant="outline" size="sm">Connect</Button>
                          </div>
                          
                          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white text-sm font-medium">N</div>
                              <div>
                                <div className="font-medium text-sm">Notion</div>
                                <div className="text-xs text-gray-500">Import pages and databases from Notion</div>
                              </div>
                            </div>
                            <Button variant="outline" size="sm">Connect</Button>
                          </div>
                          
                          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center text-white text-sm font-medium">S</div>
                              <div>
                                <div className="font-medium text-sm">Slack</div>
                                <div className="text-xs text-gray-500">Send messages and notifications to Slack</div>
                              </div>
                            </div>
                            <Button variant="outline" size="sm">Connect</Button>
                          </div>
                          
                          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center text-white text-sm font-medium">G</div>
                              <div>
                                <div className="font-medium text-sm">Gmail</div>
                                <div className="text-xs text-gray-500">Read and send emails through Gmail</div>
                              </div>
                            </div>
                            <Button variant="outline" size="sm">Connect</Button>
                          </div>
                          
                          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center text-white text-sm font-medium">S</div>
                              <div>
                                <div className="font-medium text-sm">Spotify</div>
                                <div className="text-xs text-gray-500">Control music playback and playlists</div>
                              </div>
                            </div>
                            <Button variant="outline" size="sm">Connect</Button>
                          </div>
                          
                          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-blue-700 rounded-lg flex items-center justify-center text-white text-sm font-medium">D</div>
                              <div>
                                <div className="font-medium text-sm">Dropbox</div>
                                <div className="text-xs text-gray-500">Access files stored in Dropbox</div>
                              </div>
                            </div>
                            <Button variant="outline" size="sm">Connect</Button>
                          </div>
                          
                          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-pink-500 rounded-lg flex items-center justify-center text-white text-sm font-medium">F</div>
                              <div>
                                <div className="font-medium text-sm">Figma</div>
                                <div className="text-xs text-gray-500">Import designs and collaborate on Figma files</div>
                              </div>
                            </div>
                            <Button variant="outline" size="sm">Connect</Button>
                          </div>
                          
                          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center text-white text-sm font-medium">G</div>
                              <div>
                                <div className="font-medium text-sm">GitHub</div>
                                <div className="text-xs text-gray-500">Access repositories and manage code</div>
                              </div>
                            </div>
                            <Button variant="outline" size="sm">Connect</Button>
                          </div>
                          
                          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white text-sm font-medium">T</div>
                              <div>
                                <div className="font-medium text-sm">Trello</div>
                                <div className="text-xs text-gray-500">Manage boards and organize tasks</div>
                              </div>
                            </div>
                            <Button variant="outline" size="sm">Connect</Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "help" && (
                    <div className="space-y-6 flex-1" style={{ alignSelf: 'flex-start', width: '100%' }}>
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
