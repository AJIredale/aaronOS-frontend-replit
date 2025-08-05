import { useState } from "react";
import { Card } from "@/components/ui/card";
import AaronIcon from "@/components/aaron-icon";
import AgentStatus from "@/components/agent-status";
import { useAgentState } from "@/hooks/use-agent-state";
import { MessageSquare, Brain, CheckSquare, Settings } from "lucide-react";

export default function Sidebar() {
  const [activeTab, setActiveTab] = useState("conversation");
  const { agentStatus } = useAgentState();

  const navItems = [
    { id: "conversation", label: "Conversation", icon: MessageSquare },
    { id: "memory", label: "Memory", icon: Brain },
    { id: "tasks", label: "Tasks", icon: CheckSquare },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="w-80 bg-[var(--aaron-dark)] text-white flex flex-col border-r border-gray-800">
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <AaronIcon size={32} className="text-white" />
          <div>
            <h1 className="text-xl font-semibold">aaron</h1>
            <p className="text-sm text-gray-400">AI OS Agent</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors w-full text-left ${
                  isActive
                    ? "bg-[var(--aaron-accent)] text-white"
                    : "text-gray-300 hover:bg-[var(--aaron-secondary)]"
                }`}
              >
                <Icon size={20} className="opacity-60" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Agent Status */}
      <div className="p-4 border-t border-gray-700">
        <AgentStatus />
      </div>
    </div>
  );
}
