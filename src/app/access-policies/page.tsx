// src/app/access-policies/page.tsx

'use client'

import { useEffect, useState } from 'react'

interface Policy {
  id: string
  org_id: string
  allow_country: string[]
  block_time_ranges: string[]
  require_trusted_device: boolean
  updated_at: string
  created_at: string
}

export default function AccessPoliciesPage() {
  const [policies, setPolicies] = useState<Policy[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(5)

useEffect(() => {
  async function fetchPolicies() {
    setLoading(true)
    try {
      const res = await fetch('/api/policies')
      const result = await res.json()

      if (!res.ok) {
        throw new Error(result.error || 'Failed to fetch')
      }

      setPolicies(result)
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Unknown error occurred')
      }
    } finally {
      setLoading(false)
    }
  }

  fetchPolicies()
}, [])


  const paginated = policies.slice((page - 1) * perPage, page * perPage)
  const totalPages = Math.ceil(policies.length / perPage)

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Access Policies</h1>

      {loading && <p>Loading policies...</p>}
      {error && <p className="text-red-600">Error: {error}</p>}

      {!loading && !error && (
        <>
          <div className="mb-4 flex items-center justify-between">
            <label className="text-sm">
              Show{' '}
              <select
                className="border rounded px-2 py-1 ml-1"
                value={perPage}
                onChange={(e) => {
                  setPage(1)
                  setPerPage(Number(e.target.value))
                }}
              >
                {[5, 10, 25, 50].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>{' '}
              per page
            </label>
            <p className="text-sm text-gray-600">
              Total: {policies.length} policies
            </p>
          </div>

          <div className="overflow-x-auto border rounded-lg">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100 text-left">
                <tr>
                  <th className="px-4 py-2">Allowed Countries</th>
                  <th className="px-4 py-2">Blocked Times</th>
                  <th className="px-4 py-2">Trusted Device</th>
                  <th className="px-4 py-2">Updated</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((policy) => (
                  <tr key={policy.id} className="border-t">
                    <td className="px-4 py-2">{policy.allow_country.join(', ')}</td>
                    <td className="px-4 py-2">{policy.block_time_ranges.join(', ')}</td>
                    <td className="px-4 py-2">
                      {policy.require_trusted_device ? 'Yes' : 'No'}
                    </td>
                    <td className="px-4 py-2">
                      {new Date(policy.updated_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between mt-4">
            <button
              className="px-3 py-1 border rounded disabled:opacity-50"
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
            >
              Previous
            </button>
            <p className="text-sm">
              Page {page} of {totalPages}
            </p>
            <button
              className="px-3 py-1 border rounded disabled:opacity-50"
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  )
}
