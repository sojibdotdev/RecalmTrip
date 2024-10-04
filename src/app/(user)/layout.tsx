import { Header } from '@/components'
import { Footer } from '@/components/Footer'

export default function UserLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div>
      <Header />
      <main className="h-[calc(100vh-var(--header-height))] overflow-y-auto">
        <div className="min-h-screen">{children}</div>
        <Footer />
      </main>
    </div>
  )
}
