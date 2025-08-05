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

  const demoTerminalLines = [
    "$ npx create-react-app webapp --template typescript",
    "✓ Created new React TypeScript project",
    "$ cd webapp && npm install @auth0/auth0-react",
    "✓ Installing authentication packages...",
    "$ npm install @headlessui/react @tailwindcss/forms",
    "✓ Setting up UI components...",
    "$ mkdir src/components/dashboard",
    "✓ Creating dashboard structure...",
    "$ npm run build",
    "✓ Build completed successfully",
  ];

  const demoActions = [
    { action: "Analyzed project requirements", time: "30s ago", status: "completed" },
    { action: "Generated authentication setup", time: "25s ago", status: "completed" },
    { action: "Creating dashboard components", time: "20s ago", status: "in-progress" },
    { action: "Installing dependencies", time: "15s ago", status: "in-progress" },
    { action: "Setting up routing", time: "10s ago", status: "pending" },
    { action: "Deploying to production", time: "5s ago", status: "pending" },
  ];

  return (
    <div className="w-96 border-l border-gray-200 bg-gray-50 flex flex-col">
      <div className="p-4 border-b border-gray-200 bg-white flex-shrink-0">
        <h3 className="font-semibold text-gray-900">Aaron's Activity</h3>
        <p className="text-sm text-gray-500">Real-time task execution</p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {/* Terminal Output */}
        <Card className="p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
            <Activity size={16} />
            Terminal
          </h4>
          <div className="bg-black rounded-lg p-3 font-mono text-xs">
            {demoTerminalLines.map((line, index) => (
              <div key={index} className={`mb-1 ${line.startsWith('$') ? 'text-green-400' : 'text-gray-300'}`}>
                {line}
              </div>
            ))}
            <div className="text-green-400 animate-pulse">$ █</div>
          </div>
        </Card>

        {/* Actions Table */}
        <Card className="p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
            <Clock size={16} />
            Actions
          </h4>
          <div className="space-y-2">
            {demoActions.map((action, index) => (
              <div key={index} className="flex items-center justify-between text-xs">
                <span className="flex-1 truncate text-gray-700">{action.action}</span>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Badge 
                    variant={action.status === 'completed' ? 'default' : action.status === 'in-progress' ? 'secondary' : 'outline'}
                    className="text-xs"
                  >
                    {action.status}
                  </Badge>
                  <span className="text-gray-400">{action.time}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
