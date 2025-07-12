'use client'

import { useState } from 'react'
import { Dialog } from '@headlessui/react'
import { AccessPolicy } from '../../../types/policy'
import CountryStateSelector from './CountryStateSelector'

interface Props {
  open: boolean
  onClose: () => void
  onSubmit: (newPolicy: Omit<AccessPolicy, 'id' | 'created_at' | 'updated_at'>) => void
  orgId: string
}

export default function CreatePolicyModal({ open, onClose, onSubmit, orgId }: Props) {
  const [countryState, setCountryState] = useState<{ country: string[]; state?: string[] } | null>(null)
  const [blockTimes, setBlockTimes] = useState<string>('')
  const [requireTrusted, setRequireTrusted] = useState(false)
  const [error, setError] = useState('')

  const handleSave = () => {
    if (!orgId || !countryState?.country?.length) {
      setError('Please provide an org ID and select at least one country.')
      return
    }

    const newPolicy = {
      org_id: orgId,
      allow_country: countryState.country,
      allow_state: countryState.state || [],
      block_time_ranges:
        blockTimes.trim().length > 0
          ? blockTimes.split(',').map((s) => s.trim()).filter(Boolean)
          : undefined,
      require_trusted_device: requireTrusted,
    }

    onSubmit(newPolicy)
    setCountryState(null)
    setBlockTimes('')
    setRequireTrusted(false)
    setError('')
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white rounded-lg p-6 max-w-md w-full">
          <Dialog.Title className="text-lg font-semibold mb-4">
            Create Access Policy
          </Dialog.Title>

          {error && <p className="text-red-600 text-sm mb-2">{error}</p>}

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Allowed Countries</label>
            <CountryStateSelector onChange={setCountryState} />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Block Time Ranges</label>
            <input
              type="text"
              placeholder="e.g. 22:00-06:00, 14:00-15:00"
              value={blockTimes}
              onChange={(e) => setBlockTimes(e.target.value)}
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div className="mb-4 flex items-center gap-2">
            <input
              type="checkbox"
              checked={requireTrusted}
              onChange={(e) => setRequireTrusted(e.target.checked)}
              id="trustedDevice"
            />
            <label htmlFor="trustedDevice" className="text-sm">
              Require trusted device
            </label>
          </div>

          <div className="flex justify-end gap-2">
            <button className="px-4 py-2 rounded border" onClick={onClose}>
              Cancel
            </button>
            <button
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
              onClick={handleSave}
            >
              Create
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  )
}