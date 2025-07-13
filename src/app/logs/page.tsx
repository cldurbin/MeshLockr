'use client';

import LogsTable from './components/LogsTable';

export default function LogsPage() {
  return (
    <div className="p-4">
      <LogsTable />
    </div>
  );
}
// This page displays the logs of user actions in the application.
// It uses the LogsTable component to render the logs in a table format.