import { useState , useEffect } from "react"
import { Link, NavLink, useNavigate } from "react-router-dom"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import HeaderTopicItem from "./HeaderTopicItem"
import { useAuth } from "@/contexts/AuthContext"
import { getTopics } from "@/api/topics"

function Header() {
  const { user, loading, logout } = useAuth()
  const navigate = useNavigate()

  const [topics, setTopics] = useState([])

  useEffect(() => {
    async function loadTopics() {
      try {
        const data = await getTopics()
        setTopics(data)
      } catch (error) {
        console.error("Не удалось загрузить темы:", error)
      }
    }

    loadTopics()
  }, [])

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

          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>
                  Курсы
                </NavigationMenuTrigger>

                <NavigationMenuContent>
                  <div className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-2">
                    <NavigationMenuLink asChild>
                      <Link
                        to="/courses"
                        className="block rounded-md p-3 text-sm font-medium hover:bg-accent"
                      >
                        Все курсы
                      </Link>
                    </NavigationMenuLink>

                    {topics.map((topic) => (
                      <HeaderTopicItem 
                        key={topic.id} 
                        topic={topic} 
                      />
                    ))}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </nav>

        {user && (
          <NavLink to="/my-learning" className={navLinkClass}>
            Моё обучение
          </NavLink>
        )}

        <div>
          {!loading && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  {user ? user.name : "Аккаунт"}
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                {user ? (
                  <>
                    <DropdownMenuItem asChild>
                      <Link to="/profile">
                        Мой профиль
                      </Link>
                    </DropdownMenuItem>

                    {(user?.role === "author" 
                    || user?.role === "admin") && (
                      <DropdownMenuItem asChild>
                        <Link to="/author/courses">
                          Мои курсы
                        </Link>
                      </DropdownMenuItem>
                    )}

                    <DropdownMenuItem onSelect={handleLogout}>
                      Выйти
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem asChild>
                      <Link to="/login">
                        Войти
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                      <Link to="/login?mode=register">
                        Регистрация
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header