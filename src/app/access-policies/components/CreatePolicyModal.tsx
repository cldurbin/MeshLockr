'use client'

import { useState } from 'react'
import { Dialog } from '@headlessui/react'
import { AccessPolicy } from '../../../types/policy'
import { COUNTRY_OPTIONS } from '../../../data/country-options'

interface Props {
  open: boolean
  onClose: () => void
  onSubmit: (newPolicy: Omit<AccessPolicy, 'id' | 'created_at' | 'updated_at'>) => void
  orgId: string
}

export default function CreatePolicyModal({ open, onClose, onSubmit, orgId }: Props) {
  const [selectedCountries, setSelectedCountries] = useState<string[]>([])
  const [blockTimes, setBlockTimes] = useState<string>('')
  const [requireTrusted, setRequireTrusted] = useState(false)
  const [error, setError] = useState('')

  const handleSave = () => {
    if (!orgId || selectedCountries.length === 0) {
      setError('Please provide an org ID and select at least one country.')
      return
    }

    const newPolicy = {
      org_id: orgId,
      allow_country: selectedCountries,
      block_time_ranges: blockTimes
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0),
      require_trusted_device: requireTrusted,
    }

    onSubmit(newPolicy)
    setSelectedCountries([])
    setBlockTimes('')
    setRequireTrusted(false)
    setError('')
    onClose()
  }

  const handleToggleCountry = (code: string) => {
    setSelectedCountries((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    )
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
            <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto border rounded p-2">
              {COUNTRY_OPTIONS.map(({ code, name }) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => handleToggleCountry(code)}
                  className={`px-2 py-1 border rounded text-sm ${
                    selectedCountries.includes(code)
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-800'
                  }`}
                >
                  {name}
                </button>
              ))}
            </div>
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
// src/data/country-options.ts