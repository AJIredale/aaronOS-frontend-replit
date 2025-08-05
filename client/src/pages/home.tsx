import { useEffect } from "react";
import Sidebar from "@/components/sidebar";
import ChatPanel from "@/components/chat-panel";
import ActivityPanel from "@/components/activity-panel";
import { useSocket } from "@/hooks/use-socket";
import { useAgentState } from "@/hooks/use-agent-state";

export default function Home() {
  const { connect, disconnect, isConnected } = useSocket();
  const { agentStatus } = useAgentState();

  useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      <Sidebar />
      <ChatPanel />
      <ActivityPanel />
    </div>
  );
}
