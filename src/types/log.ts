export interface LogEntry {
  id: string;
  user_id: string;
  user_email?: string;
  action: string;
  metadata?: Record<string, unknown>;
  org_id?: string;
  created_at: string;
}