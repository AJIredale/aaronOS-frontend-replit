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
  messages: [],
  isTyping: false,
  currentConversationId: "default",
  
  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),
    
  clearMessages: () =>
    set(() => ({
      messages: [],
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
