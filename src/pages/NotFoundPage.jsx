import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"

function NotFoundPage() {
    return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
            <h1 className="text-7xl font-bold text-muted-foreground">
                404
            </h1>

            <h2 className="text-2xl font-semibold">
                Страница не найдена
            </h2>

            <p className="max-w-md text-muted-foreground">
                К сожалению, запрашиваемая страница не существует
                или была перемещена.
            </p>

            <Button asChild>
                <Link to="/">
                    Вернуться на главную
                </Link>
            </Button>
        </div>
    )
}

export default NotFoundPage