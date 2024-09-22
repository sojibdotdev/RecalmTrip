'use client'
import { useState } from 'react'
import { FaAngleDown, FaCheck } from 'react-icons/fa6'

type MenuItem = {
  id: number
  key: string
  label: string
}

function DropDown() {
  const [dropDown, setDropDown] = useState(false)
  const [hover, setHover] = useState(false)
  const [selectItem, setSelectItem] = useState('Economy')

  const handleDropDownClick = () => {
    setDropDown((prev) => !prev)
  }

  const handleSelectItem = (label: string) => {
    setSelectItem(label)
    setDropDown(false)
    setHover(false)
  }

  const menuItems: MenuItem[] = [
    { id: 1, key: 'economy', label: 'Economy' },
    { id: 2, key: 'premium economy', label: 'Premium economy' },
    { id: 3, key: 'business class', label: 'Business class' },
    { id: 4, key: 'first class', label: 'First class' }
  ]

  return (
    <div
      className="relative"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div
        onClick={handleDropDownClick}
        className="select-none flex gap-1 items-center max-w-max px-2 py-2.5 rounded text-sm cursor-pointer border-[1.5px] border-[#b9bac3] leading-none"
      >
        <span>{selectItem}</span>
        <FaAngleDown />
      </div>

      <div
        className={` w-60 absolute z-20 left-0  ${
          hover || dropDown ? 'block' : 'hidden'
        }`}
      >
        <ul className="bg-white py-3 rounded-md shadow mt-2">
          {menuItems.map((item) => (
            <li
              key={item.id}
              onClick={() => handleSelectItem(item.label)}
              className="hover:bg-primary-50 transition-all ease-linear duration-200 cursor-pointer px-4 py-3 flex items-center justify-between border-b last:border-none"
            >
              <span>{item.label}</span>
              {selectItem === item.label && <FaCheck />}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export { DropDown }
