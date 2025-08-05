import { apiRequest } from "./api";
import type { MemoryShard, Task } from "@shared/schema";

export async function flushContext(): Promise<{ message: string; shardsCreated: number }> {
  const response = await apiRequest("POST", "/api/flush/trigger");
  return response.json();
}

export async function getActiveContext(): Promise<{
  tasks: Task[];
  totalTokens: number;
  maxTokens: number;
}> {
  const response = await apiRequest("GET", "/api/context/active");
  return response.json();
}

export async function getMemoryShards(): Promise<MemoryShard[]> {
  const response = await apiRequest("GET", "/api/memory/shards");
  return response.json();
}

export async function getMemoryShardsByProject(project: string): Promise<MemoryShard[]> {
  const response = await apiRequest("GET", `/api/context/shard/${project}`);
  return response.json();
}

export function calculateTokenUsage(content: string): number {
  // Simple approximation: ~4 characters per token
  return Math.ceil(content.length / 4);
}

export function compressMemory(tasks: Task[]): string {
  return tasks.map(task => ({
    id: task.id,
    title: task.title,
    status: task.status,
    summary: task.description?.substring(0, 100) + (task.description && task.description.length > 100 ? "..." : "")
  })).map(t => `${t.title} (${t.status}): ${t.summary}`).join("\n");
}
