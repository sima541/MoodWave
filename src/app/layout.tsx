// app/layout.tsx

import './globals.css'
import { ReactNode } from 'react'

export const metadata = {
  title: 'ZenTime - Pomodoro + Mood Tracker',
  description: 'Boost your productivity and track your mood with ZenTime!',
}
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-100 text-gray-900">
  
        {children}
      </body>
    </html>
  )
}
