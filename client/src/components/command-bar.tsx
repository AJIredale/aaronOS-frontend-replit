import { useState, useRef, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { apiRequest } from "@/lib/api";
import { useConversationStore } from "@/store/conversation";
import { Send, Plus } from "lucide-react";

const SLASH_COMMANDS = [
  { command: "/clear", description: "Clear conversation" },
  { command: "/status", description: "Show agent status" },
];

export default function CommandBar() {
  const [input, setInput] = useState("");
  const [showCommands, setShowCommands] = useState(false);
  const [selectedCommand, setSelectedCommand] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const queryClient = useQueryClient();
  const { addMessage, setTyping } = useConversationStore();

  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      const response = await apiRequest("POST", "/api/agent/message", {
        conversationId: "default", // In a real app, this would be dynamic
        role: "user",
        content,
        metadata: {}
      });
      return response.json();
    },
    onSuccess: (message) => {
      addMessage(message);
      setTyping(true);
      // Stop typing after a delay (real implementation would use WebSocket)
      setTimeout(() => setTyping(false), 3000);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || sendMessageMutation.isPending) return;

    const content = input.trim();
    setInput("");
    
    // Handle slash commands
    if (content.startsWith("/")) {
      await handleSlashCommand(content);
      return;
    }

    // Add user message first
    addMessage({
      id: Date.now().toString(),
      conversationId: "default",
      role: "user",
      content,
      timestamp: new Date(),
      metadata: {}
    });

    // Trigger demo activity instead of real API call
    useConversationStore.getState().triggerDemo();
  };

  const handleSlashCommand = async (command: string) => {
    const [cmd, ...args] = command.split(" ");
    
    switch (cmd) {
      case "/clear":
        useConversationStore.getState().clearMessages();
        break;
      case "/status":
        const statusResponse = await apiRequest("GET", "/api/agent/status");
        const status = await statusResponse.json();
        addMessage({
          id: Date.now().toString(),
          conversationId: "default",
          role: "system",
          content: `Status: ${status.status}${status.currentTask ? ` - ${status.currentTask}` : ""}`,
          timestamp: new Date(),
          metadata: {}
        });
        break;
      default:
        addMessage({
          id: Date.now().toString(),
          conversationId: "default",
          role: "system",
          content: `Unknown command: ${cmd}`,
          timestamp: new Date(),
          metadata: {}
        });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }

    if (showCommands) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedCommand((prev) => (prev + 1) % SLASH_COMMANDS.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedCommand((prev) => (prev - 1 + SLASH_COMMANDS.length) % SLASH_COMMANDS.length);
      } else if (e.key === "Tab" || e.key === "Enter") {
        e.preventDefault();
        const command = SLASH_COMMANDS[selectedCommand];
        setInput(command.command + " ");
        setShowCommands(false);
        textareaRef.current?.focus();
      } else if (e.key === "Escape") {
        setShowCommands(false);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setInput(value);

    if (value.startsWith("/") && value.indexOf(" ") === -1) {
      setShowCommands(true);
      setSelectedCommand(0);
    } else {
      setShowCommands(false);
    }
  };

  const filteredCommands = SLASH_COMMANDS.filter(cmd =>
    cmd.command.toLowerCase().includes(input.toLowerCase())
  );

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + "px";
    }
  }, [input]);

  return (
    <div className="p-6 border-t border-gray-200 bg-white">
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex items-end gap-4">
          <div className="flex-1 relative">
            {showCommands && filteredCommands.length > 0 && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                {filteredCommands.map((cmd, index) => (
                  <div
                    key={cmd.command}
                    className={`p-3 cursor-pointer border-b border-gray-100 last:border-b-0 ${
                      index === selectedCommand ? "bg-gray-50" : ""
                    }`}
                    onClick={() => {
                      setInput(cmd.command + " ");
                      setShowCommands(false);
                      textareaRef.current?.focus();
                    }}
                  >
                    <div className="font-medium text-sm">{cmd.command}</div>
                    <div className="text-xs text-gray-500">{cmd.description}</div>
                  </div>
                ))}
              </div>
            )}
            
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Message Aaron..."
              className="min-h-[44px] max-h-[120px] resize-none pr-12 focus:ring-2 focus:ring-[var(--aaron-accent)] focus:border-transparent"
              style={{ fontSize: '15px' }}
              disabled={sendMessageMutation.isPending}
            />
            
            <Button
              type="submit"
              size="sm"
              className="absolute right-3 bottom-3 h-8 w-8 p-0 bg-[var(--aaron-accent)] hover:bg-blue-600"
              disabled={!input.trim() || sendMessageMutation.isPending}
            >
              <Send size={16} />
            </Button>
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
          <span>Press Enter to send, Shift+Enter for new line</span>
          <span>{input.length}/4000</span>
        </div>
      </form>
    </div>
  );
}
