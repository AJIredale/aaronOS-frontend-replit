import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Mic, MicOff, Sparkles } from "lucide-react";
import { useVoiceInput } from "@/hooks/use-voice-input";

interface NewChatOverlayProps {
  onStartChat: (message: string) => void;
  onClose: () => void;
}

export default function NewChatOverlay({ onStartChat, onClose }: NewChatOverlayProps) {
  const [input, setInput] = useState("");

  // Voice input integration
  const { isListening, isSupported, transcript, toggleListening } = useVoiceInput({
    onTranscript: (voiceText) => {
      setInput(prev => prev + voiceText + ' ');
    },
    onError: (error) => {
      console.error('Voice input error:', error);
    }
  });

  // Update input with voice transcript
  useEffect(() => {
    if (transcript) {
      setInput(prev => prev + transcript);
    }
  }, [transcript]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onStartChat(input.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
      <div className="w-full max-w-2xl px-6">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-normal text-gray-900 mb-2">
            What's on your mind today?
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="relative">
          <div className="relative bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything"
              className="min-h-[120px] resize-none border-0 bg-transparent text-base p-6 pr-20 focus:ring-0 focus:outline-none"
            />
            
            {/* Bottom toolbar */}
            <div className="flex items-center justify-between p-4 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 px-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                >
                  <span className="text-sm mr-1">+</span>
                  <Sparkles size={14} className="mr-1" />
                  Tools
                </Button>
              </div>
              
              <div className="flex items-center gap-2">
                {isSupported && (
                  <Button
                    type="button"
                    onClick={toggleListening}
                    variant="ghost"
                    size="sm"
                    className={`h-8 w-8 p-0 transition-colors ${
                      isListening 
                        ? "bg-red-500 hover:bg-red-600 text-white" 
                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {isListening ? <MicOff size={16} /> : <Mic size={16} />}
                  </Button>
                )}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                >
                  <Sparkles size={16} />
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}