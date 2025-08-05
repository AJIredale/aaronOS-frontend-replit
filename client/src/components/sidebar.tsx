import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import AaronIcon from "@/components/aaron-icon";
import AgentStatus from "@/components/agent-status";
import { useAgentState } from "@/hooks/use-agent-state";
import { MessageSquare, Settings, Plus, User, CreditCard, HelpCircle } from "lucide-react";
import aaronOSLogo from "@assets/aaron OS Logo Light New@4x_1754411629245.png";

export default function Sidebar() {
  const { agentStatus } = useAgentState();
  const [showSettings, setShowSettings] = useState(false);

  const chatHistory = [
    { id: 1, title: "Build React Dashboard", lastMessage: "Dashboard complete with analytics..." },
    { id: 2, title: "Debug API Issues", lastMessage: "Fixed CORS and authentication..." },
    { id: 3, title: "Create User Interface", lastMessage: "Designed modern UI components..." },
    { id: 4, title: "Database Migration", lastMessage: "Successfully migrated to PostgreSQL..." },
    { id: 5, title: "Deploy Application", lastMessage: "Deployed to production environment..." },
  ];

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

      {/* Agent Status */}
      <div className="p-4">
        <AgentStatus />
      </div>

      {/* New Chat Button */}
      <div className="px-4 mb-4">
        <Button className="w-full justify-start gap-2 bg-gray-700 hover:bg-gray-600 text-white border-none">
          <Plus size={16} />
          New chat
        </Button>
      </div>

      {/* Chat History */}
      <div className="flex-1 px-4 pb-4 overflow-y-auto">
        <div className="space-y-2">
          {chatHistory.map((chat) => (
            <button
              key={chat.id}
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
