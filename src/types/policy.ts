// src/types/policy.ts

export interface AccessPolicy {
  id: string;
  org_id: string;
  allow_country: string[];
  block_time_ranges: string[];
  require_trusted_device: boolean;
  created_at: string;
  updated_at: string;
}
