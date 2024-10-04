import type { Metadata } from 'next'
import { ReCaptchaProvider } from '@/providers/RecaptchaProvider'
import { AntdRegistry } from '@ant-design/nextjs-registry'
import { ConfigProvider } from 'antd'
import { theme } from '@/theme/antd'
import 'animate.css'
import '../styles/globals.css'

import { Inter } from 'next/font/google'
import clsx from 'clsx'
const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Recalmtrip',
  description: 'recalmtrip'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ConfigProvider theme={theme}>
      <ReCaptchaProvider>
        <html lang="en">
          <body className={clsx(inter.className, 'overflow-hidden')}>
            <AntdRegistry> {children}</AntdRegistry>
          </body>
        </html>
      </ReCaptchaProvider>
    </ConfigProvider>
  )
}
