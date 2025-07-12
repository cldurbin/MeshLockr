export interface AccessPolicy {
  id: string
  org_id: string
  allow_country: string[]
  allow_state?: string[]
  block_time_ranges?: string[]
  require_trusted_device: boolean
  created_by?: string
  created_at: string
  updated_at: string
  deleted?: boolean 
}