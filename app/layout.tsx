import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ReduxProvider } from '@/lib/providers'


const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Strong Concrete Admin Dashboard',
  description: 'Strong Concrete Admin Dashboard',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ReduxProvider>
    <html lang="en">
      <body className={inter.className}>
       

        {children}
     
        </body>
    </html>
    </ReduxProvider>
  )
}
