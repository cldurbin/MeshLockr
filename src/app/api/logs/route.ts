// src/app/api/logs/route.ts
import { NextResponse } from 'next/server';
import supabase from '@/lib/supabase';

// ✅ POST: Secure logging with verified session data
export async function POST(req: Request) {
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { action, metadata } = body;

  // Extract values from the JWT claims
  const user_id = user.id;
  const user_email = user.email || '';
  const org_id = (user?.user_metadata?.org_id || null) as string | null;

  if (!action || !org_id) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const { error: insertError } = await supabase.from('logs').insert([
    {
      user_id,
      user_email,
      org_id,
      action,
      metadata,
    },
  ]);

  if (insertError) {
    console.error('❌ Error inserting log:', insertError);
    return NextResponse.json({ error: 'Failed to log action' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

// ✅ GET: Flexible filters + tenant/org-aware protection
export async function GET(req: Request) {
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const org_id = user?.user_metadata?.org_id || null;
  if (!org_id) {
    return NextResponse.json({ error: 'Missing org_id in session' }, { status: 400 });
  }

  const { searchParams } = new URL(req.url);
  const user_id = searchParams.get('user_id');
  const action = searchParams.get('action');
  const date = searchParams.get('date');
  const limit = parseInt(searchParams.get('limit') || '20');
  const page = parseInt(searchParams.get('page') || '1');
  const offset = (page - 1) * limit;

  let query = supabase
    .from('logs')
    .select('*', { count: 'exact' })
    .eq('org_id', org_id)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (user_id) query = query.eq('user_id', user_id);
  if (action) query = query.ilike('action', `%${action}%`);
  if (date) {
    const start = new Date(date).toISOString().split('T')[0];
    const end = new Date(new Date(date).getTime() + 86400000)
      .toISOString()
      .split('T')[0];
    query = query.gte('created_at', start).lt('created_at', end);
  }

  const { data, count, error } = await query;

  if (error) {
    console.error('❌ Error fetching logs:', error);
    return NextResponse.json({ error: 'Failed to fetch logs' }, { status: 500 });
  }

  return NextResponse.json({
    logs: data,
    total: count,
    page,
    limit,
    totalPages: Math.ceil((count || 0) / limit),
  });
}
