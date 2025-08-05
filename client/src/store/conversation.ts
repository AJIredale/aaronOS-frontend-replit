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
      id: "demo-user",
      conversationId: "default", 
      role: "user",
      content: "Help me build a modern web application with user authentication and a dashboard",
      timestamp: new Date(Date.now() - 30000),
      metadata: {}
    },
    {
      id: "demo-aaron",
      conversationId: "default",
      role: "assistant", 
      content: "Sure! Let's get started on this task for you. I'll help you build a modern web application with authentication and dashboard functionality. Let me analyze the requirements and begin setting up the project structure.",
      timestamp: new Date(Date.now() - 25000),
      metadata: {}
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
      messages: [
        {
          id: "demo-user",
          conversationId: "default", 
          role: "user",
          content: "Help me build a modern web application with user authentication and a dashboard",
          timestamp: new Date(Date.now() - 30000),
          metadata: {}
        },
        {
          id: "demo-aaron",
          conversationId: "default",
          role: "assistant", 
          content: "Sure! Let's get started on this task for you. I'll help you build a modern web application with authentication and dashboard functionality. Let me analyze the requirements and begin setting up the project structure.",
          timestamp: new Date(Date.now() - 25000),
          metadata: {}
        }
      ],
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
