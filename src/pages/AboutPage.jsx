import reactIcon from "@/assets/technologies/react.svg"
import viteIcon from "@/assets/technologies/vite.svg"
import javascriptIcon from "@/assets/technologies/javascript.svg"
import tailwindIcon from "@/assets/technologies/tailwind.svg"
import reactRouterIcon from "@/assets/technologies/react-router.svg"
import shadcnIcon from "@/assets/technologies/shadcn-ui.svg"

import pythonIcon from "@/assets/technologies/python.svg"
import fastapiIcon from "@/assets/technologies/fastapi.svg"
import postgresqlIcon from "@/assets/technologies/postgresql.svg"

function AboutPage() {
    return (
        <div className="mx-auto max-w-5xl space-y-10 px-6 py-10">
            <section className="space-y-4">
                <h1 className="text-3xl font-bold">О проекте</h1>

                <h2 className="text-2xl font-semibold">
                    Course Platform
                </h2>

                <p className="max-w-3xl leading-7 text-muted-foreground">
                    Course Platform — образовательная платформа для
                    размещения, создания и прохождения онлайн-курсов.
                    Пользователи могут изучать материалы курсов, авторы —
                    создавать и управлять собственными курсами, а
                    администраторы — управлять пользователями и справочными
                    данными платформы.
                </p>
            </section>

            <section className="space-y-6">
                <h2 className="text-2xl font-semibold">Технологический стек</h2>

                <div className="space-y-4">
                    <h3 className="text-lg font-medium">Frontend</h3>

                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
                        {[
                            { name: "React", icon: reactIcon },
                            { name: "Vite", icon: viteIcon },
                            { name: "JavaScript", icon: javascriptIcon },
                            { name: "Tailwind CSS", icon: tailwindIcon },
                            { name: "React Router", icon: reactRouterIcon },
                            { name: "shadcn/ui", icon: shadcnIcon },
                        ].map((technology) => (
                            <div
                                key={technology.name}
                                className="flex flex-col items-center gap-3 rounded-lg border p-4"
                            >
                                <img
                                    src={technology.icon}
                                    alt={technology.name}
                                    className="h-12 w-12 object-contain"
                                />
                                <span className="text-sm font-medium text-center">
                                    {technology.name}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-lg font-medium">Backend</h3>

                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
                        {[
                            { name: "Python", icon: pythonIcon },
                            { name: "FastAPI", icon: fastapiIcon },
                            { name: "PostgreSQL", icon: postgresqlIcon },
                        ].map((technology) => (
                            <div
                                key={technology.name}
                                className="flex flex-col items-center gap-3 rounded-lg border p-4"
                            >
                                <img
                                    src={technology.icon}
                                    alt={technology.name}
                                    className="h-12 w-12 object-contain"
                                />
                                <span className="text-sm font-medium text-center">
                                    {technology.name}
                                </span>
                            </div>
                        ))}
                    </div>

                    <p className="text-sm text-muted-foreground">
                        Дополнительные инструменты: SQLAlchemy, Pydantic, Alembic, Uvicorn.
                    </p>
                </div>
            </section>
            <section className="space-y-6">
                <h2 className="text-2xl font-semibold">Репозитории проекта</h2>

                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-lg border p-5 space-y-2">
                        <h3 className="font-medium">Frontend</h3>
                        <a
                            href="https://github.com/RosaPylesos/course-platform-frontend"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline"
                        >
                            Открыть репозиторий
                        </a>
                    </div>

                    <div className="rounded-lg border p-5 space-y-2">
                        <h3 className="font-medium">Backend</h3>
                        <a
                            href="https://github.com/RosaPylesos/course-platform-backend"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline"
                        >
                            Открыть репозиторий
                        </a>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default AboutPage