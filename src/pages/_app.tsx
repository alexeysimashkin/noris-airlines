import type { AppProps } from 'next/app'
import { LanguageProvider } from '@/context/LanguageContext'
import Layout from '@/components/Layout'
import '@/styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <LanguageProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </LanguageProvider>
  )
}
