# AaronOS Frontend

## Overview

AaronOS is an autonomous AI operating system with a React-based frontend that provides an intelligent interface for interacting with an AI agent called Aaron. The system features a modular memory management architecture (FlushCore) that handles active RAM, pinned context, and compressed memory shards. Built with modern web technologies including React, TailwindCSS, and shadcn/ui components, it offers real-time communication via WebSockets and a command-driven interface for AI interactions.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development patterns
- **Styling**: TailwindCSS with shadcn/ui component library for consistent, accessible UI components
- **Build Tool**: Vite for fast development and optimized production builds
- **State Management**: Zustand for conversation state and React Context for global state management
- **Routing**: Wouter for lightweight client-side routing
- **Data Fetching**: TanStack React Query for server state management with caching and real-time updates
- **Voice Input**: Web Speech Recognition API integration for hands-free interaction

### Backend Integration
- **API Communication**: RESTful API endpoints for agent status, messaging, memory management, and task operations
- **Real-time Updates**: WebSocket connection for live chat streaming, task updates, and agent status changes
- **Memory System**: FlushCore memory architecture with three tiers:
  - Active RAM: Current working memory (15k token limit)
  - Pinned Context: User-locked important tasks/goals
  - Flushed Memory: Compressed project-based memory shards

### Component Architecture
- **Modular Design**: Separated components for ChatPanel, CommandBar, MemoryPanel, ActivityPanel, and AgentStatus
- **Layout System**: Three-panel layout with sidebar navigation, main chat area, and activity panel
- **Command Interface**: Slash-command system with autocomplete for power-user interactions
- **Voice Integration**: Dual voice functionality with microphone button for voice-to-text transcription and dynamic send/voice-note button that switches based on input state (like GPT)
- **Responsive Design**: Mobile-first approach with desktop optimizations

### Data Flow
- **Message Handling**: Bidirectional flow between user input, API calls, and WebSocket streams
- **State Synchronization**: Real-time updates from WebSocket events update local state stores
- **Memory Management**: Token counting and context compression with visual feedback
- **Task Tracking**: Live task status updates with priority and pinning capabilities

## External Dependencies

### Core Infrastructure
- **Database**: PostgreSQL with Drizzle ORM for data persistence and schema management
- **WebSocket Provider**: Native WebSocket implementation for real-time communication
- **Session Management**: connect-pg-simple for PostgreSQL-backed session storage

### UI and Styling
- **Design System**: shadcn/ui component library built on Radix UI primitives
- **Icons**: Lucide React icon library for consistent iconography
- **Animations**: CSS transitions and transforms for smooth user interactions
- **Typography**: Date-fns for human-readable time formatting

### Development Tools
- **Build System**: Vite with React plugin and TypeScript support
- **Code Quality**: ESBuild for production bundling and optimization
- **Development Experience**: Replit-specific plugins for hot reload and error overlay