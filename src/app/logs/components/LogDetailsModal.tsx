'use client';

import React from 'react';
import { LogEntry } from '@/types/log'; 
import { X } from 'lucide-react';

type LogDetailsModalProps = {
  log: LogEntry | null;
  onClose: () => void;
};

export default function LogDetailsModal({ log, onClose }: LogDetailsModalProps) {
  if (!log) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-lg rounded-lg shadow-lg p-6 relative">
        {/* Close Button */}
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-lg font-semibold mb-2">Log Details</h2>
        <p className="text-sm text-gray-500 mb-4">
          <strong>Action:</strong> {log.action}
        </p>

        <p className="text-sm text-gray-500 mb-4">
          <strong>User ID:</strong> {log.user_id}
        </p>

        <p className="text-sm text-gray-500 mb-4">
          <strong>Timestamp:</strong>{' '}
          {new Date(log.created_at).toLocaleString()}
        </p>

        <div>
          <h3 className="font-semibold text-sm mb-1">Metadata:</h3>
          <pre className="bg-gray-100 text-xs rounded p-2 overflow-x-auto max-h-60">
            {JSON.stringify(log.metadata ?? {}, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
