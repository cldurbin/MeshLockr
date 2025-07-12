'use client'

import { useEffect, useState } from 'react'
import { useUser, useOrganization } from '@clerk/nextjs'
import PolicyModal from './components/PolicyModal'
import { AccessPolicy } from '../../types/policy'

export default function AccessPoliciesPage() {
  const { user } = useUser()
  const { organization } = useOrganization()

  const orgId = organization?.id || 'fallback-org-id'
  const email = user?.primaryEmailAddress?.emailAddress || 'unknown@meshlockr.dev'

  const [policies, setPolicies] = useState<AccessPolicy[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(5)
  const [modalOpen, setModalOpen] = useState(false)
  const [editData, setEditData] = useState<AccessPolicy | null>(null)

  useEffect(() => {
    async function fetchPolicies() {
      setLoading(true)
      try {
        const res = await fetch(`/api/policies?org_id=${orgId}`)
        const result = await res.json()
        if (!res.ok) throw new Error(result.error || 'Failed to fetch')
        setPolicies(result)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred')
      } finally {
        setLoading(false)
      }
    }

    if (orgId) fetchPolicies()
  }, [orgId])

  const handleSaveOrUpdate = async (
    updatedPolicy: Omit<AccessPolicy, 'id' | 'created_at' | 'updated_at'>,
    id?: string
  ) => {
    try {
      const method = id ? 'PUT' : 'POST'
      const payload = id
        ? { ...updatedPolicy, id, org_id: orgId }
        : { ...updatedPolicy, org_id: orgId, created_by: email }

      const res = await fetch('/api/policies', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const result = await res.json()
      if (!res.ok) throw new Error(result.error || 'Failed to save policy')

      setPolicies((prev) =>
        id ? prev.map((p) => (p.id === id ? result : p)) : [...prev, result]
      )
    } catch (err) {
      console.error('❌ Error saving policy:', err)
      alert('Failed to save policy')
    } finally {
      setModalOpen(false)
      setEditData(null)
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this policy?')) return

    try {
      const res = await fetch('/api/policies', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })

      if (!res.ok) {
        const result = await res.json()
        throw new Error(result.error || 'Failed to delete')
      }

      setPolicies((prev) => prev.filter((p) => p.id !== id))
    } catch (err) {
      console.error('❌ Error deleting policy:', err)
      alert('Failed to delete policy')
    }
  }

  const paginated = policies.slice((page - 1) * perPage, page * perPage)
  const totalPages = Math.ceil(policies.length / perPage)

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Access Policies</h1>

      <button
        onClick={() => {
          setModalOpen(true)
          setEditData(null)
        }}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Create New Policy
      </button>

      <PolicyModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setEditData(null)
        }}
        onSubmit={handleSaveOrUpdate}
        orgId={orgId}
        mode={editData ? 'edit' : 'create'}
        initialValues={editData || undefined}
      />

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
                  <th className="px-4 py-2">Created By</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.length > 0 ? (
                  paginated.map((policy) => (
                    <tr key={policy.id} className="border-t">
                      <td className="px-4 py-2">
                        {(policy.allow_country || []).join(', ')}
                        {policy.allow_state?.length
                          ? `, ${policy.allow_state.join(', ')}`
                          : ''}
                      </td>
                      <td className="px-4 py-2">
                        {(policy.block_time_ranges || []).join(', ') || '—'}
                      </td>
                      <td className="px-4 py-2">
                        {policy.require_trusted_device ? 'Yes' : 'No'}
                      </td>
                      <td className="px-4 py-2">
                        {policy.updated_at
                          ? new Date(policy.updated_at).toLocaleString()
                          : '—'}
                      </td>
                      <td className="px-4 py-2 text-xs text-gray-600">
                        {policy.created_by || '—'}
                      </td>
                      <td className="px-4 py-2 space-x-2">
                        <button
                          className="text-blue-600 underline text-sm"
                          onClick={() => {
                            setEditData(policy)
                            setModalOpen(true)
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="text-red-600 underline text-sm"
                          onClick={() => handleDelete(policy.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center text-gray-500 px-4 py-6">
                      No access policies found.
                    </td>
                  </tr>
                )}
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
