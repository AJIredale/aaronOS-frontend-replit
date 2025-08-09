import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSocket } from "@/hooks/use-socket";
import { useAgentState } from "@/hooks/use-agent-state";
import { useActivityStore } from "@/store/activity";
import { Zap, Activity, Database, Loader2, Check, Clock, PlayCircle, CheckCircle2, AlertCircle, List, ChevronDown, ChevronRight, Terminal, Globe } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { TaskQueueItem, StatusPipeline } from "@shared/schema";

export default function ActivityPanel() {
  const { agentStatus } = useAgentState();
  const { terminalLines, actions, isActive } = useActivityStore();
  
  // Collapsible state management
  const [isLiveViewOpen, setIsLiveViewOpen] = useState(isActive);
  const [isTaskQueueOpen, setIsTaskQueueOpen] = useState(true);
  const [isActionsOpen, setIsActionsOpen] = useState(true);
  const [isStatusPipelineOpen, setIsStatusPipelineOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("terminal");
  const [panelWidth, setPanelWidth] = useState(330); // Default 30px wider
  const [isResizing, setIsResizing] = useState(false);

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
      case "queued": return <div className="w-2 h-2 rounded-full border border-gray-300"></div>;
      case "in_progress": return <Loader2 size={16} className="text-blue-500 animate-spin" />;
      case "completed": return <Check size={16} className="text-green-500" />;
      case "failed": return <AlertCircle size={16} className="text-red-500" />;
      default: return <div className="w-2 h-2 rounded-full border border-gray-300"></div>;
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

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsResizing(true);
    e.preventDefault();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing) return;
    const newWidth = window.innerWidth - e.clientX;
    setPanelWidth(Math.max(280, Math.min(500, newWidth)));
  };

  const handleMouseUp = () => {
    setIsResizing(false);
  };

  // Add event listeners for resize
  React.useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  return (
    <div className="border-l border-gray-200 bg-gray-50 flex flex-col relative" style={{ width: `${panelWidth}px` }}>
      {/* Resize handle */}
      <div 
        className="absolute left-0 top-0 w-1 h-full cursor-col-resize hover:bg-blue-400 transition-colors duration-200 z-10"
        onMouseDown={handleMouseDown}
        style={{ backgroundColor: isResizing ? '#60a5fa' : 'transparent' }}
      />
      
      <div className="p-4 border-b border-gray-200 bg-white flex-shrink-0">
        <h3 className="font-semibold text-gray-900">Aaron's Activity</h3>
        <p className="text-sm text-gray-500">Real-time task execution</p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {/* Live View (Terminal/Browser) - Only visible when active */}
        {(isActive || terminalLines.length > 0) && (
          <Card className="p-3">
            <Button 
              variant="ghost" 
              className="w-full justify-between p-2 h-auto hover:bg-gray-50 transition-colors duration-200"
              onClick={() => setIsLiveViewOpen(!isLiveViewOpen)}
            >
              <h4 className="text-sm font-medium text-gray-900 flex items-center gap-2">
                <Activity size={16} style={{ color: '#878f9d' }} />
                Live View
              </h4>
              {isLiveViewOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </Button>
            {isLiveViewOpen && (
              <div className="mt-3">
                <div className="flex rounded-lg border border-gray-200 overflow-hidden">
                  <button 
                    className={`flex-1 px-3 py-2 text-sm font-medium flex items-center justify-center gap-1 transition-colors ${
                      activeTab === 'terminal' ? 'bg-white text-gray-900' : 'bg-gray-100 text-gray-600'
                    }`}
                    onClick={() => setActiveTab('terminal')}
                  >
                    <Terminal size={12} />
                    Terminal
                  </button>
                  <button 
                    className={`flex-1 px-3 py-2 text-sm font-medium flex items-center justify-center gap-1 transition-colors ${
                      activeTab === 'browser' ? 'bg-white text-gray-900' : 'bg-gray-100 text-gray-600'
                    }`}
                    onClick={() => setActiveTab('browser')}
                  >
                    <Globe size={12} />
                    Browser
                  </button>
                </div>
                <div className="mt-3">
                  {activeTab === 'terminal' ? (
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
                  ) : (
                    <div className="rounded-lg border border-gray-200 bg-white p-3 max-h-48 overflow-y-auto">
                      <div className="space-y-2 text-xs">
                        <div className="flex items-center gap-2 text-gray-500">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span>https://docs.example.com/api</span>
                        </div>
                        <div className="bg-gray-50 p-2 rounded font-mono text-xs">
                          <div className="text-blue-600">GET /api/v1/users</div>
                          <div className="text-gray-500 mt-1">Status: 200 OK</div>
                          <div className="text-gray-500">Response time: 142ms</div>
                        </div>
                        <div className="flex items-center gap-2 text-gray-500 mt-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                          <span>Browsing documentation...</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </Card>
        )}

        {/* Task Queue */}
        <Card className="p-3">
          <Button 
            variant="ghost" 
            className="w-full justify-between p-2 h-auto hover:bg-gray-50 transition-colors duration-200"
            onClick={() => setIsTaskQueueOpen(!isTaskQueueOpen)}
          >
            <h4 className="text-sm font-medium text-gray-900 flex items-center gap-2">
              <List size={16} style={{ color: '#878f9d' }} />
              Task Queue ({taskQueue.length})
            </h4>
            {isTaskQueueOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </Button>
          {isTaskQueueOpen && (
            <div className="mt-3">
              <div className="space-y-0 max-h-64 overflow-y-auto">
                {taskQueue.length === 0 ? (
                  <div className="text-center py-4 text-gray-500 text-sm">
                    No tasks in queue
                  </div>
                ) : (
                  taskQueue.map((task) => (
                    <div key={task.id} className="flex items-center gap-3 px-3 py-2" style={{ fontSize: '0.775rem' }}>
                      <div className="flex-shrink-0 w-4 h-4 flex items-center justify-center">
                        {getTaskStatusIcon(task.status)}
                      </div>
                      <span className="flex-1 text-gray-700">{task.title}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </Card>

        {/* Actions */}
        <Card className="p-3">
          <Button 
            variant="ghost" 
            className="w-full justify-between p-2 h-auto hover:bg-gray-50 transition-colors duration-200"
            onClick={() => setIsActionsOpen(!isActionsOpen)}
          >
            <h4 className="text-sm font-medium text-gray-900 flex items-center gap-2">
              <Zap size={16} style={{ color: '#878f9d' }} />
              Actions ({actions.length})
            </h4>
            {isActionsOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </Button>
          {isActionsOpen && (
            <div className="mt-3">
              <div className="space-y-0">
                {actions.map((action, index) => (
                  <div key={index} className="flex items-center gap-3 px-3 py-2" style={{ fontSize: '0.775rem' }}>
                    <div className="flex-shrink-0 w-4 h-4 flex items-center justify-center">
                      {action.status === 'completed' && <Check size={16} className="text-green-500" />}
                      {action.status === 'in-progress' && <Loader2 size={16} className="text-blue-500 animate-spin" />}
                      {action.status === 'pending' && <div className="w-2 h-2 rounded-full border border-gray-300"></div>}
                    </div>
                    <span className="flex-1 text-gray-700">{action.action}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>

        {/* Status Pipeline */}
        <Card className="p-3">
          <Button 
            variant="ghost" 
            className="w-full justify-between p-2 h-auto hover:bg-gray-50 transition-colors duration-200"
            onClick={() => setIsStatusPipelineOpen(!isStatusPipelineOpen)}
          >
            <h4 className="text-sm font-medium text-gray-900 flex items-center gap-2">
              <Activity size={16} style={{ color: '#878f9d' }} />
              Status Pipeline
            </h4>
            {isStatusPipelineOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </Button>
          {isStatusPipelineOpen && (
            <div className="mt-3">
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
                            {stage}
                          </span>
                          <span className="text-xs text-gray-500">{progress}%</span>
                        </div>
                        <Progress value={progress} className="h-1" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
