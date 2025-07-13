import { NextResponse } from 'next/server';
import { createClerkOrganization } from '@/lib/onboarding';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json({ error: 'Missing organization name' }, { status: 400 });
    }

    const org = await createClerkOrganization(name);

    return NextResponse.json({ orgId: org.id });
  } catch (err) {
    console.error('❌ Failed to create organization:', err);
    return NextResponse.json({ error: 'Failed to create organization' }, { status: 500 });
  }
}
// src/app/api/onboarding/create-org.ts