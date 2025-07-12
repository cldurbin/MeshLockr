import { NextResponse } from 'next/server';
import supabase from '@lib/supabase';

export async function GET() {
  try {
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
