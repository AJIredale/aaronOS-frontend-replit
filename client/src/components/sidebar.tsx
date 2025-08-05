import AaronIcon from "@/components/aaron-icon";
import AgentStatus from "@/components/agent-status";
import { useAgentState } from "@/hooks/use-agent-state";

export default function Sidebar() {
  const { agentStatus } = useAgentState();

  return (
    <div className="w-64 bg-[var(--aaron-dark)] text-white flex flex-col border-r border-gray-800">
      {/* Logo Section */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <AaronIcon variant="logo" theme="dark" size={20} className="text-white" />
        </div>
      </div>

      {/* Agent Status */}
      <div className="p-4">
        <AgentStatus />
      </div>
      
      {/* Simple status indicator */}
      <div className="flex-1 flex items-end p-4">
        <div className="text-xs text-gray-500 w-full text-center">
          Ready to help
        </div>
      </div>
    </div>
  );
}
