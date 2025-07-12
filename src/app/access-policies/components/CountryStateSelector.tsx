'use client'

import { useMemo, useState, useEffect } from 'react'
import Select from 'react-select'
import { COUNTRY_OPTIONS } from '../../../data/country-options'
import { US_STATES } from '../../../data/us-states'

interface Option {
  value: string
  label: string
}

interface Props {
  value: { country: string[]; state?: string[] } | null
  onChange: (val: { country: string[]; state?: string[] } | null) => void
}
// Sort results that start with input before those that merely contain it
const prioritizeStartsWith = (options: Option[], input: string): Option[] => {
  const search = input.toLowerCase()
  const startsWith: Option[] = []
  const includes: Option[] = []

  for (const opt of options) {
    const label = opt.label.toLowerCase()
    if (label.startsWith(search)) {
      startsWith.push(opt)
    } else if (label.includes(search)) {
      includes.push(opt)
    }
  }

  return [...startsWith, ...includes]
}

export default function CountryStateSelector({ onChange }: Props) {
  const allCountryOptions: Option[] = useMemo(
    () =>
      COUNTRY_OPTIONS.map((c) => ({
        value: c.code,
        label: c.name,
      })),
    []
  )

  const stateOptions: Option[] = useMemo(
    () =>
      US_STATES.map((s) => ({
        value: s.code,
        label: s.name,
      })),
    []
  )

  const [countryInput, setCountryInput] = useState('')
  const [selectedCountries, setSelectedCountries] = useState<Option[]>([])
  const [selectedStates, setSelectedStates] = useState<Option[]>([])

  const showStateSelect = selectedCountries.some((c) => c.value === 'US')

  const filteredCountries = useMemo(
    () => prioritizeStartsWith(allCountryOptions, countryInput),
    [allCountryOptions, countryInput]
  )

  useEffect(() => {
    if (selectedCountries.length === 0) {
      onChange(null)
    } else {
      onChange({
        country: selectedCountries.map((c) => c.value),
        state: selectedStates.map((s) => s.value),
      })
    }
  }, [selectedCountries, selectedStates, onChange])

  return (
    <div className="space-y-4">
      <Select
        options={filteredCountries}
        value={selectedCountries}
        isMulti
        onChange={(vals) => setSelectedCountries(vals as Option[])}
        onInputChange={(input) => {
          setCountryInput(input)
          return input
        }}
        placeholder="Select countries..."
        className="text-sm"
        isClearable
      />

      {showStateSelect && (
        <Select
          options={stateOptions}
          value={selectedStates}
          isMulti
          onChange={(vals) => setSelectedStates(vals as Option[])}
          placeholder="Select U.S. states..."
          className="text-sm"
          isClearable
        />
      )}
    </div>
  )
}
// src/app/access-policies/components/CountryStateSelector.tsx