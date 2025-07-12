'use client'

import { useEffect, useState } from 'react'
import { useUser, useOrganization } from '@clerk/nextjs'
import PolicyModal from './components/PolicyModal'
import { AccessPolicy } from '../../types/policy'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner' 

export default function AccessPoliciesPage() {
  const { user } = useUser()
  const { organization } = useOrganization()

  const orgId = organization?.id || '361d9eeb-bbcf-4729-9502-03597dbc525b'
  const orgName = organization?.name || 'MeshLockr Team'
  const email = user?.primaryEmailAddress?.emailAddress || 'unknown@meshlockr.dev'

  const [policies, setPolicies] = useState<AccessPolicy[]>([])
  const [selected, setSelected] = useState<string[]>([])
  const [search, setSearch] = useState('')
  const [filterTrusted, setFilterTrusted] = useState('')
  const [filterDate, setFilterDate] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const [perPage] = useState(5)
  const [modalOpen, setModalOpen] = useState(false)
  const [editData, setEditData] = useState<AccessPolicy | null>(null)
  const [undoTimer, setUndoTimer] = useState<NodeJS.Timeout | null>(null)
  const [undoPolicy, setUndoPolicy] = useState<AccessPolicy | null>(null)

  useEffect(() => {
    async function fetchPolicies() {
      setLoading(true)
      try {
        const res = await fetch(`/api/policies?org_id=${orgId}`)
        const result = await res.json()
        if (!res.ok) throw new Error(result.error || 'Failed to fetch')
        setPolicies(result.filter((p: AccessPolicy) => !p.deleted))
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred')
        toast.error('Failed to load policies.')
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
    const confirm = window.confirm(id ? 'Confirm update?' : 'Confirm create policy?')
    if (!confirm) return

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

      toast.success(id ? 'Policy updated successfully.' : 'Policy created successfully.')
    } catch (err) {
      console.error('❌ Error saving policy:', err)
      toast.error('Failed to save policy.')
    } finally {
      setModalOpen(false)
      setEditData(null)
    }
  }

  const softDeletePolicy = async (id: string) => {
    const policyToDelete = policies.find((p) => p.id === id)
    if (!policyToDelete) return
    if (!window.confirm('Are you sure you want to delete this policy?')) return

    setPolicies((prev) => prev.filter((p) => p.id !== id))
    setUndoPolicy(policyToDelete)

    const timer = setTimeout(async () => {
      try {
        const res = await fetch('/api/policies', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id }),
        })

        if (!res.ok) throw new Error('Soft delete failed')
      } catch {
        setPolicies((prev) => [...prev, policyToDelete])
        toast.error('Delete failed. Policy restored.')
      } finally {
        setUndoPolicy(null)
        setUndoTimer(null)
      }
    }, 5000)

    setUndoTimer(timer)

    toast('Policy deleted', {
      description: 'Undo available for 5 seconds.',
    })
  }

  const handleBulkDelete = () => {
    if (!selected.length || !window.confirm(`Delete ${selected.length} policies?`)) return
    selected.forEach((id) => softDeletePolicy(id))
    setSelected([])
    toast(`${selected.length} policies deleted`, {
      description: 'You can undo each one individually.',
    })
  }

  const undoDelete = () => {
    if (undoTimer) clearTimeout(undoTimer)
    if (undoPolicy) {
      setPolicies((prev) => [...prev, undoPolicy])
      toast.success('Policy restored.')
    }
    setUndoPolicy(null)
    setUndoTimer(null)
  }

  const filtered = policies
    .filter((p) => {
      if (filterTrusted === 'yes') return p.require_trusted_device
      if (filterTrusted === 'no') return !p.require_trusted_device
      return true
    })
    .filter((p) => {
      if (!filterDate) return true
      const date = new Date(p.updated_at || '').toISOString().slice(0, 10)
      return date === filterDate
    })
    .filter((p) => {
      const searchTerm = search.toLowerCase()
      return (
        p.allow_country?.join(', ').toLowerCase().includes(searchTerm) ||
        p.allow_state?.join(', ').toLowerCase().includes(searchTerm) ||
        p.created_by?.toLowerCase().includes(searchTerm)
      )
    })

  const paginated = filtered.slice((page - 1) * perPage, page * perPage)
  const totalPages = Math.ceil(filtered.length / perPage)

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-1">Access Policies</h1>
      <p className="text-sm text-gray-600 mb-4">
        Policies for: <span className="font-medium">{orgName}</span>
      </p>

      {undoPolicy && (
        <div className="mb-4 bg-yellow-100 text-yellow-800 px-4 py-2 rounded flex justify-between items-center">
          <span>Policy deleted.</span>
          <button
            onClick={undoDelete}
            className="text-blue-600 underline ml-2 text-sm"
          >
            Undo
          </button>
        </div>
      )}

      <div className="flex flex-wrap gap-4 items-center mb-4">
        <button
          onClick={() => {
            setModalOpen(true)
            setEditData(null)
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Create New Policy
        </button>
        <input
          type="text"
          className="border px-2 py-1 rounded"
          placeholder="Search..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setPage(1)
          }}
        />
        <select
          className="border px-2 py-1 rounded"
          value={filterTrusted}
          onChange={(e) => setFilterTrusted(e.target.value)}
        >
          <option value="">All Devices</option>
          <option value="yes">Trusted Only</option>
          <option value="no">Untrusted Only</option>
        </select>
        <input
          type="date"
          className="border px-2 py-1 rounded"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
        />
        {selected.length > 0 && (
          <button
            onClick={handleBulkDelete}
            className="px-3 py-1 bg-red-600 text-white rounded"
          >
            Delete Selected ({selected.length})
          </button>
        )}
      </div>

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

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
          <span className="ml-2 text-sm text-gray-600">Loading policies...</span>
        </div>
      ) : error ? (
        <p className="text-red-600">Error: {error}</p>
      ) : (
        <>
          <div className="overflow-x-auto border rounded-lg">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100 text-left">
                <tr>
                  <th className="px-4 py-2">
                    <input
                      type="checkbox"
                      checked={selected.length === paginated.length}
                      onChange={(e) =>
                        setSelected(e.target.checked ? paginated.map((p) => p.id) : [])
                      }
                    />
                  </th>
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
                        <input
                          type="checkbox"
                          checked={selected.includes(policy.id)}
                          onChange={() =>
                            setSelected((prev) =>
                              prev.includes(policy.id)
                                ? prev.filter((id) => id !== policy.id)
                                : [...prev, policy.id]
                            )
                          }
                        />
                      </td>
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
                          onClick={() => softDeletePolicy(policy.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center text-gray-500 px-4 py-6">
                      <div className="flex flex-col items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-10 w-10 text-gray-300 mb-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M9 17v-2a4 4 0 118 0v2m-4-6a4 4 0 100-8 4 4 0 000 8z"
                          />
                        </svg>
                        <p>No policies found.</p>
                      </div>
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
