import { Link, NavLink, useNavigate } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"

function Header() {
  const { user, loading, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate("/")
  }

  const navLinkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors hover:text-primary ${
      isActive ? "text-primary" : "text-muted-foreground"
    }`

  return (
    <header className="w-full border-b bg-background">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="text-xl font-bold">
          Course Platform
        </Link>

        <nav className="flex items-center gap-6">
          <NavLink to="/" end className={navLinkClass}>
            Главная
          </NavLink>

          <NavLink to="/courses" className={navLinkClass}>
            Курсы
          </NavLink>
        </nav>

        <div className="flex items-center gap-3">
          {!loading && (
            user ? (
              <>
                <span className="text-sm font-medium">
                  {user.name}
                </span>

                <Button variant="outline" size="sm" onClick={handleLogout}>
                  Выйти
                </Button>
              </>
            ) : (
              <Button asChild size="sm">
                <Link to="/login">Войти</Link>
              </Button>
            )
          )}
        </div>
      </div>
    </header>
  )
}

export default Header