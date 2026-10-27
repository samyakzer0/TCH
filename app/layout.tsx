import './globals.css'
import type { Metadata } from 'next'
import CustomCursor from '../components/CustomCursor'
import AuthProvider from '../components/AuthProvider'

export const metadata: Metadata = {
  title: 'The Chai House',
  description: 'Traditional kulhad chai made with love',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
          <CustomCursor />
        </AuthProvider>
      </body>
    </html>
  )
}
