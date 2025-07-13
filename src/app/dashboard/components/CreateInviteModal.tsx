'use client';

import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { useOrganization } from '@clerk/nextjs';

interface CreateInviteModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export default function CreateInviteModal({
  open,
  onClose,
  onCreated,
}: CreateInviteModalProps) {
  const { organization } = useOrganization();
  const orgId = organization?.id;

  const [emailDomain, setEmailDomain] = useState('');
  const [role, setRole] = useState('basic_member');
  const [maxUses, setMaxUses] = useState<number | ''>('');
  const [expiresInHours, setExpiresInHours] = useState<number | ''>('');
  const [submitting, setSubmitting] = useState(false);

  const handleCreate = async () => {
    if (!orgId) return alert('Missing organization ID');
    setSubmitting(true);

    const expires_at = expiresInHours
      ? new Date(Date.now() + Number(expiresInHours) * 3600000).toISOString()
      : null;

    try {
      const res = await fetch('/api/invites/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          org_id: orgId,
          email_domain: emailDomain || null,
          role,
          max_uses: maxUses !== '' ? Number(maxUses) : null,
          expires_at,
        }),
      });

      if (!res.ok) throw new Error('Failed to create invite');
      onCreated();
      onClose();
    } catch (err) {
      console.error('Invite creation error:', err);
      alert('Failed to create invite link');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/20" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white rounded p-6 w-full max-w-md space-y-4 shadow">
          <Dialog.Title className="text-lg font-semibold">Create Invite Link</Dialog.Title>

          <div className="space-y-2">
            <input
              type="text"
              placeholder="Allowed email domain (optional)"
              className="w-full border px-2 py-1 rounded"
              value={emailDomain}
              onChange={(e) => setEmailDomain(e.target.value)}
            />
            <input
              type="text"
              placeholder="Role (default: basic_member)"
              className="w-full border px-2 py-1 rounded"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            />
            <input
              type="number"
              placeholder="Max uses (optional)"
              className="w-full border px-2 py-1 rounded"
              value={maxUses}
              onChange={(e) =>
                setMaxUses(e.target.value === '' ? '' : Number(e.target.value))
              }
            />
            <input
              type="number"
              placeholder="Expires in (hours)"
              className="w-full border px-2 py-1 rounded"
              value={expiresInHours}
              onChange={(e) =>
                setExpiresInHours(e.target.value === '' ? '' : Number(e.target.value))
              }
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              onClick={onClose}
              disabled={submitting}
              className="text-sm px-4 py-1.5 border rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              disabled={submitting}
              className="text-sm bg-blue-600 text-white px-4 py-1.5 rounded hover:bg-blue-700"
            >
              {submitting ? 'Creating...' : 'Create'}
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
