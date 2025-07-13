'use client';

import { useCallback, useEffect, useState } from 'react';
import { useOrganization } from '@clerk/nextjs';
import { Copy, Loader2, Trash2, Plus } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import CreateInviteModal from './CreateInviteModal';

interface Invite {
  id: string;
  token: string;
  email_domain?: string;
  role: string;
  max_uses?: number;
  uses: number;
  expires_at?: string;
  created_at: string;
}

export default function InviteLinksTable() {
  const { organization } = useOrganization();
  const orgId = organization?.id;
  const [invites, setInvites] = useState<Invite[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const fetchInvites = useCallback(async () => {
    if (!orgId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/invites/list?org_id=${orgId}`);
      const data = await res.json();
      if (res.ok) setInvites(data.invites);
      else console.error('Failed to fetch invites:', data.error);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [orgId]);

  useEffect(() => {
    fetchInvites();
  }, [fetchInvites]);

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    alert('Copied to clipboard!');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to revoke this invite?')) return;

    try {
      const res = await fetch(`/api/invites/delete?id=${id}`, {
        method: 'DELETE',
      });

      const result = await res.json();
      if (res.ok) {
        setInvites((prev) => prev.filter((invite) => invite.id !== id));
      } else {
        alert(result.error || 'Failed to delete invite');
      }
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const inviteUrl = (token: string) =>
    `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/join?token=${token}`;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Active Invites</h2>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1 bg-blue-600 text-white text-sm px-3 py-1.5 rounded hover:bg-blue-700"
        >
          <Plus size={14} /> New Invite
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-10 text-gray-500">
          <Loader2 className="animate-spin mr-2" /> Loading invites...
        </div>
      ) : invites.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-8">No invites found.</p>
      ) : (
        <div className="overflow-x-auto border rounded-md bg-white shadow-sm text-sm">
          <table className="min-w-full">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="px-4 py-2">Link</th>
                <th className="px-4 py-2">Role</th>
                <th className="px-4 py-2">Domain</th>
                <th className="px-4 py-2">Uses</th>
                <th className="px-4 py-2">Expires</th>
                <th className="px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {invites.map((invite) => (
                <tr key={invite.id} className="border-t">
                  <td className="px-4 py-2 font-mono text-xs max-w-[250px] truncate">
                    {inviteUrl(invite.token)}
                  </td>
                  <td className="px-4 py-2">{invite.role}</td>
                  <td className="px-4 py-2">{invite.email_domain || 'Any'}</td>
                  <td className="px-4 py-2">
                    {invite.uses}/{invite.max_uses ?? '∞'}
                  </td>
                  <td className="px-4 py-2">
                    {invite.expires_at
                      ? formatDistanceToNow(new Date(invite.expires_at), { addSuffix: true })
                      : 'Never'}
                  </td>
                  <td className="px-4 py-2 flex gap-2">
                    <button
                      onClick={() => copyToClipboard(inviteUrl(invite.token))}
                      className="text-blue-600 hover:underline"
                    >
                      <Copy size={14} className="inline-block mr-1" />
                      Copy
                    </button>
                    <button
                      onClick={() => handleDelete(invite.id)}
                      className="text-red-600 hover:underline"
                    >
                      <Trash2 size={14} className="inline-block mr-1" />
                      Revoke
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <CreateInviteModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onCreated={fetchInvites}
      />
    </div>
  );
}
