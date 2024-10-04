import { ReactNode } from 'react'
import { IconType } from 'react-icons'

export interface SocialLink {
  href: string
  icon: IconType
  label: string
}

export interface FooterLink {
  href?: string
  icon?: IconType
  text: string
}

export interface FooterSection {
  header: string
  links: FooterLink[]
}
