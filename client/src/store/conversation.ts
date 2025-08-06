import { create } from "zustand";
import type { Message } from "@shared/schema";

interface ConversationState {
  messages: Message[];
  isTyping: boolean;
  currentConversationId: string;
  isDemoMode: boolean;
  addMessage: (message: Message) => void;
  clearMessages: () => void;
  setTyping: (typing: boolean) => void;
  setCurrentConversation: (id: string) => void;
  triggerDemo: () => void;
  startNewConversation: (title: string, initialMessage: string) => string;
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
  isDemoMode: false,
  
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
    
  triggerDemo: () =>
    set((state) => {
      // Import activity store dynamically
      import("../store/activity").then(({ useActivityStore }) => {
        // Start thinking state
        setTimeout(() => {
          set({ isTyping: true, isDemoMode: true });
          
          // Start activity demo
          useActivityStore.getState().startDemo();
          
          // After 5 seconds, stop thinking and add response
          setTimeout(() => {
            set((state) => ({
              isTyping: false,
              isDemoMode: false,
              messages: [...state.messages, {
                id: Date.now().toString(),
                conversationId: "default",
                role: "assistant",
                content: "I'm analyzing your request and setting up the development environment. Let me break this down into actionable steps and start implementing the solution.",
                timestamp: new Date(),
                metadata: {}
              }]
            }));
          }, 5000);
        }, 100);
      });
      
      return state;
    }),
    
  startNewConversation: (title: string, initialMessage: string) => {
    const conversationId = `conv-${Date.now()}`;
    set(() => ({
      currentConversationId: conversationId,
      messages: [
        {
          id: `msg-${Date.now()}`,
          conversationId,
          role: "user",
          content: initialMessage,
          timestamp: new Date(),
          metadata: {}
        }
      ],
      isDemoMode: false
    }));
    return conversationId;
  },
}));
