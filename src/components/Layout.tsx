import Link from 'next/link'
import { useEffect, useState } from 'react'
import LanguageSwitcher from './LanguageSwitcher'

export default function Layout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (stored) setUser(JSON.parse(stored))
  }, [])

  return (
    <>
      <div className="header-top">
        <div className="container" style={{ display: 'flex', justifyContent: 'flex-end', gap: 20 }}>
          <a href="#">Aeroflot Bonus</a>
          <a href="#">Статус рейса</a>
          <a href="#">Помощь</a>
        </div>
      </div>
      <header className="header">
        <div className="container header-content">
          <Link href="/" className="logo">
            <div className="logo-icon">✈</div>
            NORIS
          </Link>
          <nav style={{ display: 'flex', gap: 4 }}>
            <Link href="/check-in" className="nav-link">Регистрация</Link>
            <Link href="/booking" className="nav-link">Бронирования</Link>
            {user ? (
              <Link href="/cabinet" className="user-btn">👤 {user.firstName}</Link>
            ) : (
              <Link href="/login" className="user-btn">Войти</Link>
            )}
            <LanguageSwitcher />
          </nav>
        </div>
      </header>
      <main>{children}</main>
    </>
  )
}
