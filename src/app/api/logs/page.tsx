import supabase from '../../../lib/supabase';

type Log = {
  id: string;
  user_id: string;
  action: string;
metadata: Record<string, unknown>;
  created_at: string;
};

export default async function LogsPage() {
  const { data: logs, error } = await supabase
    .from('logs')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return <div>Error loading logs: {error.message}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Audit Logs</h1>
      {logs && logs.length > 0 ? (
        <ul className="space-y-2">
          {logs.map((log: Log) => (
            <li key={log.id} className="border p-3 rounded bg-white shadow-sm">
              <p>
                <strong>User ID:</strong> {log.user_id}
              </p>
              <p>
                <strong>Action:</strong> {log.action}
              </p>
              <p>
                <strong>Metadata:</strong>{' '}
                <pre className="bg-gray-100 p-2 rounded overflow-x-auto text-sm">
                  {JSON.stringify(log.metadata, null, 2)}
                </pre>
              </p>
              <p className="text-xs text-gray-500">
                <strong>Timestamp:</strong> {new Date(log.created_at).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No logs available yet.</p>
      )}
    </div>
  );
}
