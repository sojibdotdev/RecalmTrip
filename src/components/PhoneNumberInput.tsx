import React, { useState, useMemo, useEffect } from 'react'
import { Select, Input } from 'antd'
import {
  getCountries,
  getCountryCallingCode,
  AsYouType,
  CountryCode
} from 'libphonenumber-js'

const { Option } = Select

interface CountryOption {
  value: CountryCode
  flag: React.ReactNode
  phone: string
  label: React.ReactNode
}

interface PhoneInputProps {
  value?: string
  onChange?: (value: string) => void
}

const PhoneInput: React.FC<PhoneInputProps> = ({ value, onChange }) => {
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>('BD')
  const [phoneNumber, setPhoneNumber] = useState<string>('')
  const [fullPhoneNumber, setFullPhoneNumber] = useState<string>('')
  const [searchValue, setSearchValue] = useState<string>('')

  const countryOptions: CountryOption[] = useMemo(
    () =>
      getCountries().map((country) => ({
        value: country,
        flag: (
          <img
            src={`https://flagcdn.com/w20/${country.toLowerCase()}.png`}
            alt={`${country} flag`}
            className="mr-2 h-4 w-6 object-contain"
          />
        ),
        label: (
          <div className="flex items-center">
            <img
              src={`https://flagcdn.com/w20/${country.toLowerCase()}.png`}
              alt={`${country} flag`}
              className="mr-2 h-4 w-6 object-contain"
            />
            <span>
              {new Intl.DisplayNames(['en'], { type: 'region' }).of(country)}
            </span>
          </div>
        ),
        phone: getCountryCallingCode(country)
      })),
    []
  )

  const filteredOptions = useMemo(() => {
    return countryOptions.filter(
      (option) =>
        option.label &&
        typeof option.label === 'object' &&
        'props' in option.label &&
        option.label.props.children[1]?.props?.children
          ?.toLowerCase()
          .includes(searchValue.toLowerCase())
    )
  }, [searchValue, countryOptions])

  const handleCountryChange = (value: CountryCode) => {
    setSelectedCountry(value)
    setPhoneNumber('')
    setFullPhoneNumber('')
    onChange && onChange('')
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatter = new AsYouType(selectedCountry)
    const formattedPhone = formatter.input(e.target.value)
    setPhoneNumber(formattedPhone)

    const completePhoneNumber = `+${
      countryOptions.find((c) => c.value === selectedCountry)?.phone
    } ${formattedPhone}`

    setFullPhoneNumber(completePhoneNumber)
    onChange && onChange(completePhoneNumber)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value)
  }

  useEffect(() => {
    if (value !== fullPhoneNumber) {
      setFullPhoneNumber(value || '')
      const phonePart = value ? value.replace(/^\+\d+\s/, '') : ''
      setPhoneNumber(phonePart)
    }
  }, [value])

  return (
    <div className="flex items-center space-x-2">
      <Select<CountryCode>
        style={{ width: 80 }}
        placeholder="Select country"
        optionLabelProp="label"
        onChange={handleCountryChange}
        value={selectedCountry}
        dropdownRender={(menu) => (
          <div>
            <Input
              placeholder="Search country"
              onChange={handleSearchChange}
              style={{ marginBottom: 8, width: '100%' }}
              value={searchValue}
            />
            {menu}
          </div>
        )}
        dropdownStyle={{ width: 250 }}
      >
        {filteredOptions.map((option) => (
          <Option key={option.value} value={option.value} label={option.flag}>
            {option.label}
          </Option>
        ))}
      </Select>
      <Input
        addonBefore={`+${
          countryOptions.find((c) => c.value === selectedCountry)?.phone
        }`}
        value={phoneNumber}
        onChange={handlePhoneChange}
        placeholder="Enter phone number"
        className="flex-grow"
      />
    </div>
  )
}

export { PhoneInput }
