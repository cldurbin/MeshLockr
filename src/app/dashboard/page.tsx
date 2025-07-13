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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          MeshLockr Admin Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Total Users: {loading ? '...' : users.length}
        </p>
      </div>

      {!loading && users.length > 0 && (
        <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
          {users.map((user) => (
            <li key={user.id}>
              <span className="font-mono text-blue-600 dark:text-blue-400">
                {user.id}
              </span>{' '}
              – {new Date(user.created_at).toLocaleString()}
            </li>
          ))}
        </ul>
      )}

      <button
        onClick={handleTestLog}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
      >
        Write Test Log
      </button>
    </div>
  );
}
