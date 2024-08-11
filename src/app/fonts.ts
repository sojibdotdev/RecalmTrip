import { Kalam, Quicksand } from 'next/font/google'

const primary = Quicksand({
  subsets: ['latin'],
  variable: '--font-primary',
  weight: ['400', '400', '700']
})
const secondary = Kalam({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-secondary'
})

export { primary, secondary }
