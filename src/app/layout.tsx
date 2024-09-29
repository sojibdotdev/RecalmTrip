import { AntdRegistry } from '@ant-design/nextjs-registry'
import 'animate.css'
import { ConfigProvider } from 'antd'
import type { Metadata } from 'next'
import { SessionProvider } from 'next-auth/react'
import { Suspense } from 'react'
import { auth } from '../auth'
import '../globals.css'
import { theme } from '../theme/antd'
import { Footer, Header, Loading, ReCaptcha } from './components'
import { centraFont } from './fonts'

export const metadata: Metadata = {
  title: 'Reclamtrip',
  description: 'Reclamtrip project setup'
}

const RootLayout = async ({
  children
}: Readonly<{
  children: React.ReactNode
}>) => {
  const session = await auth()
  return (
    <SessionProvider session={session}>
      <html lang="en">
        <body className={`${centraFont.variable} font-centra`}>
          <Suspense fallback={<Loading />}>
            <AntdRegistry>
              <ConfigProvider theme={theme}>
                <ReCaptcha>
                  <div>
                    <div>
                      <Header />
                      <div
                        style={{
                          height: 'calc(100vh - 80px)'
                        }}
                        className="overflow-y-auto "
                      >
                        <main
                          className="max-w-screen-xl px-3 mx-auto "
                          style={{
                            minHeight: 'calc(100vh - 80px)'
                          }}
                        >
                          {children}
                        </main>
                        <Footer />
                      </div>
                    </div>
                  </div>
                </ReCaptcha>
              </ConfigProvider>
            </AntdRegistry>
          </Suspense>
        </body>
      </html>
    </SessionProvider>
  )
}
export default RootLayout
