import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Activity, 
  Cpu, 
  HardDrive, 
  Wifi, 
  Database, 
  RefreshCw,
  CheckCircle,
  Clock,
  AlertCircle,
  Zap,
  Users,
  Server,
  Globe
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface SystemStatus {
  status: "healthy" | "warning" | "error";
  uptime: string;
  version: string;
  activeWorkers: number;
}

interface ResourceUsage {
  cpu: { usage: number; cores: number };
  memory: { used: number; total: number };
  disk: { used: number; total: number };
  network: { in: number; out: number };
}

interface Service {
  id: string;
  name: string;
  port: number;
  status: "running" | "stopped" | "error";
  uptime: string;
}

interface Worker {
  id: string;
  name: string;
  status: "active" | "idle" | "error";
  jobsProcessed: number;
  queued: number;
}

interface ActivityLog {
  id: string;
  timestamp: string;
  level: "info" | "warning" | "error";
  message: string;
  source: string;
}

export default function SystemPage() {
  // Mock data for system information
  const systemStatus: SystemStatus = {
    status: "healthy",
    uptime: "7d 14h 32m",
    version: "1.0.0-beta",
    activeWorkers: 2
  };

  const resourceUsage: ResourceUsage = {
    cpu: { usage: 23, cores: 4 },
    memory: { used: 2.1, total: 8 },
    disk: { used: 45.2, total: 100 },
    network: { in: 1.2, out: 0.8 }
  };

  const services: Service[] = [
    { id: "1", name: "API Server", port: 3001, status: "running", uptime: "7d 14h 32m" },
    { id: "2", name: "Database", port: 5432, status: "running", uptime: "7d 14h 32m" },
    { id: "3", name: "Redis Cache", port: 6379, status: "running", uptime: "7d 14h 32m" },
    { id: "4", name: "Task Queue", port: 0, status: "running", uptime: "7d 14h 32m" },
    { id: "5", name: "WebSocket", port: 3001, status: "running", uptime: "7d 14h 32m" }
  ];

  const workers: Worker[] = [
    { id: "1", name: "Web Scraping", status: "active", jobsProcessed: 127, queued: 3 },
    { id: "2", name: "AI Analysis", status: "active", jobsProcessed: 89, queued: 1 },
    { id: "3", name: "Document Generation", status: "idle", jobsProcessed: 45, queued: 0 },
    { id: "4", name: "Email Sending", status: "idle", jobsProcessed: 23, queued: 0 }
  ];

  const activityLogs: ActivityLog[] = [
    { id: "1", timestamp: "14:32:15", level: "info", message: "Task completed successfully", source: "Worker" },
    { id: "2", timestamp: "14:31:42", level: "info", message: "New user registered", source: "API" },
    { id: "3", timestamp: "14:30:18", level: "warning", message: "High memory usage detected", source: "Monitor" },
    { id: "4", timestamp: "14:29:55", level: "info", message: "Database backup completed", source: "Database" },
    { id: "5", timestamp: "14:28:33", level: "info", message: "Cache cleared successfully", source: "Redis" }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
      case "running":
      case "active":
        return "text-green-600";
      case "warning":
      case "idle":
        return "text-yellow-600";
      case "error":
      case "stopped":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
      case "running":
      case "active":
        return <CheckCircle size={16} className="text-green-600" />;
      case "warning":
      case "idle":
        return <Clock size={16} className="text-yellow-600" />;
      case "error":
      case "stopped":
        return <AlertCircle size={16} className="text-red-600" />;
      default:
        return <Clock size={16} className="text-gray-600" />;
    }
  };

  const formatBytes = (bytes: number) => {
    return `${bytes.toFixed(1)}GB`;
  };

  const formatSpeed = (speed: number) => {
    return `${speed.toFixed(1)} MB/s`;
  };

  return (
    <div className="flex-1 flex flex-col h-screen bg-white">
      {/* Header */}
      <div className="flex-shrink-0 px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">System Status</h1>
            <p className="text-sm text-gray-500 mt-1">Monitor system health, performance, and diagnostics</p>
          </div>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <RefreshCw size={14} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <Activity size={20} className="text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <p className={`font-semibold ${getStatusColor(systemStatus.status)}`}>
                  {systemStatus.status === "healthy" ? "Healthy" : systemStatus.status}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <Clock size={20} className="text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Uptime</p>
                <p className="font-semibold text-gray-900">{systemStatus.uptime}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <Zap size={20} className="text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Version</p>
                <p className="font-semibold text-gray-900">{systemStatus.version}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <Users size={20} className="text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Active Workers</p>
                <p className="font-semibold text-gray-900">{systemStatus.activeWorkers}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Resource Usage */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Activity size={20} />
            Resource Usage
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Cpu size={16} className="text-gray-600" />
                  <span className="text-sm font-medium">CPU</span>
                </div>
                <span className="text-sm text-gray-600">{resourceUsage.cpu.usage}%</span>
              </div>
              <Progress value={resourceUsage.cpu.usage} className="h-2 mb-1" />
              <p className="text-xs text-gray-500">{resourceUsage.cpu.cores} cores</p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Database size={16} className="text-gray-600" />
                  <span className="text-sm font-medium">Memory</span>
                </div>
                <span className="text-sm text-gray-600">{formatBytes(resourceUsage.memory.used)}</span>
              </div>
              <Progress value={(resourceUsage.memory.used / resourceUsage.memory.total) * 100} className="h-2 mb-1" />
              <p className="text-xs text-gray-500">{formatBytes(resourceUsage.memory.total)} total</p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <HardDrive size={16} className="text-gray-600" />
                  <span className="text-sm font-medium">Disk</span>
                </div>
                <span className="text-sm text-gray-600">{formatBytes(resourceUsage.disk.used)}</span>
              </div>
              <Progress value={(resourceUsage.disk.used / resourceUsage.disk.total) * 100} className="h-2 mb-1" />
              <p className="text-xs text-gray-500">{formatBytes(resourceUsage.disk.total)} total</p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Wifi size={16} className="text-gray-600" />
                  <span className="text-sm font-medium">Network</span>
                </div>
                <span className="text-sm text-gray-600">↑{formatSpeed(resourceUsage.network.out)} ↓{formatSpeed(resourceUsage.network.in)}</span>
              </div>
              <div className="flex gap-1">
                <Progress value={60} className="h-2 flex-1" />
                <Progress value={40} className="h-2 flex-1" />
              </div>
              <p className="text-xs text-gray-500">In / Out</p>
            </div>
          </div>
        </Card>

        {/* Services and Workers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Services */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Server size={20} />
              Services
            </h3>
            <div className="space-y-3">
              {services.map((service) => (
                <div key={service.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(service.status)}
                    <div>
                      <p className="font-medium text-gray-900">{service.name}</p>
                      <p className="text-sm text-gray-500">
                        {service.port > 0 ? `Port ${service.port}` : "Internal service"}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-medium ${getStatusColor(service.status)}`}>
                      {service.status}
                    </p>
                    <p className="text-xs text-gray-500">{service.uptime}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Workers */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Zap size={20} />
              Workers
            </h3>
            <div className="space-y-3">
              {workers.map((worker) => (
                <div key={worker.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(worker.status)}
                    <div>
                      <p className="font-medium text-gray-900">{worker.name}</p>
                      <p className="text-sm text-gray-500">{worker.jobsProcessed} jobs processed</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{worker.queued} queued</p>
                    <p className={`text-xs ${getStatusColor(worker.status)}`}>{worker.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <p className="text-sm text-gray-500 mb-4">Latest system logs and events</p>
          <div className="space-y-3">
            {activityLogs.map((log) => (
              <div key={log.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500 font-mono">{log.timestamp}</span>
                  <Badge variant={log.level === "error" ? "destructive" : log.level === "warning" ? "secondary" : "outline"}>
                    {log.level}
                  </Badge>
                  <span className="text-sm text-gray-900">{log.message}</span>
                </div>
                <span className="text-sm text-gray-500">{log.source}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Advanced Monitoring Coming Soon */}
        <Card className="p-8 text-center">
          <div className="flex justify-center mb-4">
            <Activity size={32} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Advanced Monitoring Coming Soon</h3>
          <p className="text-sm text-gray-500">
            Real-time metrics, alerting, log aggregation, and automated healing capabilities are in development.
          </p>
        </Card>
      </div>
    </div>
  );
}