// src/app/api/policies/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '../../../lib/supabase'

const token = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!token) {
  console.error('❌ Missing service role key')
}

const supabase = createServerSupabaseClient(token!)

/**
 * GET /api/policies
 * Fetch all access policies for an org
 */
export async function GET(req: NextRequest) {
  const orgId = req.nextUrl.searchParams.get('org_id')

  if (!orgId) {
    return NextResponse.json({ error: 'Missing org_id' }, { status: 400 })
  }

  try {
    const { data, error } = await supabase
      .from('policies')
      .select('*')
      .eq('org_id', orgId)

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

/**
 * POST /api/policies
 * Create a new access policy
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      org_id,
      allow_country,
      allow_state,
      block_time_ranges,
      require_trusted_device,
      created_by,
    } = body

    if (!org_id || !allow_country?.length) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const insertPayload: Record<string, unknown> = {
      org_id,
      allow_country,
      require_trusted_device: !!require_trusted_device,
      created_by: created_by || 'unknown@meshlockr.dev',
    }

    if (Array.isArray(allow_state) && allow_state.length > 0) {
      insertPayload.allow_state = allow_state
    }

    if (Array.isArray(block_time_ranges) && block_time_ranges.length > 0) {
      insertPayload.block_time_ranges = block_time_ranges
    }

    const { data, error } = await supabase
      .from('policies')
      .insert(insertPayload)
      .select()
      .single()

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

/**
 * PUT /api/policies
 * Update an existing access policy
 */
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      id,
      org_id,
      allow_country,
      allow_state,
      block_time_ranges,
      require_trusted_device,
    } = body

    if (!id || !org_id || !allow_country?.length) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const updatePayload: Record<string, unknown> = {
      org_id,
      allow_country,
      require_trusted_device: !!require_trusted_device,
    }

    if (Array.isArray(allow_state)) {
      updatePayload.allow_state = allow_state
    }

    if (Array.isArray(block_time_ranges)) {
      updatePayload.block_time_ranges = block_time_ranges
    }

    const { data, error } = await supabase
      .from('policies')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('❌ Supabase update error:', error.message)
      return NextResponse.json({ error: 'Failed to update policy' }, { status: 500 })
    }

    console.log('✅ Policy updated:', data)
    return NextResponse.json(data)
  } catch (err) {
    console.error('🚨 Unexpected error in PUT /api/policies:', err)
    return NextResponse.json({ error: 'Unexpected server error' }, { status: 500 })
  }
}

/**
 * DELETE /api/policies
 * Delete a policy by ID
 */
export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json()

    if (!id) {
      return NextResponse.json({ error: 'Missing policy ID' }, { status: 400 })
    }

    const { error } = await supabase.from('policies').delete().eq('id', id)

    if (error) {
      console.error('❌ Supabase delete error:', error.message)
      return NextResponse.json({ error: 'Failed to delete policy' }, { status: 500 })
    }

    console.log('🗑️ Policy deleted:', id)
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('🚨 Unexpected error in DELETE /api/policies:', err)
    return NextResponse.json({ error: 'Unexpected server error' }, { status: 500 })
  }
}
