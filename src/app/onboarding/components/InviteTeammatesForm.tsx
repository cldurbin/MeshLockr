'use client';

import { useState } from 'react';

export default function InviteTeammatesForm({ orgId }: { orgId: string }) {
  const [emails, setEmails] = useState('');
  const [sending, setSending] = useState(false);

  const handleInvite = async () => {
    if (!emails.trim()) return;

    setSending(true);
    try {
      await fetch('/api/onboarding/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orgId, emails: emails.split(',').map(e => e.trim()) }),
      });
      alert('Invites sent!');
    } catch (err) {
      console.error('Invite failed:', err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium">Invite teammates (comma-separated emails)</label>
      <input
        type="text"
        value={emails}
        onChange={(e) => setEmails(e.target.value)}
        placeholder="jane@example.com, joe@example.com"
        className="border px-3 py-2 rounded w-full"
      />
      <button
        onClick={handleInvite}
        disabled={sending}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {sending ? 'Sending...' : 'Send Invites'}
      </button>
    </div>
  );
}
