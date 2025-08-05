import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useSocket } from "@/hooks/use-socket";
import { useAgentState } from "@/hooks/use-agent-state";
import { Clock, Activity, Database } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function ActivityPanel() {
  const { agentStatus } = useAgentState();
  
  const { data: activeContext } = useQuery({
    queryKey: ["/api/context/active"],
    refetchInterval: 2000,
  });

  const { data: tasks } = useQuery({
    queryKey: ["/api/tasks"],
    refetchInterval: 2000,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "thinking": return "bg-yellow-500";
      case "executing": return "bg-[var(--aaron-accent)]";
      case "idle": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "thinking": return "Analyzing";
      case "executing": return "Working";
      case "idle": return "Ready";
      default: return "Unknown";
    }
  };

  const activeTasks = tasks?.filter((task: any) => task?.status === "in_progress") || [];
  const recentActions = [
    { action: "Processed user message", time: new Date(), type: "message" },
    { action: "Updated task status", time: new Date(Date.now() - 30000), type: "task" },
    { action: "Retrieved context data", time: new Date(Date.now() - 60000), type: "memory" },
  ];

  return (
    <div className="w-96 border-l border-gray-200 bg-gray-50 flex flex-col">
      <div className="p-4 border-b border-gray-200 bg-white flex-shrink-0">
        <h3 className="font-semibold text-gray-900">Aaron's Activity</h3>
        <p className="text-sm text-gray-500">Real-time task execution</p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {/* Current Status */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-2 h-2 rounded-full animate-pulse ${getStatusColor((agentStatus as any)?.status || "idle")}`} />
            <span className="text-sm font-medium text-gray-900">
              {getStatusText((agentStatus as any)?.status || "idle")}
            </span>
          </div>
          {(agentStatus as any)?.currentTask && (
            <p className="text-sm text-gray-600 mb-3">{(agentStatus as any).currentTask}</p>
          )}
          {(agentStatus as any)?.status === "executing" && (
            <div className="bg-gray-100 rounded p-2">
              <div className="font-mono text-xs text-gray-700">
                <div className="flex items-center gap-1">
                  <Activity size={12} />
                  <span>Processing request...</span>
                </div>
                <div className="text-[var(--aaron-accent)] mt-1">█</div>
              </div>
            </div>
          )}
        </Card>

        {/* Active Tasks */}
        {activeTasks.length > 0 && (
          <Card className="p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center gap-2">
              <Activity size={16} />
              Active Tasks
            </h4>
            <div className="space-y-2">
              {activeTasks.map((task: any) => (
                <div key={task.id} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 truncate">{task.title}</span>
                  <Badge variant="secondary" className="text-xs">
                    {task.status}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Memory Context */}
        <Card className="p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center gap-2">
            <Database size={16} />
            Active Context
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600">Conversation History</span>
              <span className="text-[var(--aaron-accent)]">1.2k tokens</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600">Task Context</span>
              <span className="text-[var(--aaron-accent)]">{((activeContext as any)?.totalTokens || 0).toLocaleString()} tokens</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600">System Instructions</span>
              <span className="text-[var(--aaron-accent)]">0.5k tokens</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Total Usage</span>
              <span className="text-gray-700 font-medium">
                {Math.round((((activeContext as any)?.totalTokens || 0) + 1700) / 1000 * 10) / 10}k / 15k tokens
              </span>
            </div>
            <Progress 
              value={(((activeContext as any)?.totalTokens || 0) + 1700) / 15000 * 100} 
              className="mt-1 h-1.5"
            />
          </div>
        </Card>

        {/* Recent Actions */}
        <Card className="p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center gap-2">
            <Clock size={16} />
            Recent Actions
          </h4>
          <div className="space-y-2">
            {recentActions.map((action, index) => (
              <div key={index} className="flex items-center gap-2 text-xs text-gray-600">
                <div className="w-1 h-1 bg-gray-400 rounded-full flex-shrink-0" />
                <span className="flex-1 truncate">{action.action}</span>
                <span className="text-gray-400 flex-shrink-0">
                  {formatDistanceToNow(action.time, { addSuffix: true })}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
