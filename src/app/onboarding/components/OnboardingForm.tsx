'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function OnboardingForm() {
  const [orgName, setOrgName] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgName) return;

    setLoading(true);
    try {
      const res = await fetch('/api/onboarding/create-org', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: orgName }),
      });

      const { orgId } = await res.json();
      router.push(`/onboarding?step=invite&orgId=${orgId}`);
    } catch (err) {
      console.error('Org creation failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="block text-sm font-medium">Organization Name</label>
      <input
        type="text"
        value={orgName}
        onChange={(e) => setOrgName(e.target.value)}
        className="border px-3 py-2 rounded w-full"
        placeholder="e.g. Acme Corp"
        required
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {loading ? 'Creating...' : 'Create Organization'}
      </button>
    </form>
  );
}
