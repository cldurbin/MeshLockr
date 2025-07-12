import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '../../../lib/supabase';

export async function GET() {
  try {
    const token = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!token) {
      console.error('❌ Missing service role key');
      return NextResponse.json({ error: 'Unauthorized – missing service key' }, { status: 401 });
    }

    const supabase = createServerSupabaseClient(token);

    const { data, error } = await supabase.from('policies').select('*');

    if (error) {
      console.error('❌ Supabase fetch error:', error.message);
      return NextResponse.json({ error: 'Failed to fetch policies' }, { status: 500 });
    }

    console.log('✅ Policies fetched:', data);
    return NextResponse.json(data);
  } catch (err) {
    console.error('🚨 Unexpected error in /api/policies:', err);
    return NextResponse.json({ error: 'Unexpected server error' }, { status: 500 });
  }
}
