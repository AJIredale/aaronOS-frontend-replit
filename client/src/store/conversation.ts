import { create } from "zustand";
import type { Message } from "@shared/schema";

export interface ActivityIndicator {
  id: string;
  type: "thinking" | "working" | "completed" | "progress";
  title: string;
  subtitle?: string;
  progress?: Array<{ name: string; completed: boolean }>;
  timestamp: Date;
}

interface ConversationState {
  messages: Message[];
  activities: ActivityIndicator[];
  isTyping: boolean;
  currentConversationId: string;
  isDemoMode: boolean;
  addMessage: (message: Message) => void;
  addActivity: (activity: ActivityIndicator) => void;
  updateActivity: (id: string, updates: Partial<ActivityIndicator>) => void;
  removeActivity: (id: string) => void;
  clearActivities: () => void;
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
  activities: [],
  isTyping: false,
  currentConversationId: "default",
  isDemoMode: false,
  
  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),
    
  addActivity: (activity) =>
    set((state) => ({
      activities: [...state.activities, activity],
    })),
    
  updateActivity: (id, updates) =>
    set((state) => ({
      activities: state.activities.map(activity =>
        activity.id === id ? { ...activity, ...updates } : activity
      ),
    })),
    
  removeActivity: (id) =>
    set((state) => ({
      activities: state.activities.filter(activity => activity.id !== id),
    })),
    
  clearActivities: () =>
    set(() => ({
      activities: [],
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
      activities: [],
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
      // Start thinking state
      setTimeout(() => {
        set({ isTyping: true, isDemoMode: true });
        
        // Add thinking activity
        const thinkingId = `activity-${Date.now()}`;
        set((state) => ({
          activities: [...state.activities, {
            id: thinkingId,
            type: "thinking" as const,
            title: "Thought about it...",
            timestamp: new Date()
          }]
        }));
        
        // After 2 seconds, add working activity
        setTimeout(() => {
          const workingId = `activity-${Date.now() + 1}`;
          set((state) => ({
            activities: [...state.activities, {
              id: workingId,
              type: "working" as const,
              title: "Setting up project...",
              timestamp: new Date()
            }]
          }));
          
          // After 3 more seconds, complete first activity and add progress
          setTimeout(() => {
            const completedId = `activity-${Date.now() + 2}`;
            set((state) => ({
              activities: state.activities.map(a => 
                a.id === workingId ? { ...a, type: "completed" as const, title: "Project setup complete" } : a
              ).concat([{
                id: completedId,
                type: "progress" as const,
                title: "Building components...",
                progress: [
                  { name: "authentication_setup", completed: true },
                  { name: "dashboard_layout", completed: true },
                  { name: "api_endpoints", completed: false },
                  { name: "database_schema", completed: false }
                ],
                timestamp: new Date()
              }])
            }));
            
            // Add response after 2 more seconds
            setTimeout(() => {
              set((state) => ({
                isTyping: false,
                isDemoMode: false,
                messages: [...state.messages, {
                  id: Date.now().toString(),
                  conversationId: "default",
                  role: "assistant",
                  content: "I'll create a comprehensive React dashboard with analytics charts, user management, and modern UI components.",
                  timestamp: new Date(),
                  metadata: {}
                }]
              }));
            }, 2000);
          }, 3000);
        }, 2000);
      }, 100);
      
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
