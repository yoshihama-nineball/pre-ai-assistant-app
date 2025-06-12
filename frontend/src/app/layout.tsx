import Loading from '@/components/feedback/Loading'
import Footer from '@/components/layouts/Footer/Footer'
import Header from '@/components/layouts/Header/Header'
import type { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  title: 'プレAIアシスタントアプリ | TOP',
  description: 'AIアシスタントアプリのトップ画面です',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>
        <Header />
        <main>
          <React.Suspense fallback={<Loading />}>{children}</React.Suspense>
        </main>
        <Footer />
      </body>
    </html>
  )
}
