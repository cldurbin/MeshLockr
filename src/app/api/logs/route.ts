// src/app/api/logs/route.ts
import { NextResponse } from 'next/server';
import supabase from '../../../lib/supabase';

export async function POST(req: Request) {
  const body = await req.json();
  const { user_id, action, metadata, org_id, user_email } = body;

  const { error } = await supabase.from('logs').insert([
    {
      user_id,
      user_email,
      action,
      metadata,
      org_id,
    },
  ]);

  if (error) {
    console.error('❌ Error inserting log:', error);
    return NextResponse.json({ error: 'Failed to log action' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const org_id = searchParams.get('org_id');
  const user_id = searchParams.get('user_id');
  const action = searchParams.get('action');
  const date = searchParams.get('date');
  const limit = parseInt(searchParams.get('limit') || '20');
  const page = parseInt(searchParams.get('page') || '1');
  const offset = (page - 1) * limit;

  if (!org_id) {
    return NextResponse.json({ error: 'Missing org_id' }, { status: 400 });
  }

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
