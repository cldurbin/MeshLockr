// src/types/log.ts

export interface LogEntry {
  id: string;
  user_id: string;
  action: string;
  metadata?: Record<string, string | number | boolean | null>;
  created_at: string;
}