import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '../../../lib/supabase'

const token = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!token) {
  console.error('❌ Missing service role key')
}

const supabase = createServerSupabaseClient(token!)

export async function GET() {
  try {
    const { data, error } = await supabase.from('policies').select('*')

    if (error) {
      console.error('❌ Supabase fetch error:', error.message)
      return NextResponse.json({ error: 'Failed to fetch policies' }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (err) {
    console.error('🚨 Unexpected error in GET /api/policies:', err)
    return NextResponse.json({ error: 'Unexpected server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const {
      org_id,
      allow_country,
      allow_state,
      block_time_ranges,
      require_trusted_device,
    } = body

    if (!org_id || !allow_country?.length) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const insertPayload: Record<string, unknown> = {
      org_id,
      allow_country,
      require_trusted_device: !!require_trusted_device,
    }

    if (Array.isArray(allow_state) && allow_state.length > 0) {
      insertPayload.allow_state = allow_state
    }

    if (Array.isArray(block_time_ranges) && block_time_ranges.length > 0) {
      insertPayload.block_time_ranges = block_time_ranges
    }

    const { data, error } = await supabase.from('policies').insert(insertPayload).select().single()

    if (error) {
      console.error('❌ Supabase insert error:', error.message)
      return NextResponse.json({ error: 'Failed to create policy' }, { status: 500 })
    }

    console.log('✅ Policy created:', data)
    return NextResponse.json(data)
  } catch (err) {
    console.error('🚨 Unexpected error in POST /api/policies:', err)
    return NextResponse.json({ error: 'Unexpected server error' }, { status: 500 })
  }
}