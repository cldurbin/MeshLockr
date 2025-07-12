'use client'

import Select from 'react-select'
import { COUNTRY_OPTIONS } from '../../../data/country-options'
import { US_STATES } from '../../../data/us-states'

interface CountryStateValue {
  country: string
  state?: string
}

interface Option {
  value: string
  label: string
}

interface Props {
  value: CountryStateValue | null
  onChange: (val: CountryStateValue | null) => void
}

export default function CountryStateSelector({ value, onChange }: Props) {
  const countryOptions: Option[] = COUNTRY_OPTIONS.map((c) => ({
    value: c.code,
    label: c.name,
  }))

  const stateOptions: Option[] = US_STATES.map((s) => ({
    value: s.code,
    label: s.name,
  }))

  const selectedCountry = countryOptions.find((opt) => opt.value === value?.country) || null
  const selectedState =
    value?.country === 'US'
      ? stateOptions.find((opt) => opt.value === value?.state)
      : null

  const handleCountryChange = (selected: Option | null) => {
    if (!selected) {
      onChange(null)
    } else if (selected.value === 'US') {
      onChange({ country: selected.value, state: value?.state }) // state will show
    } else {
      onChange({ country: selected.value }) // non-US = no state
    }
  }

  const handleStateChange = (selected: Option | null) => {
    if (!selected) return
    onChange({ country: value?.country || 'US', state: selected.value })
  }

  return (
    <div className="space-y-4">
      <Select
        options={countryOptions}
        value={selectedCountry}
        onChange={handleCountryChange}
        placeholder="Select a country..."
        className="text-sm"
      />

      {value?.country === 'US' && (
        <Select
          options={stateOptions}
          value={selectedState}
          onChange={handleStateChange}
          placeholder="Select a U.S. state..."
          className="text-sm"
        />
      )}
    </div>
  )
}
