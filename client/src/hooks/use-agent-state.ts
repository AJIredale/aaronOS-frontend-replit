import { useQuery } from "@tanstack/react-query";
import { useSocket } from "./use-socket";
import { useEffect, useState } from "react";
import type { AgentStatus } from "@shared/schema";

export function useAgentState() {
  const [agentStatus, setAgentStatus] = useState<AgentStatus | null>(null);
  const { lastMessage } = useSocket();

  const { data: initialStatus } = useQuery({
    queryKey: ["/api/agent/status"],
    refetchInterval: 5000, // Poll every 5 seconds as fallback
  });

  useEffect(() => {
    if (initialStatus) {
      setAgentStatus(initialStatus);
    }
  }, [initialStatus]);

  useEffect(() => {
    if (lastMessage && lastMessage.type === "status_update") {
      setAgentStatus(prev => ({
        id: prev?.id || "temp",
        status: lastMessage.status,
        currentTask: lastMessage.currentTask,
        lastActivity: new Date(),
        metadata: lastMessage.metadata || null
      }));
    }
  }, [lastMessage]);

  return {
    agentStatus: agentStatus || initialStatus,
  };
}
