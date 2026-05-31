import Link from 'next/link'
import { useEffect, useState } from 'react'
import LanguageSwitcher from './LanguageSwitcher'

export default function Layout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (stored) {
      setUser(JSON.parse(stored))
    }
  }, [])

  return (
    <>
      <header className="header">
        <div className="container header-content">
          <div>
            <Link href="/" className="logo">
              NORIS
            </Link>
            <div className="logo-sub">Airlines</div>
          </div>
          <nav style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <Link href="/check-in" style={{ color: '#6b3fa0', textDecoration: 'none', fontWeight: 500, fontSize: 14 }}>
              🎫 Онлайн-регистрация
            </Link>
            <Link href="/booking" style={{ color: '#6b3fa0', textDecoration: 'none', fontWeight: 500, fontSize: 14 }}>
              📋 Бронирования
            </Link>
            {user ? (
              <Link href="/cabinet" style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: 'linear-gradient(135deg, #6b3fa0, #8b5cf6)',
                color: 'white', textDecoration: 'none', fontWeight: 600, fontSize: 14,
                padding: '8px 16px', borderRadius: 20
              }}>
                👤 {user.firstName}
              </Link>
            ) : (
              <Link href="/login" style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: '#f5f3ff', color: '#6b3fa0', textDecoration: 'none', fontWeight: 600, fontSize: 14,
                padding: '8px 16px', borderRadius: 20, border: '1px solid #e8e0f0'
              }}>
                👤 Войти
              </Link>
            )}
            <LanguageSwitcher />
          </nav>
        </div>
      </header>
      <main className="container" style={{ padding: '30px 20px' }}>
        {children}
      </main>
    </>
  )
}
