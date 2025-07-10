// src/app/api/test/route.ts
import { NextResponse } from 'next/server'
import supabase from '../../../lib/supabase'

export async function GET() {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .limit(5)

  if (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 })
  }

  return NextResponse.json({ users: data })
}

