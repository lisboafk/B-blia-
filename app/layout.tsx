import type { Metadata, Viewport } from 'next'
import './globals.css'
import PwaRegister from '@/components/PwaRegister'
import AuthProvider from '@/components/AuthProvider'

export const metadata: Metadata = {
  title: 'Bíblia Sagrada Reformada',
  description: 'Bíblia de Estudo com comentários reformados. Experiencie a Palavra de Deus com profundidade teológica.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Bíblia Reformada',
  },
  icons: {
    icon: [
      { url: '/api/icon?size=192', sizes: '192x192', type: 'image/svg+xml' },
      { url: '/api/icon?size=512', sizes: '512x512', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/api/icon?size=152', sizes: '152x152' },
      { url: '/api/icon?size=192', sizes: '192x192' },
    ],
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#111111',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Bíblia Reformada" />
      </head>
      <body style={{ background: '#111', color: '#e8d5a3', minHeight: '100vh' }}>
        <AuthProvider>
          <PwaRegister />
          <div className="relative min-h-screen">
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}
