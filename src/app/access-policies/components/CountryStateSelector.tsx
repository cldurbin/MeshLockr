'use client'

import { useEffect, useMemo, useState } from 'react'
import Select from 'react-select'
import { COUNTRY_OPTIONS } from '../../../data/country-options'
import { US_STATES } from '../../../data/us-states'

interface Option {
  value: string
  label: string
}

export default function CountryStateSelector({
  onChange,
}: {
  onChange: (selected: { countries: Option[]; states: Option[] }) => void
}) {
  const countryOptions: Option[] = useMemo(
    () =>
      COUNTRY_OPTIONS.map((c) => ({
        value: c.code,
        label: c.name,
      })),
    []
  )

  const usStateOptions: Option[] = useMemo(
    () =>
      US_STATES.map((s) => ({
        value: s.code,
        label: s.name,
      })),
    []
  )

  const [selectedCountries, setSelectedCountries] = useState<Option[]>([])
  const [selectedStates, setSelectedStates] = useState<Option[]>([])

  const showStateSelect = selectedCountries.some((c) => c.value === 'US')

  useEffect(() => {
    onChange({
      countries: [...selectedCountries],
      states: [...selectedStates],
    })
  }, [selectedCountries, selectedStates, onChange])

  return (
    <div className="space-y-4">
      <Select
        isMulti
        options={countryOptions}
        value={selectedCountries}
        onChange={(v) => setSelectedCountries([...v])}
        placeholder="Select countries..."
        className="text-sm"
      />

      {showStateSelect && (
        <Select
          isMulti
          options={usStateOptions}
          value={selectedStates}
          onChange={(v) => setSelectedStates([...v])}
          placeholder="Select U.S. states..."
          className="text-sm"
        />
      )}
    </div>
  )
}
