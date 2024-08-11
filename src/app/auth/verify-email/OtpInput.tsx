import React, { useRef, useEffect } from 'react'
import { useController, Control } from 'react-hook-form'

interface OtpInputProps {
  control: Control<any>
  name: string
  length?: number
}

const OtpInput: React.FC<OtpInputProps> = ({ control, name, length = 6 }) => {
  const { field } = useController({ name, control })
  const inputsRef = useRef<Array<HTMLInputElement | null>>([])

  useEffect(() => {
    if (inputsRef.current[0]) {
      inputsRef.current[0].focus()
    }
  }, [])

  const handleInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value
    if (value.length === 1 && index < length - 1) {
      inputsRef.current[index + 1]?.focus()
    }
    field.onChange(inputsRef.current.map((input) => input?.value).join(''))
  }

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (
      e.key === 'Backspace' &&
      index > 0 &&
      !inputsRef.current[index]?.value
    ) {
      inputsRef.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pasteData = e.clipboardData.getData('text').split('')
    pasteData.forEach((char, i) => {
      if (i < length) {
        inputsRef.current[i]!.value = char
      }
    })
    inputsRef.current[Math.min(pasteData.length - 1, length - 1)]?.focus()
    field.onChange(inputsRef.current.map((input) => input?.value).join(''))
  }

  return (
    <div className="flex gap-2">
      {Array.from({ length }, (_, index) => (
        <input
          key={index}
          type="text"
          className="w-full h-14 text-center text-lg border rounded focus-visible:outline focus-visible:outline-primary-500"
          maxLength={1}
          ref={(el) => {
            inputsRef.current[index] = el
          }}
          onInput={(e) =>
            handleInput(e as React.ChangeEvent<HTMLInputElement>, index)
          }
          onKeyDown={(e) =>
            handleKeyDown(e as React.KeyboardEvent<HTMLInputElement>, index)
          }
          onPaste={handlePaste}
        />
      ))}
    </div>
  )
}

export default OtpInput
