import { Link } from "react-router-dom"

function Footer() {
    return (
        <footer className="border-t bg-background">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 text-sm text-muted-foreground">
                <span>© 2026 Course Platform</span>

                <Link
                    to="/about"
                    className="transition-colors hover:text-primary hover:underline"
                >
                    О проекте
                </Link>
            </div>
        </footer>
    )
}

export default Footer