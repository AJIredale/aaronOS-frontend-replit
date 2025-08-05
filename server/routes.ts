import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { insertMessageSchema, insertTaskSchema, insertMemoryShardSchema, insertAgentStatusSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // WebSocket server for real-time communication
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  // Store connected clients
  const clients = new Set<WebSocket>();

  wss.on('connection', (ws) => {
    clients.add(ws);
    console.log('Client connected to WebSocket');

    ws.on('close', () => {
      clients.delete(ws);
      console.log('Client disconnected from WebSocket');
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
      clients.delete(ws);
    });
  });

  // Helper function to broadcast to all clients
  const broadcast = (data: any) => {
    clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  };

  // Agent endpoints
  app.get("/api/agent/status", async (req, res) => {
    try {
      const status = await storage.getAgentStatus();
      res.json(status || { status: "idle", currentTask: null, lastActivity: new Date() });
    } catch (error) {
      res.status(500).json({ error: "Failed to get agent status" });
    }
  });

  app.post("/api/agent/message", async (req, res) => {
    try {
      const messageData = insertMessageSchema.parse(req.body);
      
      // Update agent status to thinking
      await storage.updateAgentStatus({ status: "thinking", currentTask: "Processing message" });
      broadcast({ type: "status_update", status: "thinking", currentTask: "Processing message" });

      // Create user message
      const userMessage = await storage.createMessage(messageData);
      broadcast({ type: "message", message: userMessage });

      // Simulate AI processing delay
      setTimeout(async () => {
        try {
          // Create AI response message
          const aiResponse = await storage.createMessage({
            conversationId: messageData.conversationId,
            role: "assistant",
            content: `I understand you want me to help with: "${messageData.content}". Let me break this down into actionable steps and get started.`,
            metadata: { thinking: true }
          });

          broadcast({ type: "message", message: aiResponse });

          // Update agent status to executing
          await storage.updateAgentStatus({ status: "executing", currentTask: "Working on your request" });
          broadcast({ type: "status_update", status: "executing", currentTask: "Working on your request" });

          // Simulate completion
          setTimeout(async () => {
            await storage.updateAgentStatus({ status: "idle", currentTask: null });
            broadcast({ type: "status_update", status: "idle", currentTask: null });
          }, 5000);

        } catch (error) {
          console.error("Error processing AI response:", error);
        }
      }, 2000);

      res.json(userMessage);
    } catch (error) {
      res.status(400).json({ error: "Invalid message data" });
    }
  });

  // Context endpoints
  app.get("/api/context/active", async (req, res) => {
    try {
      // Return active memory context (simplified)
      const tasks = await storage.getTasks();
      const activeTasks = tasks.filter(task => task.status === "in_progress" || task.isPinned);
      
      res.json({
        tasks: activeTasks,
        totalTokens: activeTasks.length * 200, // Simplified token calculation
        maxTokens: 15000
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to get active context" });
    }
  });

  app.get("/api/context/shard/:project", async (req, res) => {
    try {
      const { project } = req.params;
      const shards = await storage.getMemoryShardsByProject(project);
      res.json(shards);
    } catch (error) {
      res.status(500).json({ error: "Failed to get memory shards" });
    }
  });

  app.post("/api/flush/trigger", async (req, res) => {
    try {
      // Simulate flushing resolved tasks to memory shards
      const tasks = await storage.getTasks();
      const resolvedTasks = tasks.filter(task => task.status === "resolved");

      for (const task of resolvedTasks) {
        await storage.createMemoryShard({
          project: "default",
          content: JSON.stringify(task),
          summary: task.title,
          tokens: 200,
          metadata: { originalTaskId: task.id }
        });
      }

      broadcast({ type: "flush_complete", shardsCreated: resolvedTasks.length });
      res.json({ message: "Context flushed successfully", shardsCreated: resolvedTasks.length });
    } catch (error) {
      res.status(500).json({ error: "Failed to flush context" });
    }
  });

  // Task endpoints
  app.get("/api/tasks", async (req, res) => {
    try {
      const tasks = await storage.getTasks();
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ error: "Failed to get tasks" });
    }
  });

  app.post("/api/tasks", async (req, res) => {
    try {
      const taskData = insertTaskSchema.parse(req.body);
      const task = await storage.createTask(taskData);
      broadcast({ type: "task_created", task });
      res.json(task);
    } catch (error) {
      res.status(400).json({ error: "Invalid task data" });
    }
  });

  app.patch("/api/tasks/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const task = await storage.updateTask(id, updates);
      
      if (!task) {
        return res.status(404).json({ error: "Task not found" });
      }

      broadcast({ type: "task_updated", task });
      res.json(task);
    } catch (error) {
      res.status(400).json({ error: "Failed to update task" });
    }
  });

  // Memory endpoints
  app.get("/api/memory/shards", async (req, res) => {
    try {
      const shards = await storage.getMemoryShards();
      res.json(shards);
    } catch (error) {
      res.status(500).json({ error: "Failed to get memory shards" });
    }
  });

  return httpServer;
}
