import { Card } from "@/components/ui/card";
import AaronIcon from "@/components/aaron-icon";
import { useAgentState } from "@/hooks/use-agent-state";
import { formatDistanceToNow } from "date-fns";

export default function AgentStatus() {
  const { agentStatus } = useAgentState();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "thinking": return "bg-yellow-400";
      case "executing": return "bg-[var(--aaron-accent)]";
      case "idle": return "bg-green-400";
      default: return "bg-gray-400";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "thinking": return "Thinking";
      case "executing": return "Working";
      case "idle": return "Ready";
      default: return "Unknown";
    }
  };

  const getStatusDescription = (status: string, currentTask?: string | null) => {
    if (currentTask) return currentTask;
    
    switch (status) {
      case "thinking": return "Processing request...";
      case "executing": return "Executing tasks...";
      case "idle": return "Waiting for instructions";
      default: return "Status unknown";
    }
  };

  return (
    <Card className="p-3 bg-[var(--aaron-secondary)] border-gray-600">
      <div className="flex items-center gap-3">
        <div className="relative">
          <AaronIcon 
            size={24} 
            className={`text-gray-300 ${(agentStatus as any)?.status !== "idle" ? "aaron-shimmer" : ""}`}
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm text-white">
            {getStatusText((agentStatus as any)?.status || "idle")}
          </p>
          <p className="text-xs text-gray-400 truncate">
            {getStatusDescription((agentStatus as any)?.status || "idle", (agentStatus as any)?.currentTask)}
          </p>
        </div>
        <div className={`w-2 h-2 rounded-full animate-pulse ${getStatusColor((agentStatus as any)?.status || "idle")}`} />
      </div>
      
      {(agentStatus as any)?.lastActivity && (
        <div className="mt-2 pt-2 border-t border-gray-600">
          <p className="text-xs text-gray-500">
            Last active: {formatDistanceToNow(new Date((agentStatus as any).lastActivity), { addSuffix: true })}
          </p>
        </div>
      )}
    </Card>
  );
}
