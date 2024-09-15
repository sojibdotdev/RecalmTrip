'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

type TabItem = {
  id: number
  value: string
  name: string
  icon?: string | JSX.Element // Icon can be a URL (string) or React component (JSX.Element)
}

interface TabProps {
  tabItems: TabItem[]
}

function Tab({ tabItems }: TabProps) {
  const [left, setLeft] = useState(0)
  const [width, setWidth] = useState(0)
  const [activeTab, setActiveTab] = useState(0) // Track the active tab

  const elementRefs = useRef<(HTMLLIElement | null)[]>([])

  const handleTabClick = (index: number) => {
    const clickedElement = elementRefs.current[index]
    if (clickedElement) {
      const newWidth = clickedElement.offsetWidth
      const newLeft = clickedElement.offsetLeft
      if (newWidth !== width || newLeft !== left) {
        setWidth(newWidth)
        setLeft(newLeft)
      }
      setActiveTab(index) // Set the clicked tab as active
    }
  }

  useEffect(() => {
    const firstTab = elementRefs.current[0]
    if (firstTab) {
      setWidth(firstTab.offsetWidth)
      setLeft(firstTab.offsetLeft)
    }
  }, [])

  return (
    <ul className="flex items-center relative overflow-hidden">
      {/* Bottom animated border */}
      <li
        className="h-[2px] bg-secondary absolute bottom-0 z-10 transition-all ease-linear duration-200"
        style={{ left: `${left}px`, width: `${width}px` }}
      ></li>
      {/* Static gray bottom border */}
      <li className="h-[1px] w-full bg-gray-200 absolute bottom-0"></li>

      {tabItems.map((item, index) => (
        <li
          key={item.id}
          ref={(el) => {
            elementRefs.current[index] = el // Assign ref to the current element
          }}
          className={`px-3.5 pb-2 cursor-pointer flex items-center gap-1 ${
            activeTab === index ? 'text-primary-600' : 'text-gray-600'
          }`}
          onClick={() => handleTabClick(index)}
        >
          {/* If an icon is provided, render it */}
          {item.icon && (
            <span className="mb-1">
              {typeof item.icon === 'string' ? (
                <Image
                  src={item.icon}
                  alt={item.name}
                  width={22}
                  height={22}
                  className={`transition-all ${
                    activeTab === index ? 'grayscale-0' : 'grayscale'
                  }`}
                />
              ) : (
                item.icon
              )}
            </span>
          )}
          {item.name}
        </li>
      ))}
    </ul>
  )
}

export default Tab
