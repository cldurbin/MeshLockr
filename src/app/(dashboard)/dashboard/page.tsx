// src/app/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import supabase from '@lib/supabase';
import { logAction } from '@lib/logger';

export default function DashboardPage() {
  const [users, setUsers] = useState<{ id: string; created_at: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      const { data, error } = await supabase.from('users').select('*');
      if (error) {
        console.error('Error fetching users:', error.message);
      } else {
        setUsers(data);
      }
      setLoading(false);
    }

    fetchUsers();
  }, []);

  const handleTestLog = async () => {
    await logAction({
      user_id: 'test-user-123',
      action: 'Test log from dashboard',
      metadata: { source: 'dashboard button' },
    });
  };

  if (loading) {
    return (
      <div className="p-4">
        <p className="text-gray-600">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">MeshLockr Admin Dashboard</h1>
      <p>Total Users: {users.length}</p>

      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.id} – {user.created_at}
          </li>
        ))}
      </ul>

      <button
        onClick={handleTestLog}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded mt-4"
      >
        Write Test Log
      </button>
    </div>
  );
}
// This page fetches and displays user data from the Supabase database
// and allows the admin to write a test log entry.