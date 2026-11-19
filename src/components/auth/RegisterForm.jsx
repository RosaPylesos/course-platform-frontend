import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

function RegisterForm({ formData, handleChange, handleRegister, submitting }) {
    return (
        <form className="space-y-4" onSubmit={handleRegister}>
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

            <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? "Подождите..." : "Зарегистрироваться"}
            </Button>
        </form>
    )
}

export default RegisterForm