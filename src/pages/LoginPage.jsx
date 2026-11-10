import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { registerUser } from "@/api/auth"

function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [isRegistering, setIsRegistering] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  async function handleRegister(event) {
    event.preventDefault()

    try {
      setSubmitting(true)
      setError("")
      setSuccess("")

      await registerUser({
        name: formData.name,
        surname: formData.surname || null,
        email: formData.email,
        password: formData.password,
      })

      setSuccess("Аккаунт создан. Теперь вы можете войти.")
      setIsRegistering(false)
      setFormData((prev) => ({
        ...prev,
        password: "",
      }))
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  async function handleLogin(event) {
    event.preventDefault()

    try {
      setSubmitting(true)
      setError("")
      setSuccess("")

      await login({
        email: formData.email,
        password: formData.password,
      })

      navigate("/")
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  function handleChange(event) {
    const { name, value } = event.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  return (
    <div className="mx-auto max-w-md space-y-6 p-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">
          {isRegistering ? "Регистрация" : "Вход в аккаунт"}
        </h1>

        <p className="text-sm text-muted-foreground">
          {isRegistering
            ? "Создайте аккаунт, чтобы записываться на курсы."
            : "Войдите, чтобы продолжить обучение."}
        </p>
      </div>

      <form 
        className="space-y-4"
        onSubmit={
          isRegistering ? handleRegister : handleLogin
        }
      >
        {isRegistering && (
          <>
            <div className="space-y-2">
              <Label htmlFor="name">Имя</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                maxLength={64}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="surname">Фамилия</Label>
              <Input
                id="surname"
                name="surname"
                value={formData.surname}
                onChange={handleChange}
                maxLength={64}
              />
            </div>
          </>
        )}

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Пароль</Label>
          <Input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={8}
            maxLength={128}
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={submitting}
        >
          {submitting
            ? "Подождите..."
            : isRegistering
              ? "Зарегистрироваться"
              : "Войти"}
        </Button>
      </form>

        {error && (
          <p className="text-sm text-destructive">
            {error}
          </p>
        )}

        {success && (
          <p className="text-sm text-green-600">
            {success}
          </p>
        )}

      <div className="text-center text-sm">
        {isRegistering
          ? "Уже есть аккаунт?"
          : "Ещё нет аккаунта?"}

        <button
          type="button"
          className="ml-1 font-medium underline underline-offset-4"
          onClick={() => setIsRegistering((value) => !value)}
        >
          {isRegistering ? "Войти" : "Зарегистрироваться"}
        </button>
      </div>
    </div>
  )
}

export default LoginPage