// src/app/api/invites/create/route.ts
import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { currentUser } from '@clerk/nextjs/server';
import  supabase  from '@/lib/supabase';
import { logAction } from '@/lib/logger';

export async function POST(req: Request) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const { org_id, email_domain, role = 'basic_member', expires_at, max_uses } = body;

    if (!org_id) {
      return NextResponse.json({ error: 'Missing org_id' }, { status: 400 });
    }

    const token = randomUUID();

    const { error } = await supabase.from('invites').insert({
      token,
      org_id,
      email_domain,
      role,
      expires_at,
      max_uses,
      created_by: user.id,
    });

    if (error) {
      console.error('❌ Failed to create invite:', error);
      return NextResponse.json({ error: 'Failed to create invite' }, { status: 500 });
    }

    // Log action
    await logAction({
      user_id: user.id,
      action: 'invite_created',
      metadata: {
        token,
        org_id,
        role,
        email_domain,
        expires_at,
        max_uses,
      },
    });

    const joinUrl = `${process.env.NEXT_PUBLIC_APP_URL}/join/${token}`;
    return NextResponse.json({ joinUrl });
  } catch (err) {
    console.error('❌ Unexpected error:', err);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
