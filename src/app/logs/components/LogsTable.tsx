'use client';

import { useEffect, useState } from 'react';
import { LogEntry } from '@/types/log';
import LogDetailsModal from './LogDetailsModal';
import { Loader2 } from 'lucide-react';

export default function LogsTable() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);

  useEffect(() => {
    async function fetchLogs() {
      try {
        const res = await fetch('/api/logs');
        const result = await res.json();
        if (!res.ok) throw new Error(result.error || 'Failed to load logs');
        setLogs(result.logs);
      } catch (err) {
        console.error('Error fetching logs:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchLogs();
  }, []);

  return (
    <div className="overflow-x-auto border rounded-lg bg-white shadow">
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
          <span className="ml-2 text-sm text-gray-600">Loading logs...</span>
        </div>
      ) : logs.length === 0 ? (
        <p className="text-center py-10 text-gray-500">No logs found.</p>
      ) : (
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="px-4 py-2">User ID</th>
              <th className="px-4 py-2">Action</th>
              <th className="px-4 py-2">Created At</th>
              <th className="px-4 py-2">Details</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2 font-mono text-xs">{log.user_id}</td>
                <td className="px-4 py-2">{log.action}</td>
                <td className="px-4 py-2">
                  {new Date(log.created_at).toLocaleString()}
                </td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => setSelectedLog(log)}
                    className="text-blue-600 underline text-sm"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <LogDetailsModal log={selectedLog} onClose={() => setSelectedLog(null)} />
    </div>
  );
}
