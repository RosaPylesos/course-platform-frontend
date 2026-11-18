import { useState } from "react"
import { useNavigate, useSearchParams, Link } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { registerUser } from "@/api/auth"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"

import LoginForm from "@/components/auth/LoginForm"
import RegisterForm from "@/components/auth/RegisterForm"

function LoginPage() {
    const { login } = useAuth()
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        name: "",
        surname: "",
        email: "",
        password: "",
    })
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [searchParams, setSearchParams] = useSearchParams()
    const [isRegistering, setIsRegistering] = useState(
        searchParams.get("mode") === "register"
    )

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
        <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 py-10">

            <div className="w-full max-w-md translate-y-2 space-y-4">

                <div>
                    <Link
                        to="/"
                        className="inline-flex items-center text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                        ← На главную
                    </Link>
                </div>

                <Card>
                    <CardHeader className="space-y-2 text-center">
                        <CardTitle className="text-3xl">
                            {isRegistering ? "Регистрация" : "Вход в аккаунт"}
                        </CardTitle>

                        <CardDescription>
                            {isRegistering
                                ? "Создайте аккаунт, чтобы записываться на курсы."
                                : "Войдите, чтобы продолжить обучение."}
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        {isRegistering ? (
                            <RegisterForm
                                formData={formData}
                                handleChange={handleChange}
                                handleRegister={handleRegister}
                                submitting={submitting}
                            />
                        ) : (
                            <LoginForm
                                formData={formData}
                                handleChange={handleChange}
                                handleLogin={handleLogin}
                                submitting={submitting}
                            />
                        )}

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
                    </CardContent>
                </Card>


                    <div className="text-center text-sm">
                        {isRegistering
                            ? "Уже есть аккаунт?"
                            : "Ещё нет аккаунта?"}

                        <Button className="hover:underline"
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                const nextMode = !isRegistering

                                setIsRegistering(nextMode)
                                setSearchParams(nextMode ? { mode: "register" } : {})
                            }}
                        >
                            {isRegistering ? "Войти" : "Зарегистрироваться"}
                        </Button>
                    </div>
            </div>
        </div>
    )
}

export default LoginPage