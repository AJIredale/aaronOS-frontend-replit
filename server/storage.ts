import { 
  type User, type InsertUser, 
  type Conversation, type InsertConversation, 
  type Message, type InsertMessage, 
  type Task, type InsertTask, 
  type MemoryShard, type InsertMemoryShard, 
  type AgentStatus, type InsertAgentStatus,
  type TaskQueueItem, type InsertTaskQueueItem,
  type StatusPipeline, type InsertStatusPipeline
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Conversations
  getConversations(userId: string): Promise<Conversation[]>;
  getConversation(id: string): Promise<Conversation | undefined>;
  createConversation(conversation: InsertConversation): Promise<Conversation>;

  // Messages
  getMessages(conversationId: string): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;

  // Tasks
  getTasks(): Promise<Task[]>;
  getTask(id: string): Promise<Task | undefined>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: string, updates: Partial<Task>): Promise<Task | undefined>;

  // Memory Shards
  getMemoryShards(): Promise<MemoryShard[]>;
  getMemoryShardsByProject(project: string): Promise<MemoryShard[]>;
  createMemoryShard(shard: InsertMemoryShard): Promise<MemoryShard>;

  // Agent Status
  getAgentStatus(): Promise<AgentStatus | undefined>;
  updateAgentStatus(status: InsertAgentStatus): Promise<AgentStatus>;

  // Task Queue
  getTaskQueue(): Promise<TaskQueueItem[]>;
  getTaskQueueItem(id: string): Promise<TaskQueueItem | undefined>;
  createTaskQueueItem(item: InsertTaskQueueItem): Promise<TaskQueueItem>;
  updateTaskQueueItem(id: string, updates: Partial<TaskQueueItem>): Promise<TaskQueueItem | undefined>;

  // Status Pipeline
  getStatusPipeline(): Promise<StatusPipeline | undefined>;
  updateStatusPipeline(pipeline: InsertStatusPipeline): Promise<StatusPipeline>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private conversations: Map<string, Conversation>;
  private messages: Map<string, Message>;
  private tasks: Map<string, Task>;
  private memoryShards: Map<string, MemoryShard>;
  private agentStatus: AgentStatus | undefined;
  private taskQueue: Map<string, TaskQueueItem>;
  private statusPipeline: StatusPipeline | undefined;

  constructor() {
    this.users = new Map();
    this.conversations = new Map();
    this.messages = new Map();
    this.tasks = new Map();
    this.memoryShards = new Map();
    this.taskQueue = new Map();
    this.agentStatus = {
      id: randomUUID(),
      status: "idle",
      currentTask: null,
      lastActivity: new Date(),
      metadata: null
    };
    this.statusPipeline = {
      id: randomUUID(),
      currentStage: "planning",
      stages: [
        { name: "planning", status: "active", progress: 0 },
        { name: "doing", status: "pending", progress: 0 },
        { name: "testing", status: "pending", progress: 0 },
        { name: "done", status: "pending", progress: 0 }
      ],
      taskId: null,
      updatedAt: new Date(),
      metadata: null
    };

    // Initialize with some sample task queue items
    this.initializeSampleData();
  }

  private initializeSampleData() {
    const sampleTasks: TaskQueueItem[] = [
      {
        id: randomUUID(),
        title: "Implement user authentication",
        description: "Set up JWT-based authentication system",
        priority: 1,
        status: "in_progress",
        estimatedTime: 45,
        createdAt: new Date(),
        startedAt: new Date(),
        completedAt: null,
        metadata: null
      },
      {
        id: randomUUID(),
        title: "Database schema optimization",
        description: "Optimize database queries and indexes",
        priority: 2,
        status: "queued",
        estimatedTime: 30,
        createdAt: new Date(),
        startedAt: null,
        completedAt: null,
        metadata: null
      },
      {
        id: randomUUID(),
        title: "UI component library update",
        description: "Update shadcn/ui components to latest version",
        priority: 3,
        status: "queued",
        estimatedTime: 20,
        createdAt: new Date(),
        startedAt: null,
        completedAt: null,
        metadata: null
      }
    ];

    sampleTasks.forEach(task => this.taskQueue.set(task.id, task));
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getConversations(userId: string): Promise<Conversation[]> {
    return Array.from(this.conversations.values()).filter(conv => conv.userId === userId);
  }

  async getConversation(id: string): Promise<Conversation | undefined> {
    return this.conversations.get(id);
  }

  async createConversation(insertConversation: InsertConversation): Promise<Conversation> {
    const id = randomUUID();
    const now = new Date();
    const conversation: Conversation = {
      id,
      userId: insertConversation.userId || null,
      title: insertConversation.title,
      createdAt: now,
      updatedAt: now
    };
    this.conversations.set(id, conversation);
    return conversation;
  }

  async getMessages(conversationId: string): Promise<Message[]> {
    return Array.from(this.messages.values())
      .filter(msg => msg.conversationId === conversationId)
      .sort((a, b) => (a.timestamp?.getTime() || 0) - (b.timestamp?.getTime() || 0));
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = randomUUID();
    const message: Message = {
      id,
      conversationId: insertMessage.conversationId || null,
      role: insertMessage.role,
      content: insertMessage.content,
      timestamp: new Date(),
      metadata: insertMessage.metadata || null
    };
    this.messages.set(id, message);
    return message;
  }

  async getTasks(): Promise<Task[]> {
    return Array.from(this.tasks.values())
      .sort((a, b) => (b.updatedAt?.getTime() || 0) - (a.updatedAt?.getTime() || 0));
  }

  async getTask(id: string): Promise<Task | undefined> {
    return this.tasks.get(id);
  }

  async createTask(insertTask: InsertTask): Promise<Task> {
    const id = randomUUID();
    const now = new Date();
    const task: Task = {
      id,
      title: insertTask.title,
      description: insertTask.description || null,
      status: insertTask.status || "planned",
      priority: insertTask.priority || null,
      isPinned: insertTask.isPinned || null,
      createdAt: now,
      updatedAt: now,
      metadata: insertTask.metadata || null
    };
    this.tasks.set(id, task);
    return task;
  }

  async updateTask(id: string, updates: Partial<Task>): Promise<Task | undefined> {
    const task = this.tasks.get(id);
    if (!task) return undefined;

    const updatedTask: Task = {
      ...task,
      ...updates,
      updatedAt: new Date()
    };
    this.tasks.set(id, updatedTask);
    return updatedTask;
  }

  async getMemoryShards(): Promise<MemoryShard[]> {
    return Array.from(this.memoryShards.values())
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async getMemoryShardsByProject(project: string): Promise<MemoryShard[]> {
    return Array.from(this.memoryShards.values())
      .filter(shard => shard.project === project)
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async createMemoryShard(insertShard: InsertMemoryShard): Promise<MemoryShard> {
    const id = randomUUID();
    const shard: MemoryShard = {
      id,
      project: insertShard.project,
      content: insertShard.content,
      summary: insertShard.summary || null,
      tokens: insertShard.tokens || null,
      createdAt: new Date(),
      metadata: insertShard.metadata || null
    };
    this.memoryShards.set(id, shard);
    return shard;
  }

  async getAgentStatus(): Promise<AgentStatus | undefined> {
    return this.agentStatus;
  }

  async updateAgentStatus(statusUpdate: InsertAgentStatus): Promise<AgentStatus> {
    if (!this.agentStatus) {
      this.agentStatus = {
        id: randomUUID(),
        status: statusUpdate.status || "idle",
        currentTask: statusUpdate.currentTask || null,
        lastActivity: new Date(),
        metadata: statusUpdate.metadata || null
      };
    } else {
      this.agentStatus = {
        id: this.agentStatus.id,
        status: statusUpdate.status || this.agentStatus.status,
        currentTask: statusUpdate.currentTask || this.agentStatus.currentTask,
        lastActivity: new Date(),
        metadata: statusUpdate.metadata || this.agentStatus.metadata
      };
    }
    return this.agentStatus;
  }

  // Task Queue methods
  async getTaskQueue(): Promise<TaskQueueItem[]> {
    return Array.from(this.taskQueue.values()).sort((a, b) => (a.priority || 2) - (b.priority || 2));
  }

  async getTaskQueueItem(id: string): Promise<TaskQueueItem | undefined> {
    return this.taskQueue.get(id);
  }

  async createTaskQueueItem(insertItem: InsertTaskQueueItem): Promise<TaskQueueItem> {
    const id = randomUUID();
    const item: TaskQueueItem = {
      id,
      title: insertItem.title,
      description: insertItem.description || null,
      priority: insertItem.priority || 2,
      status: insertItem.status || "queued",
      estimatedTime: insertItem.estimatedTime || null,
      createdAt: new Date(),
      startedAt: null,
      completedAt: null,
      metadata: insertItem.metadata || null
    };
    this.taskQueue.set(id, item);
    return item;
  }

  async updateTaskQueueItem(id: string, updates: Partial<TaskQueueItem>): Promise<TaskQueueItem | undefined> {
    const item = this.taskQueue.get(id);
    if (!item) return undefined;

    const updatedItem = { ...item, ...updates };
    this.taskQueue.set(id, updatedItem);
    return updatedItem;
  }

  // Status Pipeline methods
  async getStatusPipeline(): Promise<StatusPipeline | undefined> {
    return this.statusPipeline;
  }

  async updateStatusPipeline(pipelineUpdate: InsertStatusPipeline): Promise<StatusPipeline> {
    if (!this.statusPipeline) {
      this.statusPipeline = {
        id: randomUUID(),
        currentStage: pipelineUpdate.currentStage || "planning",
        stages: pipelineUpdate.stages || null,
        taskId: pipelineUpdate.taskId || null,
        updatedAt: new Date(),
        metadata: pipelineUpdate.metadata || null
      };
    } else {
      this.statusPipeline = {
        ...this.statusPipeline,
        currentStage: pipelineUpdate.currentStage || this.statusPipeline.currentStage,
        stages: pipelineUpdate.stages || this.statusPipeline.stages,
        taskId: pipelineUpdate.taskId || this.statusPipeline.taskId,
        updatedAt: new Date(),
        metadata: pipelineUpdate.metadata || this.statusPipeline.metadata
      };
    }
    return this.statusPipeline;
  }
}

export const storage = new MemStorage();
