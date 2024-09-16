'use client'
import { useEffect, useRef, useState } from 'react'
import { FaLocationDot, FaXmark } from 'react-icons/fa6'

function FillterSearchBox() {
  const [isSearchBox, setIsSearchBox] = useState<boolean>(true) // State to show/hide search box
  const [inputValue, setInputValue] = useState<string>('') // State to manage input value
  const searchBoxRef = useRef<HTMLDivElement | null>(null) // Reference to the search box container
  const inputRef = useRef<HTMLInputElement | null>(null) // Reference to the input field

  // Toggle the input field when clicking on the search box
  const handleClick = (): void => {
    setIsSearchBox((prev) => !prev)
  }

  // Handle clicks outside the component
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (
        searchBoxRef.current &&
        !searchBoxRef.current.contains(event.target as Node)
      ) {
        setIsSearchBox(true) // Hide the input field if clicked outside
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [searchBoxRef])

  // Focus input field when search box is opened or cleared
  useEffect(() => {
    if (!isSearchBox && inputRef.current) {
      inputRef.current.focus() // Focus the input field when search box is opened
    }
  }, [isSearchBox])

  // Clear input and focus on the input field
  const handleClear = (): void => {
    setInputValue('')
    if (inputRef.current) {
      inputRef.current.focus() // Focus the input field when clearing
    }
  }

  const text: string = 'Bangladesh, Hazrat Shahjalal International Airport'

  return (
    <>
      <div
        ref={searchBoxRef} // Attach the ref to the search box container
        className="w-full h-12 flex items-center gap-2 border-[1.5px] pr-2 border-[#b9bac3] overflow-hidden rounded-lg py-1"
      >
        <div className="text-primary-600 border-r-[1.5px] py-1 px-2 border-[#b9bac3]">
          <FaLocationDot />
        </div>

        {isSearchBox ? (
          <div
            className="w-full cursor-pointer transition-all ease-linear duration-500"
            onClick={handleClick}
          >
            <span className="text-xs font-medium">Dhaka (DAC)</span>
            <p className="text-xs text-gray-500 truncate">
              <span>{text.length > 25 ? text.slice(0, 25) + '...' : text}</span>
            </p>
          </div>
        ) : (
          <div className="w-full flex items-center ">
            <input
              ref={inputRef} // Attach the ref to the input field
              type="text"
              placeholder="from..."
              value={inputValue}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setInputValue(e.target.value)
              }
              className="bg-transparent outline-none w-full pt-[7px] pb-[5px] px-1"
            />
            <FaXmark
              onClick={handleClear} // Clear the input and focus the input field
              className={`cursor-pointer ${
                inputValue === '' ? 'invisible' : 'visible'
              }`}
            />
          </div>
        )}
      </div>
    </>
  )
}

export default FillterSearchBox
