import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Mic, MicOff, Sparkles, Square } from "lucide-react";
import { useVoiceInput } from "@/hooks/use-voice-input";
import { useVoiceRecording } from "@/hooks/use-voice-recording";

interface NewChatOverlayProps {
  onStartChat: (message: string) => void;
  onClose: () => void;
}

export default function NewChatOverlay({ onStartChat, onClose }: NewChatOverlayProps) {
  const [input, setInput] = useState("");

  // Voice input integration
  const { isListening, isSupported: voiceSupported, transcript, toggleListening } = useVoiceInput({
    onTranscript: (voiceText) => {
      setInput(prev => prev + voiceText + ' ');
    },
    onError: (error) => {
      console.error('Voice input error:', error);
    }
  });

  // Voice recording integration
  const { isRecording, isSupported: recordingSupported, toggleRecording } = useVoiceRecording({
    onRecordingComplete: (audioBlob) => {
      console.log('Voice recording completed:', audioBlob);
      // TODO: Send voice note to backend
    },
    onError: (error) => {
      console.error('Voice recording error:', error);
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
            <div className="flex items-center justify-between p-4 border-t border-gray-100 min-h-[56px]">
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
                {voiceSupported && (
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
                    {isListening ? <MicOff size={16} /> : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
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
                    className="h-8 w-8 p-0 rounded-full bg-black hover:bg-gray-800 text-white"
                  >
                    <Send size={16} />
                  </Button>
                ) : (
                  recordingSupported && (
                    <Button
                      type="button"
                      onClick={toggleRecording}
                      variant="ghost"
                      size="sm"
                      className={`h-8 w-8 p-0 rounded-full transition-colors ${
                        isRecording 
                          ? "bg-red-500 hover:bg-red-600 text-white" 
                          : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {isRecording ? (
                        <Square size={12} />
                      ) : (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <rect x="6" y="10" width="1.5" height="4" rx="0.75"/>
                          <rect x="9.25" y="8" width="1.5" height="8" rx="0.75"/>
                          <rect x="12.5" y="6" width="1.5" height="12" rx="0.75"/>
                          <rect x="15.75" y="8" width="1.5" height="8" rx="0.75"/>
                        </svg>
                      )}
                    </Button>
                  )
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