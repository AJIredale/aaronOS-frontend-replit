import { useState, useRef, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { apiRequest } from "@/lib/api";
import { useConversationStore } from "@/store/conversation";
import { useQuoteStore } from "@/store/quote";
import { Send, Plus, Paperclip, FileText, Image, Code, Database, Mic, MicOff, Square, X, Quote } from "lucide-react";
import { useVoiceInput } from "@/hooks/use-voice-input";
import { useVoiceRecording } from "@/hooks/use-voice-recording";

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
  const { quotedText, isQuoting, clearQuote } = useQuoteStore();

  // Voice input integration
  const { isListening, isSupported: voiceSupported, transcript, toggleListening } = useVoiceInput({
    onTranscript: (voiceText) => {
      setInput(prev => prev + voiceText + ' ');
      textareaRef.current?.focus();
    },
    onError: (error) => {
      console.error('Voice input error:', error);
    }
  });

  // Voice recording integration
  const { isRecording, isSupported: recordingSupported, toggleRecording } = useVoiceRecording({
    onRecordingComplete: (audioBlob) => {
      // For now, we'll just log the recording. In a real app, this would be sent to the server
      console.log('Voice recording completed:', audioBlob);
      // TODO: Send voice note to backend
    },
    onError: (error) => {
      console.error('Voice recording error:', error);
    }
  });

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
    let messageContent = content;
    
    // If there's a quote, prepend it to the message
    if (isQuoting && quotedText) {
      messageContent = `> "${quotedText}"\n\n${content}`;
    }
    
    setInput("");
    clearQuote(); // Clear the quote after sending
    
    // Handle slash commands
    if (content.startsWith("/")) {
      await handleSlashCommand(content);
      return;
    }

    // Add user message with quote metadata
    addMessage({
      id: Date.now().toString(),
      conversationId: "default",
      role: "user",
      content: content,
      timestamp: new Date(),
      metadata: {
        quotedText: isQuoting && quotedText ? quotedText : undefined
      }
    });

    // Trigger demo activity instead of real API call
    // In a real implementation, you would send the quoted context to the LLM:
    // const contextualContent = isQuoting && quotedText ? 
    //   `Responding to: "${quotedText}"\n\n${content}` : content;
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

  // Update input with voice transcript
  useEffect(() => {
    if (transcript) {
      setInput(prev => prev + transcript);
    }
  }, [transcript]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      // Reset height to calculate actual needed height
      textarea.style.height = "auto";
      
      // Set minimum height for single line (like GPT's 36px)
      const minHeight = 36;
      const maxHeight = 200; // Max height for multiple lines
      
      // Calculate required height based on scroll height
      const scrollHeight = textarea.scrollHeight;
      const newHeight = Math.max(minHeight, Math.min(scrollHeight, maxHeight));
      
      textarea.style.height = newHeight + "px";
      
      // Update container height to match
      const container = textarea.closest('.flex.items-center');
      if (container) {
        const containerHeight = Math.max(44, newHeight + 16); // Add padding
        container.style.minHeight = containerHeight + "px";
      }
    }
  }, [input]);

  return (
    <div className="p-6 border-t border-gray-200 bg-white">
      <div className="max-w-[770px] mx-auto">
        {/* Quoted Content */}
        {isQuoting && quotedText && (
          <div className="mb-4 p-3 bg-gray-50 border-l-4 border-gray-300 rounded-r-2xl">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-2 flex-1">
                <Quote size={14} className="text-gray-500 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-gray-700 leading-relaxed">
                  "{quotedText}"
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearQuote}
                className="h-6 w-6 p-0 hover:bg-gray-200 ml-2 flex-shrink-0"
              >
                <X size={12} />
              </Button>
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="relative">
          {showCommands && filteredCommands.length > 0 && (
            <div className="absolute bottom-full left-0 right-0 mb-2 bg-white border border-gray-200 rounded-2xl shadow-lg z-10">
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
          
          <div className="relative bg-white border border-gray-200 rounded-3xl shadow-sm hover:shadow-md transition-all duration-200 ease-out focus-within:shadow-md focus-within:border-gray-200">
            <div className="flex items-center px-4 py-2 min-h-[52px] transition-all duration-200 ease-out">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 mr-3 hover:bg-gray-100 flex-shrink-0"
                  >
                    <Plus size={16} className="text-gray-500" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  <DropdownMenuItem>
                    <Paperclip className="mr-2 h-4 w-4" />
                    <span>Add file</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Image className="mr-2 h-4 w-4" />
                    <span>Add image</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Code className="mr-2 h-4 w-4" />
                    <span>Add code snippet</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Database className="mr-2 h-4 w-4" />
                    <span>Connect data source</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <div className="flex-1 relative gpt-textarea-container">
                <Textarea
                  ref={textareaRef}
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Message Aaron..."
                  className="gpt-textarea min-h-[36px] max-h-[200px] resize-none border-0 bg-transparent p-0 focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 w-full overflow-hidden"
                  style={{ 
                    fontSize: '0.95rem', 
                    lineHeight: '1.4',
                    height: '36px'
                  }}
                  disabled={sendMessageMutation.isPending}
                />
              </div>
              
              <div className="flex items-center gap-2 ml-3">
                {voiceSupported && (
                  <Button
                    type="button"
                    onClick={toggleListening}
                    size="sm"
                    variant="ghost"
                    className={`h-7 w-7 p-0 rounded-full transition-colors flex-shrink-0 ${
                      isListening 
                        ? "bg-red-500 hover:bg-red-600 text-white" 
                        : "hover:bg-gray-100 text-gray-500"
                    }`}
                  >
                    {isListening ? <MicOff style={{width: "1.1rem", height: "1.1rem"}} /> : (
                      <svg width="1.1rem" height="1.1rem" viewBox="0 0 24 24" fill="currentColor" style={{width: "1.1rem", height: "1.1rem"}}>
                        <path d="M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
                        <path d="M19 10v1a7 7 0 0 1-14 0v-1" fill="none" stroke="currentColor" strokeWidth="2"/>
                        <path d="M12 18v4" fill="none" stroke="currentColor" strokeWidth="2"/>
                        <path d="M8 22h8" fill="none" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                    )}
                  </Button>
                )}
                
                {/* Dynamic send/voice button like GPT */}
                {input.trim() ? (
                  <Button
                    type="submit"
                    size="sm"
                    className="h-7 w-7 p-0 rounded-full transition-colors flex-shrink-0 bg-black hover:bg-gray-800 text-white"
                    disabled={sendMessageMutation.isPending}
                  >
                    <Send size={13} />
                  </Button>
                ) : (
                  recordingSupported && (
                    <Button
                      type="button"
                      onClick={toggleRecording}
                      size="sm"
                      className={`h-7 w-7 p-0 rounded-full transition-colors flex-shrink-0 ${
                        isRecording 
                          ? "bg-red-500 hover:bg-red-600 text-white" 
                          : "bg-gray-200 hover:bg-gray-300 text-gray-600"
                      }`}
                    >
                      {isRecording ? (
                        <Square size={11} />
                      ) : (
                        <svg width="1.1rem" height="1.1rem" viewBox="0 0 24 24" fill="currentColor" style={{width: "1.1rem", height: "1.1rem"}}>
                          <rect x="6" y="10" width="1.5" height="4" rx="0.75"/>
                          <rect x="9.25" y="8" width="1.5" height="8" rx="0.75"/>
                          <rect x="12.5" y="6" width="1.5" height="12" rx="0.75"/>
                          <rect x="15.75" y="8" width="1.5" height="8" rx="0.75"/>
                        </svg>
                      )}
                    </Button>
                  )
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
