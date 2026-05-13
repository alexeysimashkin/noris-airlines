import Link from 'next/link'
import LanguageSwitcher from './LanguageSwitcher'

export default function Layout({ children }: { children: React.ReactNode }) {
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
            <Link href="/check-in" style={{ color: '#1a3a5c', textDecoration: 'none', fontWeight: 500 }}>
              Онлайн-регистрация
            </Link>
            <Link href="/booking" style={{ color: '#1a3a5c', textDecoration: 'none', fontWeight: 500 }}>
              Бронирования
            </Link>
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
