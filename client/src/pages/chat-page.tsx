import { useParams } from "wouter";
import Sidebar from "@/components/sidebar";
import ChatPanel from "@/components/chat-panel";
import ActivityPanel from "@/components/activity-panel";

export default function ChatPage() {
  const { conversationId } = useParams<{ conversationId: string }>();

  return (
    <div className="flex h-screen bg-white">
      <Sidebar />
      <ChatPanel />
      <ActivityPanel />
    </div>
  );
}