import { NextResponse } from 'next/server';
import supabase from '@/lib/supabase';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const org_id = searchParams.get('org_id');

  if (!org_id) {
    return NextResponse.json({ error: 'Missing org_id' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('invites')
    .select('*')
    .eq('org_id', org_id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching invites:', error.message);
    return NextResponse.json({ error: 'Failed to fetch invites' }, { status: 500 });
  }

  return NextResponse.json({ invites: data });
}
