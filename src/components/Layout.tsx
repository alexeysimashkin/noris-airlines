import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Layout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (stored) setUser(JSON.parse(stored))
  }, [])

  return (
    <>
      <header className="header">
        <div className="container header-content">
          <Link href="/" className="logo">
            <div className="logo-mark">N</div>
            Noris
          </Link>
          <nav className="nav">
            <Link href="/check-in">Регистрация</Link>
            <Link href="/booking">Бронирования</Link>
            {user ? (
              <Link href="/cabinet" className="btn btn-primary btn-sm">👤 {user.firstName}</Link>
            ) : (
              <Link href="/login" className="btn btn-outline btn-sm">Войти</Link>
            )}
          </nav>
        </div>
      </header>
      <main className="container" style={{ paddingTop: 24, paddingBottom: 60 }}>
        {children}
      </main>
    </>
  )
}
