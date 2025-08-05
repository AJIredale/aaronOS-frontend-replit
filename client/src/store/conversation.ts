import { create } from "zustand";
import type { Message } from "@shared/schema";

interface ConversationState {
  messages: Message[];
  isTyping: boolean;
  currentConversationId: string;
  addMessage: (message: Message) => void;
  clearMessages: () => void;
  setTyping: (typing: boolean) => void;
  setCurrentConversation: (id: string) => void;
}

export const useConversationStore = create<ConversationState>((set) => ({
  messages: [
    {
      id: "welcome",
      conversationId: "default",
      role: "assistant",
      content: "Hello! I'm Aaron, your AI OS orchestration agent. I can help you with complex tasks, automate workflows, and manage your digital environment. What would you like me to work on today?",
      timestamp: new Date(),
      metadata: { isWelcome: true }
    }
  ],
  isTyping: false,
  currentConversationId: "default",
  
  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),
    
  clearMessages: () =>
    set(() => ({
      messages: [{
        id: "welcome",
        conversationId: "default",
        role: "assistant", 
        content: "Hello! I'm Aaron, your AI OS orchestration agent. I can help you with complex tasks, automate workflows, and manage your digital environment. What would you like me to work on today?",
        timestamp: new Date(),
        metadata: { isWelcome: true }
      }],
    })),
    
  setTyping: (typing) =>
    set(() => ({
      isTyping: typing,
    })),
    
  setCurrentConversation: (id) =>
    set(() => ({
      currentConversationId: id,
    })),
}));
