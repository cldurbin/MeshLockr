import { NextResponse } from 'next/server';
import supabase from '@/lib/supabase';
import { currentUser } from '@clerk/nextjs/server';

export async function POST(req: Request) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: 'Missing invite ID' }, { status: 400 });

  const { error } = await supabase.from('invites').delete().eq('id', id);

  if (error) {
    console.error('Failed to delete invite:', error.message);
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
