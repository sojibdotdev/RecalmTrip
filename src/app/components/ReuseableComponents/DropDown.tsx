'use client'
import { useState } from 'react'
import { FaAngleDown, FaCheck } from 'react-icons/fa6'

// Define the type for menu items
type MenuItem = {
  id: number
  value: string
  name: string
}

function DropDown() {
  const [dropDown, setDropDown] = useState(false) // Persistent dropdown state
  const [hover, setHover] = useState(false) // Hover state
  const [selectItem, setSelectItem] = useState('Economy')

  // Toggle dropdown on click
  const handleDropDownClick = () => {
    setDropDown((prev) => !prev)
  }

  // Handle selecting an item
  const handleSelectItem = (name: string) => {
    setSelectItem(name)
    setDropDown(false) // Close dropdown after selecting an item
    setHover(false) // Reset hover state
  }

  const menuItems: MenuItem[] = [
    { id: 1, value: 'economy', name: 'Economy' },
    { id: 2, value: 'premium economy', name: 'Premium economy' },
    { id: 3, value: 'business class', name: 'Business class' },
    { id: 4, value: 'first class', name: 'First class' }
  ]

  return (
    <div
      className="relative"
      onMouseEnter={() => setHover(true)} // Open on hover
      onMouseLeave={() => setHover(false)} // Close when leaving the dropdown area
    >
      {/* Dropdown Button */}
      <div
        onClick={handleDropDownClick}
        className="select-none flex gap-1 items-center max-w-max px-2 py-2.5 rounded text-sm cursor-pointer border-[1.5px] border-gray-300 leading-none"
      >
        <span>{selectItem}</span>
        <FaAngleDown />
      </div>

      {/* Dropdown Menu */}
      <div
        className={` w-60 absolute z-20 left-0  ${
          hover || dropDown ? 'block' : 'hidden' // Show on hover or when dropdown is clicked
        }`}
      >
        <ul className="bg-white py-3 rounded-md shadow mt-2">
          {menuItems.map((item) => (
            <li
              key={item.id}
              onClick={() => handleSelectItem(item.name)} // Select item and close menu
              className="hover:bg-primary-50 transition-all ease-linear duration-200 cursor-pointer px-4 py-3 flex items-center justify-between"
            >
              <span>{item.name}</span>
              {selectItem === item.name && <FaCheck />}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default DropDown
