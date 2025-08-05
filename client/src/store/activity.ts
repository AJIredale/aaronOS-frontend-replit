import { create } from "zustand";

interface ActivityState {
  terminalLines: string[];
  actions: Array<{
    action: string;
    time: string;
    status: "completed" | "in-progress" | "pending";
  }>;
  isActive: boolean;
  addTerminalLine: (line: string) => void;
  updateAction: (index: number, status: "completed" | "in-progress" | "pending") => void;
  startDemo: () => void;
  reset: () => void;
}

const initialTerminalLines = [
  "$ npx create-react-app webapp --template typescript",
  "✓ Created new React TypeScript project",
  "$ cd webapp && npm install @auth0/auth0-react",
  "✓ Installing authentication packages...",
  "$ npm install @headlessui/react @tailwindcss/forms",
  "✓ Setting up UI components...",
  "$ mkdir src/components/dashboard",
  "✓ Creating dashboard structure...",
  "$ npm run build",
  "✓ Build completed successfully",
];

const initialActions = [
  { action: "Analyzed project requirements", time: "30s ago", status: "completed" as const },
  { action: "Generated authentication setup", time: "25s ago", status: "completed" as const },
  { action: "Creating dashboard components", time: "20s ago", status: "in-progress" as const },
  { action: "Installing dependencies", time: "15s ago", status: "in-progress" as const },
  { action: "Setting up routing", time: "10s ago", status: "pending" as const },
  { action: "Deploying to production", time: "5s ago", status: "pending" as const },
];

export const useActivityStore = create<ActivityState>((set, get) => ({
  terminalLines: initialTerminalLines,
  actions: initialActions,
  isActive: false,
  
  addTerminalLine: (line) =>
    set((state) => ({
      terminalLines: [...state.terminalLines, line],
    })),
    
  updateAction: (index, status) =>
    set((state) => ({
      actions: state.actions.map((action, i) => 
        i === index ? { ...action, status } : action
      ),
    })),
    
  startDemo: () => {
    set({ isActive: true });
    
    const demoSequence = [
      { delay: 1000, line: "$ npm install express cors helmet", action: 2, status: "completed" as const },
      { delay: 2000, line: "✓ Backend dependencies installed", action: 3, status: "completed" as const },
      { delay: 3000, line: "$ npx create-react-app client --template typescript", action: 4, status: "in-progress" as const },
      { delay: 4000, line: "✓ Frontend scaffolding complete", action: 4, status: "completed" as const },
      { delay: 5000, line: "$ npm run test", action: 5, status: "in-progress" as const },
      { delay: 6000, line: "✓ All tests passing", action: 5, status: "completed" as const },
    ];
    
    demoSequence.forEach(({ delay, line, action, status }) => {
      setTimeout(() => {
        if (get().isActive) {
          get().addTerminalLine(line);
          get().updateAction(action, status);
        }
      }, delay);
    });
    
    // Stop demo after completion
    setTimeout(() => {
      set({ isActive: false });
    }, 7000);
  },
  
  reset: () =>
    set({
      terminalLines: initialTerminalLines,
      actions: initialActions,
      isActive: false,
    }),
}));