import { useEffect, useState } from "react";
import Sidebar from "@/components/sidebar";
import ChatPanel from "@/components/chat-panel";
import ActivityPanel from "@/components/activity-panel";
import NewChatOverlay from "@/components/new-chat-overlay";
import { useSocket } from "@/hooks/use-socket";
import { useAgentState } from "@/hooks/use-agent-state";
import { useConversationStore } from "@/store/conversation";

export default function Home() {
  const { connect, disconnect, isConnected } = useSocket();
  const { agentStatus } = useAgentState();
  const [showNewChatOverlay, setShowNewChatOverlay] = useState(false);
  const { messages, addMessage, triggerDemo } = useConversationStore();

  useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  // Show new chat overlay when there are no messages
  useEffect(() => {
    setShowNewChatOverlay(messages.length === 0);
  }, [messages.length]);

  const handleStartChat = (message: string) => {
    // Add user message
    addMessage({
      id: Date.now().toString(),
      conversationId: "default",
      role: "user",
      content: message,
      timestamp: new Date(),
      metadata: {}
    });

    // Trigger demo activity
    triggerDemo();
    setShowNewChatOverlay(false);
  };

  const handleCloseOverlay = () => {
    setShowNewChatOverlay(false);
  };

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      <Sidebar />
      <ChatPanel />
      <ActivityPanel />
      
      {showNewChatOverlay && (
        <NewChatOverlay 
          onStartChat={handleStartChat}
          onClose={handleCloseOverlay}
        />
      )}
    </div>
  );
}
