'use client';

import { useCallback, useEffect, useState } from 'react';
import { LogEntry } from '@/types/log';
import LogDetailsModal from './LogDetailsModal';
import { Loader2, Download, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { useOrganization } from '@clerk/nextjs';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function LogsTable() {
  const { organization } = useOrganization();
  const orgId = organization?.id || '';

  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);

  const fetchLogs = useCallback(async () => {
    if (!orgId) return;
    setLoading(true);
    try {
      const params = new URLSearchParams({
        org_id: orgId,
        page: page.toString(),
        limit: limit.toString(),
        ...(search ? { action: search } : {}),
      });

      const res = await fetch(`/api/logs?${params.toString()}`);
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Failed to load logs');
      setLogs(result.logs);
      setTotalPages(result.totalPages || 1);
    } catch (err) {
      console.error('Error fetching logs:', err);
    } finally {
      setLoading(false);
    }
  }, [orgId, page, limit, search]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  useEffect(() => {
    const channel = supabase
      .channel('logs-stream')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'logs' }, () => {
        fetchLogs();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchLogs]);

  function exportCSV() {
    const header = ['User ID', 'Action', 'Created At'];
    const rows = logs.map((log) => [
      log.user_id,
      log.action,
      new Date(log.created_at).toLocaleString(),
    ]);

    const csvContent = [header, ...rows].map((row) => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'meshlockr-logs.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search by action..."
            className="border px-2 py-1 rounded text-sm"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <button
          onClick={exportCSV}
          className="flex items-center gap-1 text-sm bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700"
        >
          <Download size={16} />
          Export CSV
        </button>
      </div>

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
                  <td className="px-4 py-2">{new Date(log.created_at).toLocaleString()}</td>
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
      </div>

      <div className="flex items-center justify-between text-sm mt-2">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="flex items-center gap-1 px-3 py-1 border rounded disabled:opacity-50"
        >
          <ChevronLeft size={14} /> Prev
        </button>
        <p className="text-gray-600">
          Page {page} of {totalPages}
        </p>
        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
          className="flex items-center gap-1 px-3 py-1 border rounded disabled:opacity-50"
        >
          Next <ChevronRight size={14} />
        </button>
      </div>

      <LogDetailsModal log={selectedLog} onClose={() => setSelectedLog(null)} />
    </div>
  );
}
