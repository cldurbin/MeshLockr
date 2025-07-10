// src/app/api/logs/route.ts
import { NextResponse } from 'next/server';
import supabase from '../../../lib/supabase'; // assumes tsconfig.json is using "paths" alias "@/*"

export async function POST(req: Request) {
  const body = await req.json();
  const { user_id, action, metadata } = body;

  const { error } = await supabase.from('logs').insert([
    {
      user_id,
      action,
      metadata,
    },
  ]);

  if (error) {
    console.error('Error inserting log:', error);
    return NextResponse.json({ error: 'Failed to log action' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

export async function GET() {
  const { data, error } = await supabase
    .from('logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100);

  if (error) {
    console.error('Error fetching logs:', error);
    return NextResponse.json({ error: 'Failed to fetch logs' }, { status: 500 });
  }

  return NextResponse.json({ logs: data });
}

