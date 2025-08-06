import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, jsonb, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const conversations = pgTable("conversations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  title: text("title").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const messages = pgTable("messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  conversationId: varchar("conversation_id").references(() => conversations.id),
  role: text("role").notNull(), // 'user' | 'assistant' | 'system'
  content: text("content").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
  metadata: jsonb("metadata"), // For storing additional message data
});

export const tasks = pgTable("tasks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  status: text("status").notNull().default("planned"), // 'planned' | 'in_progress' | 'resolved' | 'blocked'
  priority: text("priority").default("medium"), // 'low' | 'medium' | 'high'
  isPinned: integer("is_pinned").default(0), // 0 or 1 for boolean
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  metadata: jsonb("metadata"),
});

export const memoryShards = pgTable("memory_shards", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  project: text("project").notNull(),
  content: text("content").notNull(),
  summary: text("summary"),
  tokens: integer("tokens").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  metadata: jsonb("metadata"),
});

export const agentStatus = pgTable("agent_status", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  status: text("status").notNull().default("idle"), // 'idle' | 'thinking' | 'executing'
  currentTask: text("current_task"),
  lastActivity: timestamp("last_activity").defaultNow(),
  metadata: jsonb("metadata"),
});

export const taskQueue = pgTable("task_queue", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  priority: integer("priority").default(1), // 1 = high, 2 = medium, 3 = low
  status: text("status").notNull().default("queued"), // 'queued' | 'in_progress' | 'completed' | 'failed'
  estimatedTime: integer("estimated_time"), // in minutes
  createdAt: timestamp("created_at").defaultNow(),
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  metadata: jsonb("metadata"),
});

export const statusPipeline = pgTable("status_pipeline", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  currentStage: text("current_stage").notNull().default("planning"), // 'planning' | 'doing' | 'testing' | 'done'
  stages: jsonb("stages"), // Array of stage objects with progress
  taskId: varchar("task_id"),
  updatedAt: timestamp("updated_at").defaultNow(),
  metadata: jsonb("metadata"),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const insertConversationSchema = createInsertSchema(conversations).omit({ id: true, createdAt: true, updatedAt: true });
export const insertMessageSchema = createInsertSchema(messages).omit({ id: true, timestamp: true });
export const insertTaskSchema = createInsertSchema(tasks).omit({ id: true, createdAt: true, updatedAt: true });
export const insertMemoryShardSchema = createInsertSchema(memoryShards).omit({ id: true, createdAt: true });
export const insertAgentStatusSchema = createInsertSchema(agentStatus).omit({ id: true, lastActivity: true });
export const insertTaskQueueSchema = createInsertSchema(taskQueue).omit({ id: true, createdAt: true, startedAt: true, completedAt: true });
export const insertStatusPipelineSchema = createInsertSchema(statusPipeline).omit({ id: true, updatedAt: true });

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Conversation = typeof conversations.$inferSelect;
export type InsertConversation = z.infer<typeof insertConversationSchema>;
export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Task = typeof tasks.$inferSelect;
export type InsertTask = z.infer<typeof insertTaskSchema>;
export type MemoryShard = typeof memoryShards.$inferSelect;
export type InsertMemoryShard = z.infer<typeof insertMemoryShardSchema>;
export type AgentStatus = typeof agentStatus.$inferSelect;
export type InsertAgentStatus = z.infer<typeof insertAgentStatusSchema>;
export type TaskQueueItem = typeof taskQueue.$inferSelect;
export type InsertTaskQueueItem = z.infer<typeof insertTaskQueueSchema>;
export type StatusPipeline = typeof statusPipeline.$inferSelect;
export type InsertStatusPipeline = z.infer<typeof insertStatusPipelineSchema>;
