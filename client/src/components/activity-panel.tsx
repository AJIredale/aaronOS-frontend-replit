import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useSocket } from "@/hooks/use-socket";
import { useAgentState } from "@/hooks/use-agent-state";
import { useActivityStore } from "@/store/activity";
import { Zap, Activity, Database, Loader2, Check, Clock, PlayCircle, CheckCircle2, AlertCircle, List } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { TaskQueueItem, StatusPipeline } from "@shared/schema";

export default function ActivityPanel() {
  const { agentStatus } = useAgentState();
  const { terminalLines, actions, isActive } = useActivityStore();

  // Fetch task queue data
  const { data: taskQueue = [] } = useQuery<TaskQueueItem[]>({
    queryKey: ['/api/task-queue'],
    refetchInterval: 2000,
  });

  // Fetch status pipeline data
  const { data: statusPipeline } = useQuery<StatusPipeline>({
    queryKey: ['/api/status-pipeline'],
    refetchInterval: 1000,
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

  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 1: return "bg-red-100 text-red-800";
      case 2: return "bg-yellow-100 text-yellow-800";
      case 3: return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityText = (priority: number) => {
    switch (priority) {
      case 1: return "High";
      case 2: return "Medium";
      case 3: return "Low";
      default: return "Unknown";
    }
  };

  const getTaskStatusIcon = (status: string) => {
    switch (status) {
      case "queued": return <Clock size={12} className="text-gray-400" />;
      case "in_progress": return <PlayCircle size={12} className="text-blue-500" />;
      case "completed": return <CheckCircle2 size={12} className="text-green-500" />;
      case "failed": return <AlertCircle size={12} className="text-red-500" />;
      default: return <Clock size={12} className="text-gray-400" />;
    }
  };

  const getStageProgress = (currentStage: string, stageName: string) => {
    const stages = ["planning", "doing", "testing", "done"];
    const currentIndex = stages.indexOf(currentStage);
    const stageIndex = stages.indexOf(stageName);
    
    if (stageIndex < currentIndex) return 100;
    if (stageIndex === currentIndex) return 65;
    return 0;
  };

  const getStageStatus = (currentStage: string, stageName: string) => {
    const stages = ["planning", "doing", "testing", "done"];
    const currentIndex = stages.indexOf(currentStage);
    const stageIndex = stages.indexOf(stageName);
    
    if (stageIndex < currentIndex) return "completed";
    if (stageIndex === currentIndex) return "active";
    return "pending";
  };

  return (
    <div className="w-96 border-l border-gray-200 bg-gray-50 flex flex-col">
      <div className="p-4 border-b border-gray-200 bg-white flex-shrink-0">
        <h3 className="font-semibold text-gray-900">Aaron's Activity</h3>
        <p className="text-sm text-gray-500">Real-time task execution</p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {/* Status Pipeline */}
        <Card className="p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
            <Activity size={16} style={{ color: '#878f9d' }} />
            Status Pipeline
          </h4>
          <div className="space-y-3">
            {statusPipeline && ["planning", "doing", "testing", "done"].map((stage) => {
              const progress = getStageProgress(statusPipeline.currentStage, stage);
              const status = getStageStatus(statusPipeline.currentStage, stage);
              
              return (
                <div key={stage} className="flex items-center gap-3">
                  <div className={`flex-shrink-0 w-3 h-3 rounded-full ${
                    status === 'completed' ? 'bg-green-500' :
                    status === 'active' ? 'bg-blue-500' : 'bg-gray-300'
                  }`} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-sm capitalize ${
                        status === 'active' ? 'font-medium text-gray-900' : 'text-gray-600'
                      }`}>
                        {stage === 'done' ? 'Done ✅' : stage}
                      </span>
                      <span className="text-xs text-gray-500">{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-1" />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Task Queue */}
        <Card className="p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
            <List size={16} style={{ color: '#878f9d' }} />
            Task Queue
          </h4>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {taskQueue.length === 0 ? (
              <div className="text-center py-4 text-gray-500 text-sm">
                No tasks in queue
              </div>
            ) : (
              taskQueue.map((task) => (
                <div key={task.id} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {getTaskStatusIcon(task.status)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-gray-900 truncate">
                          {task.title}
                        </span>
                        <Badge variant="secondary" className={`text-xs ${getPriorityColor(task.priority || 2)}`}>
                          {getPriorityText(task.priority || 2)}
                        </Badge>
                      </div>
                      {task.description && (
                        <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                          {task.description}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        {task.estimatedTime && (
                          <span className="flex items-center gap-1">
                            <Clock size={10} />
                            {task.estimatedTime}m
                          </span>
                        )}
                        <span className="capitalize">{task.status.replace('_', ' ')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Actions Table */}
        <Card className="p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
            <Zap size={16} style={{ color: '#878f9d' }} />
            Actions
          </h4>
          <div className="space-y-3">
            {actions.map((action, index) => (
              <div key={index} className="flex items-center gap-3 text-sm">
                <div className="flex-shrink-0 w-4 h-4 flex items-center justify-center">
                  {action.status === 'completed' && <Check size={16} className="text-green-500" />}
                  {action.status === 'in-progress' && <Loader2 size={16} className="text-blue-500 animate-spin" />}
                  {action.status === 'pending' && <div className="w-2 h-2 rounded-full border border-gray-300"></div>}
                </div>
                <span className="flex-1 text-gray-700">{action.action}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Terminal Output */}
        <Card className="p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
            <Activity size={16} style={{ color: '#878f9d' }} />
            Terminal
          </h4>
          <div className="rounded-lg p-3 font-mono text-xs max-h-48 overflow-y-auto" style={{
            backgroundColor: 'rgb(19 24 42)',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}>
            <style>{`
              .terminal-scroll::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            <div className="terminal-scroll">
              {terminalLines.slice(-8).map((line, index) => (
                <div key={index} className={`mb-1 ${line.startsWith('$') ? 'text-green-400' : 'text-gray-300'}`}>
                  {line}
                </div>
              ))}
              {isActive && <div className="text-green-400 animate-pulse">$ █</div>}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
